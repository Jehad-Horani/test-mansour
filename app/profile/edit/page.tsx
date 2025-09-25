"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { Save, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function EditProfilePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    university: "",
    major: "",
    study_level: "",
    student_id: "",
    bio: "",
  })

  // جلب البيانات الحالية من البروفايل
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        birth_date: profile?.birth_date || "",
        university: profile?.university || "",
        major: profile?.major || "",
        study_level: profile?.study_level || "",
        student_id: profile?.student_id || "",
        bio: profile?.bio || "",
      })
    }
  }, [profile, user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً")
      return
    }
    
    setLoading(true)

    try {
      // Update profile in database - Fixed the API call
      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          phone: form.phone,
          birth_date: form.birth_date,
          university: form.university,
          major: form.major,
          study_level: form.study_level,
          student_id: form.student_id,
          bio: form.bio,
        })
        .eq("id", user.id)

      if (error) throw error

      toast.success("تم تحديث الملف الشخصي بنجاح")
      
      // Wait a bit then redirect
      setTimeout(() => {
        router.push("/profile")
      }, 1000)
      
    } catch (err: any) {
      console.error("Error updating profile:", err)
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/profile">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للملف الشخصي
            </Link>
          </Button>
        </div>

        <RetroWindow title="تعديل الملف الشخصي">
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  المعلومات الشخصية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      className="retro-window"
                      style={{ background: "#f0f0f0", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">تاريخ الميلاد</label>
                    <Input
                      type="date"
                      name="birth_date"
                      value={form.birth_date || ""}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  المعلومات الأكاديمية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الجامعة</label>
                    <select
                      name="university"
                      value={form.university}
                      onChange={handleChange}
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option value="">اختر الجامعة</option>
                      <option value="جامعة الملك سعود">جامعة الملك سعود</option>
                      <option value="جامعة الملك عبدالعزيز">جامعة الملك عبدالعزيز</option>
                      <option value="جامعة الإمام محمد بن سعود">جامعة الإمام محمد بن سعود</option>
                      <option value="جامعة الملك فهد للبترول والمعادن">جامعة الملك فهد للبترول والمعادن</option>
                      <option value="الجامعة الأردنية">الجامعة الأردنية</option>
                      <option value="جامعة العلوم والتكنولوجيا الأردنية">جامعة العلوم والتكنولوجيا الأردنية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">التخصص</label>
                    <select
                      name="major"
                      value={form.major}
                      onChange={handleChange}
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option value="">اختر التخصص</option>
                      <option value="law">القانون</option>
                      <option value="it">علوم الحاسب</option>
                      <option value="medical">الطب</option>
                      <option value="business">إدارة الأعمال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المستوى الدراسي</label>
                    <select
                      name="study_level"
                      value={form.study_level}
                      onChange={handleChange}
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option value="">اختر المستوى</option>
                      <option value="بكالوريوس">بكالوريوس</option>
                      <option value="ماجستير">ماجستير</option>
                      <option value="دكتوراه">دكتوراه</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الرقم الجامعي</label>
                    <Input
                      name="student_id"
                      value={form.student_id}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">نبذة شخصية</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full p-2 retro-window resize-none"
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                  placeholder="اكتب نبذة مختصرة عن نفسك..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="retro-button"
                  style={{ background: "var(--primary)", color: "white" }}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 ml-1" />
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/profile">إلغاء</Link>
                </Button>
              </div>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}