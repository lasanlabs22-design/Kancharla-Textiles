import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, 8)
  })

  if (!products.length) {
    return null
  }

  return (
    <div>
      <div className="mb-6 small:mb-10 text-center">
        <p className="kt-eyebrow">You may also like</p>
        <h2 className="mt-2 small:mt-3 font-display text-[28px] small:text-[40px] leading-[1.05] font-normal text-teak">
          More to explore
        </h2>
      </div>

      <ul className="kt-rail small:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
