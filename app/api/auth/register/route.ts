import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, university, major, year } = await req.json()
    const supabase = createClient()

    console.log("[v0] Registration API - Starting registration for:", email)

    // تسجيل المستخدم في Supabase Auth with metadata
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          university,
          major,
          year
        }
      }
    })

    if (signUpError) {
      console.error("[v0] Registration API - Auth signup error:", signUpError.message)
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error("[v0] Registration API - No user returned from auth")
      return NextResponse.json({ error: "فشل في إنشاء المستخدم" }, { status: 400 })
    }

    console.log("[v0] Registration API - Auth user created:", authData.user.id)

    // Use service role to ensure profile creation
    const supabaseAdmin = createClient()
    
    // Wait a moment for trigger to process
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if profile already exists (from trigger)
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", authData.user.id)
      .single()

    if (!existingProfile) {
      console.log("[v0] Registration API - Profile not created by trigger, creating manually")
      
      // إنشاء profile في جدول profiles manually
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: authData.user.id,
        name,
        phone,
        university,
        major,
        year,
        role: "student",
        subscription_tier: "free",
        preferences: {
          theme: "retro",
          language: "ar",
          emailNotifications: true,
          pushNotifications: true,
          profileVisibility: "university"
        },
        stats: {
          uploadsCount: 0,
          viewsCount: 0,
          helpfulVotes: 0,
          coursesEnrolled: 0,
          booksOwned: 0,
          consultations: 0,
          communityPoints: 0
        }
      })

      if (profileError) {
        console.error("[v0] Registration API - Profile creation error:", profileError.message)
        return NextResponse.json({ error: `فشل في إنشاء الملف الشخصي: ${profileError.message}` }, { status: 500 })
      }
      
      console.log("[v0] Registration API - Profile created manually")
    } else {
      console.log("[v0] Registration API - Profile already exists from trigger")
    }

    return NextResponse.json({ 
      message: "تم إنشاء الحساب بنجاح",
      user: authData.user,
      needsEmailConfirmation: !authData.user.email_confirmed_at
    })
  } catch (err: any) {
    console.error("[v0] Registration API - General error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
