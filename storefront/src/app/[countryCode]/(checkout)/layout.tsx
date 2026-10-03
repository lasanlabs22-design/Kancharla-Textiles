import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b border-teak-line">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-semibold text-teak flex items-center gap-x-2 flex-1 basis-0 hover:text-kumkum"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Back to bag</span>
            <span className="block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/" className="flex flex-col items-center" data-testid="store-link">
            <span className="font-display text-center text-[18px] small:text-[22px] leading-[1.05] tracking-[0.16em] pl-[0.16em] text-kumkum whitespace-nowrap">
              KANCHARLA
              <br className="small:hidden" />
              <span className="hidden small:inline"> </span>
              TEXTILES
            </span>
            <span className="text-[8px] tracking-[0.42em] pl-[0.42em] font-medium text-zari-ink mt-1">MANGALAGIRI</span>
          </LocalizedClientLink>
          <div className="flex-1 basis-0 flex justify-end items-center gap-2 text-xs font-semibold text-teak-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="1" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span className="hidden small:inline">100% secure checkout</span>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
