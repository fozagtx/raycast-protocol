import clsx from "clsx"
import type { DriveStep } from "driver.js"
import Image from "next/image"
import { useMemo, useState } from "react"

import { Deposit } from "@/app/components/bridge/components/deposit"
import { ProductTourButton } from "@/app/components/product-tour-button"
import { Submitting } from "@/app/components/bridge/components/submitting"
import { Withdraw } from "@/app/components/bridge/components/withdraw"
import { useBridge } from "@/app/providers/bridge-provider"
import { useWithdraw } from "@/app/providers/withdraw-provider"

export function Bridge() {
  const [showDeposit, setShowDeposit] = useState(true)
  const bridge = useBridge()
  const withdraw = useWithdraw()

  const bridgeTourSteps = useMemo<DriveStep[]>(
    () => [
      {
        element: "[data-tour='bridge-card']",
        popover: {
          title: "Bridge widget",
          description:
            "This modal is the live deposit and withdraw flow for Raycast Protocol.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "[data-tour='bridge-tabs']",
        popover: {
          title: "Mode",
          description:
            "Deposit mints rcARB from USDC. Withdraw redeems rcARB back to USDC.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "[data-tour='deposit-input']",
        popover: {
          title: "Deposit amount",
          description:
            "Enter the USDC amount you want to move into the Arbitrum vault.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "[data-tour='deposit-approve']",
        popover: {
          title: "Approve once",
          description:
            "Approve lets the vault spend the entered USDC. If allowance is already enough, this button reads Approved.",
          side: "left",
          align: "center",
        },
      },
      {
        element: "[data-tour='deposit-submit']",
        popover: {
          title: "Deposit",
          description:
            "After approval, Deposit sends the vault transaction. The UI keeps the confirmed state after the receipt comes back.",
          side: "left",
          align: "center",
        },
      },
      {
        popover: {
          title: "Receipts",
          description:
            "Submitted and confirmed transactions show a short explorer link plus Copy hash, so you can inspect or share the transaction.",
          side: "over",
        },
      },
      {
        element: "[data-tour='bridge-tab-withdraw']",
        popover: {
          title: "Withdraw",
          description:
            "Withdraw redeems your own rcARB, so there is no separate approval step. I will switch to that tab next.",
          nextBtnText: "Show withdraw",
          side: "bottom",
          align: "center",
          onNextClick: (_element, _step, options) => {
            setShowDeposit(false)
            window.setTimeout(() => options.driver.moveNext(), 160)
          },
        },
      },
      {
        element: "[data-tour='withdraw-input']",
        popover: {
          title: "Withdraw amount",
          description:
            "Enter the rcARB amount you want to redeem back to USDC on Arbitrum Sepolia.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "[data-tour='withdraw-submit']",
        popover: {
          title: "Withdraw",
          description:
            "Confirm in your wallet, then the same receipt panel shows the explorer link and copyable hash.",
          side: "left",
          align: "center",
        },
      },
    ],
    [],
  )

  const toggleDepositWithdraw = (showDeposit: boolean) => {
    setShowDeposit(showDeposit)
  }

  if (bridge.isSubmitting) {
    return (
      <Submitting
        explorerUrl={bridge.transactionExplorerUrl}
        routeLabel="Arbitrum Sepolia to Ethereum Sepolia"
        statusLabel={bridge.statusMessage ?? "Confirming deposit..."}
        transactionHash={bridge.transactionHash}
        inputLabel={`${bridge.inputAmount} USDC`}
        outputLabel={`${bridge.quote?.outputAmount ?? bridge.inputAmount} rcARB`}
      />
    )
  }

  return withdraw.isSubmitting ? (
    <Submitting
      explorerUrl={withdraw.transactionExplorerUrl}
      routeLabel="Ethereum Sepolia to Arbitrum Sepolia"
      statusLabel={withdraw.statusMessage ?? "Confirming withdrawal..."}
      transactionHash={withdraw.transactionHash}
      inputLabel={`${withdraw.inputAmount} rcARB`}
      outputLabel={`${withdraw.quote?.outputAmount ?? withdraw.inputAmount} USDC`}
    />
  ) : (
    <div
      className="dither-card relative flex w-[min(460px,calc(100vw-32px))] flex-col gap-3 rounded-[30px] border border-white/10 bg-[#17191C] p-3 text-[#FBFBFD] shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_18px_50px_-12px_rgba(0,34,89,0.5)]"
      data-tour="bridge-card"
    >
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <div className="text-xs font-medium tracking-[-0.5px] text-[#8A8FA8]">
            Bridge widget
          </div>
          <div className="text-2xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
            Raycast route
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProductTourButton
            label="Guide"
            onBeforeStart={() => setShowDeposit(true)}
            steps={bridgeTourSteps}
            variant="dark"
          />
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
      </div>

      <div
        className="grid grid-cols-2 gap-2 rounded-full bg-[#292C32] p-1"
        data-tour="bridge-tabs"
      >
        <button
          type="button"
          className={clsx(
            "h-11 rounded-full text-base font-semibold tracking-[-0.5px] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C]",
            showDeposit
              ? "bg-[#FBFBFD] text-[#17191C]"
              : "text-[#A7ABBE] hover:bg-[#343840]",
          )}
          onClick={() => toggleDepositWithdraw(true)}
          data-tour="bridge-tab-deposit"
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
          data-tour="bridge-tab-withdraw"
        >
          Withdraw
        </button>
      </div>
      {showDeposit && <Deposit />}
      {!showDeposit && <Withdraw />}
    </div>
  )
}
