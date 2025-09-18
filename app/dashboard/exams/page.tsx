"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window" // Replaced WindowCard import with RetroWindow
import { RetroToggle } from "@/components/retro-toggle"
import Link from "next/link"

const mockExams = [
  {
    id: 1,
    course: "مبادئ القانون",
    code: "LAW 101",
    date: "2024-02-15",
    time: "09:00",
    location: "قاعة الامتحانات الكبرى",
    type: "نهائي",
    status: "قادم",
  },
  {
    id: 2,
    course: "مقدمة في البرمجة",
    code: "CS 101",
    date: "2024-02-20",
    time: "10:00",
    location: "مختبر الحاسب 2",
    type: "عملي",
    status: "قادم",
  },
]

export default function ExamsPage() {
  const [exams, setExams] = useState(mockExams)
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

  const handleAddExam = () => {
    if (!newExam.course || !newExam.code || !newExam.date || !newExam.time) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setExams((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newExam,
        status: "قادم",
      },
    ])

    setNewExam({
      course: "",
      code: "",
      date: "",
      time: "",
      location: "",
      type: "",
    })

    alert("تم إضافة الامتحان بنجاح!")
  }

  const handleEditExam = (exam: any) => {
    setEditingExam({ ...exam })
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingExam.course || !editingExam.code || !editingExam.date || !editingExam.time) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setExams((prev) => prev.map((item) => (item.id === editingExam.id ? editingExam : item)))
    setEditModalOpen(false)
    setEditingExam(null)
    alert("تم تحديث الامتحان بنجاح!")
  }

  const handleDeleteExam = (examId: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الامتحان؟")) {
      setExams((prev) => prev.filter((item) => item.id !== examId))
      alert("تم حذف الامتحان بنجاح!")
    }
  }

  const exportToICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TAKHASSUS//Exams//AR
CALSCALE:GREGORIAN
METHOD:PUBLISH
${exams
  .map(
    (exam) => `BEGIN:VEVENT
UID:${exam.id}@takhassus.com
DTSTART:${exam.date.replace(/-/g, "")}T${exam.time.replace(":", "")}00
DTEND:${exam.date.replace(/-/g, "")}T${(Number.parseInt(exam.time.split(":")[0]) + 2).toString().padStart(2, "0")}${exam.time.split(":")[1]}00
SUMMARY:امتحان ${exam.course}
DESCRIPTION:${exam.type} - ${exam.location}
LOCATION:${exam.location}
END:VEVENT`,
  )
  .join("\n")}
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "جدول_الامتحانات.ics"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <RetroToggle />

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

      {/* Upcoming Exams */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              الامتحانات القادمة
            </h2>
            <button onClick={exportToICS} className="retro-button">
              تصدير ICS
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {exams.map((exam) => (
              <RetroWindow key={exam.id} title={exam.code} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                    {exam.course}
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
                    <p>التاريخ: {exam.date}</p>
                    <p>الوقت: {exam.time}</p>
                    <p>المكان: {exam.location}</p>
                    <div className="flex items-center gap-2">
                      <span className="retro-button text-xs px-2 py-1">{exam.type}</span>
                      <span className="retro-button text-xs px-2 py-1" style={{ background: "#ffd93d", color: "#000" }}>
                        {exam.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="retro-button" onClick={() => handleEditExam(exam)}>
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
