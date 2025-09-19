import type React from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { cn } from "@/lib/utils"

interface WindowCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  showControls?: boolean
}

export function WindowCard({ title, children, className, showControls = true }: WindowCardProps) {
  return (
    <Card className={cn("window-card", className)}>
      {title && (
        <CardHeader className="window-title-bar p-0">
          <div className="flex items-center justify-between">
            <span className="font-medium">{title}</span>
            {showControls && (
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
