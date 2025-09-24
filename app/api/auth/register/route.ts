import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[v0] Registration API - Request body:", body)

    // Handle both new registration and profile creation for existing users
    if (body.userId) {
      // This is a fallback profile creation for existing auth user
      const { userId, name, phone, university, major, year } = body
      
      console.log("[v0] Registration API - Creating profile for existing user:", userId)
      
      // Use service role key for profile creation to bypass RLS
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userId,
        name,
        phone,
        university: university ? [university] : [null], // Array format
        major: major || null, // String or null
        year: year || null, // String or null
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
      
      console.log("[v0] Registration API - Profile created successfully")
      return NextResponse.json({ message: "تم إنشاء الملف الشخصي بنجاح" })
    }

    // Original registration flow (shouldn't be used now, but kept for compatibility)
    const { name, email, password, phone, university, major, year } = body
const supabase = await createClient()

    console.log("[v0] Registration API - Starting full registration for:", email)

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
          year,
          role: "student",
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

    // Wait for trigger to process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Use service role key for profile checks and creation
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", authData.user.id)
      .single()

    if (!existingProfile) {
      console.log("[v0] Registration API - Creating profile manually")
      
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: authData.user.id,
        name,
        phone,
        university: university ? [university] : [null], // Array format
        major: major || null, // String or null
        year: year || null, // String or null
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
