import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

/** A titled row of products from one category (or the newest overall when no category is given). */
export default async function ProductRail({
  title,
  eyebrow,
  categoryHandle,
  region,
  countryCode,
  limit = 4,
}: {
  title: string
  eyebrow: string
  categoryHandle?: string
  region: HttpTypes.StoreRegion
  countryCode: string
  limit?: number
}) {
  const category = categoryHandle ? await getCategoryByHandle(categoryHandle.split("/")).catch(() => null) : null
  if (categoryHandle && !category) return null

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit,
      order: "-created_at",
      ...(category ? { category_id: [category.id] } : {}),
    } as any,
  })

  if (!products.length) return null

  return (
    <section className="content-container py-10 small:py-16">
      <div className="flex items-end justify-between gap-4 mb-6 small:mb-10">
        <div>
          <p className="kt-eyebrow">{eyebrow}</p>
          <h2 className="mt-2 small:mt-3 font-display text-[28px] small:text-[40px] leading-[1.05] font-normal text-teak">{title}</h2>
        </div>
        <LocalizedClientLink href={category ? `/categories/${category.handle}` : "/store"} className="kt-link shrink-0">
          View all
        </LocalizedClientLink>
      </div>
      <ul className="kt-rail small:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
