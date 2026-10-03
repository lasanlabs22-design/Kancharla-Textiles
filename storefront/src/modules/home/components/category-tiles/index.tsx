import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const TILES = [
  { name: "Mangalagiri Sarees", href: "/categories/sarees/mangalagiri-sarees", photo: "saree-06" },
  { name: "Silk Sarees", href: "/categories/sarees", photo: "saree-03" },
  { name: "Kurtis & Sets", href: "/categories/kurtis", photo: "kurti-02" },
  { name: "Lehengas", href: "/categories/lehengas", photo: "lehenga-02" },
  { name: "Nighties", href: "/categories/nighties", photo: "nighty-01" },
  { name: "Leggings", href: "/categories/leggings", photo: "leggings-02" },
]

export default function CategoryTiles() {
  return (
    <section className="content-container py-12 small:py-20">
      <div className="text-center mb-7 small:mb-12">
        <p className="kt-eyebrow">Shop by category</p>
        <h2 className="mt-3 font-display text-[30px] leading-tight small:text-[40px] font-normal text-teak">
          Crafted for every <em>occasion</em>
        </h2>
      </div>
      <ul className="grid grid-cols-3 small:grid-cols-6 gap-x-3 gap-y-6 small:gap-5">
        {TILES.map((t) => (
          <li key={t.name}>
            <LocalizedClientLink href={t.href} className="group block text-center">
              <div className="relative aspect-[3/4] overflow-hidden bg-lime-deep">
                <Image
                  src={`/products/${t.photo}.jpg`}
                  alt={t.name}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-2.5 small:mt-4 font-display text-[15px] leading-tight small:text-xl text-teak group-hover:text-kumkum transition-colors">
                {t.name}
              </p>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
