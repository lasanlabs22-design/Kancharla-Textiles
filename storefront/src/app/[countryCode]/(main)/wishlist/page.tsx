import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getWishlistIds } from "@lib/data/cookies"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { WishlistAddToBag, WishlistEmpty, WishlistItem } from "@modules/wishlist/wishlist-item"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Sarees and outfits you've saved at Kancharla Textiles.",
}

export default async function WishlistPage(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) notFound()

  const ids = await getWishlistIds()
  const products = ids.length
    ? (
        await listProducts({ countryCode, queryParams: { id: ids, limit: ids.length } as any }).catch(() => null)
      )?.response.products ?? []
    : []
  // Keep the order the shopper saved them in (newest first).
  products.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))

  return (
    <div className="content-container py-8 small:py-14" data-testid="wishlist-page">
      <p className="kt-eyebrow">Saved for later</p>
      <h1 className="mt-2 font-display text-[clamp(30px,8vw,40px)] leading-tight text-teak">Your wishlist</h1>
      <div className="zari-thread mt-4 w-20" />
      <p className="mt-4 max-w-[60ch] text-[14px] text-teak-muted">
        Tap the heart on any product to save it here. Sign in with your mobile to keep your wishlist on every device.
      </p>

      {products.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 xsmall:grid-cols-3 medium:grid-cols-4 small:gap-x-6">
          {products.map((p) => {
            const variants = p.variants ?? []
            const single = variants.length === 1 ? variants[0] : undefined
            const inStock = variants.some(
              (v) => !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
            )
            return (
              <WishlistItem key={p.id} productId={p.id}>
                <ProductPreview product={p} region={region} />
                <WishlistAddToBag handle={p.handle!} variantId={single?.id} inStock={inStock} />
              </WishlistItem>
            )
          })}
        </ul>
      ) : null}

      {/* Shown when nothing is saved, and appears instantly once the last item is removed. */}
      <WishlistEmpty productIds={products.map((p) => p.id)}>
        <EmptyState />
      </WishlistEmpty>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-8 border border-dashed border-teak-line bg-white px-5 py-12 text-center" data-testid="wishlist-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8955A" strokeWidth="1.1" className="mx-auto" aria-hidden>
        <path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" />
      </svg>
      <p className="mt-4 font-display text-[26px] text-teak">Nothing saved yet</p>
      <p className="mt-1 text-[14px] text-teak-muted">Tap the ♡ on any saree or outfit you love.</p>
      <LocalizedClientLink href="/categories/sarees" className="kt-btn mt-6 h-11">
        Explore sarees
      </LocalizedClientLink>
    </div>
  )
}
