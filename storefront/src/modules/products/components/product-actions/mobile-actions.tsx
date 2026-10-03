import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

/** Sticky bottom bar on phones/tablets once the main "Add to bag" button scrolls out of view. */
const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)
  // Multi-size products without a size picked: the main button opens the size sheet instead.
  const needsSize = !isSimple && !variant

  return (
    <>
      <div
        className={clx("small:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div
            className="flex items-center gap-3 border-t border-teak-line bg-lime px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(31,26,23,0.08)]"
            data-testid="mobile-actions"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] text-teak-muted" data-testid="mobile-title">
                {product.title}
              </p>
              {selectedPrice && (
                <p className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-[16px] text-teak">{selectedPrice.calculated_price}</span>
                  {selectedPrice.price_type === "sale" && (
                    <>
                      <span className="text-[11px] text-teak-muted line-through">{selectedPrice.original_price}</span>
                      <span className="text-[11px] text-kumkum">{selectedPrice.percentage_diff}% off</span>
                    </>
                  )}
                </p>
              )}
            </div>
            {!isSimple && variant && (
              <button
                type="button"
                onClick={open}
                className="h-12 shrink-0 border border-teak/40 px-3 text-[12px] uppercase tracking-[0.12em] text-teak"
                data-testid="mobile-actions-button"
              >
                {Object.values(options).join(" / ")}
              </button>
            )}
            <button
              type="button"
              onClick={needsSize ? open : handleAddToCart}
              disabled={!needsSize && (!inStock || !variant || isAdding)}
              className="kt-btn h-12 shrink-0 px-5 disabled:bg-teak-muted disabled:cursor-not-allowed"
              data-testid="mobile-cart-button"
            >
              {isAdding ? "Adding…" : needsSize ? "Select size" : !inStock ? "Out of stock" : "Add to bag"}
            </button>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-teak/50" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel
                className="w-full bg-white pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                data-testid="mobile-actions-modal"
              >
                <div className="zari-band" />
                <div className="flex items-center justify-between px-5 py-4 border-b border-teak-line">
                  <Dialog.Title className="font-display text-xl text-teak">Select size</Dialog.Title>
                  <button
                    onClick={close}
                    className="flex h-9 w-9 items-center justify-center text-teak"
                    aria-label="Close"
                    data-testid="close-modal-button"
                  >
                    <X />
                  </button>
                </div>
                <div className="px-5 pt-5">
                  {(product.variants?.length ?? 0) > 1 && (
                    <div className="flex flex-col gap-y-6">
                      {(product.options || []).map((option) => (
                        <div key={option.id}>
                          <OptionSelect
                            option={option}
                            current={options[option.id]}
                            updateOption={updateOptions}
                            title={option.title ?? ""}
                            disabled={optionsDisabled}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart()
                      close()
                    }}
                    disabled={!inStock || !variant || isAdding}
                    className="kt-btn mt-6 h-12 w-full disabled:bg-teak-muted disabled:cursor-not-allowed"
                  >
                    {!variant ? "Select a size" : !inStock ? "Out of stock" : "Add to bag"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
