import { HttpTypes } from "@medusajs/types"

export type MenuItem = {
  id: string
  name: string
  href: string
  children: MenuItem[]
}

type Category = HttpTypes.StoreProductCategory

const meta = (c: Category) => (c.metadata ?? {}) as Record<string, unknown>
const byRank = (a: Category, b: Category) => (a.rank ?? 0) - (b.rank ?? 0)

/**
 * Builds the header menu from the category tree the owner manages in the admin.
 *
 * - Top level: Home, then categories pinned with `metadata.menu_pin`
 *   (e.g. Mangalagiri Sarees), then root categories by rank.
 * - Children marked `metadata.hide_in_parent_menu` stay out of their parent's
 *   mega menu, which is how Mangalagiri Sarees appears only as a top-level item.
 */
export function buildMenu(categories: Category[]): MenuItem[] {
  // The Store API only returns active, public categories, so no extra filtering is needed.
  const active = categories
  const childrenOf = (id: string) => active.filter((c) => c.parent_category_id === id).sort(byRank)

  const toItem = (c: Category, depth: number): MenuItem => ({
    id: c.id,
    name: c.name,
    href: `/categories/${c.handle}`,
    children:
      depth < 2
        ? childrenOf(c.id)
            .filter((child) => !meta(child).hide_in_parent_menu)
            .map((child) => toItem(child, depth + 1))
        : [],
  })

  const pinned = active
    .filter((c) => meta(c).menu_pin)
    .sort((a, b) => Number(meta(a).menu_rank ?? 0) - Number(meta(b).menu_rank ?? 0))
    .map((c) => ({ ...toItem(c, 2), children: [] }))

  const roots = active.filter((c) => !c.parent_category_id).sort(byRank).map((c) => toItem(c, 0))

  return [{ id: "home", name: "Home", href: "/", children: [] }, ...pinned, ...roots]
}
