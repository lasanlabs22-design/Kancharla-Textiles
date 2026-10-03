"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "./context"

/** Header heart with a count badge (same look as the bag icon). */
export default function WishlistNavLink({ className = "" }: { className?: string }) {
  const { ids } = useWishlist()
  return (
    <LocalizedClientLink
      href="/wishlist"
      aria-label={`Wishlist${ids.length ? `, ${ids.length} saved` : ""}`}
      className={`relative flex items-center text-teak hover:text-kumkum transition-colors ${className}`}
      data-testid="nav-wishlist-link"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
        <path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" />
      </svg>
      {ids.length > 0 && (
        <span className="absolute -top-2 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-kumkum text-lime text-[10px] leading-[17px] text-center">
          {ids.length}
        </span>
      )}
    </LocalizedClientLink>
  )
}
