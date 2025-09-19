import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      conversationId,
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
      messageType = "text",
      bookTitle,
      bookPrice,
    } = body

    if (!conversationId || !senderId || !receiverId || !message) {
      return NextResponse.json(
        { error: "conversationId, senderId, receiverId, and message are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // إضافة الرسالة
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_name: senderName || "مستخدم",
        receiver_id: receiverId,
        receiver_name: receiverName || "مستقبل غير معروف",
        message: message,
        message_type: messageType,
        book_title: bookTitle || null,
        book_price: bookPrice || null,
        status: "sent",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, message: data },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("send-message error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
