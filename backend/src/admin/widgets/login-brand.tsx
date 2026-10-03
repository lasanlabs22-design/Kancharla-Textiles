import { defineWidgetConfig } from "@medusajs/admin-sdk"

/** Store name above Medusa's admin login form (the "Welcome to Medusa" heading itself can't be changed). */
const LoginBrand = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 26,
          letterSpacing: "0.16em",
          lineHeight: 1.1,
          color: "#8C2A22",
        }}
      >
        KANCHARLA TEXTILES
      </div>
      <div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.4em", color: "#7D5F27" }}>
        MANGALAGIRI · OWNER CONSOLE
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default LoginBrand
