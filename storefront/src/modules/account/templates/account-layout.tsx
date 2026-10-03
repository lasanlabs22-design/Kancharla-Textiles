import React from "react"

import { HttpTypes } from "@medusajs/types"
import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  // Signed out: only the centred sign-in card on the ivory page.
  if (!customer) {
    return (
      <div className="content-container flex justify-center py-8 small:py-16" data-testid="account-page">
        {children}
      </div>
    )
  }

  return (
    <div className="content-container py-6 small:py-14" data-testid="account-page">
      <div className="grid gap-6 small:grid-cols-[260px_1fr] small:gap-12">
        <aside>
          <AccountNav customer={customer} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
      <AccountHelp />
    </div>
  )
}

/** Replaces the starter's "Got questions?" block; the floating contact buttons are hidden on account pages. */
function AccountHelp() {
  return (
    <div className="mt-12 small:mt-16 flex flex-col gap-5 border border-teak-line bg-lime-deep px-5 py-6 small:flex-row small:items-center small:justify-between small:px-8">
      <div>
        <p className="kt-eyebrow">We&apos;re here to help</p>
        <p className="mt-2 font-display text-[24px] leading-tight text-teak">Need help with an order?</p>
        <p className="mt-1 text-[14px] text-teak-muted">Message or call our Mangalagiri store.</p>
      </div>
      <div className="flex flex-col gap-3 xsmall:flex-row">
        <a
          href="https://wa.me/917780136846?text=Hello%20Kancharla%20Textiles%2C%20I%20need%20help%20with%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="kt-btn h-11 bg-[#1f7a4a] hover:bg-[#17603a]"
        >
          WhatsApp us
        </a>
        <a href="tel:+917780136846" className="kt-btn-outline h-11">
          Call +91 77801 36846
        </a>
      </div>
    </div>
  )
}

export default AccountLayout
