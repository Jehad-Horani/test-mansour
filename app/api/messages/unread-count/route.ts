import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Count unread messages where user is the receiver
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", userId)
      .neq("status", "read")

    if (error) throw error

    return NextResponse.json({ unreadCount: count || 0 }, { status: 200 })
  } catch (err: any) {
    console.error("unread-count error:", err)
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}