"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import Link from "next/link"
import { 
  User, 
  Search, 
  Filter, 
  ArrowRight,
  Shield,
  BookOpen,
  Calendar,
  Mail
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  name: string
  email: string
  university?: string
  major?: string
  role?: string
  subscription_tier?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  phone?: string
  birth_date?: string
}

export default function AdminUsersPage() {
  const { user, isLoggedIn, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
   

    loadUsers()
  }, [ user])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      console.error("Error loading users:", error)
      toast.error("حدث خطأ أثناء تحميل المستخدمين")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`هل أنت متأكد من تغيير دور المستخدم إلى ${newRole}؟`)) return

    try {
      setProcessing(userId)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => 
        prev.map(u => 
          u.id === userId 
            ? { ...u, role: newRole }
            : u
        )
      )

      toast.success("تم تحديث دور المستخدم بنجاح")
    } catch (error: any) {
      console.error("Error updating user role:", error)
      toast.error("حدث خطأ أثناء تحديث دور المستخدم")
    } finally {
      setProcessing(null)
    }
  }

  const filteredUsers = users.filter(userProfile => {
    const matchesSearch = 
      userProfile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProfile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProfile.university?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || userProfile.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleLabel = (role?: string) => {
    const labels: Record<string, string> = {
      admin: "مدير",
      student: "طالب",
      moderator: "مشرف"
    }
    return labels[role || 'student'] || 'طالب'
  }

  const getTierLabel = (tier?: string) => {
    const labels: Record<string, string> = {
      free: "مجاني",
      standard: "قياسي", 
      premium: "مميز"
    }
    return labels[tier || 'free'] || 'مجاني'
  }

  const getMajorLabel = (major?: string) => {
    const labels: Record<string, string> = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال"
    }
    return labels[major || ''] || major || 'غير محدد'
  }

  

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="إدارة المستخدمين">
          <div className="p-6 text-center">
            <p className="text-gray-600">جاري تحميل المستخدمين...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/admin">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للوحة التحكم
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>
            إدارة المستخدمين
          </h1>
          <p className="text-gray-600">عرض وإدارة حسابات المستخدمين</p>
        </div>

        {/* Search and Filters */}
        <RetroWindow title="البحث والفلاتر">
          <div className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="البحث في المستخدمين..." 
                  className="retro-button pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="retro-button">
                  <SelectValue placeholder="فلترة حسب الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="student">طلاب</SelectItem>
                  <SelectItem value="admin">مديرون</SelectItem>
                  <SelectItem value="moderator">مشرفون</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="retro-button bg-transparent"
                onClick={loadUsers}
              >
                <Filter className="w-4 h-4 ml-2" />
                تحديث القائمة
              </Button>
            </div>
          </div>
        </RetroWindow>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
          <RetroWindow title="إجمالي المستخدمين">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                {users.length}
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="المديرون">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="الطلاب">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === 'student' || !u.role).length}
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="نتائج البحث">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {filteredUsers.length}
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Users List */}
        <RetroWindow title={`المستخدمون (${filteredUsers.length})`}>
          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">لا توجد نتائج</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userProfile) => (
                  <div key={userProfile.id} className="retro-window bg-white">
                    <div className="p-4">
                      <div className="grid lg:grid-cols-6 gap-4 items-center">
                        {/* User Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={userProfile.avatar_url || "/diverse-user-avatars.png"}
                              alt={userProfile.name || "مستخدم"}
                              className="w-12 h-12 rounded border"
                            />
                            <div>
                              <h4 className="font-semibold">{userProfile.name || "بدون اسم"}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {userProfile.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Academic Info */}
                        <div className="text-sm">
                          <p className="font-medium">{userProfile.university || "غير محدد"}</p>
                          <p className="text-gray-600">{getMajorLabel(userProfile.major)}</p>
                        </div>

                        {/* Role */}
                        <div>
                          <Badge 
                            variant={userProfile.role === "admin" ? "default" : "secondary"}
                            className={userProfile.role === "admin" ? "bg-blue-500" : ""}
                          >
                            <Shield className="w-3 h-3 ml-1" />
                            {getRoleLabel(userProfile.role)}
                          </Badge>
                        </div>

                        {/* Subscription */}
                        <div>
                          <Badge 
                            variant="outline"
                            className={
                              userProfile.subscription_tier === 'premium' ? "border-yellow-500 text-yellow-700" :
                              userProfile.subscription_tier === 'standard' ? "border-blue-500 text-blue-700" :
                              "border-gray-500 text-gray-700"
                            }
                          >
                            {getTierLabel(userProfile.subscription_tier)}
                          </Badge>
                        </div>

                        {/* Join Date */}
                        <div className="text-sm text-gray-500">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(userProfile.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {userProfile.role !== 'admin' && (
                            <Button
                              size="sm"
                              className="retro-button text-xs"
                              style={{ background: "var(--primary)", color: "white" }}
                              onClick={() => updateUserRole(userProfile.id, 'admin')}
                              disabled={processing === userProfile.id}
                            >
                              <Shield className="w-3 h-3 ml-1" />
                              جعل مدير
                            </Button>
                          )}
                          {userProfile.role === 'admin' && userProfile.id !== user?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="retro-button text-xs bg-transparent"
                              onClick={() => updateUserRole(userProfile.id, 'student')}
                              disabled={processing === userProfile.id}
                            >
                              إزالة الإدارة
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Additional Info Row */}
                      {userProfile.phone && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            الهاتف: {userProfile.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
