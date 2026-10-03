import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { buildMenu } from "@lib/util/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import MobileMenu from "@modules/layout/components/mobile-menu"

export default async function Nav() {
  const categories = await listCategories().catch(() => [])
  const menu = buildMenu(categories ?? [])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <div className="bg-lime-deep text-teak-muted text-[clamp(9px,2.6vw,10px)] small:text-[11px] uppercase tracking-[0.12em] xsmall:tracking-[0.16em] small:tracking-[0.24em] text-center py-2 px-4 truncate">
        <span className="small:hidden">Handwoven in Mangalagiri · Cash on Delivery</span>
        <span className="hidden small:inline">Handwoven in Mangalagiri · Delivered across India · Cash on Delivery available</span>
      </div>
      <header className="relative bg-lime/95 backdrop-blur border-b border-teak-line">
        <div className="content-container grid grid-cols-[1fr_auto_1fr] items-center h-[64px] small:h-[76px]">
          <div className="flex items-center gap-4">
            <div className="small:hidden">
              <MobileMenu items={menu} />
            </div>
            <LocalizedClientLink
              href="/store"
              className="hidden small:flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-teak-muted hover:text-teak"
            >
              <SearchIcon />
              Search
            </LocalizedClientLink>
          </div>

          <LocalizedClientLink href="/" className="flex flex-col items-center" data-testid="nav-store-link">
            <GopuramMark />
            <span className="font-display text-[21px] small:text-[32px] leading-none tracking-[0.16em] pl-[0.16em] small:tracking-[0.24em] small:pl-[0.24em] text-teak">KANCHARLA</span>
            <span className="text-[7.5px] small:text-[8.5px] tracking-[0.26em] pl-[0.26em] small:tracking-[0.42em] small:pl-[0.42em] text-zari mt-1.5 whitespace-nowrap">TEXTILES · MANGALAGIRI</span>
          </LocalizedClientLink>

          <div className="flex items-center justify-end gap-x-3 xsmall:gap-x-5">
            <NavIcon href="/account" label="Account" testId="nav-account-link">
              <ProfileIcon />
            </NavIcon>
            <NavIcon href="/account" label="Wishlist" className="hidden xsmall:flex">
              <HeartIcon />
            </NavIcon>
            <Suspense fallback={<NavIcon href="/cart" label="Bag"><BagIcon /></NavIcon>}>
              <CartButton />
            </Suspense>
          </div>
        </div>
        <nav className="hidden small:flex justify-center h-12 border-t border-teak-line/70">
          <MegaMenu items={menu} />
        </nav>
      </header>
    </div>
  )
}

/** Small gopuram glyph above the wordmark. */
function GopuramMark() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#B8955A" strokeWidth="1" className="mb-1.5" aria-hidden>
      <path d="M2 15.5h18M4 15.5V12h14v3.5M5.5 12V9h11v3M7 9V6.5h8V9M8.5 6.5V4.5h5v2M9.5 4.5 11 1.5l1.5 3" />
    </svg>
  )
}

function NavIcon({
  href,
  label,
  children,
  className = "",
  testId,
}: {
  href: string
  label: string
  children: React.ReactNode
  className?: string
  testId?: string
}) {
  return (
    <LocalizedClientLink
      href={href}
      data-testid={testId}
      aria-label={label}
      className={`flex items-center text-teak hover:text-kumkum transition-colors ${className}`}
    >
      {children}
    </LocalizedClientLink>
  )
}

const iconProps = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.3, viewBox: "0 0 24 24" }

export const SearchIcon = () => (
  <svg {...iconProps} width={16} height={16} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const ProfileIcon = () => (
  <svg {...iconProps} aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
)
export const HeartIcon = () => (
  <svg {...iconProps} aria-hidden><path d="M12 20s-7-4.4-9-9.2C1.8 7.4 4 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.2 0 5.4 2.9 4.2 6.3C19 15.6 12 20 12 20Z" /></svg>
)
export const BagIcon = () => (
  <svg {...iconProps} aria-hidden><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
)
