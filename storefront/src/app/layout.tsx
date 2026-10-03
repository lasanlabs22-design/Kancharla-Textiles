import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cormorant_Garamond, Jost } from "next/font/google"
import "styles/globals.css"

// Editorial pairing: Cormorant Garamond for headings, Jost for interface text.
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
})
const jost = Jost({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-jost" })

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: "Kancharla Textiles | Handwoven Sarees from Mangalagiri", template: "%s | Kancharla Textiles" },
  description:
    "Handloom Mangalagiri sarees, silk sarees, kurtis, lehengas, nighties and our signature 4-way stretch leggings. Shipped from Mangalagiri across India.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-lime text-teak font-sans font-light antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
