"use client"

import { MenuItem } from "@lib/util/menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"

/** Mobile drawer menu built from the same category tree as the desktop mega menu. */
export default function MobileMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        data-testid="nav-menu-button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center text-teak"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h12" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-teak/50" onClick={close} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col bg-white">
            <div className="zari-band" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-teak-line">
              <span className="flex flex-col">
                <span className="font-display text-2xl leading-none tracking-[0.2em] text-kumkum">KANCHARLA</span>
                <span className="mt-1 text-[8px] tracking-[0.42em] text-teak-muted">TEXTILES</span>
              </span>
              <button type="button" onClick={close} aria-label="Close menu" className="text-2xl leading-none text-teak">
                ×
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="border-b border-teak-line">
                  <div className="flex items-center justify-between">
                    <LocalizedClientLink href={item.href} onClick={close} className="flex-1 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-teak">
                      {item.name}
                    </LocalizedClientLink>
                    {item.children.length > 0 && (
                      <button
                        type="button"
                        aria-label={`Show ${item.name} categories`}
                        aria-expanded={expanded === item.id}
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        className="px-5 py-4 text-lg text-kumkum"
                      >
                        {expanded === item.id ? "−" : "+"}
                      </button>
                    )}
                  </div>
                  {expanded === item.id && (
                    <ul className="bg-lime pb-3">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <LocalizedClientLink href={child.href} onClick={close} className="block px-8 py-2 text-sm text-teak">
                            {child.name}
                          </LocalizedClientLink>
                          {child.children.map((g) => (
                            <LocalizedClientLink key={g.id} href={g.href} onClick={close} className="block px-12 py-1.5 text-sm text-teak-muted">
                              {g.name}
                            </LocalizedClientLink>
                          ))}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="p-5 text-xs text-teak-muted">Kancharla Textiles · Mangalagiri, Andhra Pradesh</div>
          </div>
        </div>
      )}
    </>
  )
}
