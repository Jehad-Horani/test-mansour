"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardMarketPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/market")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--panel)" }}>
      <div className="retro-window p-6">
        <div className="retro-window-title">
          <span>جاري التحويل...</span>
        </div>
        <div className="p-4 text-center" style={{ color: "var(--ink)" }}>
          <p>جاري تحويلك إلى السوق...</p>
        </div>
      </div>
    </div>
  )
}
