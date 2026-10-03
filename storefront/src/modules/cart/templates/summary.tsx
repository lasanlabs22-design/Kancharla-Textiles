"use client"

import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

// No coupons at launch (client decision), so the starter's promotion-code box is not shown.
const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="font-display text-[26px] leading-tight text-teak">Order summary</h2>
      <CartTotals totals={cart} />
      <LocalizedClientLink href={"/checkout?step=" + step} data-testid="checkout-button" className="kt-btn h-12 w-full">
        Proceed to checkout
      </LocalizedClientLink>
      <ul className="grid gap-1.5 text-[12px] text-teak-muted">
        <li>✓ Cash on Delivery available</li>
        <li>✓ UPI, cards and netbanking via Razorpay</li>
        <li>✓ Shipped from Mangalagiri by Delhivery</li>
      </ul>
    </div>
  )
}

export default Summary
