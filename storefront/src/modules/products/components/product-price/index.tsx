import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-40 h-9 warp-shimmer" />
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span
          className="font-display text-[28px] text-teak"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {selectedPrice.price_type === "sale" && (
          <>
            <span className="text-base text-teak-muted">
              MRP{" "}
              <span
                className="line-through"
                data-testid="original-product-price"
                data-value={selectedPrice.original_price_number}
              >
                {selectedPrice.original_price}
              </span>
            </span>
            <span className="text-base font-semibold text-haldi-deep">({selectedPrice.percentage_diff}% OFF)</span>
          </>
        )}
      </div>
      <span className="text-xs font-semibold text-indigo">Inclusive of all taxes</span>
    </div>
  )
}
