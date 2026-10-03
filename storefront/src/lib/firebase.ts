import { getApp, getApps, initializeApp } from "firebase/app"
import { Auth, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth"

// Browser-only. Firebase is used just to send and confirm the SMS OTP; the store's own
// session is the Medusa token cookie, so Firebase keeps nothing between page loads.
let auth: Auth | null = null

export function firebaseAuth(): Auth {
  if (auth) return auth

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      })

  auth = getAuth(app)
  auth.languageCode = "en"
  void setPersistence(auth, inMemoryPersistence)
  return auth
}
