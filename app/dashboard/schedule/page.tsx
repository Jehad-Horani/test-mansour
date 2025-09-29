"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { RetroWindow } from "@/app/components/retro-window"
import { RetroToggle } from "@/app/components/retro-toggle"
import Link from "next/link"
import { toPng } from "html-to-image"


export default function SchedulePage() {
  const [schedule, setSchedule] = useState<any[]>([])
  const [newCourse, setNewCourse] = useState({
    course: "",
    code: "",
    time: "",
    day: "",
    location: "",
    instructor: "",
  })
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setSchedule(data)
    }
  }

  const exportToImage = async () => {
    const node = document.getElementById("schedule-section")
    if (!node) return

    const dataUrl = await toPng(node)
    const link = document.createElement("a")
    link.download = "جدول_الامتحانات.png"
    link.href = dataUrl
    link.click()
  }

  const handleAddCourse = async () => {
    if (!newCourse.course || !newCourse.code || !newCourse.time || !newCourse.day) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("schedules")
      .insert([
        {
          ...newCourse,
          user_id: user?.id
        }
      ])
      .select()

    if (error) {
      console.error(error)
      alert("حدث خطأ أثناء إضافة المقرر")
    } else {
      setSchedule((prev) => [...prev, data[0]])
      setNewCourse({
        course: "",
        code: "",
        time: "",
        day: "",
        location: "",
        instructor: "",
      })
      alert("تم إضافة المقرر بنجاح!")

      // Refresh البيانات مرتين
      fetchSchedule()
      fetchSchedule()
    }
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse({ ...course })
    setEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingCourse.course || !editingCourse.code || !editingCourse.time || !editingCourse.day) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const { error } = await supabase
      .from("schedules")
      .update(editingCourse)
      .eq("id", editingCourse.id)

    if (error) {
      console.error(error)
      alert("حدث خطأ أثناء تحديث المقرر")
    } else {
      setSchedule((prev) =>
        prev.map((item) => (item.id === editingCourse.id ? editingCourse : item)),
      )
      setEditModalOpen(false)
      setEditingCourse(null)
      alert("تم تحديث المقرر بنجاح!")
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المقرر؟")) {
      const { error } = await supabase.from("schedules").delete().eq("id", courseId)

      if (error) {
        console.error(error)
        alert("حدث خطأ أثناء حذف المقرر")
      } else {
        setSchedule((prev) => prev.filter((item) => item.id !== courseId))
        alert("تم حذف المقرر بنجاح!")
      }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <RetroToggle />

      {/* Header */}
      <section className="retro-window mx-4 mt-4 mb-6">
        <div className="retro-window-title">
          <span>الجدول الدراسي - نظم وإدارة جدولك الدراسي</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      {/* Current Schedule */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              جدولي الحالي
            </h2>
            <button onClick={exportToImage} className="retro-button">
              تحميل جدولك الدراسي كصورة
            </button>
          </div>

          <div id="schedule-section" className="grid md:grid-cols-2 gap-6 mb-12">
            {schedule.map((item) => (
              <RetroWindow key={item.id} title={item.code} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                    {item.course}
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
                    <p>الوقت: {item.time}</p>
                    <p>اليوم: {item.day}</p>
                    <p>المكان: {item.location}</p>
                    <p>الأستاذ: {item.instructor}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="retro-button" onClick={() => handleEditCourse(item)}>
                      تعديل
                    </button>
                    <button
                      className="retro-button"
                      style={{ background: "#ff6b6b", color: "white" }}
                      onClick={() => handleDeleteCourse(item.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </RetroWindow>
            ))}
          </div>

          {/* Add New Course */}
          <RetroWindow title="إضافة مقرر جديد" className="max-w-2xl">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="اسم المقرر"
                  value={newCourse.course}
                  onChange={(e) => setNewCourse({ ...newCourse, course: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  placeholder="رمز المقرر"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="الوقت (مثال: 08:00 - 09:30)"
                  value={newCourse.time}
                  onChange={(e) => setNewCourse({ ...newCourse, time: e.target.value })}
                />
                <select
                  className="retro-input w-full"
                  value={newCourse.day}
                  onChange={(e) => setNewCourse({ ...newCourse, day: e.target.value })}
                >
                  <option value="">اختر اليوم</option>
                  <option value="أحد - ثلاثاء - خميس">أحد - ثلاثاء - خميس</option>
                  <option value="اثنين - اربعاء"> اثنين - اربعاء</option>

                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="المكان"
                  value={newCourse.location}
                  onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  placeholder="اسم الأستاذ"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
              </div>
              <button
                onClick={handleAddCourse}
                className="retro-button w-full"
                style={{ background: "var(--primary)", color: "white" }}
              >
                إضافة المقرر
              </button>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Edit Course Modal */}
      {editModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="retro-window bg-white p-6 max-w-md w-full mx-4">
            <div className="retro-window-title">
              <span>تعديل المقرر</span>
            </div>
            <div className="p-4 space-y-4">
              <input
                className="retro-input w-full"
                placeholder="اسم المقرر"
                value={editingCourse.course}
                onChange={(e) => setEditingCourse({ ...editingCourse, course: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="رمز المقرر"
                value={editingCourse.code}
                onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="الوقت"
                value={editingCourse.time}
                onChange={(e) => setEditingCourse({ ...editingCourse, time: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="المكان"
                value={editingCourse.location}
                onChange={(e) => setEditingCourse({ ...editingCourse, location: e.target.value })}
              />
              <input
                className="retro-input w-full"
                placeholder="اسم الأستاذ"
                value={editingCourse.instructor}
                onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
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
