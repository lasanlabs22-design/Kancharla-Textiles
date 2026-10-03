import { MenuItem } from "@lib/util/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const COLUMN_SIZE = 6

// Editorial photo for each mega panel (POC stock photos; owner can swap later).
const PANEL_PHOTO: Record<string, { src: string; caption: string }> = {
  Sarees: { src: "/products/saree-11.jpg", caption: "The festive silk edit" },
  Kurtis: { src: "/products/kurti-02.jpg", caption: "Everyday kurtis & sets" },
  Leggings: { src: "/products/leggings-02.jpg", caption: "4-way stretch, with pocket" },
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

/** Desktop header menu with editorial mega panels. Pure CSS hover/focus, no client JS. */
export default function MegaMenu({ items }: { items: MenuItem[] }) {
  return (
    <ul className="flex items-stretch h-full gap-x-2">
      {items.map((item) => {
        const photo = PANEL_PHOTO[item.name]
        return (
          <li key={item.id} className="group/nav flex items-stretch">
            <LocalizedClientLink
              href={item.href}
              className="relative flex items-center px-4 text-[12px] font-normal uppercase tracking-[0.2em] text-teak hover:text-kumkum after:absolute after:inset-x-4 after:bottom-[-1px] after:h-px after:bg-zari after:scale-x-0 after:transition-transform group-hover/nav:after:scale-x-100 group-focus-within/nav:after:scale-x-100"
            >
              {item.name}
            </LocalizedClientLink>

            {item.children.length > 0 && (
              <div className="invisible opacity-0 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100 transition-opacity duration-200 absolute left-0 right-0 top-full bg-lime border-t border-teak-line shadow-[0_24px_40px_-24px_rgba(31,26,23,0.25)]">
                <div className="content-container grid grid-cols-[1fr_300px] gap-12 py-10">
                  <div className="flex gap-14">
                    {chunk(flatten(item), COLUMN_SIZE).map((col, i) => (
                      <ul key={i} className="flex flex-col gap-y-3 min-w-[170px]">
                        <li className="mb-2 h-[22px] font-display text-xl italic text-zari" aria-hidden={i > 0}>
                          {i === 0 ? item.name : ""}
                        </li>
                        {col.map((child) => (
                          <li key={child.id}>
                            <LocalizedClientLink
                              href={child.href}
                              className={`text-[14px] hover:text-kumkum transition-colors ${child.depth === 2 ? "pl-3 text-teak-muted" : "text-teak"}`}
                            >
                              {child.name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    ))}
                    <div className="flex flex-col justify-end">
                      <LocalizedClientLink href={item.href} className="kt-link self-start">
                        View all
                      </LocalizedClientLink>
                    </div>
                  </div>
                  {photo && (
                    <LocalizedClientLink href={item.href} className="group/photo relative block aspect-[4/5] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 font-display text-xl italic text-white">
                        {photo.caption}
                      </span>
                    </LocalizedClientLink>
                  )}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function flatten(item: MenuItem) {
  return item.children.flatMap((child) => [
    { ...child, depth: 1 },
    ...child.children.map((g) => ({ ...g, depth: 2 })),
  ])
}
