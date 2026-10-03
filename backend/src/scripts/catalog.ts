/**
 * Kancharla Textiles POC catalog: the category tree from the client's header spec and
 * sample products. The owner replaces products with real ones in the admin.
 */

export type CategoryNode = {
  name: string
  handle: string
  rank: number
  metadata?: Record<string, unknown>
  children?: CategoryNode[]
}

const saree = (name: string, slug: string, rank: number, metadata?: Record<string, unknown>): CategoryNode => ({
  name,
  handle: `sarees/${slug}`,
  rank,
  metadata,
})

export const CATEGORY_TREE: CategoryNode[] = [
  {
    name: "Sarees",
    handle: "sarees",
    rank: 2,
    children: [
      // Shown as its own top-level header item, hidden inside the Sarees menu.
      saree("Mangalagiri Sarees", "mangalagiri-sarees", 0, { menu_pin: true, menu_rank: 1, hide_in_parent_menu: true }),
      saree("Gadwal Sarees", "gadwal-sarees", 1),
      saree("Benaras Sarees", "benaras-sarees", 2),
      saree("Paithani Sarees", "paithani-sarees", 3),
      saree("Pattu Sarees", "pattu-sarees", 4),
      saree("Mysore Silk Sarees", "mysore-silk-sarees", 5),
      saree("Kalamkari Sarees", "kalamkari-sarees", 6),
      saree("Mushroom Silk Sarees", "mushroom-silk-sarees", 7),
      saree("Georgette Sarees", "georgette-sarees", 8),
      saree("Dola Sarees", "dola-sarees", 9),
      saree("Fancy Sarees", "fancy-sarees", 10),
      saree("Party Wear Sarees", "party-wear-sarees", 11),
      saree("Chinon Silk Sarees", "chinon-silk-sarees", 12),
      saree("Maheshwari Silk Sarees", "maheshwari-silk-sarees", 13),
      saree("Marshmallow Sarees", "marshmallow-sarees", 14),
    ],
  },
  {
    name: "Kurtis",
    handle: "kurtis",
    rank: 3,
    children: [
      { name: "Coord Sets", handle: "kurtis/coord-sets", rank: 1 },
      { name: "3-Piece Sets", handle: "kurtis/3-piece-sets", rank: 2 },
      {
        name: "Frocks",
        handle: "kurtis/frocks",
        rank: 3,
        children: [
          { name: "Georgette Frocks", handle: "kurtis/frocks/georgette-frocks", rank: 1 },
          { name: "Kalamkari Frocks", handle: "kurtis/frocks/kalamkari-frocks", rank: 2 },
        ],
      },
    ],
  },
  { name: "Lehengas", handle: "lehengas", rank: 4 },
  { name: "Nighties", handle: "nighties", rank: 5 },
  {
    name: "Leggings",
    handle: "leggings",
    rank: 6,
    children: [{ name: "Ankle Leggings", handle: "leggings/ankle-leggings", rank: 1 }],
  },
]

export type Kind = "saree" | "kurti" | "frock" | "lehenga" | "nighty" | "leggings"

export type SampleProduct = {
  title: string
  handle: string
  category: string // deepest category handle; parents are added automatically
  kind: Kind
  mrp: number
  price: number
  color: string // main fabric colour (hex) for the placeholder image
  accent: string // border colour (hex)
  description: string
  metadata?: Record<string, string>
}

export const FREE_SIZE = ["Free Size"]
export const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"]

const SAREE_META = { length: "5.5 m + 0.8 m blouse piece", origin: "Handwoven in India" }

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  // Mangalagiri
  { title: "Mangalagiri Cotton Saree, Kumkum Red with Nizam Zari Border", handle: "mangalagiri-cotton-kumkum-red", category: "sarees/mangalagiri-sarees", kind: "saree", mrp: 1850, price: 1499, color: "#A8241B", accent: "#C9A13B", description: "Pure Mangalagiri cotton with the classic Nizam zari border and a plain, airy body. Woven on pit looms in Mangalagiri.", metadata: { fabric: "Pure cotton", ...SAREE_META } },
  { title: "Mangalagiri Handloom Saree, Indigo with Gold Zari", handle: "mangalagiri-handloom-indigo", category: "sarees/mangalagiri-sarees", kind: "saree", mrp: 1850, price: 1549, color: "#24406A", accent: "#C9A13B", description: "Deep indigo Mangalagiri handloom with a slim gold zari border. Breathable for everyday and office wear.", metadata: { fabric: "Pure cotton", ...SAREE_META } },
  { title: "Mangalagiri Silk-Cotton Saree, Turmeric Yellow", handle: "mangalagiri-silk-cotton-turmeric", category: "sarees/mangalagiri-sarees", kind: "saree", mrp: 2400, price: 1999, color: "#D99A1E", accent: "#7A1A14", description: "Silk-cotton blend in festive turmeric with a contrast maroon and zari border.", metadata: { fabric: "Silk-cotton", ...SAREE_META } },
  { title: "Mangalagiri Cotton Saree, Parrot Green Checks", handle: "mangalagiri-cotton-parrot-green", category: "sarees/mangalagiri-sarees", kind: "saree", mrp: 1750, price: 1399, color: "#3F7D3A", accent: "#C9A13B", description: "Small woven checks on a parrot-green body, finished with a Nizam zari border.", metadata: { fabric: "Pure cotton", ...SAREE_META } },
  // Other sarees
  { title: "Gadwal Pattu Saree, Maroon with Temple Border", handle: "gadwal-pattu-maroon", category: "sarees/gadwal-sarees", kind: "saree", mrp: 8500, price: 6999, color: "#6E1423", accent: "#D4AF37", description: "Cotton body with an interlocked pure-silk temple border and rich pallu, the Gadwal signature.", metadata: { fabric: "Cotton body, silk border", ...SAREE_META } },
  { title: "Benaras Katan Silk Saree, Royal Blue", handle: "benaras-katan-royal-blue", category: "sarees/benaras-sarees", kind: "saree", mrp: 9500, price: 7899, color: "#1F3A93", accent: "#D4AF37", description: "Katan silk with all-over zari buttis and a heavy Benarasi pallu.", metadata: { fabric: "Katan silk", ...SAREE_META } },
  { title: "Paithani Silk Saree, Peacock Green", handle: "paithani-peacock-green", category: "sarees/paithani-sarees", kind: "saree", mrp: 12000, price: 9999, color: "#0F6B5C", accent: "#D4AF37", description: "Peacock motifs woven into the pallu with a bright contrast border.", metadata: { fabric: "Silk", ...SAREE_META } },
  { title: "Pattu Saree, Magenta with Mango Butta", handle: "pattu-magenta-mango-butta", category: "sarees/pattu-sarees", kind: "saree", mrp: 7500, price: 5999, color: "#B0185E", accent: "#D4AF37", description: "Traditional pattu with mango buttas across the body and a broad zari border.", metadata: { fabric: "Pure silk", ...SAREE_META } },
  { title: "Mysore Silk Crepe Saree, Bottle Green", handle: "mysore-silk-bottle-green", category: "sarees/mysore-silk-sarees", kind: "saree", mrp: 6500, price: 5499, color: "#1D4D3A", accent: "#D4AF37", description: "Lightweight Mysore crepe silk with a simple gold border.", metadata: { fabric: "Crepe silk", ...SAREE_META } },
  { title: "Kalamkari Printed Saree, Pen Art Rust", handle: "kalamkari-pen-art-rust", category: "sarees/kalamkari-sarees", kind: "saree", mrp: 2200, price: 1799, color: "#9C4A1A", accent: "#2A1A12", description: "Hand-drawn kalamkari motifs in natural dyes on soft cotton.", metadata: { fabric: "Cotton", ...SAREE_META } },
  { title: "Mushroom Silk Saree, Pastel Peach", handle: "mushroom-silk-pastel-peach", category: "sarees/mushroom-silk-sarees", kind: "saree", mrp: 2800, price: 2299, color: "#E8A48A", accent: "#B08423", description: "Glossy mushroom silk with a light zari border for easy draping.", metadata: { fabric: "Mushroom silk", ...SAREE_META } },
  { title: "Georgette Saree, Sequin Border Black", handle: "georgette-sequin-black", category: "sarees/georgette-sarees", kind: "saree", mrp: 1999, price: 1599, color: "#1E1A1D", accent: "#C0C0C0", description: "Flowing georgette with a sequin border for evening wear.", metadata: { fabric: "Georgette", ...SAREE_META } },
  { title: "Dola Silk Saree, Floral Jacquard Lilac", handle: "dola-silk-floral-lilac", category: "sarees/dola-sarees", kind: "saree", mrp: 1500, price: 1199, color: "#9C7BB8", accent: "#B08423", description: "Soft dola silk with floral jacquard weave.", metadata: { fabric: "Dola silk", ...SAREE_META } },
  { title: "Fancy Saree, Ombre Lavender", handle: "fancy-ombre-lavender", category: "sarees/fancy-sarees", kind: "saree", mrp: 1299, price: 999, color: "#7E6BB3", accent: "#E7D7F2", description: "Light, easy-care fancy saree in an ombre wash.", metadata: { fabric: "Blended", ...SAREE_META } },
  { title: "Party Wear Saree, Wine Satin", handle: "party-wear-wine-satin", category: "sarees/party-wear-sarees", kind: "saree", mrp: 3200, price: 2699, color: "#5E1224", accent: "#D4AF37", description: "Satin party saree with a stone-work border.", metadata: { fabric: "Satin", ...SAREE_META } },
  { title: "Chinon Silk Saree, Mirror Work Teal", handle: "chinon-silk-mirror-teal", category: "sarees/chinon-silk-sarees", kind: "saree", mrp: 2500, price: 1999, color: "#127C80", accent: "#E5E4E2", description: "Chinon silk with hand-finished mirror work.", metadata: { fabric: "Chinon silk", ...SAREE_META } },
  { title: "Maheshwari Silk Saree, Reversible Border Mustard", handle: "maheshwari-reversible-mustard", category: "sarees/maheshwari-silk-sarees", kind: "saree", mrp: 3500, price: 2899, color: "#C7911C", accent: "#6E1423", description: "Silk-cotton Maheshwari with its signature reversible border.", metadata: { fabric: "Silk-cotton", ...SAREE_META } },
  { title: "Marshmallow Saree, Soft Rose", handle: "marshmallow-soft-rose", category: "sarees/marshmallow-sarees", kind: "saree", mrp: 1800, price: 1499, color: "#D98CA0", accent: "#B08423", description: "Feather-light marshmallow fabric with a satin finish.", metadata: { fabric: "Marshmallow", ...SAREE_META } },
  // Kurtis
  { title: "Kalamkari Coord Set, Kurti and Palazzo", handle: "kalamkari-coord-set", category: "kurtis/coord-sets", kind: "kurti", mrp: 1899, price: 1499, color: "#8A3B1E", accent: "#E7C98B", description: "Straight kalamkari kurti with matching palazzo.", metadata: { fabric: "Cotton" } },
  { title: "Cotton 3-Piece Set, Indigo Block Print", handle: "cotton-3-piece-indigo", category: "kurtis/3-piece-sets", kind: "kurti", mrp: 2199, price: 1799, color: "#2B4C7E", accent: "#F2EBDD", description: "Kurti, pant and dupatta in hand block-printed cotton.", metadata: { fabric: "Cotton" } },
  { title: "Georgette Anarkali Frock, Midnight Blue", handle: "georgette-frock-midnight", category: "kurtis/frocks/georgette-frocks", kind: "frock", mrp: 2499, price: 1999, color: "#1B2A4A", accent: "#D4AF37", description: "Flared georgette frock with zari yoke.", metadata: { fabric: "Georgette" } },
  { title: "Kalamkari Frock, Earthy Rust", handle: "kalamkari-frock-rust", category: "kurtis/frocks/kalamkari-frocks", kind: "frock", mrp: 1699, price: 1399, color: "#A0471D", accent: "#2A1A12", description: "Kalamkari printed frock with a flared hem.", metadata: { fabric: "Cotton" } },
  // Lehengas
  { title: "Bridal Lehenga, Zari Embroidered Red", handle: "bridal-lehenga-red", category: "lehengas", kind: "lehenga", mrp: 15999, price: 12999, color: "#A31621", accent: "#D4AF37", description: "Heavy zari embroidery with a net dupatta.", metadata: { fabric: "Silk blend" } },
  { title: "Festive Lehenga, Pastel Mint", handle: "festive-lehenga-mint", category: "lehengas", kind: "lehenga", mrp: 6999, price: 5499, color: "#8FC9B0", accent: "#C9A13B", description: "Light festive lehenga with sequin highlights.", metadata: { fabric: "Georgette" } },
  // Nighties
  { title: "Cotton Nighty, Block Print Indigo", handle: "cotton-nighty-indigo", category: "nighties", kind: "nighty", mrp: 799, price: 599, color: "#3A5A8C", accent: "#F2EBDD", description: "Soft cotton nighty with front buttons and pockets.", metadata: { fabric: "Cotton" } },
  { title: "Rayon Nighty, Floral Pink", handle: "rayon-nighty-pink", category: "nighties", kind: "nighty", mrp: 699, price: 549, color: "#D97A98", accent: "#FFFFFF", description: "Breathable rayon nighty with an all-over floral print.", metadata: { fabric: "Rayon" } },
  // Leggings (the store's existing product line)
  ...([
    ["Black", "#1C1B1F"],
    ["Beige", "#D8C3A5"],
    ["Maroon", "#6B1E2C"],
    ["Royal Blue", "#2346A0"],
    ["Sea Green", "#2E8B7A"],
    ["Grape Wine", "#5B2340"],
  ] as const).map(([name, hex]) => ({
    title: `Ankle Length Leggings with Pocket, ${name}`,
    handle: `ankle-leggings-${name.toLowerCase().replace(/\s+/g, "-")}`,
    category: "leggings/ankle-leggings",
    kind: "leggings" as Kind,
    mrp: 700,
    price: 499,
    color: hex,
    accent: "#B08423",
    description: "4-way stretch, 95% cotton and 5% Lycra, with a side pocket and bio-washed fabric. Our signature legging.",
    metadata: { fabric: "95% cotton, 5% Lycra" },
  })),
]

/** Placeholder product image: a folded textile in the product colour with a zari border. */
export function placeholderSvg(p: SampleProduct, variant: 0 | 1): string {
  const label: Record<Kind, string> = {
    saree: "SAREE",
    kurti: "KURTI SET",
    frock: "FROCK",
    lehenga: "LEHENGA",
    nighty: "NIGHTY",
    leggings: "LEGGINGS",
  }
  // 580px-wide fold / 40px triangles = 14.5, so 15 triangles clipped to the fold.
  const tri = Array.from({ length: 15 }, (_, i) => `M${i * 40} 0 L${i * 40 + 20} 18 L${i * 40 + 40} 0 Z`).join(" ")
  const ground = variant === 0 ? "#F5EFE3" : "#EFE6D6"
  const fold = variant === 0
    ? `<rect x="110" y="170" width="580" height="560" fill="${p.color}"/>
       <rect x="110" y="650" width="580" height="80" fill="${p.accent}" opacity="0.9"/>
       <g transform="translate(110 650)" fill="${p.color}" opacity="0.55" clip-path="url(#fold)"><path d="${tri}"/></g>
       <rect x="110" y="170" width="580" height="560" fill="url(#weave)"/>
       <rect x="110" y="300" width="580" height="6" fill="#000" opacity="0.10"/>
       <rect x="110" y="470" width="580" height="6" fill="#000" opacity="0.10"/>`
    : `<rect x="60" y="120" width="680" height="700" fill="${p.color}"/>
       <rect x="60" y="120" width="120" height="700" fill="${p.accent}" opacity="0.9"/>
       <rect x="60" y="120" width="680" height="700" fill="url(#weave)"/>
       <circle cx="460" cy="470" r="150" fill="none" stroke="${p.accent}" stroke-width="6" opacity="0.6"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <clipPath id="fold"><rect x="0" y="0" width="580" height="80"/></clipPath>
    <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="none"/><path d="M0 4 H8 M4 0 V8" stroke="#ffffff" stroke-width="0.6" opacity="0.10"/>
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="${ground}"/>
  ${fold}
  <text x="400" y="910" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="5" fill="#2A1A12" opacity="0.55">KANCHARLA TEXTILES · ${label[p.kind]}</text>
</svg>`
}
