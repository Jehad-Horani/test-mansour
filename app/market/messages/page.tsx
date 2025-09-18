"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../../../hooks/use-user"
import RetroWindow from "../../components/retro-window"
import { Button } from "../../../components/ui/button"
import { Input } from "../../components/ui/input"
import PixelIcon from "../../components/pixel-icon"
import { createClient } from "../../../lib/supabase/client"
import Link from "next/link"

interface ConversationWithLastMessage {
  id: string
  buyer_id: string
  seller_id: string
  book_title?: string
  book_price?: string
  last_message_at: string
  other_user_name: string
  other_user_id: string
  last_message: string
  unread_count: number
  is_buyer: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    loadConversations()

    // Set up real-time subscription for conversation updates
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          loadConversations()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return

    try {
      // Get conversations where user is buyer or seller
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false })

      if (convError) throw convError

      // Get last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        (convData || []).map(async (conv) => {
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id
          const isBuyer = conv.buyer_id === user.id

          // Get last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("message, sender_name")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          // Get unread count
          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("receiver_id", user.id)
            .neq("status", "read")

          // For demo purposes, generate other user name
          const otherUserName = isBuyer ? `البائع ${otherUserId.slice(-4)}` : `المشتري ${otherUserId.slice(-4)}`

          return {
            ...conv,
            other_user_name: otherUserName,
            other_user_id: otherUserId,
            last_message: lastMsg?.message || "لا توجد رسائل",
            unread_count: unreadCount || 0,
            is_buyer: isBuyer,
          }
        }),
      )

      setConversations(conversationsWithDetails)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.book_title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "منذ قليل"
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`
    } else {
      return date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" })
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        <RetroWindow title="الرسائل">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                رسائلي
              </h1>
              <Button onClick={() => router.push("/market")} variant="outline" className="retro-button bg-transparent">
                <PixelIcon name="shopping-cart" className="w-4 h-4 ml-2" />
                تصفح السوق
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="ابحث في المحادثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="retro-input"
              />
            </div>

            {/* Conversations List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل المحادثات...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <PixelIcon name="message-circle" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>
                  {searchTerm ? "لا توجد نتائج" : "لا توجد محادثات"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "لم يتم العثور على محادثات تطابق البحث"
                    : "ابدأ محادثة جديدة من خلال التواصل مع البائعين في السوق"}
                </p>
                <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                  <Link href="/market">تصفح السوق</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/market/purchase-chat/${conversation.other_user_id}?bookTitle=${encodeURIComponent(conversation.book_title || "")}&bookPrice=${conversation.book_price}&sellerName=${encodeURIComponent(conversation.other_user_name)}`}
                    className="block"
                  >
                    <div className="retro-window bg-white hover:bg-gray-50 transition-colors">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="relative">
                              <img
                                src="/placeholder.svg?height=40&width=40"
                                alt={conversation.other_user_name}
                                className="w-10 h-10 rounded-full bg-gray-200"
                              />
                              {conversation.unread_count > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                                  {conversation.other_user_name}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    conversation.is_buyer ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {conversation.is_buyer ? "مشتري" : "بائع"}
                                </span>
                              </div>

                              {conversation.book_title && (
                                <p className="text-xs text-gray-600 mb-1">
                                  📚 {conversation.book_title} - {conversation.book_price} دينار
                                </p>
                              )}

                              <p
                                className={`text-sm truncate ${
                                  conversation.unread_count > 0 ? "font-medium" : "text-gray-600"
                                }`}
                              >
                                {conversation.last_message}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 mr-2">{formatDate(conversation.last_message_at)}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
