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
  BaseError,
  encodeFunctionData,
  decodeFunctionResult,
  formatUnits,
  parseUnits,
} from "viem"
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"

import { sourceVaultContract } from "@/app/config"
import { SOURCE_VAULT_ABI } from "./source-vault-abi"

interface FormattedQuote {
  outputAmount: string
  outputAmountUsd: string
}

export interface WithdrawContext {
  inputAmount: string
  inputAmountUsd: string
  isLoading: boolean
  isSubmitting: boolean
  isWithdrawConfirmed: boolean
  statusMessage: string | null
  errorMessage: string | null
  transactionHash: string | null
  transactionExplorerUrl: string
  quote: FormattedQuote | null
  onChangeInput: (val: string) => void
  onSubmit: () => void
}

export const WithdrawProviderContext = createContext<WithdrawContext>({
  inputAmount: "0",
  inputAmountUsd: "$0",
  isLoading: false,
  isSubmitting: false,
  isWithdrawConfirmed: false,
  statusMessage: null,
  errorMessage: null,
  transactionHash: null,
  transactionExplorerUrl: "",
  quote: null,
  onChangeInput: () => {},
  onSubmit: () => {},
})

export const useWithdraw = () => useContext(WithdrawProviderContext)

const targetChain = arbitrumSepolia
const transactionExplorerUrl = targetChain.blockExplorers.default.url
const maxFeeBuffer = BigInt(100_000_000)
const priorityFeeBuffer = BigInt(1_000_000)
const shortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`
const formatError = (error: unknown, fallback: string) => {
  if (error instanceof BaseError) return error.shortMessage || fallback
  if (error instanceof Error) return error.message || fallback
  return fallback
}
type ActivePublicClient = NonNullable<ReturnType<typeof usePublicClient>>
const getBufferedFeeOverrides = async (client: ActivePublicClient) => {
  const [fees, pendingBlock] = await Promise.all([
    client.estimateFeesPerGas({ type: "eip1559" }),
    client.getBlock({ blockTag: "pending" }).catch(() => null),
  ])
  const pendingBaseFee = pendingBlock?.baseFeePerGas ?? BigInt(0)
  const maxPriorityFeePerGas = fees.maxPriorityFeePerGas + priorityFeeBuffer
  const estimatedFeeCap = fees.maxFeePerGas * BigInt(3) + maxFeeBuffer
  const baseFeeCap = pendingBaseFee + maxPriorityFeePerGas + maxFeeBuffer

  return {
    maxFeePerGas:
      estimatedFeeCap > baseFeeCap ? estimatedFeeCap : baseFeeCap,
    maxPriorityFeePerGas,
  }
}

export function WithdrawProvider(props: { children: ReactNode }) {
  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient({ chainId: targetChain.id })
  const { switchChainAsync } = useSwitchChain()
  const { data: walletClient } = useWalletClient()

  const [inputAmount, setInputAmount] = useState("0")
  const inputAmountUsd = useMemo(() => `$${Number(inputAmount)}`, [inputAmount])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWithdrawConfirmed, setIsWithdrawConfirmed] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [quote, setQuote] = useState<FormattedQuote | null>(null)

  const validateReady = useCallback(async () => {
    setErrorMessage(null)
    setStatusMessage(null)

    if (!address) {
      setErrorMessage("Connect your wallet first.")
      return false
    }
    if (!publicClient) {
      setErrorMessage("Network client is still loading. Try again in a moment.")
      return false
    }
    if (!walletClient) {
      setErrorMessage(
        "Wallet signer is not available. Reconnect your wallet and try again.",
      )
      return false
    }
    const amnt = Number(inputAmount)
    if (!Number.isFinite(amnt) || amnt <= 0) {
      setErrorMessage("Enter an amount greater than 0.")
      return false
    }
    try {
      parseUnits(inputAmount, 6)
    } catch {
      setErrorMessage("Use a valid rcARB amount with up to 6 decimals.")
      return false
    }
    if (chainId !== targetChain.id) {
      try {
        setStatusMessage("Switching wallet to Arbitrum Sepolia...")
        await switchChainAsync({ chainId: targetChain.id })
      } catch (error) {
        setStatusMessage(null)
        setErrorMessage(
          formatError(error, "Switch to Arbitrum Sepolia and try again."),
        )
        return false
      }
    }

    return true
  }, [
    address,
    chainId,
    inputAmount,
    publicClient,
    switchChainAsync,
    walletClient,
  ])

  const onChangeInput = (val: string) => {
    setInputAmount(val)
    setQuote(null)
    setErrorMessage(null)
    setStatusMessage(null)
    setTransactionHash(null)
    setIsWithdrawConfirmed(false)
  }

  const onSubmit = useCallback(() => {
    const submitting = async () => {
      if (!(await validateReady())) return
      const account = address
      const client = publicClient
      const wallet = walletClient
      if (!account || !client || !wallet) return
      try {
        setIsSubmitting(true)
        setIsWithdrawConfirmed(false)
        const shares = parseUnits(inputAmount, 6)
        const encodedData = encodeFunctionData({
          abi: SOURCE_VAULT_ABI,
          functionName: "redeem",
          args: [shares, account, account],
        })
        const gasLimit = await client.estimateGas({
          account,
          to: sourceVaultContract,
          data: encodedData,
        })
        const feeOverrides = await getBufferedFeeOverrides(client)
        const hash = await wallet.writeContract({
          account,
          address: sourceVaultContract,
          abi: SOURCE_VAULT_ABI,
          chain: targetChain,
          functionName: "redeem",
          args: [shares, account, account],
          gas: gasLimit,
          ...feeOverrides,
        })
        setTransactionHash(hash)
        setStatusMessage(`Withdrawal submitted: ${shortHash(hash)}`)
        await client.waitForTransactionReceipt({
          confirmations: 1,
          hash,
        })
        setIsWithdrawConfirmed(true)
        setStatusMessage("Withdrawal confirmed.")
      } catch (error) {
        setErrorMessage(formatError(error, "Withdrawal failed."))
        setStatusMessage(null)
      } finally {
        setIsSubmitting(false)
      }
    }
    submitting()
  }, [address, inputAmount, publicClient, validateReady, walletClient])


  useEffect(() => {
    if (!address || !publicClient) return
    const amnt = Number(inputAmount)
    if (amnt <= 0) return
    let amount: bigint
    try {
      amount = parseUnits(inputAmount, 6)
    } catch {
      return
    }
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

  const canDisplayQuote = Boolean(
    address && publicClient && Number(inputAmount) > 0,
  )

  return (
    <WithdrawProviderContext.Provider
      value={{
        inputAmount,
        inputAmountUsd,
        isLoading: canDisplayQuote ? isLoading : false,
        isSubmitting,
        isWithdrawConfirmed,
        statusMessage,
        errorMessage,
        transactionHash,
        transactionExplorerUrl,
        quote: canDisplayQuote ? quote : null,
        onChangeInput,
        onSubmit,
      }}
    >
      {props.children}
    </WithdrawProviderContext.Provider>
  )
}
