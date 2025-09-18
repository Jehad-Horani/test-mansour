import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // تحديث حالة الرسالة
    const { error } = await supabase
      .from("messages")
      .update({ status: "delivered" })
      .eq("id", messageId)

    if (error) throw error

    return NextResponse.json(
      { success: true, message: "Message marked as delivered" },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("mark-delivered error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
