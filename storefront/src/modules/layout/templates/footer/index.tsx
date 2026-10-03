import { listCategories } from "@lib/data/categories"
import { buildMenu } from "@lib/util/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HELP = [
  { name: "My orders", href: "/account/orders" },
  { name: "Track an order", href: "/account/orders" },
  { name: "Shipping policy", href: "/store" },
  { name: "Cancellation policy", href: "/store" },
  { name: "Contact us", href: "/store" },
]

export default async function Footer() {
  const categories = await listCategories().catch(() => [])
  const menu = buildMenu(categories ?? []).filter((m) => m.id !== "home")

  return (
    <footer className="mt-10 bg-teak text-lime">
      <div className="content-container grid grid-cols-2 gap-x-6 gap-y-10 py-12 small:py-16 small:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="col-span-2 small:col-span-1">
          <span className="block font-display text-[30px] small:text-[34px] leading-[1.05] tracking-[0.18em] text-zari-light">
            KANCHARLA
            <br />
            TEXTILES
          </span>
          <span className="block mt-2.5 text-[11px] tracking-[0.5em] text-zari-light/80">MANGALAGIRI</span>
          <p className="mt-4 max-w-[38ch] text-sm text-lime/75">
            Sarees, kurtis, lehengas and leggings from Kancharla Textiles, a family of weavers and textile
            sellers in Mangalagiri, Andhra Pradesh.
          </p>
          <p className="mt-5 text-sm text-lime/75">
            Kancharla Textiles, Mangalagiri, AP
            <br />
            +91 77801 36846 · +91 95535 25888
          </p>
        </div>
        <FooterColumn title="Shop" links={menu.map((m) => ({ name: m.name, href: m.href }))} />
        <FooterColumn
          title="Sarees"
          links={(menu.find((m) => m.name === "Sarees")?.children ?? []).slice(0, 7).map((c) => ({ name: c.name, href: c.href }))}
        />
        <FooterColumn title="Help" links={HELP} />
      </div>
      <div className="border-t border-lime/15">
        <div className="content-container flex flex-col small:flex-row justify-between gap-2 py-5 text-xs text-lime/60">
          <span>© {new Date().getFullYear()} Kancharla Textiles. All rights reserved.</span>
          <span>Prices include GST · Shipping across India</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.26em] text-zari-light">{title}</p>
      <ul className="mt-4 grid gap-2">
        {links.map((l) => (
          <li key={l.name}>
            <LocalizedClientLink href={l.href} className="text-sm text-lime/80 hover:text-white">
              {l.name}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
