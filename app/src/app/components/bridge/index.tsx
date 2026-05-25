import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"

import { Deposit } from "@/app/components/bridge/components/deposit"
import { Submitting } from "@/app/components/bridge/components/submitting"
import { Withdraw } from "@/app/components/bridge/components/withdraw"
import { useBridge } from "@/app/providers/bridge-provider"
import { useWithdraw } from "@/app/providers/withdraw-provider"

export function Bridge() {
  const [showDeposit, setShowDeposit] = useState(true)
  const bridge = useBridge()
  const withdraw = useWithdraw()

  const toggleDepositWithdraw = (showDeposit: boolean) => {
    setShowDeposit(showDeposit)
  }

  if (bridge.isSubmitting) {
    return (
      <Submitting
        routeLabel="Arbitrum Sepolia to Ethereum Sepolia"
        statusLabel={bridge.statusMessage ?? "Confirming deposit..."}
        inputLabel={`${bridge.inputAmount} USDC`}
        outputLabel={`${bridge.quote?.outputAmount ?? bridge.inputAmount} rcARB`}
      />
    )
  }

  return withdraw.isSubmitting ? (
    <Submitting
      routeLabel="Ethereum Sepolia to Arbitrum Sepolia"
      statusLabel="Confirming withdrawal..."
      inputLabel={`${withdraw.inputAmount} rcARB`}
      outputLabel={`${withdraw.quote?.outputAmount ?? withdraw.inputAmount} USDC`}
    />
  ) : (
    <div className="dither-card relative flex w-[min(460px,calc(100vw-32px))] flex-col gap-3 rounded-[30px] border border-white/10 bg-[#17191C] p-3 text-[#FBFBFD] shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_18px_50px_-12px_rgba(0,34,89,0.5)]">
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <div className="text-xs font-medium tracking-[-0.5px] text-[#8A8FA8]">
            Bridge widget
          </div>
          <div className="text-2xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
            Raycast route
          </div>
        </div>
        <div className="flex -space-x-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#17191C] bg-blue-700">
            <Image
              alt="Arbitrum"
              src="/assets/arbitrum-logo.svg"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#17191C] bg-blue-900">
            <Image
              alt="USDC"
              src="/assets/usdc-logo.svg"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-full bg-[#292C32] p-1">
        <button
          type="button"
          className={clsx(
            "h-11 rounded-full text-base font-semibold tracking-[-0.5px] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C]",
            showDeposit
              ? "bg-[#FBFBFD] text-[#17191C]"
              : "text-[#A7ABBE] hover:bg-[#343840]",
          )}
          onClick={() => toggleDepositWithdraw(true)}
        >
          Deposit
        </button>
        <button
          type="button"
          className={clsx(
            "h-11 rounded-full text-base font-semibold tracking-[-0.5px] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C]",
            !showDeposit
              ? "bg-[#FBFBFD] text-[#17191C]"
              : "text-[#A7ABBE] hover:bg-[#343840]",
          )}
          onClick={() => toggleDepositWithdraw(false)}
        >
          Withdraw
        </button>
      </div>
      {showDeposit && <Deposit />}
      {!showDeposit && <Withdraw />}
    </div>
  )
}
