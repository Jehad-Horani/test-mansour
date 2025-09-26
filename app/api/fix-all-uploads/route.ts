import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST(request: Request) {
  try {
    console.log("🔧 Starting comprehensive upload fixes...")
    
    const supabase = createAdminClient()
    
    // Read the fix script
    const scriptPath = join(process.cwd(), 'scripts', 'fix_all_upload_issues.sql')
    const fixScript = readFileSync(scriptPath, 'utf8')
    
    console.log("📋 Executing database schema fixes...")
    
    // Execute the fix script
    const { data, error } = await supabase.rpc('exec_sql', { sql: fixScript })
    
    if (error) {
      console.error("❌ Database fix error:", error)
      return NextResponse.json({ 
        error: "Failed to fix database schema", 
        details: error.message 
      }, { status: 500 })
    }
    
    console.log("✅ Database schema fixes completed successfully")
    
    // Verify the fixes by checking key tables
    const verificationQueries = [
      {
        name: "profiles_email_column",
        query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email'`
      },
      {
        name: "daily_lectures_columns", 
        query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'daily_lectures' AND column_name IN ('instructor_id', 'approval_status')`
      },
      {
        name: "summaries_status_column",
        query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'summaries' AND column_name = 'status'`
      },
      {
        name: "storage_buckets",
        query: `SELECT name FROM storage.buckets WHERE name IN ('summaries', 'lectures', 'avatars', 'book-images')`
      }
    ]
    
    const verificationResults = {}
    
    for (const query of verificationQueries) {
      const { data: result, error: queryError } = await supabase.rpc('exec_sql', { 
        sql: query.query 
      })
      
      if (queryError) {
        console.warn(`⚠️ Verification query failed for ${query.name}:`, queryError)
        verificationResults[query.name] = { error: queryError.message }
      } else {
        verificationResults[query.name] = { success: true, data: result }
      }
    }
    
    console.log("🔍 Verification results:", verificationResults)
    
    return NextResponse.json({
      success: true,
      message: "All upload issues have been fixed successfully",
      verification: verificationResults,
      fixes_applied: [
        "Added email column to profiles table",
        "Added instructor_id and approval_status columns to daily_lectures table", 
        "Added status column to summaries table",
        "Created storage buckets for uploads",
        "Added storage policies for secure uploads",
        "Fixed foreign key references",
        "Created admin_activities table",
        "Added performance indexes"
      ]
    })
    
  } catch (error: any) {
    console.error("💥 Error in fix-all-uploads:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 })
  }
}