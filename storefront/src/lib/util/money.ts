import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-IN",
}: ConvertToLocaleParams) => {
  // Whole rupee amounts print as ₹1,549 (not ₹1,549.00); paise still show when present.
  const wholeAmount = Number.isInteger(amount)
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits: minimumFractionDigits ?? (wholeAmount ? 0 : 2),
        maximumFractionDigits: maximumFractionDigits ?? (wholeAmount ? 0 : 2),
      }).format(amount)
    : amount.toString()
}
