import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { photoUrl, PRODUCT_PHOTOS } from "./product-photos"

/** Swaps the POC placeholder swatches for photos. Run: `npx medusa exec ./src/scripts/apply-photos.ts` */
export default async function applyPhotos({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const base = process.env.STOREFRONT_URL || "http://localhost:8000"

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: Object.keys(PRODUCT_PHOTOS) },
  })

  for (const p of products) {
    const [front, back] = PRODUCT_PHOTOS[p.handle]
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: p.id },
        update: {
          thumbnail: photoUrl(base, front),
          images: [{ url: photoUrl(base, front) }, { url: photoUrl(base, back) }],
        },
      },
    })
  }

  logger.info(`Updated photos on ${products.length} products.`)
}
