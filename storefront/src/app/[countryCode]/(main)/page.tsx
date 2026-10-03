import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"
import CategoryTiles from "@modules/home/components/category-tiles"
import Hero from "@modules/home/components/hero"
import ProductRail from "@modules/home/components/product-rail"
import Story from "@modules/home/components/story"

export const metadata: Metadata = {
  title: "Kancharla Textiles | Handwoven Sarees from Mangalagiri",
  description:
    "Handloom Mangalagiri sarees, silk sarees, kurtis, lehengas, nighties and our signature 4-way stretch leggings, shipped from Mangalagiri across India.",
}

const PROMISES = [
  { title: "Woven in Mangalagiri", body: "Chosen at our store, from local looms" },
  { title: "Cash on Delivery", body: "Pay at your door on eligible orders" },
  { title: "Tracked delivery", body: "Shipped by Delhivery across India" },
  { title: "Secure payments", body: "UPI, cards and netbanking" },
]

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoryTiles />
      <ProductRail
        eyebrow="Our home weave"
        title="Mangalagiri Sarees"
        categoryHandle="sarees/mangalagiri-sarees"
        region={region}
        countryCode={countryCode}
      />
      <Story />
      <ProductRail
        eyebrow="Festive silks"
        title="Sarees for the season"
        categoryHandle="sarees"
        region={region}
        countryCode={countryCode}
        limit={8}
      />
      <ProductRail
        eyebrow="Our signature"
        title="4-way stretch leggings"
        categoryHandle="leggings"
        region={region}
        countryCode={countryCode}
      />
      <section className="border-t border-teak-line">
        <ul className="content-container grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-7 small:gap-8 py-10 small:py-14 text-center">
          {PROMISES.map((p) => (
            <li key={p.title}>
              <p className="font-display text-lg small:text-xl text-teak">{p.title}</p>
              <p className="mt-1 text-[13px] text-teak-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
