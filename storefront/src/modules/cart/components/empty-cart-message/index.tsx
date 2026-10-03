import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center py-20 small:py-32 px-2 text-center" data-testid="empty-cart-message">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#B8955A" strokeWidth="1" aria-hidden>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      <h1 className="mt-6 font-display text-[32px] small:text-[40px] leading-tight text-teak">Your bag is empty</h1>
      <div className="zari-thread w-20 mt-5" />
      <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-teak-muted">
        Handwoven sarees, kurtis and more are waiting. Add something you love and it will show up here.
      </p>
      <LocalizedClientLink href="/categories/sarees" className="kt-btn mt-8 w-full xsmall:w-auto">
        Start shopping
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
