"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    shipping_methods?: unknown[] | null
  }
}

/** Bag / checkout / order totals. Prices on this store already include GST. */
const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total, item_subtotal, shipping_subtotal, discount_subtotal, shipping_methods } = totals
  const money = (amount?: number | null) => convertToLocale({ amount: amount ?? 0, currency_code })
  const shippingChosen = (shipping_methods?.length ?? 0) > 0

  return (
    <div className="text-[14px]">
      <div className="flex flex-col gap-y-2.5 text-teak-muted">
        <Row label="Items total" value={money(item_subtotal)} testId="cart-subtotal" dataValue={item_subtotal} />
        <Row
          label="Shipping (5% of order)"
          value={shippingChosen ? money(shipping_subtotal) : "Added at checkout"}
          testId="cart-shipping"
          dataValue={shipping_subtotal}
        />
        {!!discount_subtotal && (
          <Row label="Discount" value={`– ${money(discount_subtotal)}`} testId="cart-discount" dataValue={discount_subtotal} />
        )}
        {/* GST is included in prices; only show a separate line if tax is actually added on top. */}
        {!!tax_total && <Row label="GST" value={money(tax_total)} testId="cart-taxes" dataValue={tax_total} />}
      </div>
      <div className="my-4 h-px w-full bg-teak-line" />
      <div className="flex items-baseline justify-between text-teak">
        <span className="font-medium">Total</span>
        <span className="text-[20px] font-medium" data-testid="cart-total" data-value={total || 0}>
          {money(total)}
        </span>
      </div>
      <p className="mt-1 text-right text-[12px] text-teak-muted">Inclusive of all taxes</p>
    </div>
  )
}

function Row({ label, value, testId, dataValue }: { label: string; value: string; testId: string; dataValue?: number | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-teak" data-testid={testId} data-value={dataValue || 0}>
        {value}
      </span>
    </div>
  )
}

export default CartTotals
