import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

/** Editorial hero: one traditional silk-saree portrait beside a quiet serif headline. */
const Hero = () => {
  return (
    <section className="bg-lime">
      <div className="grid small:grid-cols-[1.25fr_1fr] small:h-[min(780px,calc(100vh-165px))] small:min-h-[600px]">
        <div className="relative h-[min(62vh,520px)] min-h-[360px] small:h-full small:min-h-0 overflow-hidden">
          <Image
            src="/products/hero-bride.jpg"
            alt="Bride in a maroon and gold silk ensemble with temple jewellery, seated on a carved chair"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-[30%_62%]"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-9 xsmall:px-8 small:px-16 small:py-14 xlarge:px-24">
          <p className="kt-eyebrow">The Dasara Edit · 2026</p>
          <h1 className="mt-4 small:mt-6 font-display text-[42px] leading-[1.02] xsmall:text-[52px] small:text-[72px] font-normal text-teak [text-wrap:balance]">
            Heritage,
            <br />
            <em className="text-kumkum">handwoven.</em>
          </h1>
          <div className="zari-thread w-20 mt-6 small:mt-8" />
          <p className="mt-6 small:mt-8 max-w-[42ch] text-[14px] small:text-[15px] leading-relaxed text-teak-muted">
            Mangalagiri cottons with the Nizam zari border, silks from Gadwal to Benaras, and lehengas for the
            season. Woven by the looms of our temple town and sent to your door.
          </p>
          <div className="mt-8 small:mt-10 flex flex-col xsmall:flex-row xsmall:flex-wrap items-center gap-5 xsmall:gap-6">
            <LocalizedClientLink href="/categories/sarees" className="kt-btn w-full xsmall:w-auto">
              Discover sarees
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories/sarees/mangalagiri-sarees" className="kt-link">
              Mangalagiri weaves
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
