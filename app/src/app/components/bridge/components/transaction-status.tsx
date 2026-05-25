"use client"

import { useState } from "react"

interface TransactionStatusProps {
  errorMessage: string | null
  explorerUrl?: string
  statusMessage: string | null
  transactionHash: string | null
}

const shortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`

export function TransactionStatus(props: TransactionStatusProps) {
  const [copied, setCopied] = useState(false)
  const txUrl =
    props.transactionHash && props.explorerUrl
      ? `${props.explorerUrl}/tx/${props.transactionHash}`
      : null

  if (!props.statusMessage && !props.errorMessage && !props.transactionHash) {
    return null
  }

  const copyHash = async () => {
    if (!props.transactionHash) return
    await navigator.clipboard.writeText(props.transactionHash)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      role={props.errorMessage ? "alert" : "status"}
      data-tour="transaction-status"
      className={`rounded-[18px] border px-4 py-3 text-sm font-medium tracking-[-0.5px] ${
        props.errorMessage
          ? "border-red-400/30 bg-red-500/10 text-red-100"
          : "border-blue-400/30 bg-blue-500/10 text-blue-100"
      }`}
    >
      <div>{props.errorMessage ?? props.statusMessage}</div>
      {props.transactionHash && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {txUrl ? (
            <a
              className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/15"
              href={txUrl}
              rel="noreferrer"
              target="_blank"
            >
              View tx {shortHash(props.transactionHash)}
            </a>
          ) : (
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
              {shortHash(props.transactionHash)}
            </span>
          )}
          <button
            className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/15"
            onClick={copyHash}
            type="button"
          >
            {copied ? "Copied" : "Copy hash"}
          </button>
        </div>
      )}
    </div>
  )
}
