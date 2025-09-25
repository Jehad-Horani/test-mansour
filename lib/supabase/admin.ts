import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  university?: string
  major?: string
  role: "admin"
  subscription_tier: string
  created_at: string
  stats: {
    adminActions: number
    [key: string]: any
  }
}

export interface AdminAction {
  id: string
  admin_id: string
  action_type: string
  target_type?: string
  target_id?: string
  description: string
  metadata: Record<string, any>
  created_at: string
}

export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: Record<string, any>
  description?: string
  updated_by?: string
  updated_at: string
}

export class AdminService {
  private supabase

  constructor() {
    const cookieStore = cookies()
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
  }

  // User Management
  async getAllUsers(page = 1, limit = 20) {
    const { data, error, count } = await this.supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    return { data, error, count }
  }

  async updateUserRole(userId: string, role: "student" | "admin") {
    const { data, error } = await this.supabase.from("profiles").update({ role }).eq("id", userId).select()

    if (!error) {
      await this.logAction("user_management", "user", userId, `تم تغيير دور المستخدم إلى ${role}`)
    }

    return { data, error }
  }

  async suspendUser(userId: string, reason: string) {
    const { data, error } = await this.supabase
      .from("profiles")
      .update({
        preferences: { suspended: true, suspensionReason: reason },
      })
      .eq("id", userId)
      .select()

    if (!error) {
      await this.logAction("user_management", "user", userId, `تم إيقاف المستخدم: ${reason}`)
    }

    return { data, error }
  }

  // Content Management
  async getPendingBooks() {
    const { data, error } = await this.supabase
      .from("books")
      .select(`
        *,
        book_images(*),
        seller:profiles!books_seller_id_fkey(name, university, phone)
      `)
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })

    return { data, error }
  }

  async getPendingLectures() {
    const { data, error } = await this.supabase
      .from("daily_lectures")
      .select(`
        *,
        instructor:profiles!daily_lectures_instructor_id_fkey(name, university, phone)
      `)
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })

    return { data, error }
  }

  async approveBook(bookId: string) {
    const { data, error } = await this.supabase
      .from("books")
      .update({ 
        approval_status: "approved",
        approved_at: new Date().toISOString()
      })
      .eq("id", bookId)
      .select()

    if (!error) {
      await this.logAction("content_moderation", "book", bookId, "تم الموافقة على الكتاب")
    }

    return { data, error }
  }

  async rejectBook(bookId: string, reason: string) {
    const { data, error } = await this.supabase
      .from("books")
      .update({
        approval_status: "rejected",
        rejection_reason: reason,
        approved_at: new Date().toISOString()
      })
      .eq("id", bookId)
      .select()

    if (!error) {
      await this.logAction("content_moderation", "book", bookId, `تم رفض الكتاب: ${reason}`)
    }

    return { data, error }
  }

  async approveLecture(lectureId: string) {
    const { data, error } = await this.supabase
      .from("daily_lectures")
      .update({ 
        approval_status: "approved",
        approved_at: new Date().toISOString()
      })
      .eq("id", lectureId)
      .select()

    if (!error) {
      await this.logAction("content_moderation", "lecture", lectureId, "تم الموافقة على المحاضرة")
    }

    return { data, error }
  }

  async rejectLecture(lectureId: string, reason: string) {
    const { data, error } = await this.supabase
      .from("daily_lectures")
      .update({
        approval_status: "rejected",
        rejection_reason: reason,
        approved_at: new Date().toISOString()
      })
      .eq("id", lectureId)
      .select()

    if (!error) {
      await this.logAction("content_moderation", "lecture", lectureId, `تم رفض المحاضرة: ${reason}`)
    }

    return { data, error }
  }

  // System Settings
  async getSystemSettings() {
    const { data, error } = await this.supabase.from("system_settings").select("*").order("setting_key")

    return { data, error }
  }

  async updateSystemSetting(key: string, value: Record<string, any>) {
    const { data, error } = await this.supabase
      .from("system_settings")
      .update({
        setting_value: value,
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", key)
      .select()

    if (!error) {
      await this.logAction("system_settings", "setting", `تم تحديث إعداد ${key}`)
    }

    return { data, error }
  }

  // Analytics
  async getDashboardStats() {
    const [usersResult, booksResult, questionsResult, notebooksResult] = await Promise.all([
      this.supabase.from("profiles").select("id", { count: "exact", head: true }),
      this.supabase.from("books").select("id", { count: "exact", head: true }),
      this.supabase.from("questions").select("id", { count: "exact", head: true }),
      this.supabase.from("notebooks").select("id", { count: "exact", head: true }),
    ])

    return {
      totalUsers: usersResult.count || 0,
      totalBooks: booksResult.count || 0,
      totalQuestions: questionsResult.count || 0,
      totalNotebooks: notebooksResult.count || 0,
    }
  }

  // Admin Actions
  async logAction(actionType: string, targetType?: string, targetId?: string, description = "", metadata = {}) {
    const { data, error } = await this.supabase.rpc("log_admin_action", {
      p_action_type: actionType,
      p_target_type: targetType,
      p_target_id: targetId,
      p_description: description,
      p_metadata: metadata,
    })

    return { data, error }
  }

  async getAdminActions(page = 1, limit = 20) {
    const { data, error } = await this.supabase
      .from("admin_actions")
      .select(`
        *,
        profiles:admin_id (name)
      `)
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    return { data, error }
  }

  // Create admin user (for initial setup)
  async createAdminUser(email: string, password: string, name: string, phone?: string) {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      email_confirm: true,
    })

    if (authError) return { data: null, error: authError }

    // Update profile to admin role
    const { data: profileData, error: profileError } = await this.supabase
      .from("profiles")
      .update({
        role: "admin",
        subscription_tier: "premium",
        subscription_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", authData.user.id)
      .select()

    return { data: { auth: authData, profile: profileData }, error: profileError }
  }
}

export const adminService = new AdminService()
