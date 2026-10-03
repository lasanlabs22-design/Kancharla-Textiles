import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PhoneLogin from "@modules/account/components/phone-login"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 gap-y-10 py-8 small:py-12">
      {customer ? (
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      ) : (
        // Client rule: browsing is open, but placing an order needs a verified mobile number.
        <div className="mx-auto w-full max-w-md border border-teak-line bg-white px-5 py-8 xsmall:px-8">
          <p className="kt-eyebrow text-center">Step 1 of 3</p>
          <div className="mt-3">
            <PhoneLogin
              title="Verify your mobile"
              subtitle="We'll send an OTP to confirm your number. It's also how we'll contact you about delivery."
            />
          </div>
        </div>
      )}
      <CheckoutSummary cart={cart} />
    </div>
  )
}
