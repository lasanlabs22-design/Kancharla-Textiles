"use client"

import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { formatPhone } from "@lib/util/format-phone"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const LINKS = [
  { href: "/account", label: "Overview", icon: "home", testId: "overview-link" },
  { href: "/account/orders", label: "My orders", icon: "box", testId: "orders-link" },
  { href: "/account/profile", label: "Profile", icon: "user", testId: "profile-link" },
  { href: "/account/addresses", label: "Addresses", icon: "pin", testId: "addresses-link" },
] as const

const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const current = route.split(`/${countryCode}`)[1] || "/"
  const onOverview = current === "/account"

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ")

  return (
    <div>
      {/* Phones / tablets */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {!onOverview ? (
          <LocalizedClientLink
            href="/account"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.14em] text-teak-muted"
            data-testid="account-main-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m15 6-6 6 6 6" />
            </svg>
            My account
          </LocalizedClientLink>
        ) : (
          <div className="border border-teak-line bg-white">
            <Greeting name={name} phone={customer?.phone} />
            <ul>
              {LINKS.slice(1).map((l) => (
                <li key={l.href} className="border-t border-teak-line">
                  <LocalizedClientLink
                    href={l.href}
                    className="flex items-center justify-between px-5 py-4 text-[15px] text-teak"
                    data-testid={l.testId}
                  >
                    <span className="flex items-center gap-3">
                      <Icon name={l.icon} />
                      {l.label}
                    </span>
                    <Chevron />
                  </LocalizedClientLink>
                </li>
              ))}
              <li className="border-t border-teak-line">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-[15px] text-kumkum"
                  data-testid="logout-button"
                >
                  <Icon name="logout" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden small:block border border-teak-line bg-white" data-testid="account-nav">
        <Greeting name={name} phone={customer?.phone} />
        <ul className="border-t border-teak-line py-2">
          {LINKS.map((l) => {
            const active = current === l.href
            return (
              <li key={l.href}>
                <LocalizedClientLink
                  href={l.href}
                  data-testid={l.testId}
                  className={`flex items-center gap-3 border-l-2 px-5 py-3 text-[14px] transition-colors ${
                    active
                      ? "border-kumkum bg-lime text-kumkum font-medium"
                      : "border-transparent text-teak hover:bg-lime hover:text-kumkum"
                  }`}
                >
                  <Icon name={l.icon} />
                  {l.label}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-teak-line p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-[14px] text-teak-muted hover:text-kumkum"
            data-testid="logout-button"
          >
            <Icon name="logout" />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

function Greeting({ name, phone }: { name: string; phone?: string | null }) {
  return (
    <div className="px-5 py-5">
      <p className="kt-eyebrow">My account</p>
      <p className="mt-2 font-display text-[26px] leading-tight text-teak" data-testid="welcome-message">
        Namaste{name ? `, ${name.split(" ")[0]}` : ""}
      </p>
      {phone && <p className="mt-1 text-[13px] text-teak-muted">{formatPhone(phone)}</p>}
    </div>
  )
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teak-muted" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

function Icon({ name }: { name: "home" | "box" | "user" | "pin" | "logout" }) {
  const paths = {
    home: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />,
    box: (
      <>
        <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
        <path d="M3 7.5 12 12l9-4.5M12 12v9" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
    logout: (
      <>
        <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
        <path d="M10 8l-4 4 4 4M6 12h10" />
      </>
    ),
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      {paths[name]}
    </svg>
  )
}

export default AccountNav
