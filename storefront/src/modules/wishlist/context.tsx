"use client"

import { saveWishlist } from "@lib/data/customer"
import { serializeWishlist, WISHLIST_COOKIE, WISHLIST_MAX } from "@lib/util/wishlist"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type WishlistContextValue = {
  ids: string[]
  has: (productId: string) => boolean
  toggle: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

/**
 * Holds the wishlist for the whole shop. Starts from the cookie the server read, updates instantly in the
 * browser, writes the cookie back, and (if signed in) saves it to the account in the background.
 */
export function WishlistProvider({
  initialIds,
  signedIn,
  children,
}: {
  initialIds: string[]
  signedIn: boolean
  children: React.ReactNode
}) {
  const [ids, setIds] = useState(initialIds)

  // Server may hand us a new list (e.g. merged after OTP sign-in, cleared after sign-out).
  const initialKey = initialIds.join(".")
  useEffect(() => setIds(initialIds), [initialKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(
    (productId: string) => {
      setIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [productId, ...prev].slice(0, WISHLIST_MAX)
        document.cookie = `${WISHLIST_COOKIE}=${serializeWishlist(next)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
        if (signedIn) void saveWishlist(next)
        return next
      })
    },
    [signedIn]
  )

  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle }), [ids, toggle])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

const NO_WISHLIST: WishlistContextValue = { ids: [], has: () => false, toggle: () => {} }

/** Outside the shop layout (e.g. checkout) hearts simply render empty instead of crashing. */
export function useWishlist() {
  return useContext(WishlistContext) ?? NO_WISHLIST
}
