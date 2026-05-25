"use client"

import { Footer } from "@/app/components/footer"
import { Vaults } from "@/app/components/vaults"
import Image from "next/image"
import { useAccount } from "wagmi"

import { ConnectButton } from "@/app/components/connect-button"

export default function Connect() {
  const { isConnected } = useAccount()
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-page-gradient text-navy">
      <div className="mx-auto flex min-h-screen w-full max-w-[1223px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header
          className="z-50 flex items-center justify-between pb-2"
          data-tour="app-header"
        >
          <div className="flex items-center gap-2">
            <span className="brand-mark" aria-hidden="true">
              R
            </span>
            <div className="font-serif text-3xl leading-tight tracking-[-0.5px] text-navy">
              Raycast Protocol
            </div>
          </div>
          <div
            className="flex items-center gap-2 rounded-full bg-blue-700/10 px-4 py-2 text-sm font-semibold tracking-[-0.5px] text-navy"
            data-tour="network-badge"
          >
            <Image
              alt=""
              aria-hidden="true"
              src="/assets/arbitrum-logo.svg"
              width={16}
              height={16}
              style={{ width: 16, height: 16 }}
            />
            Arbitrum Sepolia
          </div>
        </header>

        <section className="grid flex-1 place-items-center py-4 sm:py-6">
          {!isConnected && (
            <div className="flex w-full max-w-[670px] flex-col items-center gap-3 text-center">
              <div className="rounded-full border border-blue-300/40 bg-white/75 px-4 py-2 text-sm font-semibold tracking-[-0.5px] text-blue-700 backdrop-blur-xl">
                Cross-chain vaults
              </div>
              <div
                className="hero-logo-orbit hero-route-orbit relative h-20 w-[min(520px,calc(100vw-32px))] sm:h-24"
                aria-label="Arbitrum to USDC to Ethereum"
                data-tour="route-graphic"
              >
                <div className="hero-logo-card hero-logo-card-arbitrum">
                  <Image
                    alt="Arbitrum"
                    src="/assets/arbitrum-logo.svg"
                    width={28}
                    height={28}
                    style={{ width: 28, height: 28 }}
                  />
                  <span className="hero-logo-name">Arbitrum</span>
                </div>
                <span
                  className="hero-route-to hero-route-to-first"
                  aria-hidden="true"
                >
                  to
                </span>
                <div className="hero-logo-card hero-logo-card-usdc">
                  <Image
                    alt="USDC"
                    src="/assets/usdc-logo.svg"
                    width={30}
                    height={30}
                  />
                  <span className="hero-logo-name">USDC</span>
                </div>
                <span
                  className="hero-route-to hero-route-to-second"
                  aria-hidden="true"
                >
                  to
                </span>
                <div className="hero-logo-card hero-logo-card-ethereum">
                  <Image
                    alt="Ethereum"
                    src="/assets/ethereum-logo.png"
                    width={24}
                    height={24}
                    style={{ width: 24, height: 24 }}
                  />
                  <span className="hero-logo-name">Ethereum</span>
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl leading-tight tracking-[-0.5px] text-black">
                  Bridge into yield
                </h1>
                <p className="mx-auto max-w-md text-sm leading-relaxed tracking-[-0.5px] text-black">
                  Move USDC across chains and into yield with a calm, clear flow
                  for every step.
                </p>
              </div>
              <ConnectButton />
            </div>
          )}

          {isConnected && <Vaults />}
        </section>

        {isConnected && <Footer />}
      </div>
    </main>
  )
}
