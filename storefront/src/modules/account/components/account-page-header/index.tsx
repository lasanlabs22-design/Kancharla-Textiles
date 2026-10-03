/** Heading block shared by the account pages (Overview, Orders, Profile, Addresses). */
export default function AccountPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6 small:mb-8">
      {eyebrow && <p className="kt-eyebrow">{eyebrow}</p>}
      <h1 className="mt-2 font-display text-[clamp(28px,8vw,36px)] leading-tight text-teak">{title}</h1>
      <div className="zari-thread mt-4 w-20" />
      {description && <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-teak-muted">{description}</p>}
    </div>
  )
}
