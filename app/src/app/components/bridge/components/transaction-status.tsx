"use client"

import { useEffect, useState } from "react"

interface TransactionStatusProps {
  errorMessage: string | null
  explorerUrl?: string
  statusMessage: string | null
  transactionHash: string | null
}

type CopyState = "idle" | "copied" | "failed"

type CopyFeedback = {
  hash: string
  state: CopyState
}

const shortHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`

const transactionUrl = (explorerUrl: string | undefined, hash: string | null) => {
  if (!explorerUrl || !hash) return null

  return `${explorerUrl.replace(/\/$/, "")}/tx/${hash}`
}

const copyWithFallback = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // Fall through to the selection-based copy path.
    }
  }

  const textArea = document.createElement("textarea")
  textArea.value = value
  textArea.setAttribute("readonly", "true")
  textArea.style.left = "-9999px"
  textArea.style.position = "fixed"
  textArea.style.top = "0"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    return document.execCommand("copy")
  } catch {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

export function TransactionStatus(props: TransactionStatusProps) {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null)
  const isError = Boolean(props.errorMessage)
  const message = props.errorMessage ?? props.statusMessage
  const txUrl = transactionUrl(props.explorerUrl, props.transactionHash)
  const copyState =
    copyFeedback?.hash === props.transactionHash ? copyFeedback.state : "idle"
  const isConfirmed = /confirmed|complete|success/i.test(message ?? "")
  const title = isError
    ? "Transaction needs attention"
    : isConfirmed
      ? "Transaction confirmed"
      : "Transaction submitted"
  const panelTone = isError
    ? "border-red-400/40 bg-red-500/15 text-red-50 shadow-red-950/20"
    : isConfirmed
      ? "border-emerald-300/50 bg-emerald-500/15 text-emerald-50 shadow-emerald-950/20"
      : "border-blue-300/50 bg-blue-500/15 text-blue-50 shadow-blue-950/20"

  useEffect(() => {
    if (!copyFeedback || copyFeedback.state === "idle") return

    const timeout = window.setTimeout(
      () => setCopyFeedback(null),
      copyFeedback.state === "copied" ? 1600 : 3200,
    )

    return () => window.clearTimeout(timeout)
  }, [copyFeedback])

  const copyHash = async () => {
    const hash = props.transactionHash
    if (!hash) return

    const didCopy = await copyWithFallback(hash)
    setCopyFeedback({
      hash,
      state: didCopy ? "copied" : "failed",
    })
  }

  if (!props.statusMessage && !props.errorMessage && !props.transactionHash) {
    return null
  }

  return (
    <div
      aria-live={isError ? "assertive" : "polite"}
      data-tour="transaction-status"
      role={isError ? "alert" : "status"}
      className={`rounded-[18px] border p-4 text-sm shadow-lg ${panelTone}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">
          Receipt
        </p>
        <p className="text-base font-black tracking-[-0.4px]">{title}</p>
        {message && (
          <p className="text-sm font-medium leading-5 opacity-90">{message}</p>
        )}
      </div>
      {props.transactionHash && (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-75">
              Transaction hash
            </p>
            <code className="mt-1 block break-all font-mono text-xs font-semibold text-white">
              {props.transactionHash}
            </code>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {txUrl ? (
              <a
                aria-label={`View transaction ${shortHash(
                  props.transactionHash,
                )} on explorer`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                href={txUrl}
                rel="noreferrer"
                target="_blank"
              >
                View on explorer
              </a>
            ) : (
              <div className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/10 px-4 py-2 text-center text-sm font-bold text-white/80">
                Explorer link unavailable
              </div>
            )}
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              onClick={copyHash}
              type="button"
            >
              {copyState === "copied"
                ? "Hash copied"
                : copyState === "failed"
                  ? "Copy failed"
                  : `Copy ${shortHash(props.transactionHash)}`}
            </button>
          </div>

          {copyState === "failed" && (
            <p className="text-xs font-semibold text-white/80">
              Copy did not work in this browser. Select the hash above instead.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
