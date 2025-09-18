"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "modern" | "retro"

type ThemeProviderContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("modern")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("theme-modern", "theme-retro")
    root.classList.add(`theme-${theme}`)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "modern" ? "retro" : "modern")
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
