import { useWithdraw } from "@/app/providers/withdraw-provider"

import { Input } from "./input"
import { TransactionStatus } from "../transaction-status"

export function Withdraw() {
  const {
    inputAmount,
    inputAmountUsd,
    isLoading,
    isSubmitting,
    isWithdrawConfirmed,
    statusMessage,
    errorMessage,
    transactionHash,
    transactionExplorerUrl,
    quote,
    onChangeInput,
    onSubmit,
  } = useWithdraw()

  const hasAmount = Number.parseFloat(inputAmount) > 0
  const canWithdraw =
    hasAmount && Boolean(quote) && !isSubmitting && !isWithdrawConfirmed
  const outputAmount = quote?.outputAmount ?? "0"
  const outputAmountUsd = quote?.outputAmountUsd ?? "$0"

  return (
    <>
      <div className="flex flex-col gap-3">
        <Input
          onChange={onChangeInput}
          isLoading={isLoading}
          value={inputAmount}
          amountUsd={inputAmountUsd}
        />
        <div
          className="flex w-full flex-col gap-3 rounded-[24px] bg-[#292C32] p-4"
          data-tour="withdraw-receive"
        >
          <div className="flex flex-row items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium tracking-[-0.5px] text-[#8A8FA8]">
                Receive USDC
              </div>
              <div className="mt-1 truncate text-3xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
                {outputAmount}
              </div>
            </div>
            <div className="flex h-11 shrink-0 items-center rounded-full bg-[#17191C] px-4 text-base font-semibold tracking-[-0.5px] text-[#FBFBFD]">
              USDC
            </div>
          </div>
          <div className="flex min-h-5 flex-row items-center justify-between">
            <div className="text-sm tracking-[-0.5px] text-[#A7ABBE]">
              {outputAmountUsd}
            </div>
            {isLoading && (
              <div className="h-3 w-3">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-blue-500 opacity-75"></span>
              </div>
            )}
          </div>
        </div>
      </div>
      <TransactionStatus
        errorMessage={errorMessage}
        explorerUrl={transactionExplorerUrl}
        statusMessage={statusMessage}
        transactionHash={transactionHash}
      />
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center rounded-full border border-white/10 bg-cta-gradient px-4 py-3 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
        onClick={onSubmit}
        disabled={!canWithdraw}
        aria-busy={isSubmitting}
        data-tour="withdraw-submit"
      >
        {isSubmitting && (
          <div className="mr-4 h-3 w-3">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
          </div>
        )}
        <span>
          {isSubmitting
            ? "Withdrawing..."
            : isWithdrawConfirmed
              ? "Withdrawal complete"
              : "Withdraw"}
        </span>
      </button>
    </>
  )
}
