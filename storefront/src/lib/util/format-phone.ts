/** "+919876543210" -> "+91 98765 43210" (other formats are returned unchanged). */
export const formatPhone = (phone?: string | null) => phone?.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2") ?? ""
