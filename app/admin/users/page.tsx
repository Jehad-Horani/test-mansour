"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import {
  Search,
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Users,
  Crown,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  university?: string
  major?: string
  role: "student" | "admin" | "ambassador"
  subscription_tier: string
  created_at: string
  avatar_url?: string
}

export default function AdminUsersPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push('/')
      return
    }
    fetchUsers()
  }, [isLoggedIn, isAdmin, router, page, search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (search) {
        params.append('search', search)
      }

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()

      if (res.ok) {
        setUsers(data.users || [])
        setPagination(data.pagination)
      } else {
        console.error("Error fetching users:", data.error)
        toast.error("خطأ في جلب المستخدمين")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

 const updateUserRole = async (
  userId: string,
  newRole: "student" | "admin" | "ambassador"
) => {
  // ترجم الأدوار لعرضها بالعربي
  const roleLabels: Record<"student" | "admin" | "ambassador", string> = {
    student: "طالب",
    admin: "مشرف",
    ambassador: "سفير",
  }

  if (!confirm(`هل تريد تغيير دور هذا المستخدم إلى ${roleLabels[newRole]}؟`)) {
    return
  }

  try {
    setUpdating(userId)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        updates: { role: newRole },
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
      toast.success("تم تحديث دور المستخدم بنجاح")
    } else {
      console.error("Error updating user role:", data.error)
      toast.error("خطأ في تحديث دور المستخدم")
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    toast.error("خطأ في الاتصال")
  } finally {
    setUpdating(null)
  }
}


  const updateSubscription = async (userId: string, tier: string) => {
    try {
      setUpdating(userId)
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          updates: { subscription_tier: tier }
        })
      })

      const data = await res.json()

      if (res.ok) {
        setUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, subscription_tier: tier } : user
        ))
        toast.success("تم تحديث الاشتراك بنجاح")
      } else {
        console.error("Error updating subscription:", data.error)
        toast.error("خطأ في تحديث الاشتراك")
      }
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setUpdating(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم بشكل كامل؟")) return;

    try {
      setUpdating(userId)
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await res.json()

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId))
        toast.success("تم حذف المستخدم بنجاح")
      } else {
        console.error("Error deleting user:", data.error)
        toast.error("خطأ في حذف المستخدم")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setUpdating(null)
    }
  }


  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
  }

  const getTierColor = (tier: string) => {
    return tier === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="إدارة المستخدمين">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">إدارة المستخدمين</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">المجموع: {pagination.total}</span>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="بحث بالاسم أو البريد الإلكتروني..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchUsers} disabled={loading}>
                  بحث
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">
                    {users.filter(u => u.role === 'student').length}
                  </div>
                  <div className="text-sm text-blue-600">طلاب</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-800">
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-red-600">مشرفين</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-800">
                    {users.filter(u => u.subscription_tier === 'premium').length}
                  </div>
                  <div className="text-sm text-yellow-600">مشتركين مميزين</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {users.filter(u => u.subscription_tier === 'basic').length}
                  </div>
                  <div className="text-sm text-gray-600">مشتركين عاديين</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Users List */}
        <RetroWindow title="قائمة المستخدمين">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">جاري التحميل...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">لا يوجد مستخدمين</div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {users.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-400 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-gray-500" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-black">{user.name}</h3>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role === 'admin' ? 'مشرف' : 'طالب'}
                              </Badge>
                              <Badge className={getTierColor(user.subscription_tier)}>
                                {user.subscription_tier === 'premium' ? 'مميز' : 'عادي'}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              {user.university && (
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  <span>{user.university}</span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                انضم: {new Date(user.created_at).toLocaleDateString('ar-SA')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as "student" | "admin" |"ambassador")}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="student">طالب</option>
                            <option value="admin">مشرف</option>
                            <option value="ambassador">سفير</option>
                          </select>

                          <select
                            value={user.subscription_tier}
                            onChange={(e) => updateSubscription(user.id, e.target.value)}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="basic">عادي</option>
                            <option value="premium">مميز</option>
                          </select>

                          <Button
                            variant="destructive"
                            onClick={() => deleteUser(user.id)}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-red-600 text-white hover:bg-red-700"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      صفحة {pagination.page} من {pagination.totalPages} ({pagination.total} مستخدم)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="retro-button bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                        السابق
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="retro-button bg-transparent"
                      >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}