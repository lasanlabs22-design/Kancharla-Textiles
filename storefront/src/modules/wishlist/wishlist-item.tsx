"use client"

import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useWishlist } from "./context"

/** Wraps one product on the Wishlist page; disappears as soon as its heart is tapped off. */
export function WishlistItem({ productId, children }: { productId: string; children: React.ReactNode }) {
  const { has } = useWishlist()
  if (!has(productId)) return null
  return <li data-testid="wishlist-item">{children}</li>
}

/** Shows its children (the empty state) when none of the listed products are still saved. */
export function WishlistEmpty({ productIds, children }: { productIds: string[]; children: React.ReactNode }) {
  const { has } = useWishlist()
  return productIds.some(has) ? null : <>{children}</>
}

/** "Add to bag" for one-size products; products with sizes go to the product page to pick one. */
export function WishlistAddToBag({
  handle,
  variantId,
  inStock,
}: {
  handle: string
  variantId?: string
  inStock: boolean
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const [state, setState] = useState<"idle" | "adding" | "added">("idle")

  if (!inStock) {
    return (
      <span className="mt-3 flex h-10 w-full items-center justify-center border border-teak-line text-[11px] uppercase tracking-[0.16em] text-teak-muted">
        Sold out
      </span>
    )
  }

  if (!variantId) {
    return (
      <LocalizedClientLink
        href={`/products/${handle}`}
        className="mt-3 flex h-10 w-full items-center justify-center border border-teak text-[11px] uppercase tracking-[0.16em] text-teak hover:bg-teak hover:text-lime"
      >
        Select size
      </LocalizedClientLink>
    )
  }

  return (
    <button
      type="button"
      disabled={state === "adding"}
      onClick={async () => {
        setState("adding")
        await addToCart({ variantId, quantity: 1, countryCode })
        setState("added")
      }}
      className="mt-3 flex h-10 w-full items-center justify-center bg-teak text-[11px] uppercase tracking-[0.16em] text-lime hover:bg-kumkum disabled:opacity-60"
      data-testid="wishlist-add-to-bag"
    >
      {state === "adding" ? "Adding…" : state === "added" ? "Added to bag ✓" : "Add to bag"}
    </button>
  )
}
