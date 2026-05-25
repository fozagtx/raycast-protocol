import { useState } from "react"
import type { DriveStep } from "driver.js"
import Image from "next/image"

import { Popup } from "@/app/components/popup"
import { ProductTourButton } from "@/app/components/product-tour-button"
import { Vault } from "@/app/components/vault"
import { Bridge } from "@/app/components/bridge"
import { useBridge } from "@/app/providers/bridge-provider"

const vaultTourSteps: DriveStep[] = [
  {
    element: "[data-tour='vault-header']",
    popover: {
      title: "Vaults",
      description:
        "This is the connected view. Pick a vault card to open the live bridge widget.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='vault-tags']",
    popover: {
      title: "Route tags",
      description:
        "These tags call out the assets and network flavor for the visible vaults.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "[data-tour='vault-grid']",
    popover: {
      title: "Open a vault",
      description:
        "Click any card to bring up deposit and withdraw. The bridge modal has its own guide for transaction steps.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "[data-tour='footer-wallet']",
    popover: {
      title: "Wallet",
      description:
        "Your connected wallet stays available here if you need to switch accounts or inspect the connection.",
      side: "top",
      align: "end",
    },
  },
]

export function Vaults() {
  const [modalOpen, setModalOpen] = useState(false)
  const { onChangeInput } = useBridge()

  const toggleModal = () => {
    onChangeInput("0")
    setModalOpen(!modalOpen)
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3" data-tour="vault-header">
          <span className="brand-mark brand-mark-lg" aria-hidden="true">
            R
          </span>
          <div>
            <div className="font-serif text-4xl leading-tight tracking-[-0.5px] text-navy">
              Explore
            </div>
            <div className="mt-1 text-sm font-medium tracking-[-0.5px] text-neutral-600">
              Raycast Protocol
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProductTourButton steps={vaultTourSteps} />
          <div
            className="t-avatar-group flex flex-wrap gap-2"
            data-tour="vault-tags"
          >
            <span className="t-avatar flex items-center gap-2 rounded-full border border-blue-100 bg-blue-150 px-3 py-2 text-base tracking-[-0.5px] text-navy">
              <Image
                alt=""
                aria-hidden="true"
                src="/assets/usdc-logo.svg"
                width={18}
                height={18}
              />
              Trending
            </span>
            <span className="t-avatar flex items-center gap-2 rounded-full border border-neutral-50 bg-neutral-200 px-3 py-2 text-base tracking-[-0.5px] text-navy">
              <Image
                alt=""
                aria-hidden="true"
                src="/assets/ethereum-logo.png"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Stable
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3" data-tour="vault-grid">
        <Vault
          networkArbitrum={true}
          name="Real Yield USD"
          provider="Sommelier Finance"
          apy="38.96%"
          styles={{ bg: "bg-blue-700", text: "text-navy" }}
          onClick={toggleModal}
        />
        <Vault
          networkArbitrum={true}
          name="gUSDC"
          provider="Gains"
          apy="25.6%"
          styles={{ bg: "bg-blue-500", text: "text-navy" }}
          onClick={toggleModal}
        />
        <Vault
          networkArbitrum={false}
          name="maUSDC"
          provider="Morpho"
          apy="19.27%"
          styles={{ bg: "bg-blue-900", text: "text-navy" }}
          onClick={toggleModal}
        />
      </div>
      <Popup isOpen={modalOpen} onClose={toggleModal}>
        <Bridge />
      </Popup>
    </section>
  )
}
