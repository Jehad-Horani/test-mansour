"use client"

import { useState, useEffect } from "react"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toPng } from "html-to-image"
import { useAuth } from "@/hooks/use-auth"
import { Router } from "lucide-react"
import { useRouter } from "next/router"



export default function ExamsPage() {
  const supabase = createClient()
  const [exams, setExams] = useState<any[]>([])
  const [newExam, setNewExam] = useState({
    course: "",
    code: "",
    date: "",
    time: "",
    location: "",
    type: "",
  })
  const [editingExam, setEditingExam] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { profile, ispremium } = useAuth()
  const router = useRouter();

useEffect(() => {
  if (!profile) return;

  if (profile.subscription_tier === "premium") {
    if (router.pathname !== "/dashboard/schedule") {
      router.push("/dashboard/schedule");
    }
  } else {
    if (router.pathname !== "/") {
      router.push("/");
    }
  }
}, [profile, router]);



  // ✅ جلب الامتحانات للمستخدم الحالي فقط
  const fetchExams = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("user_id", user.id) // 🔑 فلترة حسب user_id
      .order("date", { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setExams(data || [])
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  // ✅ إضافة امتحان
  const handleAddExam = async () => {
    if (!newExam.course || !newExam.code || !newExam.date || !newExam.time) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً")
      return
    }

    const { data, error } = await supabase
      .from("exams")
      .insert([{ ...newExam, user_id: user.id }]) // ✅ ربط باليوزر
      .select()

    if (error) {
      console.error(error)
      alert("خطأ أثناء الإضافة")
    } else {
      setExams((prev) => [...prev, data[0]])
      setNewExam({ course: "", code: "", date: "", time: "", location: "", type: "" })
      alert("تمت إضافة الامتحان بنجاح!")
    }
  }

  // ✅ تعديل امتحان
  const handleSaveEdit = async () => {
    const { data, error } = await supabase
      .from("exams")
      .update(editingExam)
      .eq("id", editingExam.id)
      .select()

    if (error) {
      console.error(error)
      alert("خطأ أثناء التعديل")
    } else {
      setExams((prev) =>
        prev.map((item) => (item.id === editingExam.id ? data[0] : item))
      )
      setEditModalOpen(false)
      setEditingExam(null)
      alert("تم تحديث الامتحان!")
    }
  }

  // ✅ حذف امتحان
  const handleDeleteExam = async (examId: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      const { error } = await supabase.from("exams").delete().eq("id", examId)
      if (error) {
        console.error(error)
        alert("خطأ أثناء الحذف")
      } else {
        setExams((prev) => prev.filter((e) => e.id !== examId))
        alert("تم الحذف")
      }
    }
  }

  // ✅ Export to ICS
  const exportToImage = async () => {
    const node = document.getElementById("exams-section")
    if (!node) return

    const dataUrl = await toPng(node)
    const link = document.createElement("a")
    link.download = "جدول_الامتحانات.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>

      {/* Header */}
      <section className="retro-window mx-4 mt-4 mb-6">
        <div className="retro-window-title">
          <span>جدول الامتحانات - نظم ومتابعة امتحاناتك</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      {/* Exams */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              الامتحانات القادمة
            </h2>
            <button onClick={exportToImage} className="retro-button">
              تحميل جدول الامتحانات
            </button>
          </div>

          <div id="exams-section" className="grid md:grid-cols-2 gap-6 mb-12">
            {exams.map((exam) => (
              <RetroWindow key={exam.id} title={exam.code}>
                <div className="space-y-3">
                  <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                    {exam.course}
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
                    <p>التاريخ: {exam.date}</p>
                    <p>الوقت: {exam.time}</p>
                    <p>المكان: {exam.location}</p>
                    <p>النوع: {exam.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="retro-button"
                      onClick={() => {
                        setEditingExam(exam)
                        setEditModalOpen(true)
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="retro-button"
                      style={{ background: "#ff6b6b", color: "white" }}
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </RetroWindow>
            ))}
          </div>

          {/* Add New Exam */}
          <RetroWindow title="إضافة امتحان جديد" className="max-w-2xl">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="اسم المقرر"
                  value={newExam.course}
                  onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  placeholder="رمز المقرر"
                  value={newExam.code}
                  onChange={(e) => setNewExam({ ...newExam, code: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  type="time"
                  value={newExam.time}
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="المكان"
                  value={newExam.location}
                  onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  placeholder="نوع الامتحان"
                  value={newExam.type}
                  onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                />
              </div>
              <button
                onClick={handleAddExam}
                className="retro-button w-full"
                style={{ background: "var(--primary)", color: "white" }}
              >
                إضافة الامتحان
              </button>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Edit Exam Modal */}
      {editModalOpen && editingExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="retro-window bg-white p-6 max-w-md w-full mx-4">
            <div className="retro-window-title">
              <span>تعديل الامتحان</span>
            </div>
            <div className="p-4 space-y-4">
              <input
                className="retro-input w-full"
                placeholder="اسم المقرر"
                value={editingExam.course}
                onChange={(e) => setEditingExam({ ...editingExam, course: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="رمز المقرر"
                value={editingExam.code}
                onChange={(e) => setEditingExam({ ...editingExam, code: e.target.value })}
              />
              <input
                className="retro-input w-full"
                type="date"
                value={editingExam.date}
                onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })}
              />
              <input
                className="retro-input w-full"
                type="time"
                value={editingExam.time}
                onChange={(e) => setEditingExam({ ...editingExam, time: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="المكان"
                value={editingExam.location}
                onChange={(e) => setEditingExam({ ...editingExam, location: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="نوع الامتحان"
                value={editingExam.type}
                onChange={(e) => setEditingExam({ ...editingExam, type: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="retro-button flex-1">
                  حفظ
                </button>
                <button className="retro-button flex-1" onClick={() => setEditModalOpen(false)}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
