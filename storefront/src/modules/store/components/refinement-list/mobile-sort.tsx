"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SortOptions } from "./sort-products"

const OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Latest arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

/** Compact sort dropdown for phones; the desktop sidebar (RefinementList) is hidden below `small`. */
export default function MobileSort({ sortBy }: { sortBy: SortOptions }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <label className="small:hidden relative flex items-center gap-2 border border-teak-line bg-white pl-3 pr-8 h-10 text-[12px] uppercase tracking-[0.14em] text-teak">
      <span className="text-teak-muted">Sort</span>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent text-[13px] normal-case tracking-normal text-teak outline-none"
        data-testid="mobile-sort"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  )
}
