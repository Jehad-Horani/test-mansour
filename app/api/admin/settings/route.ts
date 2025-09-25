import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Verify admin access
    await authServer.requireAdmin()
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key')
    
    if (error) {
      console.error("Error fetching system settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Transform to key-value pairs for easier frontend consumption
    const settings = (data || []).reduce((acc: any, setting: any) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})
    
    // Add default settings if they don't exist
    const defaultSettings = {
      site_name: "تخصصكُم - TAKHASSUS.com",
      site_description: "منصة الطلاب متعددة التخصصات",
      max_file_size: 50, // MB
      allowed_file_types: ["pdf", "doc", "docx", "ppt", "pptx"],
      auto_approve_books: false,
      auto_approve_summaries: false,
      auto_approve_lectures: false,
      maintenance_mode: false,
      registration_enabled: true,
      email_notifications: true,
      max_cart_items: 20,
      support_email: "support@takhassus.com",
      terms_version: "1.0",
      privacy_version: "1.0"
    }
    
    const finalSettings = { ...defaultSettings, ...settings }
    
    return NextResponse.json(finalSettings)
  } catch (error: any) {
    console.error("Error in GET /api/admin/settings:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin access
    const admin = await authServer.requireAdmin()
    
    const settings = await request.json()
    
    const supabase = createAdminClient()
    
    const results = []
    
    for (const [key, value] of Object.entries(settings)) {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .upsert({
            setting_key: key,
            setting_value: value,
            updated_by: admin.id,
            updated_at: new Date().toISOString()
          })
          .select()
        
        if (error) {
          console.error(`Error updating setting ${key}:`, error)
          results.push({ key, success: false, error: error.message })
        } else {
          results.push({ key, success: true, data })
        }
      } catch (err: any) {
        console.error(`Exception updating setting ${key}:`, err)
        results.push({ key, success: false, error: err.message })
      }
    }
    
    // Log admin activity
    await supabase
      .from('admin_activities')
      .insert([{
        admin_id: admin.id,
        action: 'update_system_settings',
        target_type: 'system',
        details: {
          updated_settings: Object.keys(settings),
          total_settings: results.length
        }
      }])
    
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    
    return NextResponse.json({
      message: "Settings update completed",
      results,
      summary: { successful, failed }
    })
  } catch (error: any) {
    console.error("Error in POST /api/admin/settings:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}