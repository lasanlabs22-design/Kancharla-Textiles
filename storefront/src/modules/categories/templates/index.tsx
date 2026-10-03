import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import MobileSort from "@modules/store/components/refinement-list/mobile-sort"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-5 small:py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full min-w-0">
        <nav className="mb-2 text-xs text-teak-muted truncate">
          <LocalizedClientLink href="/" className="hover:text-kumkum">Home</LocalizedClientLink>
          {parents
            .slice()
            .reverse()
            .map((parent) => (
              <span key={parent.id}>
                {" / "}
                <LocalizedClientLink className="hover:text-kumkum" href={`/categories/${parent.handle}`} data-testid="sort-by-link">
                  {parent.name}
                </LocalizedClientLink>
              </span>
            ))}
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-4">
          <h1 className="font-display text-[clamp(26px,8vw,32px)] leading-none small:text-4xl text-teak" data-testid="category-page-title">
            {category.name}
          </h1>
          <MobileSort sortBy={sort} />
        </div>
        <div className="zari-thread mt-4 mb-5 small:mb-6 w-24" />
        {category.description && <p className="mb-5 small:mb-6 max-w-[70ch] text-sm text-teak-muted">{category.description}</p>}
        {!!category.category_children?.length && (
          <ul className="-mx-4 px-4 mb-6 small:mx-0 small:px-0 small:mb-8 flex flex-nowrap small:flex-wrap gap-2 overflow-x-auto no-scrollbar">
            {/* All sub-categories show here, including Mangalagiri Sarees (hidden only in the mega menu). */}
            {category.category_children
              .slice()
              .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
              .map((c) => (
                <li key={c.id} className="shrink-0">
                  <LocalizedClientLink
                    href={`/categories/${c.handle}`}
                    className="inline-block whitespace-nowrap rounded-full border border-teak-line bg-white px-3.5 small:px-4 py-1.5 text-[13px] small:text-sm text-teak hover:border-kumkum hover:text-kumkum"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
          </ul>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
