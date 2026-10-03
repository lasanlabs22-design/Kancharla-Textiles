import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { HttpTypes } from "@medusajs/types"

// The starter's "Already have an account? Sign in" box is gone: shoppers verify their mobile at checkout.
const CartTemplate = ({
  cart,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-8 small:py-14">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 small:grid-cols-[1fr_380px] small:gap-14">
            <ItemsTemplate cart={cart} />
            <div className="relative">
              <div className="sticky top-40 border border-teak-line bg-white p-5 small:p-6">
                {cart.region && <Summary cart={cart as any} />}
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
