"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { RetroWindow } from "@/app/components/retro-window"
import  PixelIcon from "@/app/components/pixel-icon"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  email: string
  full_name: string
  bio: string
  university: string
  college: string
  major: string
  year: string
  phone: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setSaving(true)
    try {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user?.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
      alert("تم حفظ التغييرات بنجاح!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("حدث خطأ أثناء حفظ التغييرات")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="الملف الشخصي">
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الملف الشخصي...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="الملف الشخصي">
          <div className="p-8 text-center">
            <PixelIcon type="user" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">لم يتم العثور على الملف الشخصي</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <RetroWindow title="الملف الشخصي">
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-lg border-2 border-gray-300">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.charAt(0) || profile.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-right flex-1">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                {profile.full_name || "اسم المستخدم"}
              </h1>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.university && <Badge variant="secondary">{profile.university}</Badge>}
                {profile.college && <Badge variant="outline">{profile.college}</Badge>}
                {profile.major && <Badge variant="outline">{profile.major}</Badge>}
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
              <TabsTrigger value="academic">المعلومات الأكاديمية</TabsTrigger>
              <TabsTrigger value="security">الأمان والخصوصية</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                  <CardDescription>قم بتحديث معلوماتك الشخصية الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">الاسم الكامل</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name || ""}
                        onChange={(e) => setProfile((prev) => (prev ? { ...prev, full_name: e.target.value } : null))}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة شخصية</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : null))}
                      placeholder="اكتب نبذة مختصرة عن نفسك..."
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      updateProfile({
                        full_name: profile.full_name,
                        phone: profile.phone,
                        bio: profile.bio,
                      })
                    }
                    disabled={saving}
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academic Information Tab */}
            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأكاديمية</CardTitle>
                  <CardDescription>حدث معلوماتك الجامعية والتخصص</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">الجامعة</Label>
                      <Select
                        value={profile.university || ""}
                        onValueChange={(value) => setProfile((prev) => (prev ? { ...prev, university: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر جامعتك" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الجامعة الأردنية">الجامعة الأردنية</SelectItem>
                          <SelectItem value="جامعة اليرموك">جامعة اليرموك</SelectItem>
                          <SelectItem value="الجامعة الهاشمية">الجامعة الهاشمية</SelectItem>
                          <SelectItem value="جامعة مؤتة">جامعة مؤتة</SelectItem>
                          <SelectItem value="الجامعة الأمريكية">الجامعة الأمريكية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college">الكلية</Label>
                      <Select
                        value={profile.college || ""}
                        onValueChange={(value) => setProfile((prev) => (prev ? { ...prev, college: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر كليتك" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="كلية الحقوق">كلية الحقوق</SelectItem>
                          <SelectItem value="كلية تكنولوجيا المعلومات">كلية تكنولوجيا المعلومات</SelectItem>
                          <SelectItem value="كلية إدارة الأعمال">كلية إدارة الأعمال</SelectItem>
                          <SelectItem value="كلية الهندسة">كلية الهندسة</SelectItem>
                          <SelectItem value="كلية الطب">كلية الطب</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="major">التخصص</Label>
                      <Input
                        id="major"
                        value={profile.major || ""}
                        onChange={(e) => setProfile((prev) => (prev ? { ...prev, major: e.target.value } : null))}
                        placeholder="أدخل تخصصك"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">السنة الدراسية</Label>
                      <Select
                        value={profile.year || ""}
                        onValueChange={(value) => setProfile((prev) => (prev ? { ...prev, year: value } : null))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر سنتك الدراسية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="السنة الأولى">السنة الأولى</SelectItem>
                          <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                          <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                          <SelectItem value="السنة الرابعة">السنة الرابعة</SelectItem>
                          <SelectItem value="السنة الخامسة">السنة الخامسة</SelectItem>
                          <SelectItem value="دراسات عليا">دراسات عليا</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      updateProfile({
                        university: profile.university,
                        college: profile.college,
                        major: profile.major,
                        year: profile.year,
                      })
                    }
                    disabled={saving}
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>الأمان والخصوصية</CardTitle>
                  <CardDescription>إدارة كلمة المرور وإعدادات الأمان</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">تغيير كلمة المرور</h4>
                    <p className="text-sm text-yellow-700 mb-4">
                      لتغيير كلمة المرور، سيتم إرسال رابط إعادة تعيين إلى بريدك الإلكتروني
                    </p>
                    <Button
                      variant="outline"
                      className="retro-button bg-transparent"
                      onClick={() => {
                        // TODO: Implement password reset
                        alert("سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني")
                      }}
                    >
                      إرسال رابط إعادة التعيين
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">حذف الحساب</h4>
                    <p className="text-sm text-red-700 mb-4">
                      حذف الحساب نهائي ولا يمكن التراجع عنه. سيتم حذف جميع بياناتك.
                    </p>
                    <Button
                      variant="destructive"
                      className="retro-button"
                      onClick={() => {
                        if (confirm("هل أنت متأكد من رغبتك في حذف حسابك نهائياً؟")) {
                          // TODO: Implement account deletion
                          alert("تم إرسال طلب حذف الحساب للمراجعة")
                        }
                      }}
                    >
                      حذف الحساب نهائياً
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </RetroWindow>
    </div>
  )
}