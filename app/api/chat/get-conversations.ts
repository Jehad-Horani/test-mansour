import { NextResponse } from "next/server"
import { createClient } from "../../lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId, firstMessage, sellerId, bookTitle, bookPrice } = await req.json()

    if (!userId || !firstMessage || !sellerId) {
      return NextResponse.json(
        { error: "userId, sellerId and firstMessage are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const conversationId = `${userId}_${sellerId}_${bookTitle.replace(/\s+/g, "_")}`

    // تحقق إذا كانت المحادثة موجودة
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (!existing) {
      const { error: convErr } = await supabase.from("conversations").insert({
        id: conversationId,
        buyer_id: userId,
        seller_id: sellerId,
        book_title: bookTitle,
        book_price: bookPrice,
      })
      if (convErr) throw convErr

      // أول رسالة
      const { error: msgErr } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        sender_name: "مشتري",
        receiver_id: sellerId,
        receiver_name: "البائع",
        message: firstMessage,
        message_type: "purchase_inquiry",
        book_title: bookTitle,
        book_price: bookPrice,
        status: "sent",
      })
      if (msgErr) throw msgErr
    }

    return NextResponse.json({ conversationId, message: "Conversation initialized" }, { status: 200 })
  } catch (err: any) {
    console.error("init-conversation error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
