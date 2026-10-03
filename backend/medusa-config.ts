import { loadEnv, defineConfig, Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      // Owner/admin signs in with email + password; shoppers only with phone OTP.
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["firebase-otp"],
      },
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/firebase-auth",
            id: "firebase-otp",
            options: {
              projectId: process.env.FIREBASE_PROJECT_ID,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
          {
            resolve: "./src/modules/delhivery",
            id: "delhivery",
            options: {
              shippingPercent: Number(process.env.SHIPPING_PERCENT ?? 5),
              apiToken: process.env.DELHIVERY_API_TOKEN,
              baseUrl: process.env.DELHIVERY_BASE_URL,
              pickupLocation: process.env.DELHIVERY_PICKUP_LOCATION,
            },
          },
        ],
      },
    },
    {
      // "feed" channel = notifications shown in the admin console's bell.
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: { channels: ["feed"] },
          },
        ],
      },
    },
  ],
})
