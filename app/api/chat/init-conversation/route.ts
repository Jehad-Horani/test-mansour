import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      conversationId,
      buyerId,
      sellerId,
      bookTitle = null,
      bookPrice = null,
      messageText = null,
    } = body

    if (!conversationId || !buyerId || !sellerId) {
      return NextResponse.json(
        { error: "conversationId, buyerId and sellerId are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // هل المحادثة موجودة؟
    const { data: existingConversation, error: convCheckErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle()

    if (convCheckErr) throw convCheckErr

    if (!existingConversation) {
      // إنشاء محادثة جديدة
      const { data: createdConversation, error: convCreateErr } = await supabase
        .from("conversations")
        .insert({
          id: conversationId,
          buyer_id: buyerId,
          seller_id: sellerId,
          book_title: bookTitle,
          book_price: bookPrice,
        })
        .select()
        .single()

      if (convCreateErr) throw convCreateErr

      // إذا في رسالة بداية أضفها
      let createdMessages: any[] = []
      if (messageText) {
        const { data: msgData, error: msgErr } = await supabase
          .from("messages")
          .insert({
            conversation_id: createdConversation.id,
            sender_id: buyerId,
            sender_name: "مشتري",
            receiver_id: sellerId,
            receiver_name: "بائع",
            message: messageText,
            message_type: "purchase_inquiry",
            book_title: bookTitle,
            book_price: bookPrice,
            status: "sent",
          })
          .select()

        if (msgErr) throw msgErr
        createdMessages = msgData || []
      }

      return NextResponse.json(
        { conversation: createdConversation, messages: createdMessages },
        { status: 200 }
      )
    } else {
      // لو موجود نرجع المحادثة مع الرسائل
      const { data: messages, error: msgsErr } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (msgsErr) throw msgsErr

      return NextResponse.json(
        { conversation: existingConversation, messages: messages || [] },
        { status: 200 }
      )
    }
  } catch (err: any) {
    console.error("init-conversation error:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
