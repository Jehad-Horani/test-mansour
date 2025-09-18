"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { RetroToggle } from "@/components/retro-toggle"
import Link from "next/link"

const mockStudyPlans = [
  {
    id: 1,
    title: "خطة مراجعة القانون الدستوري",
    course: "LAW 101",
    tasks: [
      { id: 1, task: "مراجعة الفصل الأول - مبادئ القانون", completed: true },
      { id: 2, task: "حل التمارين العملية", completed: false },
      { id: 3, task: "مراجعة المحاضرات المسجلة", completed: false },
      { id: 4, task: "إعداد ملخص شامل", completed: false },
    ],
    deadline: "2024-02-15",
    priority: "عالية",
    progress: 25,
  },
  {
    id: 2,
    title: "مشروع التخرج - البحث والتطوير",
    course: "PROJ 499",
    tasks: [
      { id: 1, task: "جمع المراجع والمصادر", completed: true },
      { id: 2, task: "كتابة المقدمة", completed: true },
      { id: 3, task: "تطوير النموذج الأولي", completed: false },
      { id: 4, task: "اختبار النظام", completed: false },
    ],
    deadline: "2024-03-01",
    priority: "عالية جداً",
    progress: 50,
  },
]

export default function StudyPage() {
  const [studyPlans, setStudyPlans] = useState(mockStudyPlans)
  const [newPlan, setNewPlan] = useState({
    title: "",
    course: "",
    deadline: "",
    description: "",
    priority: "متوسطة",
  })

  const handleAddPlan = () => {
    if (!newPlan.title || !newPlan.course || !newPlan.deadline) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    const tasks = newPlan.description
      .split("\n")
      .filter((task) => task.trim())
      .map((task, index) => ({
        id: index + 1,
        task: task.trim(),
        completed: false,
      }))

    const newStudyPlan = {
      id: studyPlans.length + 1,
      title: newPlan.title,
      course: newPlan.course,
      deadline: newPlan.deadline,
      priority: newPlan.priority,
      progress: 0,
      tasks:
        tasks.length > 0
          ? tasks
          : [
              { id: 1, task: "مراجعة المحاضرات", completed: false },
              { id: 2, task: "حل التمارين", completed: false },
            ],
    }

    setStudyPlans([...studyPlans, newStudyPlan])
    setNewPlan({
      title: "",
      course: "",
      deadline: "",
      description: "",
      priority: "متوسطة",
    })

    alert("تم إنشاء الخطة الدراسية بنجاح!")
  }

  const toggleTask = (planId: number, taskId: number) => {
    setStudyPlans((plans) =>
      plans.map((plan) => {
        if (plan.id === planId) {
          const updatedTasks = plan.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          )
          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const progress = Math.round((completedTasks / updatedTasks.length) * 100)

          return { ...plan, tasks: updatedTasks, progress }
        }
        return plan
      }),
    )
  }

  const deletePlan = (planId: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الخطة؟")) {
      setStudyPlans((plans) => plans.filter((plan) => plan.id !== planId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية جداً":
        return "#ff4757"
      case "عالية":
        return "#ff6b6b"
      case "متوسطة":
        return "#ffa502"
      case "منخفضة":
        return "#2ed573"
      default:
        return "#747d8c"
    }
  }

  const exportToICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TAKHASSUS//StudyPlans//AR
CALSCALE:GREGORIAN
METHOD:PUBLISH
${studyPlans
  .map(
    (plan) => `BEGIN:VEVENT
UID:${plan.id}@takhassus.com
DTSTART:${plan.deadline.replace(/-/g, "")}T090000
DTEND:${plan.deadline.replace(/-/g, "")}T100000
SUMMARY:موعد نهائي: ${plan.title}
DESCRIPTION:${plan.course} - ${plan.tasks.length} مهام
END:VEVENT`,
  )
  .join("\n")}
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "خططي_الدراسية.ics"
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
          <span>الخطط الدراسية - نظم ومتابعة خططك الدراسية</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      {/* Study Plans */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
              خططي الدراسية ({studyPlans.length})
            </h2>
            <div className="flex gap-2">
              <button onClick={exportToICS} className="retro-button">
                تصدير التقويم
              </button>
              <button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                إحصائيات التقدم
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {studyPlans.map((plan) => (
              <RetroWindow key={plan.id} title={plan.course} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg" style={{ color: "var(--ink)" }}>
                      {plan.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded text-white font-semibold"
                      style={{ backgroundColor: getPriorityColor(plan.priority) }}
                    >
                      {plan.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--ink)" }}>التقدم</span>
                      <span style={{ color: "var(--ink)" }}>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${plan.progress}%`,
                          backgroundColor: plan.progress === 100 ? "#2ed573" : "var(--primary)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    {plan.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(plan.id, task.id)}
                          className="retro-input"
                        />
                        <span
                          className={`text-sm flex-1 ${task.completed ? "line-through opacity-60" : ""}`}
                          style={{ color: "var(--ink)" }}
                        >
                          {task.task}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                      الموعد النهائي: {new Date(plan.deadline).toLocaleDateString("ar")}
                    </span>
                    <span className="text-sm" style={{ color: "var(--ink)" }}>
                      {plan.tasks.filter((t) => t.completed).length}/{plan.tasks.length} مكتمل
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="retro-button flex-1">تعديل</button>
                    <button
                      className="retro-button"
                      style={{ background: "#ff6b6b", color: "white" }}
                      onClick={() => deletePlan(plan.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </RetroWindow>
            ))}
          </div>

          {/* Add New Study Plan */}
          <RetroWindow title="إنشاء خطة دراسية جديدة" className="max-w-2xl">
            <div className="space-y-4">
              <input
                className="retro-input w-full"
                placeholder="عنوان الخطة"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  className="retro-input w-full"
                  placeholder="المقرر"
                  value={newPlan.course}
                  onChange={(e) => setNewPlan({ ...newPlan, course: e.target.value })}
                />
                <input
                  className="retro-input w-full"
                  type="date"
                  value={newPlan.deadline}
                  onChange={(e) => setNewPlan({ ...newPlan, deadline: e.target.value })}
                />
                <select
                  className="retro-input w-full"
                  value={newPlan.priority}
                  onChange={(e) => setNewPlan({ ...newPlan, priority: e.target.value })}
                >
                  <option value="منخفضة">أولوية منخفضة</option>
                  <option value="متوسطة">أولوية متوسطة</option>
                  <option value="عالية">أولوية عالية</option>
                  <option value="عالية جداً">أولوية عالية جداً</option>
                </select>
              </div>
              <textarea
                className="retro-input w-full h-24 resize-none"
                placeholder="وصف الخطة والمهام المطلوبة (كل مهمة في سطر منفصل)"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
              <button
                onClick={handleAddPlan}
                className="retro-button w-full"
                style={{ background: "var(--primary)", color: "white" }}
              >
                إنشاء الخطة
              </button>
            </div>
          </RetroWindow>
        </div>
      </section>
    </div>
  )
}
