import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { conversationId, userId } = await req.json()

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "conversationId and userId are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Mark all messages in conversation as read where user is receiver
    const { error } = await supabase
      .from("messages")
      .update({ status: "read" })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", userId)
      .neq("status", "read")

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error("mark-as-read error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}