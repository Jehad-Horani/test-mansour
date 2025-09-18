"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface RetroWindowProps {
  title: string
  children: ReactNode
  className?: string
  showControls?: boolean
}

export function RetroWindow({ title, children, className, showControls = true }: RetroWindowProps) {
  return (
    <div className={cn("retro-window", className)}>
      <div className="retro-window-title">
        <span>{title}</span>
        {showControls && (
          <div className="flex gap-1">
            <button className="retro-button w-4 h-4 text-xs text-black bg-gray-300 hover:bg-gray-400">_</button>
            <button className="retro-button w-4 h-4 text-xs text-black bg-gray-300 hover:bg-gray-400">□</button>
            <button className="retro-button w-4 h-4 text-xs text-black bg-gray-300 hover:bg-gray-400">×</button>
          </div>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
