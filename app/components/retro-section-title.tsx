import type React from "react"
interface RetroSectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function RetroSectionTitle({ children, className = "" }: RetroSectionTitleProps) {
  return (
    <div className={`window-title-bar ${className}`}>
      <span>{children}</span>
      <div className="window-controls">
        <div className="window-control">•</div>
        <div className="window-control">—</div>
        <div className="window-control">×</div>
      </div>
    </div>
  )
}
