import { Metadata } from "next"

import { retrieveCart } from "@lib/data/cart"
import { getWishlistIds } from "@lib/data/cookies"
import { WishlistProvider } from "@modules/wishlist/context"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FloatingContact from "@modules/layout/components/floating-contact"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

  const wishlistIds = await getWishlistIds()

  return (
    <WishlistProvider initialIds={wishlistIds} signedIn={!!customer}>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {/* No free-shipping threshold in this store (flat 5%), so the starter's free-shipping popup is not shown. */}
      {props.children}
      <Footer />
      <FloatingContact />
    </WishlistProvider>
  )
}
