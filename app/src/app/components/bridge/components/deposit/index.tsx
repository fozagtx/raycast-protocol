import { useBridge } from "@/app/providers/bridge-provider"

import { Input } from "./input"
import { Quote } from "./quote"
import { TransactionStatus } from "../transaction-status"

export function Deposit() {
  const {
    inputAmount,
    inputAmountUsd,
    isApproved,
    isApproving,
    isLoading,
    isSubmitting,
    isDepositConfirmed,
    statusMessage,
    errorMessage,
    transactionHash,
    transactionExplorerUrl,
    quote,
    onApprove,
    onChangeInput,
    onSubmit,
  } = useBridge()

  const normalizedStatus = statusMessage?.toLowerCase() ?? ""
  const isConfirmed =
    isDepositConfirmed || normalizedStatus.includes("deposit confirmed")
  const isDepositReady = isApproved && !isConfirmed
  const isWaitingForApproval = !isApproved && !isConfirmed

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
      <TransactionStatus
        errorMessage={errorMessage}
        explorerUrl={transactionExplorerUrl}
        statusMessage={statusMessage}
        transactionHash={transactionHash}
      />

      {isConfirmed ? (
        <div
          className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3"
          data-tour="deposit-submit"
        >
          <div className="text-sm font-semibold text-emerald-100">
            Deposit confirmed
          </div>
          <div className="mt-1 text-xs leading-5 text-emerald-100/70">
            Receipt stays above. Change the amount to start another deposit.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {isWaitingForApproval ? (
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center rounded-full border border-white/10 bg-cta-gradient px-4 py-3 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
              onClick={onApprove}
              disabled={isApproving || isSubmitting}
              aria-busy={isApproving}
              data-tour="deposit-approve"
            >
              {isApproving && (
                <div className="mr-4 h-3 w-3">
                  <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
                </div>
              )}
              <span>{isApproving ? "Approving USDC..." : "Approve USDC"}</span>
            </button>
          ) : (
            <div
              className="flex h-12 items-center justify-between rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm text-emerald-100"
              data-tour="deposit-approve"
            >
              <span className="font-semibold">USDC approved</span>
              <span className="text-emerald-100/70">Ready to deposit</span>
            </div>
          )}

          {isDepositReady && (
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center rounded-full border border-white/10 bg-cta-gradient px-4 py-3 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
              onClick={onSubmit}
              disabled={isSubmitting || isApproving}
              aria-busy={isSubmitting}
              data-tour="deposit-submit"
            >
              {isSubmitting && (
                <div className="mr-4 h-3 w-3">
                  <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
                </div>
              )}
              <span>{isSubmitting ? "Depositing..." : "Deposit now"}</span>
            </button>
          )}
        </div>
      )}
    </>
  )
}
