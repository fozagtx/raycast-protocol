import { TransactionStatus } from "./transaction-status"

interface SubmittingProps {
  actionLabel: "Deposit" | "Withdraw"
  explorerUrl?: string
  helperText?: string
  inputLabel: string
  isComplete?: boolean
  onDone?: () => void
  outputLabel: string
  routeLabel: string
  statusLabel: string
  transactionHash?: string | null
}

export function Submitting(props: SubmittingProps) {
  return (
    <div className="flex h-full w-[min(460px,calc(100vw-32px))] flex-col justify-center gap-5 rounded-[30px] border border-white/10 bg-[#17191C] p-6 text-[#FBFBFD] shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_18px_50px_-12px_rgba(0,34,89,0.5)]">
      <div
        className={
          props.isComplete
            ? "grid h-12 w-12 place-items-center rounded-full bg-emerald-500"
            : "grid h-12 w-12 place-items-center rounded-full bg-blue-600"
        }
      >
        <span
          className={
            props.isComplete
              ? "h-3 w-3 rounded-full bg-white"
              : "h-3 w-3 animate-ping rounded-full bg-white"
          }
        />
      </div>
      <div>
        <div className="font-serif text-2xl tracking-[-0.5px] text-[#FBFBFD]">
          {props.actionLabel} {props.isComplete ? "confirmed" : "submitted"}
        </div>
        <div className="text-lg font-medium tracking-[-0.5px] text-[#A7ABBE]">
          {props.routeLabel}
        </div>
        <div className="mt-4 text-sm font-medium tracking-[-0.5px] text-[#A7ABBE]">
          {props.statusLabel}
        </div>
        <div className="text-lg font-semibold tracking-[-0.5px] text-[#FBFBFD]">
          {props.inputLabel} to {props.outputLabel}
        </div>
        {props.helperText && (
          <div className="mt-2 text-sm font-medium tracking-[-0.5px] text-[#A7ABBE]">
            {props.helperText}
          </div>
        )}
      </div>
      {props.transactionHash ? (
        <TransactionStatus
          errorMessage={null}
          explorerUrl={props.explorerUrl ?? ""}
          statusMessage={props.statusLabel}
          transactionHash={props.transactionHash}
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#202329] p-4 text-sm font-medium tracking-[-0.5px] text-[#A7ABBE]">
          Waiting for your wallet to return the transaction hash. The short
          explorer link and Copy hash button will appear here.
        </div>
      )}
      {props.isComplete && props.onDone && (
        <button
          type="button"
          onClick={props.onDone}
          className="h-12 rounded-full bg-[#FBFBFD] px-5 text-base font-semibold tracking-[-0.5px] text-[#17191C] transition duration-150 ease-out hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C]"
        >
          Back to bridge
        </button>
      )}
    </div>
  )
}
