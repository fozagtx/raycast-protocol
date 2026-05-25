"use client"

import clsx from "clsx"
import { useCallback, useEffect, useRef } from "react"
import { driver, type DriveStep, type Driver } from "driver.js"

interface ProductTourButtonProps {
  className?: string
  label?: string
  onBeforeStart?: () => Promise<void> | void
  steps: DriveStep[]
  variant?: "dark" | "light"
}

export function ProductTourButton({
  className,
  label = "Guide",
  onBeforeStart,
  steps,
  variant = "light",
}: ProductTourButtonProps) {
  const activeTour = useRef<Driver | null>(null)

  useEffect(() => {
    return () => activeTour.current?.destroy()
  }, [])

  const startTour = useCallback(async () => {
    if (!steps.length) return

    activeTour.current?.destroy()
    await onBeforeStart?.()

    window.setTimeout(() => {
      const tour = driver({
        allowClose: true,
        allowKeyboardControl: true,
        animate: true,
        disableActiveInteraction: false,
        doneBtnText: "Done",
        nextBtnText: "Next",
        overlayColor: "#021833",
        overlayOpacity: 0.54,
        popoverClass: "raycast-driver-popover",
        prevBtnText: "Back",
        progressText: "{{current}}/{{total}}",
        showButtons: ["next", "previous", "close"],
        showProgress: true,
        smoothScroll: true,
        stagePadding: 8,
        stageRadius: 18,
        steps,
      })

      activeTour.current = tour
      tour.drive()
    }, 120)
  }, [onBeforeStart, steps])

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold tracking-[-0.5px] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        variant === "dark"
          ? "bg-white/10 text-[#FBFBFD] hover:bg-white/15 focus-visible:ring-offset-[#17191C]"
          : "border border-blue-300/20 bg-white text-blue-700 shadow-search hover:bg-blue-100 focus-visible:ring-offset-blue-100",
        className,
      )}
      onClick={startTour}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "grid h-5 w-5 place-items-center rounded-full text-xs",
          variant === "dark" ? "bg-blue-600 text-white" : "bg-blue-100",
        )}
      >
        ?
      </span>
      <span>{label}</span>
    </button>
  )
}
