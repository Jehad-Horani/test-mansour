"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Settings, LogOut, Bell, Menu, X, Shield, MessageCircle } from "lucide-react"
import { useUserContext } from "@/contexts/user-context"
import { useCart } from "@/hooks/use-cart"
import { useMessages } from "@/contexts/messages-context"

export function RetroNavbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, isLoggedIn, logout, isAdmin } = useUserContext()
  const { getCartCount } = useCart()
  const { unreadCount: unreadMessagesCount } = useMessages()
  const router = useRouter()

  const cartCount = getCartCount()

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if there's an error
      setShowUserMenu(false)
      router.push("/")
    }
  }

  return (
    <nav className="retro-nav">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-full">
        <Link href="/" className="text-xl font-bold" style={{ color: "var(--ink)" }}>
          تخصصكُم
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            الرئيسية
          </Link>
          <Link href="/market" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            السوق
          </Link>
          <Link href="/ambassadors" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            السفراء
          </Link>
          <Link href="/community" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            المجتمع
          </Link>
          <Link href="/summaries" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            الملخصات
          </Link>
          <Link href="/pricing" className="text-sm hover:text-gray-900" style={{ color: "var(--ink)" }}>
            الأسعار
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm hover:text-gray-900" style={{ color: "var(--primary)" }}>
              لوحة التحكم
            </Link>
          )}
          {isLoggedIn && isAdmin() && (
            <Link
              href="/admin"
              className="text-sm hover:text-gray-900 flex items-center gap-1"
              style={{ color: "var(--accent)" }}
            >
              <Shield className="w-4 h-4" />
              لوحة الإدارة
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" style={{ color: "var(--ink)" }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/market/messages" className="relative">
                <MessageCircle className="w-5 h-5" style={{ color: "var(--ink)" }} />
                {unreadMessagesCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: "var(--accent)" }}
                  >
                    {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link href="/notifications" className="relative">
                <Bell className="w-5 h-5" style={{ color: "var(--ink)" }} />
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 retro-button bg-transparent hover:bg-gray-100"
                >
                  <img
                    src={user?.avatar || "/diverse-user-avatars.png"}
                    alt="صورة المستخدم"
                    className="w-6 h-6 border border-gray-300"
                  />
                  <span className="hidden sm:block text-sm" style={{ color: "var(--ink)" }}>
                    {user?.name || "المستخدم"}
                  </span>
                  {isAdmin() && <Shield className="w-3 h-3 text-red-600" />}
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute left-0 mt-2 w-48 retro-window bg-white shadow-lg z-50"
                    style={{ border: "2px outset #c0c0c0" }}
                  >
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        style={{ color: "var(--ink)" }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        الملف الشخصي
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        style={{ color: "var(--ink)" }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        لوحة التحكم
                      </Link>
                      <Link
                        href="/market/messages"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        style={{ color: "var(--ink)" }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        الرسائل
                        {unreadMessagesCount > 0 && (
                          <span
                            className="text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                            style={{ background: "var(--accent)" }}
                          >
                            {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        style={{ color: "var(--ink)" }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        الإعدادات
                      </Link>
                      {isAdmin() && (
                        <>
                          <hr className="my-2 border-gray-200" />
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                            style={{ color: "var(--accent)" }}
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield className="w-4 h-4" />
                            لوحة الإدارة
                          </Link>
                        </>
                      )}
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-right text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login/Register buttons for non-authenticated users */}
              <Button asChild variant="outline" size="sm" className="retro-button bg-transparent">
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="retro-button"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Link href="/auth/register">ابدأ الآن</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 retro-button bg-transparent"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" style={{ color: "var(--ink)" }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: "var(--ink)" }} />
            )}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden retro-window bg-white border-t-2" style={{ borderColor: "#c0c0c0" }}>
          <div className="px-4 py-2 space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/market"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              السوق
            </Link>
            <Link
              href="/ambassadors"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              السفراء
            </Link>
            <Link
              href="/community"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              المجتمع
            </Link>
            <Link
              href="/summaries"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              الملخصات
            </Link>
            <Link
              href="/pricing"
              className="block py-2 text-sm hover:bg-gray-100 px-2"
              style={{ color: "var(--ink)" }}
              onClick={() => setShowMobileMenu(false)}
            >
              الأسعار
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm hover:bg-gray-100 px-2"
                  style={{ color: "var(--primary)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-sm hover:bg-gray-100 px-2"
                  style={{ color: "var(--ink)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  الملف الشخصي
                </Link>
                <Link
                  href="/settings"
                  className="block py-2 text-sm hover:bg-gray-100 px-2"
                  style={{ color: "var(--ink)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  الإعدادات
                </Link>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="block py-2 text-sm hover:bg-gray-100 px-2 items-center gap-2"
                    style={{ color: "var(--accent)" }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Shield className="w-4 h-4" />
                    لوحة الإدارة
                  </Link>
                )}
                <Link
                  href="/market/messages"
                  className="block py-2 text-sm hover:bg-gray-100 px-2 items-center gap-2"
                  style={{ color: "var(--ink)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  الرسائل
                  {unreadMessagesCount > 0 && (
                    <span
                      className="text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                      style={{ background: "var(--accent)" }}
                    >
                      {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-right py-2 text-sm hover:bg-gray-100 px-2 text-red-600"
                >
                  تسجيل الخروج
                </button>
              </>
            ):
            (
              <div className="pt-2 space-y-2">
                <Link
                  href="/auth/login"
                  className="block py-2 text-sm hover:bg-gray-100 px-2"
                  style={{ color: "var(--ink)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 text-sm hover:bg-gray-100 px-2"
                  style={{ color: "var(--primary)" }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
    </nav>
  )
}
