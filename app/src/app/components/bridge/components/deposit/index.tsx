import { useBridge } from "@/app/providers/bridge-provider"

import { Input } from "./input"
import { Quote } from "./quote"

export function Deposit() {
  const {
    inputAmount,
    inputAmountUsd,
    isApproved,
    isApproving,
    isLoading,
    isSubmitting,
    isWalletReady,
    statusMessage,
    errorMessage,
    quote,
    onApprove,
    onChangeInput,
    onSubmit,
  } = useBridge()
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
      {(statusMessage || errorMessage) && (
        <div
          role={errorMessage ? "alert" : "status"}
          className={`rounded-[18px] border px-4 py-3 text-sm font-medium tracking-[-0.5px] ${
            errorMessage
              ? "border-red-400/30 bg-red-500/10 text-red-100"
              : "border-blue-400/30 bg-blue-500/10 text-blue-100"
          }`}
        >
          {errorMessage ?? statusMessage}
        </div>
      )}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-[#292C32] px-4 py-3 text-base font-semibold tracking-[-0.5px] text-[#D1D6E0] transition duration-150 ease-out hover:bg-[#343840] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-70"
        onClick={onApprove}
        disabled={!isWalletReady || isApproving || isSubmitting || isApproved}
        aria-busy={isApproving}
      >
        {!isWalletReady
          ? "Wallet loading..."
          : isApproving
            ? "Approving..."
            : isApproved
              ? "Approved"
              : "Approve"}
      </button>
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center rounded-full border border-white/10 bg-cta-gradient px-4 py-3 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
        onClick={onSubmit}
        disabled={!isWalletReady || isSubmitting || isApproving}
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <div className="mr-4 h-3 w-3">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
          </div>
        )}
        <span>
          {!isWalletReady
            ? "Wallet loading..."
            : isSubmitting
              ? "Depositing..."
              : isApproved
                ? "Deposit"
                : "Approve first"}
        </span>
      </button>
    </>
  )
}
