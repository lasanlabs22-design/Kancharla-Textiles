"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

/**
 * One bag line. "full" = bag page (quantity + remove), "preview" = checkout summary.
 * Card layout instead of the starter's table so names don't wrap one word per line on phones.
 */
const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity })
      .catch((err) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  // Stock is managed by hand; allow up to 10 or the variant's stock, whichever is lower.
  const stock = item.variant?.manage_inventory ? Number(item.variant?.inventory_quantity ?? 10) : 10
  const maxQuantity = Math.max(1, Math.min(10, stock || 10, 10))

  return (
    <li className="flex gap-4 py-4" data-testid="product-row">
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className={type === "preview" ? "w-16 shrink-0" : "w-20 shrink-0 small:w-24"}
      >
        <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
      </LocalizedClientLink>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="font-display text-[17px] leading-snug text-teak hover:text-kumkum small:text-[19px]"
              data-testid="product-title"
            >
              {item.product_title}
            </LocalizedClientLink>
            <div className="mt-0.5 text-[13px] text-teak-muted">
              <LineItemOptions variant={item.variant} data-testid="product-variant" />
            </div>
          </div>
          <div className="shrink-0 text-right text-[15px] text-teak">
            {type === "preview" && <p className="text-[12px] text-teak-muted">Qty {item.quantity}</p>}
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>

        {type === "full" && (
          <div className="mt-auto flex items-center gap-3 pt-3">
            <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-teak-muted">
              Qty
              <CartItemSelect
                value={item.quantity}
                onChange={(e) => changeQuantity(parseInt(e.target.value))}
                className="h-9 w-16"
                data-testid="product-select-button"
              >
                {Array.from({ length: maxQuantity }, (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                ))}
              </CartItemSelect>
            </label>
            {updating && <Spinner />}
            <div className="ml-auto text-[12px] uppercase tracking-[0.12em] text-teak-muted hover:text-kumkum">
              <DeleteButton id={item.id} data-testid="product-delete-button">
                Remove
              </DeleteButton>
            </div>
          </div>
        )}
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>
    </li>
  )
}

export default Item
