import { NextResponse } from "next/server"
import { createClient } from "../../lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json()

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get conversations where user is either buyer or seller
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        messages!inner(
          message,
          created_at,
          status,
          sender_id
        )
      `)
      .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
      .order("last_message_at", { ascending: false })

    if (error) throw error

    // Format conversations with last message and unread count
    const formattedConversations = conversations?.map(conv => {
      const isUserBuyer = conv.buyer_id === user_id
      const otherUserId = isUserBuyer ? conv.seller_id : conv.buyer_id
      
      // Get last message
      const lastMessage = conv.messages?.[0]?.message || "لا توجد رسائل"
      
      // Count unread messages
      const unreadCount = conv.messages?.filter(
        (msg: any) => msg.sender_id !== user_id && msg.status !== "read"
      ).length || 0

      return {
        id: conv.id,
        buyer_id: conv.buyer_id,
        seller_id: conv.seller_id,
        book_title: conv.book_title,
        book_price: conv.book_price,
        last_message_at: conv.last_message_at,
        other_user_id: otherUserId,
        other_user_name: isUserBuyer ? "البائع" : "المشتري",
        last_message: lastMessage,
        unread_count: unreadCount,
        is_buyer: isUserBuyer
      }
    }) || []

    return NextResponse.json(formattedConversations, { status: 200 })
  } catch (err: any) {
    console.error("get-conversations error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}