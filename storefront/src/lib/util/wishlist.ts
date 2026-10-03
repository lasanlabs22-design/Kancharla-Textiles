// Wishlist = list of product IDs. Kept in a readable cookie (so the heart responds instantly and
// server pages can render the wishlist) and, for signed-in shoppers, in customer.metadata.wishlist.
export const WISHLIST_COOKIE = "_kt_wishlist"
export const WISHLIST_MAX = 60

export const parseWishlist = (value?: string | null): string[] =>
  value
    ? Array.from(new Set(value.split(".").filter((id) => /^prod_[A-Za-z0-9]+$/.test(id)))).slice(0, WISHLIST_MAX)
    : []

export const serializeWishlist = (ids: string[]) => ids.slice(0, WISHLIST_MAX).join(".")
