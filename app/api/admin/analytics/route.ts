import { NextResponse } from "next/server"
import { createAdminClient, authServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Verify admin access
    await authServer.requireAdmin()
    
    const supabase = createAdminClient()
    
    // Get comprehensive analytics
    const [
      usersResult,
      booksResult,
      summariesResult,
      lecturesResult,
      cartItemsResult,
      messagesResult
    ] = await Promise.all([
      supabase.from('profiles').select('id, role, created_at, subscription_tier', { count: 'exact' }),
      supabase.from('books').select('id, approval_status, created_at, selling_price', { count: 'exact' }),
      supabase.from('summaries').select('id, status, created_at', { count: 'exact' }),
      supabase.from('daily_lectures').select('id, approval_status, created_at', { count: 'exact' }),
      supabase.from('cart_items').select('id, quantity, created_at', { count: 'exact' }),
      supabase.from('messages').select('id, created_at', { count: 'exact' })
    ])

    // Process user analytics
    const users = usersResult.data || []
    const userStats = {
      total: users.length,
      students: users.filter(u => u.role === 'student').length,
      admins: users.filter(u => u.role === 'admin').length,
      premium: users.filter(u => u.subscription_tier === 'premium').length,
      basic: users.filter(u => u.subscription_tier === 'basic').length
    }

    // Process book analytics
    const books = booksResult.data || []
    const bookStats = {
      total: books.length,
      pending: books.filter(b => b.approval_status === 'pending').length,
      approved: books.filter(b => b.approval_status === 'approved').length,
      rejected: books.filter(b => b.approval_status === 'rejected').length,
      totalValue: books.reduce((sum, b) => sum + (b.selling_price || 0), 0)
    }

    // Process summary analytics
    const summaries = summariesResult.data || []
    const summaryStats = {
      total: summaries.length,
      pending: summaries.filter(s => s.status === 'pending').length,
      approved: summaries.filter(s => s.status === 'approved').length,
      rejected: summaries.filter(s => s.status === 'rejected').length
    }

    // Process lecture analytics
    const lectures = lecturesResult.data || []
    const lectureStats = {
      total: lectures.length,
      pending: lectures.filter(l => l.approval_status === 'pending').length,
      approved: lectures.filter(l => l.approval_status === 'approved').length,
      rejected: lectures.filter(l => l.approval_status === 'rejected').length
    }

    // Cart analytics
    const cartItems = cartItemsResult.data || []
    const cartStats = {
      totalItems: cartItems.length,
      totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }

    // Message analytics
    const messageStats = {
      total: messagesResult.count || 0
    }

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentUsers = users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length
    const recentBooks = books.filter(b => new Date(b.created_at) >= sevenDaysAgo).length
    const recentSummaries = summaries.filter(s => new Date(s.created_at) >= sevenDaysAgo).length

    // Monthly growth data (last 6 months)
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthUsers = users.filter(u => {
        const created = new Date(u.created_at)
        return created >= monthStart && created <= monthEnd
      }).length
      
      const monthBooks = books.filter(b => {
        const created = new Date(b.created_at)
        return created >= monthStart && created <= monthEnd
      }).length
      
      monthlyData.push({
        month: date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }),
        users: monthUsers,
        books: monthBooks,
        summaries: summaries.filter(s => {
          const created = new Date(s.created_at)
          return created >= monthStart && created <= monthEnd
        }).length
      })
    }

    return NextResponse.json({
      overview: {
        totalUsers: userStats.total,
        totalBooks: bookStats.total,
        totalSummaries: summaryStats.total,
        totalLectures: lectureStats.total,
        totalMessages: messageStats.total,
        recentActivity: {
          newUsers: recentUsers,
          newBooks: recentBooks,
          newSummaries: recentSummaries
        }
      },
      users: userStats,
      books: bookStats,
      summaries: summaryStats,
      lectures: lectureStats,
      cart: cartStats,
      messages: messageStats,
      monthlyGrowth: monthlyData,
      generatedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Error in GET /api/admin/analytics:", error)
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}