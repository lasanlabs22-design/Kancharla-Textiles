import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const count = items?.reduce((n, i) => n + i.quantity, 0) ?? 0

  return (
    <div>
      <p className="kt-eyebrow">Shopping bag</p>
      <h1 className="mt-2 font-display text-[clamp(28px,8vw,36px)] leading-tight text-teak">
        Your bag <span className="text-teak-muted [font-variant-numeric:lining-nums]">({count} {count === 1 ? "item" : "items"})</span>
      </h1>
      <div className="zari-thread mt-4 w-20" />
      <ul className="mt-4 divide-y divide-teak-line border-y border-teak-line">
        {items
          ? items
              .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
              .map((item) => <Item key={item.id} item={item} currencyCode={cart?.currency_code!} />)
          : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
      </ul>
    </div>
  )
}

export default ItemsTemplate
