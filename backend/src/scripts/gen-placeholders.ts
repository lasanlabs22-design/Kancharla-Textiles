import fs from "fs"
import path from "path"
import { placeholderSvg, SAMPLE_PRODUCTS } from "./catalog"

/** Regenerates the POC placeholder product images. Run: `npx medusa exec ./src/scripts/gen-placeholders.ts` */
export default async function genPlaceholders() {
  const dir = path.resolve(process.cwd(), "../storefront/public/placeholders")
  fs.mkdirSync(dir, { recursive: true })
  for (const p of SAMPLE_PRODUCTS) {
    fs.writeFileSync(path.join(dir, `${p.handle}-1.svg`), placeholderSvg(p, 0))
    fs.writeFileSync(path.join(dir, `${p.handle}-2.svg`), placeholderSvg(p, 1))
  }
}
