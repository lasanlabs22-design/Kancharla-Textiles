import fs from "fs"
import path from "path"
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, PriceListStatus, ProductStatus } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  CATEGORY_TREE,
  CategoryNode,
  FREE_SIZE,
  placeholderSvg,
  SAMPLE_PRODUCTS,
  SIZES,
} from "./catalog"

const STOREFRONT_URL = process.env.STOREFRONT_URL || "http://localhost:8000"
const PLACEHOLDER_DIR = path.resolve(process.cwd(), "../storefront/public/placeholders")

/**
 * Seeds the Kancharla Textiles POC: India region (INR, COD), the Mangalagiri store,
 * Delhivery shipping at 5%, the full category tree and sample products.
 *
 * Run once on an empty database: `yarn seed:store`
 */
export default async function seedStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)
  const productModule = container.resolve(Modules.PRODUCT)

  const existing = await productModule.listProductCategories({ handle: "sarees" })
  if (existing.length) {
    logger.info("Catalog already seeded. Skipping.")
    return
  }

  // --- Store, sales channel, currency ---------------------------------------
  logger.info("Setting up store...")
  const [store] = await storeModule.listStores()
  let [salesChannel] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    salesChannel = result[0]
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Kancharla Textiles",
        supported_currencies: [{ currency_code: "inr", is_default: true, is_tax_inclusive: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  // --- Region: India, INR, cash on delivery ----------------------------------
  // pp_system_default is Medusa's manual provider; the storefront labels it "Cash on Delivery".
  logger.info("Creating India region...")
  const { result: [region] } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          payment_providers: ["pp_system_default"],
          is_tax_inclusive: true,
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "in", provider_id: "tp_system" }],
  })

  // --- Stock location: Mangalagiri ------------------------------------------
  logger.info("Creating Mangalagiri stock location...")
  const { result: [location] } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Kancharla Textiles, Mangalagiri",
          address: {
            address_1: "Kancharla Textiles",
            city: "Mangalagiri",
            province: "Andhra Pradesh",
            country_code: "IN",
            postal_code: "522503",
          },
        },
      ],
    },
  })

  await updateStoresWorkflow(container).run({
    input: { selector: { id: store.id }, update: { default_location_id: location.id } },
  })

  await link.create([
    { [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } },
    { [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "delhivery_delhivery" } },
  ])

  // --- Shipping: Delhivery, 5% of bag value ---------------------------------
  logger.info("Creating shipping...")
  const [existingProfile] = await fulfillmentModule.listShippingProfiles({ type: "default" })
  let shippingProfile = existingProfile
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
    name: "Mangalagiri dispatch",
    type: "shipping",
    service_zones: [{ name: "India", geo_zones: [{ country_code: "in", type: "country" }] }],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery",
        price_type: "calculated",
        provider_id: "delhivery_delhivery",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        data: { id: "delhivery-standard" },
        type: { label: "Standard", description: "Delivered by Delhivery in 4–7 days.", code: "standard" },
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: location.id, add: [salesChannel.id] },
  })

  // --- Publishable API key for the storefront -------------------------------
  const { data: keys } = await query.graph({ entity: "api_key", fields: ["id", "token"], filters: { type: "publishable" } })
  let apiKey = keys[0]
  if (!apiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Kancharla Textiles Storefront", type: "publishable", created_by: "" }] },
    })
    apiKey = result[0] as any
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: apiKey.id, add: [salesChannel.id] } })

  // --- Categories ------------------------------------------------------------
  logger.info("Creating category tree...")
  const categoryIds = new Map<string, string>()
  const parentOf = new Map<string, string>()

  const createLevel = async (nodes: CategoryNode[], parentHandle?: string) => {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: nodes.map((n) => ({
          name: n.name,
          handle: n.handle,
          rank: n.rank,
          is_active: true,
          is_internal: false,
          metadata: n.metadata,
          parent_category_id: parentHandle ? categoryIds.get(parentHandle) : null,
        })),
      },
    })
    for (const c of result) {
      categoryIds.set(c.handle, c.id)
      if (parentHandle) parentOf.set(c.handle, parentHandle)
    }
    for (const n of nodes) {
      if (n.children?.length) await createLevel(n.children, n.handle)
    }
  }
  await createLevel(CATEGORY_TREE)

  const withAncestors = (handle: string) => {
    const ids: string[] = []
    let h: string | undefined = handle
    while (h) {
      ids.push(categoryIds.get(h)!)
      h = parentOf.get(h)
    }
    return ids
  }

  // --- Placeholder images ----------------------------------------------------
  fs.mkdirSync(PLACEHOLDER_DIR, { recursive: true })
  for (const p of SAMPLE_PRODUCTS) {
    fs.writeFileSync(path.join(PLACEHOLDER_DIR, `${p.handle}-1.svg`), placeholderSvg(p, 0))
    fs.writeFileSync(path.join(PLACEHOLDER_DIR, `${p.handle}-2.svg`), placeholderSvg(p, 1))
  }

  // --- Products (base price = MRP) -------------------------------------------
  logger.info(`Creating ${SAMPLE_PRODUCTS.length} sample products...`)
  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: SAMPLE_PRODUCTS.map((p, i) => {
        const sizes = p.kind === "saree" ? FREE_SIZE : SIZES
        const skuBase = `KM-${p.kind.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`
        return {
          title: p.title,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          category_ids: withAncestors(p.category),
          shipping_profile_id: shippingProfile.id,
          weight: p.kind === "saree" ? 700 : 400,
          thumbnail: `${STOREFRONT_URL}/placeholders/${p.handle}-1.svg`,
          images: [
            { url: `${STOREFRONT_URL}/placeholders/${p.handle}-1.svg` },
            { url: `${STOREFRONT_URL}/placeholders/${p.handle}-2.svg` },
          ],
          metadata: { ...p.metadata, mrp: p.mrp },
          options: [{ title: "Size", values: sizes }],
          variants: sizes.map((size) => ({
            title: size,
            sku: `${skuBase}-${size.replace(/\s+/g, "").toUpperCase()}`,
            options: { Size: size },
            manage_inventory: true,
            prices: [{ amount: p.mrp, currency_code: "inr" }],
          })),
          sales_channels: [{ id: salesChannel.id }],
        }
      }),
    },
  })

  // --- Sale prices (MRP shown struck through, % off computed) ----------------
  logger.info("Creating launch sale price list...")
  const priceByHandle = new Map(SAMPLE_PRODUCTS.map((p) => [p.handle, p.price]))
  await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "Launch prices",
          // Price lists default to type "sale", so MRP shows struck through.
          description: "Selling prices below MRP",
          status: PriceListStatus.ACTIVE,
          prices: products.flatMap((prod) =>
            (prod.variants ?? []).map((v) => ({
              variant_id: v.id,
              amount: priceByHandle.get(prod.handle)!,
              currency_code: "inr",
            }))
          ),
        },
      ],
    },
  })

  // --- Stock -----------------------------------------------------------------
  logger.info("Adding stock at Mangalagiri...")
  const { data: inventoryItems } = await query.graph({ entity: "inventory_item", fields: ["id"] })
  const levels: CreateInventoryLevelInput[] = inventoryItems.map((item, i) => ({
    location_id: location.id,
    inventory_item_id: item.id,
    // Vary stock so "few left" and "sold out" states are visible in the POC.
    stocked_quantity: i % 11 === 0 ? 0 : i % 5 === 0 ? 3 : 25,
  }))
  await createInventoryLevelsWorkflow(container).run({ input: { inventory_levels: levels } })

  logger.info("Seed complete.")
  logger.info(`Region: ${region.name} (${region.id})`)
  logger.info(`PUBLISHABLE_KEY=${(apiKey as any).token}`)
}
