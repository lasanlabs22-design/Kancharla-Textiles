"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

/**
 * Phones: full-width swipe carousel with dots (AJIO/Myntra style).
 * Desktop: two-column image grid, as on Myntra's product page.
 */
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (index: number) => {
    const el = trackRef.current
    el?.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div className="-mx-4 small:mx-0">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar small:grid small:grid-cols-2 small:gap-2 small:overflow-visible"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            id={image.id}
            className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-lime-deep small:w-auto"
          >
            {!!image.url && (
              <Image
                src={image.url}
                priority={index <= 1}
                className="object-cover transition-transform duration-500 small:hover:scale-105"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            )}
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2 small:hidden" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={active === index}
              className={`h-1.5 rounded-full transition-all ${active === index ? "w-6 bg-teak" : "w-1.5 bg-teak/25"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
