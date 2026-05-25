"use client"

import { useMemo } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

export function Footer() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = useMemo(
    () =>
      connectors.find((item) => item.id === "familyAccountsProvider") ??
      connectors.find((item) => item.id === "injected") ??
      connectors[0],
    [connectors],
  )

  const onConnect = () => {
    if (isConnected) {
      disconnect()
      return
    }

    if (connector) connect({ connector })
  }

  const label = isConnected
    ? address
      ? formatAddress(address)
      : "Connected"
    : isPending
      ? "Connecting"
      : "Family"

  return (
    <footer className="flex w-full items-end justify-between pb-5 pt-2">
      <div className="font-serif text-2xl tracking-[-0.5px] text-navy">
        Raycast Protocol
      </div>
      <button
        type="button"
        onClick={onConnect}
        disabled={isPending || !connector}
        className="h-11 rounded-2xl border border-blue-300/20 bg-white px-6 text-sm font-semibold tracking-[-0.5px] text-blue-700 shadow-search transition duration-150 ease-out hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
      >
        {label}
      </button>
    </footer>
  )
}
