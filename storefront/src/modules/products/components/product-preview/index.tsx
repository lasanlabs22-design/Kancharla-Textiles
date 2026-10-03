import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import PreviewPrice from "./price"

/** Myntra-style product card: second image on hover, fabric line, sale price with MRP and % off. */
export default async function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const front = product.thumbnail || product.images?.[0]?.url
  const back = product.images?.[1]?.url
  const fabric = (product.metadata as Record<string, string> | null)?.fabric

  const stock = (product.variants ?? []).reduce(
    (sum, v) => sum + (v.manage_inventory ? Number(v.inventory_quantity ?? 0) : 99),
    0
  )
  const soldOut = (product.variants?.length ?? 0) > 0 && stock <= 0
  const fewLeft = !soldOut && stock > 0 && stock <= 5

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block" data-testid="product-wrapper">
      <div className="relative aspect-[4/5] overflow-hidden bg-lime-deep">
        {front && (
          <Image
            src={front}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-500 ${back ? "group-hover:opacity-0" : ""} ${soldOut ? "opacity-60" : ""}`}
          />
        )}
        {back && (
          <Image
            src={back}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 bg-lime/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-teak">
            Sold out
          </span>
        )}
        {fewLeft && (
          <span className="absolute left-3 top-3 bg-lime/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-kumkum">
            Only {stock} left
          </span>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-lime/90 text-teak opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" />
          </svg>
        </span>
      </div>
      <div className="pt-3 small:pt-4 text-center">
        {fabric && (
          <p className="text-[9px] small:text-[10px] font-medium uppercase tracking-[0.16em] small:tracking-[0.24em] text-zari-ink truncate px-1">{fabric}</p>
        )}
        <h3
          className="mt-1 small:mt-1.5 font-display text-[15px] small:text-[18px] leading-snug text-teak line-clamp-2 small:line-clamp-1 min-h-[2.5em] small:min-h-0 px-1 small:px-2"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <div className="mt-1 small:mt-1.5 flex flex-wrap items-baseline justify-center gap-x-1.5 small:gap-x-2">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
