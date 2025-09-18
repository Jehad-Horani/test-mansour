"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Search, MessageCircle, Clock, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"ambassadors" | "purchases">("ambassadors")

  const ambassadorConversations = [
    {
      id: 1,
      ambassadorId: 1,
      ambassadorName: "د. أحمد محمد السالم",
      ambassadorSpecialty: "القانون التجاري",
      ambassadorImage: "/placeholder.svg?height=50&width=50&text=أحمد+السالم",
      lastMessage: "شكراً لك على سؤالك. سأجيب عليه بالتفصيل...",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      online: true,
      type: "ambassador" as const,
    },
    {
      id: 2,
      ambassadorId: 2,
      ambassadorName: "م. فاطمة علي أحمد",
      ambassadorSpecialty: "هندسة البرمجيات",
      ambassadorImage: "/placeholder.svg?height=50&width=50&text=فاطمة+أحمد",
      lastMessage: "هل تحتاج مساعدة إضافية في البرمجة؟",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      online: false,
      type: "ambassador" as const,
    },
    {
      id: 3,
      ambassadorId: 4,
      ambassadorName: "د. محمد علي الأحمد",
      ambassadorSpecialty: "إدارة الأعمال",
      ambassadorImage: "/placeholder.svg?height=50&width=50&text=محمد+الأحمد",
      lastMessage: "يمكنني مساعدتك في خطة العمل غداً",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 1,
      online: true,
      type: "ambassador" as const,
    },
  ]

  const purchaseConversations = [
    {
      id: 101,
      sellerId: 15,
      sellerName: "سارة أحمد محمد",
      bookTitle: "مبادئ القانون المدني",
      bookPrice: "25 دينار",
      sellerImage: "/placeholder.svg?height=50&width=50&text=سارة+أحمد",
      lastMessage: "الكتاب متوفر ويمكن التسليم غداً",
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 1,
      online: true,
      type: "purchase" as const,
    },
    {
      id: 102,
      sellerId: 23,
      sellerName: "خالد محمود علي",
      bookTitle: "أساسيات البرمجة بـ Java",
      bookPrice: "30 دينار",
      sellerImage: "/placeholder.svg?height=50&width=50&text=خالد+محمود",
      lastMessage: "شكراً لاهتمامك، الكتاب في حالة ممتازة",
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 0,
      online: false,
      type: "purchase" as const,
    },
  ]

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `منذ ${diffInMinutes} دقيقة`
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `منذ ${diffInDays} يوم`
    }
  }

  const currentConversations = activeTab === "ambassadors" ? ambassadorConversations : purchaseConversations

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        <RetroWindow title="الرسائل">
          <div className="space-y-4">
            <div className="p-4 border-b-2 border-gray-300 bg-gray-50">
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setActiveTab("ambassadors")}
                  className={`retro-button flex items-center gap-2 ${
                    activeTab === "ambassadors"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  محادثات السفراء
                  {ambassadorConversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {ambassadorConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                    </Badge>
                  )}
                </Button>
                <Button
                  onClick={() => setActiveTab("purchases")}
                  className={`retro-button flex items-center gap-2 ${
                    activeTab === "purchases"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  محادثات الشراء
                  {purchaseConversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {purchaseConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={activeTab === "ambassadors" ? "ابحث في محادثات السفراء..." : "ابحث في محادثات الشراء..."}
                  className="retro-button pr-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="space-y-2">
              {currentConversations.length === 0 ? (
                <div className="text-center py-12">
                  {activeTab === "ambassadors" ? (
                    <>
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد محادثات مع السفراء</h3>
                      <p className="text-gray-500 mb-4">ابدأ محادثة مع أحد السفراء الأكاديميين</p>
                      <Button asChild className="retro-button bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/ambassadors">تصفح السفراء</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد محادثات شراء</h3>
                      <p className="text-gray-500 mb-4">ابدأ محادثة شراء من خلال تصفح الكتب المعروضة</p>
                      <Button asChild className="retro-button bg-green-600 hover:bg-green-700 text-white">
                        <Link href="/market">تصفح السوق</Link>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                currentConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={
                      conversation.type === "ambassador"
                        ? `/ambassadors/${conversation.ambassadorId}/chat`
                        : `/market/purchase-chat/${conversation.sellerId}`
                    }
                    className="block"
                  >
                    <div className="retro-window bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative">
                            <img
                              src={
                                conversation.type === "ambassador"
                                  ? conversation.ambassadorImage
                                  : conversation.sellerImage
                              }
                              alt={
                                conversation.type === "ambassador"
                                  ? conversation.ambassadorName
                                  : conversation.sellerName
                              }
                              className="w-12 h-12 rounded-full border-2 border-gray-300"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                conversation.online ? "bg-green-400" : "bg-gray-400"
                              }`}
                            />
                          </div>

                          {/* Conversation Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {conversation.type === "ambassador"
                                  ? conversation.ambassadorName
                                  : conversation.sellerName}
                              </h3>
                              <div className="flex items-center gap-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(conversation.lastMessageTime)}
                                </div>
                              </div>
                            </div>
                            <p
                              className={`text-sm mb-1 ${
                                conversation.type === "ambassador" ? "text-blue-600" : "text-green-600"
                              }`}
                            >
                              {conversation.type === "ambassador"
                                ? conversation.ambassadorSpecialty
                                : `${conversation.bookTitle} - ${conversation.bookPrice}`}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
