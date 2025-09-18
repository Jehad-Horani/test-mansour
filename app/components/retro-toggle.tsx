"use client"

import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"

export function RetroToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} className="fixed top-4 left-4 z-50 bg-transparent">
      {theme === "modern" ? "ريترو" : "حديث"}
    </Button>
  )
}
