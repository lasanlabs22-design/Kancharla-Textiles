"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Shop numbers (the same ones shown in the footer). Change here if the owner wants different lines.
const WHATSAPP_NUMBER = "917780136846"
const CALL_NUMBER = "+917780136846"
const WHATSAPP_GREETING = "Hello Kancharla Textiles, I have a question about "

/**
 * Floating WhatsApp + Call buttons, bottom-right on every shop page.
 * On product pages (phones/tablets) they sit higher so they clear the sticky "Add to bag" bar.
 */
export default function FloatingContact() {
  const pathname = usePathname()
  const onProductPage = pathname.includes("/products/")
  // Account pages have forms (OTP, addresses) and the bag has its totals right where the buttons would float.
  const hidden = pathname.includes("/account") || pathname.endsWith("/cart")

  // On product pages the WhatsApp message includes the product link (set after load to avoid a hydration mismatch).
  const [message, setMessage] = useState(encodeURIComponent(WHATSAPP_GREETING + "your sarees."))
  useEffect(() => {
    setMessage(encodeURIComponent(WHATSAPP_GREETING + (onProductPage ? window.location.href : "your sarees.")))
  }, [pathname, onProductPage])

  if (hidden) return null

  return (
    <div
      className={`fixed right-4 z-40 flex flex-col items-center gap-3 small:right-6 small:bottom-6 ${
        onProductPage ? "bottom-[calc(6rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      }`}
    >
      <a
        href={`tel:${CALL_NUMBER}`}
        aria-label="Call Kancharla Textiles"
        title="Call us"
        className="flex h-11 w-11 small:h-12 small:w-12 items-center justify-center rounded-full bg-teak text-lime ring-1 ring-lime/40 shadow-[0_6px_18px_rgba(31,26,23,0.28)] transition-transform hover:scale-105 active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Kancharla Textiles on WhatsApp"
        title="Chat on WhatsApp"
        className="flex h-[52px] w-[52px] small:h-14 small:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 active:scale-95"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.42 9.42 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.04.68C5.77.68.66 5.78.66 12.06c0 2 .52 3.96 1.52 5.69L.57 23.68l6.07-1.6a11.36 11.36 0 0 0 5.4 1.38h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.34-8.05" />
        </svg>
      </a>
    </div>
  )
}
