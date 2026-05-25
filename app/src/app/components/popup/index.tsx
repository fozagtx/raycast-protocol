import React, { useEffect } from "react"

interface PopupProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export function Popup({ children, isOpen, onClose }: PopupProps) {
  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-150 ease-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="Close bridge"
        className="absolute inset-0 h-full w-full cursor-default bg-white/70 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        onClick={onClose}
      />
      <div
        className="relative z-[60]"
        role="dialog"
        aria-modal="true"
        aria-label="Bridge"
      >
        {children}
      </div>
    </div>
  )
}
