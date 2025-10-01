"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTier } from "@/hooks/use-tier"

export function RetroSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, loading, error, signOut , isAdmin , isLoggedIn } = useAuth()
  const { tier } = useTier()

  const getQuickActions = () => {
    if (!profile) {
      return [
        { title: "تسجيل الدخول", href: "/auth/login" },
        { title: "إنشاء حساب", href: "/auth/register" },
        { title: "السوق", href: "/market" },
        { title: "الأسعار", href: "/pricing" },
      ]
    }

    const actions = [
      { title: "لوحة التحكم", href: "/dashboard" },
      { title: "ملفي الشخصي", href: "/profile" },
      { title: "السوق", href: "/market" },
      { title: "السفراء", href: "/ambassadors" },
    ]

    if (tier === "free") {
      actions.push({ title: "ترقية الاشتراك", href: "/pricing" })
    }

    if (isAdmin()) {
      actions.push({ title: "إدارة النظام", href: "/admin" })
    }

    return actions
  }

  const getContextualContent = () => {
    if (pathname.startsWith("/dashboard")) {
      return {
        title: "لوحة التحكم",
        items: [
          { title: "الجدول الدراسي", href: "/dashboard/schedule" },
          { title: "المحاضرات اليومية", href: "/dashboard/notebooks" },
          { title: "الامتحانات", href: "/dashboard/exams" },
          { title: "الجلسات الدراسية", href: "/dashboard/sessions" },
          { title: "السفراء", href: "/dashboard/ambassadors" },
        ],
      }
    }

    if (pathname.startsWith("/admin")) {
      return {
        title: "إدارة النظام",
        items: [
          { title: "المستخدمون", href: "/admin/users" },
          { title: "المحتوى", href: "/admin/content" },
          { title: "السوق", href: "/admin/market" },
          { title: "الملخصات", href: "/admin/summaries" },
          { title: "المحاضرات اليومية", href: "/admin/daily-lectures" },
          { title: "الإعدادات", href: "/admin/settings" },
        ],
      }
    }

    return null
  }

  const getNotifications = () => {
    if (!isLoggedIn || !user) return null

    const notifications = []

   

    if (profile?.subscription_tier === "free") {
      notifications.push({
        title: "ترقية للباقة المميزة",
        href: "/pricing",
        type: "info",
      })
    }

    return notifications.length > 0 ? { title: "تنبيهات", items: notifications } : null
  }

  useEffect(() => {

  getQuickActions()
  getContextualContent()
  getNotifications()
  }, [])
  const quickActions = getQuickActions()
  const contextualContent = getContextualContent()
  const notifications = getNotifications()


  return (
    <div className="overflow-hidden">
     

      <div
        className={cn(
          "retro-sidebar transform transition-transform duration-300",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
          <div className="retro-window-title mb-4">
            <span>{isLoggedIn ? `مرحباً ${profile?.name.split(" ")[0]}` : "القائمة الجانبية"}</span>
            <button className="md:hidden text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {isLoggedIn && user && (
            <div className="bg-gray-800/90 rounded p-3 mb-4 border border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-gray-300 mb-1 font-medium">التخصص</div>
                  <div className="text-sm text-white font-semibold">
                    {profile?.major}
                  </div>
                </div>
               
              </div>
              <div className="text-xs text-gray-300">{profile?.university}</div>
            </div>
          )}

          {notifications && (
            <div className="mb-4">
              <div className="text-xs text-yellow-400 mb-2 font-semibold flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                {notifications.title}
              </div>
              <div className="space-y-1">
                {notifications.items.map((notification, index) => (
                  <Link
                    key={index}
                    href={notification.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 p-2 text-xs border transition-colors rounded",
                      notification.type === "warning"
                        ? "text-yellow-300 hover:bg-yellow-900/20 border-yellow-600/30"
                        : "text-blue-300 hover:bg-blue-900/20 border-blue-600/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        notification.type === "warning" ? "bg-yellow-400" : "bg-blue-400",
                      )}
                    ></div>
                    <span>{notification.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="text-xs text-white/80 mb-2 font-semibold">التنقل السريع</div>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2 text-xs text-gray-200 bg-gray-800 hover:bg-gray-700 border border-transparent transition-colors rounded"
                >
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  <span>{action.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {contextualContent && (
            <div className="mb-4">
              <div className="text-xs text-white/80 mb-2 font-semibold">{contextualContent.title}</div>
              <div className="space-y-1">
                {contextualContent.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 text-gray-200 hover:bg-gray-700 text-xs border border-transparent transition-colors rounded"
                  >
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isLoggedIn && profile?.stats && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="text-xs text-gray-300 mb-2 font-semibold">إحصائياتي</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/90 rounded p-2 text-center border border-gray-600">
                  <div className="text-white font-semibold">{profile?.stats?.coursesEnrolled || 0}</div>
                  <div className="text-gray-300">المقررات</div>
                </div>
                <div className="bg-gray-800/90 rounded p-2 text-center border border-gray-600">
                  <div className="text-white font-semibold">{profile?.stats?.booksOwned || 0}</div>
                  <div className="text-gray-300">الكتب</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
