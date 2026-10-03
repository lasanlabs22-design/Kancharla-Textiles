import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/framework/utils"
import type {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  Logger,
} from "@medusajs/framework/types"
import { createRemoteJWKSet, jwtVerify } from "jose"

type Options = {
  // Firebase project ID, e.g. "kancharla-textiles". Only this is needed to verify ID tokens.
  projectId: string
}

// Google's public keys for Firebase Auth ID tokens (cached and rotated by jose).
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
)

/**
 * Phone OTP login for customers.
 *
 * The storefront sends the OTP and confirms it with the Firebase JS SDK, then posts the
 * resulting Firebase ID token here (`POST /auth/customer/firebase-otp { id_token }`).
 * We verify the token's signature, issuer and audience against our Firebase project and
 * use the verified phone number (E.164, e.g. +919876543210) as the auth identity.
 */
class FirebaseOtpAuthService extends AbstractAuthModuleProvider {
  static identifier = "firebase-otp"
  static DISPLAY_NAME = "Phone OTP (Firebase)"

  protected options_: Options
  protected logger_: Logger

  static validateOptions(options: Record<string, unknown>) {
    if (!options?.projectId) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "firebase-otp auth provider needs a projectId option")
    }
  }

  constructor({ logger }: { logger: Logger }, options: Options) {
    // @ts-ignore -- base class takes the same arguments
    super(...arguments)
    this.options_ = options
    this.logger_ = logger
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const idToken = (data.body as Record<string, unknown> | undefined)?.id_token
    if (typeof idToken !== "string" || !idToken) {
      return { success: false, error: "Missing id_token" }
    }

    let phone: string
    let uid: string
    try {
      const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
        issuer: `https://securetoken.google.com/${this.options_.projectId}`,
        audience: this.options_.projectId,
        algorithms: ["RS256"],
      })
      phone = String(payload.phone_number ?? "")
      uid = String(payload.sub ?? "")
      if (!phone || !uid) {
        return { success: false, error: "This sign-in has no verified phone number" }
      }
    } catch (e) {
      this.logger_.warn(`firebase-otp: rejected ID token (${(e as Error).message})`)
      return { success: false, error: "Phone verification expired or invalid. Please request a new OTP." }
    }

    try {
      const authIdentity = await authIdentityService.retrieve({ entity_id: phone })
      return { success: true, authIdentity }
    } catch (error) {
      if ((error as MedusaError).type !== MedusaError.Types.NOT_FOUND) {
        return { success: false, error: (error as Error).message }
      }
    }

    // First sign-in with this number: create the identity. The storefront then creates
    // the customer record (POST /store/customers) and refreshes the token.
    const authIdentity = await authIdentityService.create({
      entity_id: phone,
      provider_metadata: { firebase_uid: uid },
      user_metadata: { phone },
    })
    return { success: true, authIdentity }
  }

  // Registering and signing in are the same step for OTP.
  async register(
    data: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    return this.authenticate(data, authIdentityService)
  }
}

export default FirebaseOtpAuthService
