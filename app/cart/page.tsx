"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { Trash2, MessageCircle, User } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "أساسيات القانون المدني",
      author: "د. محمد أحمد",
      price: 45,
      image: "/law-book.png",
      seller: "أحمد محمود",
      sellerId: "user123",
      isAdminBook: false,
    },
    {
      id: 2,
      title: "برمجة الويب المتقدمة",
      author: "م. فاطمة علي",
      price: 55,
      image: "/programming-book.png",
      seller: "إدارة الموقع",
      sellerId: "admin",
      isAdminBook: true,
    },
  ])

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const adminBooks = cartItems.filter((item) => item.isAdminBook)
  const userBooks = cartItems.filter((item) => !item.isAdminBook)
  const adminTotal = adminBooks.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        <RetroWindow title="سلة التسوق">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">سلة التسوق فارغة</p>
              <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/market">تصفح الكتب</Link>
              </Button>
            </div>
          ) : (
            <>
              {adminBooks.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    كتب الموقع - قابلة للشراء
                  </h2>
                  <div className="space-y-4 mb-6">
                    {adminBooks.map((item) => (
                      <div key={item.id} className="retro-window bg-white">
                        <div className="p-4 flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-16 h-20 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                            <p className="font-bold" style={{ color: "var(--primary)" }}>
                              {item.price} دينار
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="retro-button text-red-600 bg-transparent"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="retro-window bg-gray-50">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">مجموع كتب الموقع:</span>
                        <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                          {adminTotal} دينار
                        </span>
                      </div>
                      <Button
                        asChild
                        className="retro-button w-full"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        <Link href="/checkout">شراء كتب الموقع</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {userBooks.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
                    كتب المستخدمين - للتواصل فقط
                  </h2>
                  <div className="space-y-4 mb-6">
                    {userBooks.map((item) => (
                      <div key={item.id} className="retro-window bg-white">
                        <div className="p-4 flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-16 h-20 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{item.author}</p>
                            <p className="text-sm mb-2">
                              <User className="w-4 h-4 inline mr-1" />
                              البائع: {item.seller}
                            </p>
                            <p className="font-bold" style={{ color: "var(--primary)" }}>
                              {item.price} دينار
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              asChild
                              size="sm"
                              className="retro-button"
                              style={{ background: "var(--accent)", color: "white" }}
                            >
                              <Link href={`/messages/new?user=${item.sellerId}&book=${item.id}`}>
                                <MessageCircle className="w-4 h-4 mr-1" />
                                تواصل
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="retro-button text-red-600 bg-transparent"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="retro-window bg-blue-50">
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">💡 للحصول على هذه الكتب، تواصل مع البائعين مباشرة</p>
                      <p className="text-xs text-gray-500">الدفع والتسليم يتم بالاتفاق المباشر مع البائع</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/market">متابعة التسوق</Link>
                </Button>
              </div>
            </>
          )}
        </RetroWindow>
      </div>
    </div>
  )
}
