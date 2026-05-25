import { TransactionStatus } from "./transaction-status"

interface SubmittingProps {
  explorerUrl?: string
  inputLabel: string
  outputLabel: string
  routeLabel: string
  statusLabel: string
  transactionHash?: string | null
}

export function Submitting(props: SubmittingProps) {
  return (
    <div className="flex h-full w-[min(460px,calc(100vw-32px))] flex-col justify-center gap-5 rounded-[30px] border border-white/10 bg-[#17191C] p-6 text-[#FBFBFD] shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_18px_50px_-12px_rgba(0,34,89,0.5)]">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-600">
        <span className="h-3 w-3 animate-ping rounded-full bg-white" />
      </div>
      <div>
        <div className="font-serif text-2xl tracking-[-0.5px] text-[#FBFBFD]">
          Raycast Protocol
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
      </div>
      {props.transactionHash && (
        <TransactionStatus
          errorMessage={null}
          explorerUrl={props.explorerUrl ?? ""}
          statusMessage={props.statusLabel}
          transactionHash={props.transactionHash}
        />
      )}
    </div>
  )
}
