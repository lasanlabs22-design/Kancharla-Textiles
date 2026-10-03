import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

/** Round size chips, as on Myntra. */
const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const values = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wider text-teak">Select {title}</span>
        {title.toLowerCase() === "size" && values.length > 1 && (
          <span className="text-xs font-semibold text-kumkum">Size chart</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5" data-testid={dataTestId}>
        {values.map((v) => (
          <button
            onClick={() => updateOption(option.id, v)}
            key={v}
            className={clx(
              "min-w-[52px] h-[52px] px-3 rounded-full border text-sm font-semibold transition-colors",
              v === current
                ? "border-kumkum bg-kumkum-soft text-kumkum"
                : "border-teak-line bg-white text-teak hover:border-kumkum"
            )}
            disabled={disabled}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionSelect
