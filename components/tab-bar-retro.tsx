"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabBarRetroProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabBarRetro({ tabs, activeTab, onTabChange, className }: TabBarRetroProps) {
  return (
    <div className={cn("", className)}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn("tab-retro", activeTab === tab.id && "active")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
}
