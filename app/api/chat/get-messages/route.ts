import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { conversationId, userId } = body

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "conversationId and userId are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // جلب الرسائل
    const { data: messages, error: msgsErr } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (msgsErr) throw msgsErr

    // تحديث حالة الرسائل غير المقروءة -> "read"
    const unreadMessages = (messages || []).filter(
      (msg) => msg.receiver_id === userId && msg.status !== "read"
    )

    if (unreadMessages.length > 0) {
      const { error: updateErr } = await supabase
        .from("messages")
        .update({ status: "read" })
        .in(
          "id",
          unreadMessages.map((msg) => msg.id)
        )

      if (updateErr) throw updateErr
    }

    return NextResponse.json({ messages: messages || [] }, { status: 200 })
  } catch (err: any) {
    console.error("get-messages error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
