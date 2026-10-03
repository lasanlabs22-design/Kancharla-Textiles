import { Metadata } from "next"

import AccountPageHeader from "@modules/account/components/account-page-header"
import { formatPhone } from "@lib/util/format-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileName from "@modules/account/components/profile-name"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Kancharla Textiles profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <AccountPageHeader
        eyebrow="Profile"
        title="Your details"
        description="Update your name and billing address. Your mobile number is how you sign in."
      />
      <div className="divide-y divide-teak-line border border-teak-line bg-white px-5 xsmall:px-6">
        <div className="py-5">
          <ProfileName customer={customer} />
        </div>
        {/* Sign-in number and email can't be changed from the Store API, so they're shown read-only. */}
        <ReadOnlyRow
          label="Mobile number"
          value={formatPhone(customer.phone) || "—"}
          note="Used to sign in with OTP. To change it, please contact us."
        />
        <ReadOnlyRow
          label="Email"
          value={customer.email || "—"}
          note="Order confirmations and GST invoices are sent here. To change it, please contact us."
        />
        <div className="py-5">
          <ProfileBillingAddress customer={customer} regions={regions} />
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="py-5">
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-teak-muted">{label}</p>
      <p className="mt-1 break-all text-[15px] text-teak">{value}</p>
      <p className="mt-1 text-[12px] text-teak-muted">{note}</p>
    </div>
  )
}
