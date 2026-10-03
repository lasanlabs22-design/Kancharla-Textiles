import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      <span className="text-[13px] small:text-[14px] font-normal text-teak whitespace-nowrap" data-testid="price">
        {price.calculated_price}
      </span>
      {price.price_type === "sale" && (
        <>
          <span className="text-[11px] small:text-[12px] text-teak-muted line-through whitespace-nowrap" data-testid="original-price">
            {price.original_price}
          </span>
          <span className="text-[11px] small:text-[12px] text-kumkum whitespace-nowrap">{price.percentage_diff}% off</span>
        </>
      )}
    </>
  )
}
