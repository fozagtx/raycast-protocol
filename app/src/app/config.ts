import { arbitrum, arbitrumSepolia, base, baseSepolia } from "wagmi/chains"
import type { Chain } from "wagmi/chains"

import {
  ArbitrumSourceVaultContractArbSepolia,
  USDC_ARBITRUM_SEPOLIA,
} from "@/app/constants"

// TEST SETUP INSTRUCTIONS
// 1. move whatever chain you wanna use first in the chains array (default chain)
// 2. add source vault address for chain
// 3. add usdc address for chain

export const chains = [
  arbitrumSepolia,
  arbitrum,
  base,
  baseSepolia,
] as const satisfies readonly [Chain, ...Chain[]]

// Config bridging (based on network)
export const sourceVaultContract = ArbitrumSourceVaultContractArbSepolia
export const inputTokenUsdc = USDC_ARBITRUM_SEPOLIA
