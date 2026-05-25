"use client"

import { ConnectKitButton } from "connectkit"
import type { DriveStep } from "driver.js"
import Image from "next/image"

import { ProductTourButton } from "@/app/components/product-tour-button"

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

const connectTourSteps: DriveStep[] = [
  {
    element: "[data-tour='app-header']",
    popover: {
      title: "Raycast Protocol",
      description:
        "This app is pointed at the Arbitrum-first testnet flow you are using.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='network-badge']",
    popover: {
      title: "Network",
      description:
        "Keep your wallet on Arbitrum Sepolia for deposits and withdrawals.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "[data-tour='route-graphic']",
    popover: {
      title: "Route",
      description:
        "The deposit starts with USDC on Arbitrum Sepolia and mints rcARB for the vault position.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='connect-card']",
    popover: {
      title: "Wallet first",
      description:
        "Connect your wallet before opening the live vault list and bridge widget.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "[data-tour='connect-wallet']",
    popover: {
      title: "Connect",
      description:
        "Use this button to open the wallet picker. After connecting, choose a vault to deposit or withdraw.",
      side: "top",
      align: "center",
    },
  },
]

export function ConnectButton() {
  return (
    <section
      className="w-[min(400px,calc(100vw-32px))] rounded-[30px] border border-white/10 bg-[#17191C] p-3 text-left text-[#FBFBFD] shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_18px_50px_-12px_rgba(0,34,89,0.42)]"
      data-tour="connect-card"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="brand-mark brand-mark-sm" aria-hidden="true">
            R
          </span>
          <div>
            <div className="text-xs font-medium tracking-[-0.5px] text-[#A7ABBE]">
              Native deposit flow
            </div>
            <div className="text-base font-semibold tracking-[-0.5px]">
              Raycast Protocol
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProductTourButton
            label="Guide"
            steps={connectTourSteps}
            variant="dark"
          />
          <span className="rounded-full bg-[#292C32] px-3 py-1 text-xs font-semibold tracking-[-0.5px] text-[#D1D6E0]">
            Deposit
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-[24px] bg-[#292C32] p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-[-0.5px] text-[#8A8FA8]">
            <span>From</span>
            <span>Arbitrum Sepolia</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-3xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
              0
            </div>
            <div className="flex h-11 items-center gap-2 rounded-full bg-[#17191C] px-3 text-base font-semibold tracking-[-0.5px] text-[#FBFBFD]">
              <Image
                alt="USDC"
                src="/assets/usdc-logo.svg"
                width={24}
                height={24}
              />
              USDC
            </div>
          </div>
        </div>

        <div className="mx-auto grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-blue-700 text-sm font-semibold text-white">
          to
        </div>

        <div className="rounded-[24px] bg-[#292C32] p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-[-0.5px] text-[#8A8FA8]">
            <span>Destination</span>
            <span>Raycast vault</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-semibold tracking-[-0.5px] text-[#FBFBFD]">
              Yield route
            </div>
            <div className="flex h-11 items-center gap-2 rounded-full bg-[#17191C] px-3 text-base font-semibold tracking-[-0.5px] text-[#FBFBFD]">
              <Image
                alt="Ethereum"
                src="/assets/ethereum-logo.png"
                width={20}
                height={20}
                style={{ width: 20, height: 20 }}
              />
              rcARB
            </div>
          </div>
        </div>
      </div>

      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address }) => (
          <button
            type="button"
            onClick={show}
            disabled={isConnecting}
            aria-busy={isConnecting}
            aria-label="Connect wallet"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-cta-gradient px-6 text-base font-semibold tracking-[-0.5px] text-white transition duration-150 ease-out hover:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17191C] disabled:pointer-events-none disabled:opacity-75"
            data-tour="connect-wallet"
          >
            {isConnected
              ? address
                ? `Connected ${formatAddress(address)}`
                : "Connected"
              : isConnecting
                ? "Connecting..."
                : "Connect wallet"}
          </button>
        )}
      </ConnectKitButton.Custom>
    </section>
  )
}
