"use client"

interface RetroCounterProps {
  title: string // Changed from label to title to match usage in homepage
  count: string | number // Changed from value to count to match usage in homepage
  className?: string
}

export function RetroCounter({ title, count, className }: RetroCounterProps) {
  return (
    <div className={`retro-window text-center ${className}`}>
      <div className="retro-window-title">
        <span className="text-white font-bold">{title}</span>
      </div>
      <div className="p-4">
        <div className="text-2xl font-bold text-primary mb-1">{count}</div>
      </div>
    </div>
  )
}
