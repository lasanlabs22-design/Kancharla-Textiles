import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const DETAIL_LABELS: Record<string, string> = {
  fabric: "Fabric",
  length: "Length",
  origin: "Origin",
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region, countryCode, images }) => {
  if (!product || !product.id) {
    return notFound()
  }

  const meta = (product.metadata ?? {}) as Record<string, unknown>
  const details = Object.entries(DETAIL_LABELS).filter(([key]) => meta[key])
  const category = product.categories?.[0]

  return (
    <>
      <div className="content-container pt-0 pb-6 small:py-6" data-testid="product-container">
        <nav className="hidden small:block mb-5 text-xs text-teak-muted truncate">
          <LocalizedClientLink href="/" className="hover:text-kumkum">Home</LocalizedClientLink>
          {category && (
            <>
              {" / "}
              <LocalizedClientLink href={`/categories/${category.handle}`} className="hover:text-kumkum">
                {category.name}
              </LocalizedClientLink>
            </>
          )}
          {" / "}
          <span className="text-teak">{product.title}</span>
        </nav>

        <div className="grid gap-6 small:gap-10 small:grid-cols-[1.35fr_1fr]">
          <ImageGallery images={images} />

          <div className="small:sticky small:top-36 self-start flex flex-col gap-6 min-w-0">
            <div>
              <p className="kt-eyebrow">Kancharla Textiles · Mangalagiri</p>
              <h1 className="mt-2 font-display text-[24px] small:text-[28px] leading-tight text-teak" data-testid="product-title">
                {product.title}
              </h1>
            </div>

            <Suspense fallback={<ProductActions disabled={true} product={product} region={region} />}>
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            <div className="border border-teak-line bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-teak">Delivery options</p>
              <div className="mt-3 flex h-11 border border-teak-line">
                <input
                  aria-label="Pincode"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter pincode"
                  className="flex-1 bg-transparent px-3 text-sm outline-none"
                />
                <span className="flex items-center px-4 text-sm font-semibold text-kumkum">Check</span>
              </div>
              <ul className="mt-3 grid gap-1.5 text-sm text-teak-muted">
                <li>Delivered by Delhivery in 4–7 days</li>
                <li>Cash on Delivery available on eligible pincodes</li>
                <li>Shipping charge: 5% of order value</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teak">Product details</p>
              <p className="mt-2 text-sm leading-relaxed text-teak-muted whitespace-pre-line" data-testid="product-description">
                {product.description}
              </p>
              {details.length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-teak-line pt-4">
                  {details.map(([key, label]) => (
                    <div key={key}>
                      <dt className="text-xs text-teak-muted">{label}</dt>
                      <dd className="text-sm text-teak">{String(meta[key])}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="content-container my-10 small:my-16" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
      {/* Room for the sticky mobile "Add to bag" bar so it never covers the footer */}
      <div className="h-20 small:hidden" aria-hidden />
    </>
  )
}

export default ProductTemplate
