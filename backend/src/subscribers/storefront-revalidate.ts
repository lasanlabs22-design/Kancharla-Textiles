import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

/**
 * When the owner changes categories or products in the admin, tell the
 * storefront to drop its cached pages so the change is live within seconds.
 */
export default async function storefrontRevalidate({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const url = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!url || !secret) {
    return
  }

  const tags = event.name.startsWith("product-category")
    ? ["categories", "products"]
    : ["products"]

  try {
    await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ tags }),
    })
  } catch (e) {
    logger.warn(`Storefront revalidate failed for ${event.name}: ${(e as Error).message}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product-category.created",
    "product-category.updated",
    "product-category.deleted",
    "product.created",
    "product.updated",
    "product.deleted",
    // MRP edits in the admin's price grid update variants.
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "inventory-level.updated",
    "inventory-level.created",
  ],
}
