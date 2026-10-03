import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

/** The Mangalagiri story: temple gopuram and the looms, as an editorial spread. */
export default function Story() {
  return (
    <section className="bg-lime-deep">
      <div className="content-container grid items-center gap-9 py-14 small:gap-12 small:py-24 small:grid-cols-[1fr_1.1fr]">
        <div className="relative h-[340px] xsmall:h-[440px] small:h-[520px]">
          <div className="absolute left-0 top-0 h-[78%] w-[66%] overflow-hidden">
            <Image src="/products/hero-gopuram.jpg" alt="Carved temple gopuram" fill sizes="40vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 h-[58%] w-[56%] overflow-hidden border-[10px] border-lime-deep">
            <Image src="/products/hero-loom.jpg" alt="Weaver at a wooden handloom" fill sizes="30vw" className="object-cover" />
          </div>
        </div>
        <div className="max-w-[480px] small:pl-6">
          <p className="kt-eyebrow">Our home · Mangalagiri, Andhra Pradesh</p>
          <h2 className="mt-4 small:mt-5 font-display text-[34px] small:text-[44px] leading-[1.08] font-normal text-teak">
            From the temple town, <em className="text-kumkum">thread by thread.</em>
          </h2>
          <div className="zari-thread w-20 mt-6 small:mt-7" />
          <p className="mt-6 small:mt-7 text-[15px] leading-relaxed text-teak-muted">
            Below the hill shrine of Sri Lakshmi Narasimha Swamy, Mangalagiri&apos;s weavers have worked pit looms for
            generations. Their cottons are known for a plain, breathable body and the gold Nizam border.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-teak-muted">
            At Kancharla Textiles we bring you these weaves, alongside festive silks and everyday wear,
            chosen in our Mangalagiri store and shipped across India.
          </p>
          <LocalizedClientLink href="/categories/sarees/mangalagiri-sarees" className="kt-link inline-block mt-8 small:mt-10">
            Explore Mangalagiri sarees
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
