"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      console.log("[v0] Admin layout checking auth:", { user, loading })

      if (!loading) {
        if (!user || user.role !== "admin") {
          console.log("[v0] Admin access denied, redirecting to login")
          router.replace("/auth/login")
        } else {
          console.log("[v0] Admin access granted")
          setIsChecking(false)
        }
      }
    }, 200)

    return () => clearTimeout(checkAuth)
  }, [user, loading, router])

 
  

  const handleLogout = async () => {
    await signOut()
    router.replace("/")
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      {/* Admin Navigation Bar */}
      <div style={{ background: "var(--bg)" }} className="border-b-2 border-black p-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white font-bold text-lg hover:text-gray-200">
              لوحة تحكم المدير
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/admin" className="text-white hover:text-gray-200">
                الرئيسية
              </Link>
              <Link href="/admin/users" className="text-white hover:text-gray-200">
                المستخدمين
              </Link>
              <Link href="/admin/market" className="text-white hover:text-gray-200">
                السوق
              </Link>
              <Link href="/admin/summaries" className="text-white hover:text-gray-200">
                الملخصات
              </Link>
              <Link href="/admin/messages" className="text-white hover:text-gray-200">
                الرسائل
              </Link>
              <Link href="/admin/settings" className="text-white hover:text-gray-200">
                الإعدادات
              </Link>
              {/* Adding daily lectures to admin navigation */}
              <Link href="/admin/daily-lectures" className="text-white hover:text-gray-200">
                المحاضرات اليومية
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              <span>مرحباً</span>
            </div>
            <Link href="/" className="text-white hover:text-gray-200 text-sm">
              الموقع الرئيسي
            </Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200 text-sm">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
