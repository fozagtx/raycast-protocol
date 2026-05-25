import { useWithdraw } from "@/app/providers/withdraw-provider"

import { Input } from "./input"
import { Quote } from "./quote"

export function Withdraw() {
  const {
    inputAmount,
    inputAmountUsd,
    isApproved,
    isApproving,
    isLoading,
    isSubmitting,
    quote,
    onApprove,
    onChangeInput,
    onSubmit,
  } = useWithdraw()
  return (
    <>
      <div>
        <Input
          onChange={onChangeInput}
          isLoading={isLoading}
          value={inputAmount}
          amountUsd={inputAmountUsd}
        />
      </div>
      {!isLoading && quote && (
        <Quote amount={quote.outputAmount} amountUsd={quote.outputAmountUsd} />
      )}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-[#292C32] px-4 py-3 text-base font-semibold tracking-[-0.5px] text-[#D1D6E0] transition duration-150 ease-out hover:bg-[#343840] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-70"
        onClick={onApprove}
        disabled={isApproving}
        aria-busy={isApproving}
      >
        {isApproving ? "Approving..." : isApproved ? "Approved" : "Approve"}
      </button>
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center rounded-full border border-white/10 bg-cta-gradient px-4 py-3 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
        onClick={onSubmit}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <div className="h-3 w-3 mr-4">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
          </div>
        )}
        <span>{isSubmitting ? "Withdrawing..." : "Withdraw"}</span>
      </button>
    </>
  )
}
