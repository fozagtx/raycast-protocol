"use client"

import { ConnectKitButton } from "connectkit"

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

export function Footer() {
  return (
    <footer
      className="flex w-full items-end justify-between pb-5 pt-2"
      data-tour="footer-wallet"
    >
      <div className="font-serif text-2xl tracking-[-0.5px] text-navy">
        Raycast Protocol
      </div>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address }) => (
          <button
            type="button"
            onClick={show}
            disabled={isConnecting}
            className="h-11 rounded-2xl border border-blue-300/20 bg-white px-6 text-sm font-semibold tracking-[-0.5px] text-blue-700 shadow-search transition duration-150 ease-out hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          >
            {isConnected
              ? address
                ? formatAddress(address)
                : "Connected"
              : isConnecting
                ? "Connecting"
                : "Connect wallet"}
          </button>
        )}
      </ConnectKitButton.Custom>
    </footer>
  )
}
