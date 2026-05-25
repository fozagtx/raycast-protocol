"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

const WalletProviders = dynamic(
  () => import("./wallet-providers").then((mod) => mod.WalletProviders),
  { ssr: false },
)

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <WalletProviders>{children}</WalletProviders>
}
