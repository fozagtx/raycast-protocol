"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { familyAccountsConnector } from "family"
import type { ReactNode } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { injected, walletConnect } from "wagmi/connectors"
import { arbitrum, arbitrumSepolia, base, baseSepolia } from "wagmi/chains"

import { chains } from "@/app/config"

import { BridgeProvider } from "./bridge-provider"
import { WithdrawProvider } from "@/app/providers/withdraw-provider"

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"
const appIcon =
  process.env.NEXT_PUBLIC_APP_ICON_URL ??
  "https://raycastprotocol.xyz/favicon.ico"

const alchemyUrl = (network: string) =>
  alchemyId ? `https://${network}.g.alchemy.com/v2/${alchemyId}` : undefined

const config = createConfig({
  chains,
  connectors: [
    familyAccountsConnector(),
    injected(),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: "Raycast Protocol",
              description: "Raycast Protocol cross-chain vaults",
              url: appUrl,
              icons: [appIcon],
            },
            showQrModal: true,
          }),
        ]
      : []),
  ],
  transports: {
    [arbitrumSepolia.id]: http(alchemyUrl("arb-sepolia")),
    [arbitrum.id]: http(alchemyUrl("arb-mainnet")),
    [base.id]: http(alchemyUrl("base-mainnet")),
    [baseSepolia.id]: http(alchemyUrl("base-sepolia")),
  },
})

const queryClient = new QueryClient()

interface WalletProvidersProps {
  children: ReactNode
}

export function WalletProviders({ children }: WalletProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <BridgeProvider>
            <WithdrawProvider>{children}</WithdrawProvider>
          </BridgeProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
