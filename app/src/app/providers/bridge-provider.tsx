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
  BaseError,
  encodeFunctionData,
  decodeFunctionResult,
  formatUnits,
  parseAbi,
  parseUnits,
} from "viem"
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"

import { inputTokenUsdc, sourceVaultContract } from "@/app/config"
import { SOURCE_VAULT_ABI } from "./source-vault-abi"

interface FormattedQuote {
  outputAmount: string
  outputAmountUsd: string
}

export interface BridgeContext {
  inputAmount: string
  inputAmountUsd: string
  isApproved: boolean
  isApproving: boolean
  isLoading: boolean
  isSubmitting: boolean
  isDepositConfirmed: boolean
  statusMessage: string | null
  errorMessage: string | null
  transactionHash: string | null
  transactionExplorerUrl: string
  quote: FormattedQuote | null
  onApprove: () => void
  onChangeInput: (val: string) => void
  onSubmit: () => void
}

export const BridgeProviderContext = createContext<BridgeContext>({
  inputAmount: "0",
  inputAmountUsd: "$0",
  isApproved: false,
  isApproving: false,
  isLoading: false,
  isSubmitting: false,
  isDepositConfirmed: false,
  statusMessage: null,
  errorMessage: null,
  transactionHash: null,
  transactionExplorerUrl: "",
  quote: null,
  onApprove: () => {},
  onChangeInput: () => {},
  onSubmit: () => {},
})

export const useBridge = () => useContext(BridgeProviderContext)

const usdc = inputTokenUsdc
const spender = sourceVaultContract
const targetChain = arbitrumSepolia
const transactionExplorerUrl = targetChain.blockExplorers.default.url
const shortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`
const maxFeeBuffer = BigInt(100_000_000)
const priorityFeeBuffer = BigInt(1_000_000)
const fallbackMaxFeePerGas = BigInt(2_000_000_000)
const fallbackMaxPriorityFeePerGas = BigInt(10_000_000)
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
  const suggestedPriorityFee = fees.maxPriorityFeePerGas + priorityFeeBuffer
  const maxPriorityFeePerGas =
    suggestedPriorityFee > fallbackMaxPriorityFeePerGas
      ? suggestedPriorityFee
      : fallbackMaxPriorityFeePerGas
  const estimatedFeeCap = fees.maxFeePerGas * BigInt(3) + maxFeeBuffer
  const baseFeeCap = pendingBaseFee + maxPriorityFeePerGas + maxFeeBuffer
  const dynamicMaxFee =
    estimatedFeeCap > baseFeeCap ? estimatedFeeCap : baseFeeCap

  return {
    maxFeePerGas:
      dynamicMaxFee > fallbackMaxFeePerGas
        ? dynamicMaxFee
        : fallbackMaxFeePerGas,
    maxPriorityFeePerGas,
  }
}

export function BridgeProvider(props: { children: ReactNode }) {
  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient({ chainId: targetChain.id })
  const { switchChainAsync } = useSwitchChain()
  const { data: walletClient } = useWalletClient()

  const [inputAmount, setInputAmount] = useState("0")
  const inputAmountUsd = useMemo(() => `$${Number(inputAmount)}`, [inputAmount])
  const [isApproving, setIsApproving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDepositConfirmed, setIsDepositConfirmed] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [quote, setQuote] = useState<FormattedQuote | null>(null)

  const { data: allowance, refetch } = useReadContract({
    chainId: targetChain.id,
    address: usdc,
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
    let amount: bigint
    try {
      amount = parseUnits(inputAmount, 6)
    } catch {
      return false
    }
    return allowance ? allowance >= amount : false
  }, [address, allowance, inputAmount, isApproving])

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
      setErrorMessage("Use a valid USDC amount with up to 6 decimals.")
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

  const onApprove = useCallback(() => {
    const approve = async () => {
      if (!(await validateReady())) return
      const account = address
      const client = publicClient
      const wallet = walletClient
      if (!account || !client || !wallet) return
      if (isApproved) {
        setStatusMessage("USDC is already approved for this amount.")
        return
      }

      setIsApproving(true)
      setIsDepositConfirmed(false)
      try {
        const abi = parseAbi([
          "function approve(address spender, uint256 amount) external returns (bool)",
        ])
        const amount = parseUnits(inputAmount, 6)
        const encodedData = encodeFunctionData({
          abi,
          functionName: "approve",
          args: [spender, amount],
        })
        const gasLimit = await client.estimateGas({
          account,
          to: usdc,
          data: encodedData,
        })
        const feeOverrides = await getBufferedFeeOverrides(client)
        const hash = await wallet.sendTransaction({
          account,
          chain: targetChain,
          to: usdc,
          data: encodedData,
          gas: gasLimit,
          ...feeOverrides,
        })
        setTransactionHash(hash)
        setStatusMessage(`Approval submitted: ${shortHash(hash)}`)
        await client.waitForTransactionReceipt({
          confirmations: 1,
          hash,
        })
        await refetch()
        setStatusMessage("Approval confirmed. You can deposit now.")
      } catch (error) {
        setErrorMessage(formatError(error, "Approval failed."))
        setStatusMessage(null)
      } finally {
        setIsApproving(false)
      }
    }
    approve()
  }, [
    address,
    inputAmount,
    isApproved,
    publicClient,
    refetch,
    validateReady,
    walletClient,
  ])

  const onChangeInput = (val: string) => {
    setInputAmount(val)
    setQuote(null)
    setErrorMessage(null)
    setStatusMessage(null)
    setTransactionHash(null)
    setIsDepositConfirmed(false)
  }

  const onSubmit = useCallback(() => {
    const submitting = async () => {
      if (!(await validateReady())) return
      const account = address
      const client = publicClient
      const wallet = walletClient
      if (!account || !client || !wallet) return
      if (!isApproved) {
        setErrorMessage("Approve USDC before depositing.")
        return
      }
      try {
        setIsSubmitting(true)
        setIsDepositConfirmed(false)
        const amount = parseUnits(inputAmount, 6)
        const encodedData = encodeFunctionData({
          abi: SOURCE_VAULT_ABI,
          functionName: "deposit",
          args: [amount, account],
        })
        const gasLimit = await client.estimateGas({
          account,
          to: sourceVaultContract,
          data: encodedData,
        })
        const feeOverrides = await getBufferedFeeOverrides(client)
        const hash = await wallet.sendTransaction({
          account,
          chain: targetChain,
          to: sourceVaultContract,
          data: encodedData,
          gas: gasLimit,
          ...feeOverrides,
        })
        setTransactionHash(hash)
        setStatusMessage(`Deposit submitted: ${shortHash(hash)}`)
        await client.waitForTransactionReceipt({
          confirmations: 1,
          hash,
        })
        await refetch()
        setIsDepositConfirmed(true)
        setStatusMessage("Deposit confirmed.")
      } catch (error) {
        setErrorMessage(formatError(error, "Deposit failed."))
        setStatusMessage(null)
      } finally {
        setIsSubmitting(false)
      }
    }
    submitting()
  }, [
    address,
    inputAmount,
    isApproved,
    publicClient,
    refetch,
    validateReady,
    walletClient,
  ])


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
          functionName: "previewDeposit",
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
            functionName: "previewDeposit",
            data,
          })
          const outputAmount = formatUnits(BigInt(value), 6)
          setQuote({
            outputAmount,
            outputAmountUsd: `$${outputAmount}`,
          })
        }
      } catch (error) {
        console.warn("Error fetching deposit quote:", error)
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
    <BridgeProviderContext.Provider
      value={{
        inputAmount,
        inputAmountUsd,
        isApproved,
        isApproving,
        isLoading: canDisplayQuote ? isLoading : false,
        isSubmitting,
        isDepositConfirmed,
        statusMessage,
        errorMessage,
        transactionHash,
        transactionExplorerUrl,
        quote: canDisplayQuote ? quote : null,
        onApprove,
        onChangeInput,
        onSubmit,
      }}
    >
      {props.children}
    </BridgeProviderContext.Provider>
  )
}
