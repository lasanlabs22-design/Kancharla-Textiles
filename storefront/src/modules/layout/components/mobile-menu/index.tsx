"use client"

import { MenuItem } from "@lib/util/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const ACCOUNT_LINKS = [
  { name: "My account", href: "/account", icon: "user" },
  { name: "My orders", href: "/account/orders", icon: "box" },
  { name: "Wishlist", href: "/wishlist", icon: "heart" },
  { name: "Bag", href: "/cart", icon: "bag" },
] as const

const HELP_LINKS = [
  { name: "Track an order", href: "/account/orders" },
  { name: "Shipping policy", href: "/store" },
  { name: "Cancellation policy", href: "/store" },
]

const PHONES = ["+91 77801 36846", "+91 95535 25888"]

/**
 * Mobile drawer menu built from the same category tree as the desktop mega menu.
 * Rendered into <body> through a portal: the sticky header uses backdrop-blur, which
 * would otherwise trap this `fixed` drawer inside the header's 64px box.
 */
export default function MobileMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const close = () => setOpen(false)

  useEffect(() => setMounted(true), [])

  // Close after navigating (covers links and browser back).
  useEffect(() => setOpen(false), [pathname])

  // Lock page scroll while open; Escape closes.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const drawer = (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-teak/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      <div
        // Shadow only while open: when closed it leaked onto the left edge of every page
        className={`absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col bg-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="zari-band" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-teak-line">
          <LocalizedClientLink href="/" onClick={close} className="flex flex-col">
            <span className="font-display text-[22px] leading-[1.05] tracking-[0.16em] text-kumkum">
              KANCHARLA
              <br />
              TEXTILES
            </span>
            <span className="mt-1.5 text-[8px] font-medium tracking-[0.42em] text-zari-ink">MANGALAGIRI</span>
          </LocalizedClientLink>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="-mr-2 flex h-10 w-10 items-center justify-center text-teak"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Search */}
          <div className="px-5 pt-4 pb-2">
            <LocalizedClientLink
              href="/store"
              onClick={close}
              className="flex h-11 items-center gap-3 border border-teak-line bg-lime px-3 text-sm text-teak-muted"
            >
              <Icon name="search" />
              Search sarees, kurtis, leggings…
            </LocalizedClientLink>
          </div>

          {/* Categories */}
          <p className="px-5 pt-4 pb-1 kt-eyebrow">Shop</p>
          <ul>
            {items.map((item) => {
              const isOpen = expanded === item.id
              return (
                <li key={item.id} className="border-b border-teak-line/70">
                  <div className="flex items-center">
                    <LocalizedClientLink
                      href={item.href}
                      onClick={close}
                      className="flex-1 px-5 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] text-teak"
                    >
                      {item.name}
                    </LocalizedClientLink>
                    {item.children.length > 0 && (
                      <button
                        type="button"
                        aria-label={`${isOpen ? "Hide" : "Show"} ${item.name} categories`}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : item.id)}
                        className="flex h-12 w-14 items-center justify-center text-kumkum"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {isOpen && (
                    <ul className="bg-lime pb-3 pt-1">
                      <li>
                        <LocalizedClientLink href={item.href} onClick={close} className="block px-8 py-2.5 text-sm font-medium text-kumkum">
                          View all {item.name}
                        </LocalizedClientLink>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <LocalizedClientLink href={child.href} onClick={close} className="block px-8 py-2.5 text-sm text-teak">
                            {child.name}
                          </LocalizedClientLink>
                          {child.children.map((g) => (
                            <LocalizedClientLink
                              key={g.id}
                              href={g.href}
                              onClick={close}
                              className="block px-12 py-2 text-[13px] text-teak-muted"
                            >
                              {g.name}
                            </LocalizedClientLink>
                          ))}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Account */}
          <p className="px-5 pt-6 pb-2 kt-eyebrow">Your account</p>
          <ul className="grid grid-cols-2 gap-2 px-5">
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.name}>
                <LocalizedClientLink
                  href={l.href}
                  onClick={close}
                  className="flex h-11 items-center gap-2.5 border border-teak-line px-3 text-[13px] text-teak"
                >
                  <Icon name={l.icon} />
                  {l.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          {/* Help */}
          <p className="px-5 pt-6 pb-1 kt-eyebrow">Help</p>
          <ul>
            {HELP_LINKS.map((l) => (
              <li key={l.name}>
                <LocalizedClientLink href={l.href} onClick={close} className="block px-5 py-2.5 text-sm text-teak">
                  {l.name}
                </LocalizedClientLink>
              </li>
            ))}
            {PHONES.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-teak">
                  <Icon name="phone" />
                  Call {p}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-teak-line bg-lime px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-[11px] leading-relaxed text-teak-muted">
          Cash on Delivery available · Shipping across India
          <br />
          Kancharla Textiles, Mangalagiri, Andhra Pradesh
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        data-testid="nav-menu-button"
        onClick={() => setOpen(true)}
        className="-ml-2 flex h-11 w-11 items-center justify-center text-teak"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h12" />
        </svg>
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  )
}

function Icon({ name }: { name: "search" | "user" | "box" | "heart" | "bag" | "phone" }) {
  const paths: Record<typeof name, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>
    ),
    box: (
      <>
        <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
        <path d="M3 7.5 12 12l9-4.5M12 12v9" />
      </>
    ),
    heart: (
      <path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" />
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-zari" aria-hidden>
      {paths[name]}
    </svg>
  )
}
