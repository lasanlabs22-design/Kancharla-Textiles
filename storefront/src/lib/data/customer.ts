"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  getPendingPhone,
  getWishlistIds,
  removeAuthToken,
  removeCartId,
  removePendingPhone,
  removeWishlistIds,
  setAuthToken,
  setPendingPhone,
  setWishlistIds,
} from "./cookies"
import { WISHLIST_MAX } from "@lib/util/wishlist"

/** Reads a JWT's payload without verifying it (the backend already verified it in the same request). */
const jwtPayload = (token: string): Record<string, any> => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"))
  } catch {
    return {}
  }
}

const afterSignIn = async () => {
  await mergeWishlistOnSignIn().catch(() => {})
  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)
  await transferCart().catch(() => {})
}

/** Hearts saved while signed out + the account's saved wishlist -> one list, stored in both places. */
async function mergeWishlistOnSignIn() {
  const headers = await getAuthHeaders()
  const { customer } = await sdk.store.customer.retrieve({ fields: "id,metadata" }, headers)
  const saved = Array.isArray(customer.metadata?.wishlist) ? (customer.metadata!.wishlist as string[]) : []
  const merged = Array.from(new Set([...(await getWishlistIds()), ...saved])).slice(0, WISHLIST_MAX)
  if (merged.length !== saved.length) {
    await sdk.store.customer.update({ metadata: { ...(customer.metadata ?? {}), wishlist: merged } }, {}, headers)
  }
  await setWishlistIds(merged)
}

/**
 * Called (fire-and-forget) when a signed-in shopper taps a heart, so the wishlist follows them to other
 * devices. Deliberately no revalidateTag: the browser already shows the change, and revalidating would
 * re-render the whole page on every tap.
 */
export async function saveWishlist(ids: string[]) {
  const headers = await getAuthHeaders()
  if (!("authorization" in headers)) return
  try {
    const { customer } = await sdk.store.customer.retrieve({ fields: "id,metadata" }, headers)
    await sdk.store.customer.update(
      { metadata: { ...(customer.metadata ?? {}), wishlist: ids.slice(0, WISHLIST_MAX) } },
      {},
      headers
    )
  } catch {
    // Not fatal: the browser cookie still holds the wishlist.
  }
}

/**
 * Step 1 of phone login: exchange the Firebase ID token (OTP confirmed in the browser) for a
 * store session. Returning shoppers are signed in; first-timers are asked for their name next.
 */
export async function loginWithPhone(
  idToken: string
): Promise<{ status: "signed_in" } | { status: "needs_profile"; phone: string } | { status: "error"; message: string }> {
  try {
    const token = (await sdk.auth.login("customer", "firebase-otp", { id_token: idToken })) as string
    await setAuthToken(token)

    if (jwtPayload(token).actor_id) {
      await afterSignIn()
      return { status: "signed_in" }
    }

    // Verified by the backend in the login call above.
    const phone = String(jwtPayload(idToken).phone_number ?? "")
    await setPendingPhone(phone)
    return { status: "needs_profile", phone }
  } catch (error: any) {
    return { status: "error", message: error?.message ?? "Could not sign you in. Please try again." }
  }
}

/** Step 2 for first-time shoppers: create the customer (phone from the verified OTP) and refresh the session. */
export async function completePhoneSignup(profile: {
  first_name: string
  last_name?: string
  email: string
}): Promise<{ status: "signed_in" } | { status: "error"; message: string }> {
  const phone = await getPendingPhone()
  const headers = await getAuthHeaders()
  if (!phone || !("authorization" in headers)) {
    return { status: "error", message: "Your verification expired. Please verify your mobile number again." }
  }

  try {
    // Medusa's create-account workflow requires an email (used for order emails and GST invoices).
    await sdk.store.customer.create(
      {
        phone,
        first_name: profile.first_name.trim(),
        last_name: profile.last_name?.trim() || undefined,
        email: profile.email.trim().toLowerCase(),
      },
      {},
      headers
    )
    const token = await sdk.auth.refresh(headers)
    await setAuthToken(token as string)
    await removePendingPhone()
    await afterSignIn()
    return { status: "signed_in" }
  } catch (error: any) {
    const message = String(error?.message ?? "")
    return {
      status: "error",
      message: /email.*exists/i.test(message)
        ? "That email is already linked to another account. Please use a different email."
        : message || "Could not create your account. Please try again.",
    }
  }
}

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()
  // Shared phones: the next person shouldn't see this shopper's saved items.
  await removeWishlistIds()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
