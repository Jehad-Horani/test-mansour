import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST() {
  try {
    const supabase = createAdminClient()
    
    // Read the SQL file
    const sqlPath = join(process.cwd(), 'fix-rls-policies.sql')
    const sqlContent = readFileSync(sqlPath, 'utf8')
    
    // Split SQL commands and execute them
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    const results = []
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command })
          if (error) {
            console.error(`Error executing SQL command: ${command}`, error)
            // Continue with other commands even if one fails
          }
          results.push({ command: command.substring(0, 50) + '...', success: !error, error: error?.message })
        } catch (err: any) {
          console.error(`Exception executing SQL command: ${command}`, err)
          results.push({ command: command.substring(0, 50) + '...', success: false, error: err.message })
        }
      }
    }
    
    return NextResponse.json({ 
      message: "Database policies update completed",
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    })
  } catch (error: any) {
    console.error("Error fixing database policies:", error)
    return NextResponse.json({ error: "Failed to update database policies" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Use POST to execute database policy fixes",
    endpoint: "/api/admin/fix-database"
  })
}