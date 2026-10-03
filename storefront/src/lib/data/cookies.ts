import "server-only"
import { cookies as nextCookies } from "next/headers"
import { parseWishlist, serializeWishlist, WISHLIST_COOKIE } from "@lib/util/wishlist"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

// Wishlist cookie is NOT httpOnly: the browser updates it directly when a heart is tapped.
export const getWishlistIds = async () => {
  const cookies = await nextCookies()
  return parseWishlist(cookies.get(WISHLIST_COOKIE)?.value)
}

export const setWishlistIds = async (ids: string[]) => {
  const cookies = await nextCookies()
  cookies.set(WISHLIST_COOKIE, serializeWishlist(ids), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeWishlistIds = async () => {
  const cookies = await nextCookies()
  cookies.set(WISHLIST_COOKIE, "", { maxAge: -1, path: "/" })
}

// Verified phone number held between "OTP confirmed" and "new shopper entered their name".
export const setPendingPhone = async (phone: string) => {
  const cookies = await nextCookies()
  cookies.set("_kt_pending_phone", phone, {
    maxAge: 60 * 15,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const getPendingPhone = async () => {
  const cookies = await nextCookies()
  return cookies.get("_kt_pending_phone")?.value
}

export const removePendingPhone = async () => {
  const cookies = await nextCookies()
  cookies.set("_kt_pending_phone", "", { maxAge: -1 })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}
