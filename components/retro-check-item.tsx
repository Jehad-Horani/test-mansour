import type React from "react"
interface RetroCheckItemProps {
  children: React.ReactNode
  className?: string
}

export function RetroCheckItem({ children, className = "" }: RetroCheckItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2 ${className}`}>
      <div className="retro-check">
        <span className="text-white text-xs">✓</span>
      </div>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  )
}
