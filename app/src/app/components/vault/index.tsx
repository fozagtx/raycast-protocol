import clsx from "clsx"
import Image from "next/image"

interface VaultProps {
  networkArbitrum: boolean
  name: string
  provider: string
  apy: string
  onClick: () => void
  styles: {
    bg: string
    text?: string
  }
}

export function Vault(props: VaultProps) {
  const { styles } = props
  return (
    <button
      type="button"
      className={clsx(
        "dither-card t-resize group relative flex h-64 w-full min-w-0 flex-col justify-between rounded-[32px] border border-blue-300/30 bg-white/85 p-4 text-left text-navy shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
        styles.text,
      )}
      onClick={props.onClick}
    >
      <div className={clsx("h-1.5 w-16 rounded-full", styles.bg)} />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-medium tracking-[-0.5px] text-neutral-600">
            {props.provider}
          </div>
          <div className="text-3xl font-semibold leading-tight tracking-[-0.5px] text-navy">
            {props.name}
          </div>
        </div>
        <div
          className={clsx(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-search",
            props.networkArbitrum ? "bg-blue-700" : "bg-blue-900",
          )}
        >
          {props.networkArbitrum ? (
            <Image
              alt="Arbitrum"
              src="/assets/arbitrum-logo.svg"
              width={26}
              height={26}
              className="h-[26px] w-[26px]"
            />
          ) : (
            <Image
              alt="Ethereum"
              src="/assets/ethereum-logo.png"
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          )}
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-medium tracking-[-0.5px] text-neutral-600">
            APY
          </div>
          <div className="text-2xl font-semibold tracking-[-0.5px] text-navy">
            {props.apy}
          </div>
        </div>
        <div className="flex h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-semibold tracking-[-0.5px] text-neutral-700 shadow-search">
          <span
            className="h-2 w-2 rounded-full bg-success"
            aria-hidden="true"
          />
          Live
        </div>
      </div>
    </button>
  )
}
