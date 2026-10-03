/**
 * POC product photos: free-to-use Unsplash images stored in storefront/public/products.
 * Each product gets [front, back]. The owner replaces these with real photos in the admin.
 */
export const PRODUCT_PHOTOS: Record<string, [string, string]> = {
  "mangalagiri-cotton-kumkum-red": ["saree-06", "saree-07"],
  "mangalagiri-handloom-indigo": ["saree-08", "saree-05"],
  "mangalagiri-silk-cotton-turmeric": ["saree-02", "saree-03"],
  "mangalagiri-cotton-parrot-green": ["saree-10", "saree-01"],
  "gadwal-pattu-maroon": ["saree-03", "fabric-03"],
  "benaras-katan-royal-blue": ["saree-05", "saree-08"],
  "paithani-peacock-green": ["saree-11", "saree-01"],
  "pattu-magenta-mango-butta": ["saree-07", "saree-03"],
  "mysore-silk-bottle-green": ["saree-01", "fabric-01"],
  "kalamkari-pen-art-rust": ["saree-09", "saree-02"],
  "mushroom-silk-pastel-peach": ["saree-12", "saree-06"],
  "georgette-sequin-black": ["saree-07", "saree-05"],
  "dola-silk-floral-lilac": ["saree-04", "saree-09"],
  "fancy-ombre-lavender": ["saree-09", "saree-04"],
  "party-wear-wine-satin": ["saree-04", "saree-11"],
  "chinon-silk-mirror-teal": ["fabric-01", "saree-01"],
  "maheshwari-reversible-mustard": ["saree-02", "saree-12"],
  "marshmallow-soft-rose": ["saree-12", "saree-10"],
  "kalamkari-coord-set": ["kurti-02", "kurti-01"],
  "cotton-3-piece-indigo": ["kurti-01", "kurti-05"],
  "georgette-frock-midnight": ["kurti-03", "kurti-04"],
  "kalamkari-frock-rust": ["kurti-04", "kurti-03"],
  "bridal-lehenga-red": ["lehenga-01", "fabric-02"],
  "festive-lehenga-mint": ["lehenga-03", "lehenga-02"],
  "cotton-nighty-indigo": ["nighty-01", "nighty-02"],
  "rayon-nighty-pink": ["nighty-02", "nighty-01"],
  "ankle-leggings-black": ["leggings-02", "leggings-06"],
  "ankle-leggings-beige": ["leggings-01", "leggings-04"],
  "ankle-leggings-maroon": ["leggings-06", "leggings-02"],
  "ankle-leggings-royal-blue": ["leggings-04", "leggings-05"],
  "ankle-leggings-sea-green": ["leggings-05", "leggings-01"],
  "ankle-leggings-grape-wine": ["leggings-06", "leggings-04"],
}

export const photoUrl = (storefrontUrl: string, name: string) => `${storefrontUrl}/products/${name}.jpg`
