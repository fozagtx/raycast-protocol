interface QuoteProps {
  amount: string
  amountUsd: string
}

export function Quote(props: QuoteProps) {
  return (
    <div className="flex w-full flex-col rounded-[24px] bg-[#292C32] px-4 py-3">
      <div className="mb-1 text-sm font-medium tracking-[-0.5px] text-[#8A8FA8]">
        Receive
      </div>
      <div className="text-xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
        {props.amount} rcARB
      </div>
      <div className="flex flex-row items-end justify-between">
        <div className="text-sm tracking-[-0.5px] text-[#A7ABBE]">
          {props.amountUsd}
        </div>
        <div className="text-sm tracking-[-0.5px] text-[#A7ABBE]">
          Estimated
        </div>
      </div>
    </div>
  )
}
