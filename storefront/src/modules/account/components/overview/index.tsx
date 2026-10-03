import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import AccountPageHeader from "@modules/account/components/account-page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <AccountPageHeader eyebrow="Overview" title="Your account at a glance" />
      </div>

      <ul className="grid grid-cols-3 gap-2 xsmall:gap-4">
        <Stat label="Orders" value={String(orders?.length ?? 0)} href="/account/orders" />
        <Stat
          label="Addresses"
          value={String(customer?.addresses?.length ?? 0)}
          href="/account/addresses"
          testId="addresses-count"
        />
        <Stat label="Profile" value={`${completion}%`} href="/account/profile" testId="customer-profile-completion" />
      </ul>

      <section className="mt-8 small:mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[24px] leading-tight text-teak">Recent orders</h2>
          {!!orders?.length && (
            <LocalizedClientLink href="/account/orders" className="kt-link">
              View all
            </LocalizedClientLink>
          )}
        </div>

        <ul className="mt-4 grid gap-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="flex items-center justify-between gap-4 border border-teak-line bg-white px-4 py-4 transition-colors hover:border-zari"
                >
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-1 xsmall:grid-cols-3">
                    <Field label="Order" value={`#${order.display_id}`} testId="order-id" />
                    <Field label="Placed on" value={formatDate(order.created_at)} testId="order-created-date" />
                    <Field
                      label="Total"
                      value={convertToLocale({ amount: order.total, currency_code: order.currency_code })}
                      testId="order-amount"
                    />
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-teak-muted" aria-hidden>
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                  <span className="sr-only">Open order #{order.display_id}</span>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li className="border border-dashed border-teak-line bg-white px-5 py-8 text-center" data-testid="no-orders-message">
              <p className="font-display text-[22px] text-teak">No orders yet</p>
              <p className="mt-1 text-[14px] text-teak-muted">Your orders will appear here once you shop with us.</p>
              <LocalizedClientLink href="/categories/sarees" className="kt-btn mt-5 h-11">
                Shop sarees
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}

function Stat({ label, value, href, testId }: { label: string; value: string; href: string; testId?: string }) {
  return (
    <li>
      <LocalizedClientLink
        href={href}
        className="block border border-teak-line bg-white px-3 py-4 text-center transition-colors hover:border-zari xsmall:px-5 xsmall:text-left"
      >
        <span className="block font-display text-[28px] leading-none text-teak small:text-[34px] [font-variant-numeric:lining-nums]" data-testid={testId} data-value={value}>
          {value}
        </span>
        <span className="mt-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-teak-muted">{label}</span>
      </LocalizedClientLink>
    </li>
  )
}

function Field({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.14em] text-teak-muted">{label}</p>
      <p className="truncate text-[14px] text-teak" data-testid={testId}>
        {value}
      </p>
    </div>
  )
}

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

// Name, email, phone and a saved address make a complete profile.
const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0
  const checks = [!!customer.first_name, !!customer.email, !!customer.phone, (customer.addresses?.length ?? 0) > 0]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export default Overview
