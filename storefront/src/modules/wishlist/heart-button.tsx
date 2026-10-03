"use client"

import { useWishlist } from "./context"

const Heart = ({ filled, size }: { filled: boolean; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden
  >
    <path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" />
  </svg>
)

/**
 * "card": round icon on product cards (always visible on phones, on hover for desktop unless saved).
 * "pdp":  outline button next to "Add to bag" on the product page.
 */
export default function HeartButton({
  productId,
  productTitle,
  variant = "card",
}: {
  productId: string
  productTitle: string
  variant?: "card" | "pdp"
}) {
  const { has, toggle } = useWishlist()
  const saved = has(productId)
  const label = saved ? `Remove ${productTitle} from wishlist` : `Save ${productTitle} to wishlist`

  if (variant === "pdp") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={saved}
        aria-label={label}
        className={`kt-btn-outline h-14 ${saved ? "border-kumkum text-kumkum hover:bg-kumkum hover:text-lime" : ""}`}
        data-testid="pdp-wishlist-button"
      >
        <Heart filled={saved} size={18} />
        <span className="hidden xsmall:inline">{saved ? "Wishlisted" : "Wishlist"}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={saved}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-lime/95 shadow-sm transition-all active:scale-90 ${
        saved ? "text-kumkum opacity-100" : "text-teak opacity-100 small:opacity-0 small:group-hover:opacity-100"
      }`}
      data-testid="card-wishlist-button"
    >
      <Heart filled={saved} size={16} />
    </button>
  )
}
