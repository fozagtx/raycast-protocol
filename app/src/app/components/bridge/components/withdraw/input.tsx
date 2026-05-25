import Image from "next/image"

interface InputProps {
  amountUsd: string
  isLoading: boolean
  value: string
  onChange: (value: string) => void
}

export function Input(props: InputProps) {
  const { isLoading } = props
  return (
    <div
      className="flex w-full flex-col gap-3 rounded-[24px] bg-[#292C32] p-4"
      data-tour="withdraw-input"
    >
      <label
        htmlFor="withdraw-amount"
        className="text-sm font-medium tracking-[-0.5px] text-[#8A8FA8]"
      >
        Pay rcARB
      </label>
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <input
            id="withdraw-amount"
            aria-label="Withdraw amount in rcARB"
            autoComplete="off"
            className="w-full rounded-lg bg-transparent px-1 text-4xl font-semibold tracking-[-0.5px] text-[#FBFBFD] outline-none transition duration-150 ease-out placeholder:text-[#676B7E] focus-visible:ring-2 focus-visible:ring-blue-500/80 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0"
            onChange={(e) => props.onChange(e.target.value)}
            type="number"
            inputMode="decimal"
            min="0"
            value={props.value}
          />
        </div>
        <div className="flex h-11 flex-row items-center gap-2 rounded-full bg-[#17191C] px-3 text-base font-semibold tracking-[-0.5px] text-[#FBFBFD]">
          <Image
            alt="Arbitrum"
            src="/assets/arbitrum-logo.svg"
            width={24}
            height={24}
          />
          <div>rcARB</div>
        </div>
      </div>
      <div className="flex flex-row items-end justify-between">
        <div className="text-sm tracking-[-0.5px] text-[#A7ABBE]">
          {props.amountUsd}
        </div>
        {isLoading && (
          <div className="h-3 w-3">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-blue-500 opacity-75"></span>
          </div>
        )}
      </div>
    </div>
  )
}
