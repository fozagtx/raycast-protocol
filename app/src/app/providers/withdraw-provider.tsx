import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import {
  Address,
  encodeFunctionData,
  decodeFunctionResult,
  formatUnits,
  parseAbi,
  parseUnits,
} from "viem"
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi"

import { sourceVaultContract } from "@/app/config"
import { SOURCE_VAULT_ABI } from "./source-vault-abi"

interface FormattedQuote {
  outputAmount: string
  outputAmountUsd: string
}

export interface WithdrawContext {
  inputAmount: string
  inputAmountUsd: string
  isApproved: boolean
  isApproving: boolean
  isLoading: boolean
  isSubmitting: boolean
  quote: FormattedQuote | null
  onApprove: () => void
  onChangeInput: (val: string) => void
  onSubmit: () => void
}

export const WithdrawProviderContext = createContext<WithdrawContext>({
  inputAmount: "0",
  inputAmountUsd: "$0",
  isApproved: false,
  isApproving: false,
  isLoading: false,
  isSubmitting: false,
  quote: null,
  onApprove: () => {},
  onChangeInput: () => {},
  onSubmit: () => {},
})

export const useWithdraw = () => useContext(WithdrawProviderContext)

const vaultShareToken = sourceVaultContract
const spender = sourceVaultContract

export function WithdrawProvider(props: { children: ReactNode }) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [inputAmount, setInputAmount] = useState("0")
  const inputAmountUsd = useMemo(() => `$${Number(inputAmount)}`, [inputAmount])
  const [isApproving, setIsApproving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quote, setQuote] = useState<FormattedQuote | null>(null)

  const { data: allowance, refetch } = useReadContract({
    address: vaultShareToken,
    abi: parseAbi([
      "function allowance(address owner, address spender) external view returns (uint256)",
    ]),
    functionName: "allowance",
    args: [address as Address, spender],
    query: {
      enabled: Boolean(address),
    },
  })

  const isApproved = useMemo(() => {
    if (!address) return false
    if (isApproving) return false
    const amnt = Number(inputAmount)
    if (amnt <= 0) return false
    const amount = parseUnits(inputAmount, 6)
    return allowance ? allowance >= amount : false
  }, [address, allowance, inputAmount, isApproving])

  const onApprove = useCallback(() => {
    if (!publicClient || !walletClient) return
    const amnt = Number(inputAmount)
    if (amnt <= 0) return
    const approve = async () => {
      setIsApproving(true)
      try {
        const abi = parseAbi([
          "function approve(address spender, uint256 amount) external returns (bool)",
        ])
        const amount = parseUnits(inputAmount, 6)
        const hash = await walletClient.writeContract({
          address: vaultShareToken,
          abi,
          functionName: "approve",
          args: [spender, amount],
        })
        await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash,
        })
        await refetch()
      } catch (error) {
        console.warn("Error approving withdrawal:", error)
      } finally {
        setIsApproving(false)
      }
    }
    approve()
  }, [inputAmount, publicClient, refetch, walletClient])

  const onChangeInput = (val: string) => {
    setInputAmount(val)
    setQuote(null)
  }

  const onSubmit = useCallback(() => {
    const submitting = async () => {
      if (!address || !publicClient || !walletClient) return
      const amnt = Number(inputAmount)
      if (amnt <= 0) return
      try {
        setIsSubmitting(true)
        const shares = parseUnits(inputAmount, 6)
        const encodedData = encodeFunctionData({
          abi: SOURCE_VAULT_ABI,
          functionName: "redeem",
          args: [shares, address, address],
        })
        const gasLimit = await publicClient.estimateGas({
          account: address,
          to: sourceVaultContract,
          data: encodedData,
        })
        const hash = await walletClient.writeContract({
          address: sourceVaultContract,
          abi: SOURCE_VAULT_ABI,
          functionName: "redeem",
          args: [shares, address, address],
          gas: gasLimit,
        })
        await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash,
        })
      } catch (error) {
        console.warn("Error submitting withdraw:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
    submitting()
  }, [address, inputAmount, publicClient, walletClient])


  useEffect(() => {
    if (!address || !publicClient) return
    const amnt = Number(inputAmount)
    if (amnt <= 0) return
    const amount = parseUnits(inputAmount, 6)
    let ignore = false
    const fetchQuote = async () => {
      setIsLoading(true)
      try {
        const encodedData = encodeFunctionData({
          abi: SOURCE_VAULT_ABI,
          functionName: "previewRedeem",
          args: [amount],
        })
        const { data } = await publicClient.call({
          account: address,
          data: encodedData,
          to: sourceVaultContract,
        })
        if (data !== undefined && !ignore) {
          const value = decodeFunctionResult({
            abi: SOURCE_VAULT_ABI,
            functionName: "previewRedeem",
            data,
          })
          const outputAmount = formatUnits(BigInt(value), 6)
          setQuote({
            outputAmount,
            outputAmountUsd: `$${outputAmount}`,
          })
        }
      } catch (error) {
        console.warn("Error fetching withdrawal quote:", error)
        if (!ignore) setQuote(null)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }
    fetchQuote()
    return () => {
      ignore = true
    }
  }, [address, inputAmount, publicClient])

  const canDisplayQuote = Boolean(address && publicClient && Number(inputAmount) > 0)

  return (
    <WithdrawProviderContext.Provider
      value={{
        inputAmount,
        inputAmountUsd,
        isApproved,
        isApproving,
        isLoading: canDisplayQuote ? isLoading : false,
        isSubmitting,
        quote: canDisplayQuote ? quote : null,
        onApprove,
        onChangeInput,
        onSubmit,
      }}
    >
      {props.children}
    </WithdrawProviderContext.Provider>
  )
}
