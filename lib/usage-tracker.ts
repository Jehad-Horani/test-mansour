import { createClient } from "@/lib/supabase/client"

export type ResourceType = 'book_upload' | 'lecture_view' | 'summary_view'

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonthYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Check if user has reached usage limit for the current month
 */
export async function checkUsageLimit(
  userId: string,
  resourceType: ResourceType,
  limit: number
): Promise<{ allowed: boolean; currentCount: number }> {
  const supabase = createClient()
  const monthYear = getCurrentMonthYear()

  try {
    // Count usage for current month
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('resource_type', resourceType)
      .eq('month_year', monthYear)

    if (error) {
      console.error('Error checking usage limit:', error)
      return { allowed: true, currentCount: 0 } // Allow on error to not block users
    }

    const currentCount = data?.length || 0
    const allowed = currentCount < limit

    return { allowed, currentCount }
  } catch (error) {
    console.error('Error in checkUsageLimit:', error)
    return { allowed: true, currentCount: 0 } // Allow on error to not block users
  }
}

/**
 * Log usage for a specific resource
 */
export async function logUsage(
  userId: string,
  resourceType: ResourceType,
  resourceId?: string
): Promise<boolean> {
  const supabase = createClient()
  const monthYear = getCurrentMonthYear()

  try {
    const { error } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        month_year: monthYear,
        count: 1,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging usage:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in logUsage:', error)
    return false
  }
}

/**
 * Get usage limits for free tier users
 */
export const FREE_TIER_LIMITS = {
  book_upload: 1,
  lecture_view: 2,
  summary_view: 1
} as const

/**
 * Get error message in Arabic for limit reached
 */
export function getLimitReachedMessage(resourceType: ResourceType, limit: number): string {
  const messages = {
    book_upload: `لقد وصلت إلى الحد الأقصى لرفع الكتب هذا الشهر (${limit} كتاب). يرجى الترقية إلى خطة مميزة للمزيد.`,
    lecture_view: `لقد وصلت إلى الحد الأقصى لعرض المحاضرات هذا الشهر (${limit} محاضرة). يرجى الترقية إلى خطة مميزة للمزيد.`,
    summary_view: `لقد وصلت إلى الحد الأقصى لعرض الملخصات هذا الشهر (${limit} ملخص). يرجى الترقية إلى خطة مميزة للمزيد.`
  }
  return messages[resourceType]
}
