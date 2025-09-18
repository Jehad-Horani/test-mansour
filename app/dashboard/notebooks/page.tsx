"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Progress } from "@/app/components/ui/progress"
import Link from "next/link"
import { ArrowRight, Upload, Eye, RefreshCw, FileText } from "lucide-react"

const mockNotebooks = [
  {
    id: 1,
    title: "محاضرة مبادئ القانون - الأسبوع 1",
    course: "LAW 101",
    uploadDate: "2024-01-15",
    status: "approved" as const,
    views: 45,
  },
  {
    id: 2,
    title: "محاضرة البرمجة - المتغيرات",
    course: "CS 101",
    uploadDate: "2024-01-20",
    status: "pending" as const,
    views: 0,
  },
  {
    id: 3,
    title: "محاضرة التشريح - الجهاز العصبي",
    course: "MED 101",
    uploadDate: "2024-01-18",
    status: "rejected" as const,
    views: 0,
    reason: "جودة الصورة غير واضحة",
  },
]

export default function NotebooksPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [notebooks, setNotebooks] = useState(mockNotebooks)
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "مقبول"
      case "pending":
        return "قيد المراجعة"
      case "rejected":
        return "مرفوض"
      default:
        return "غير معروف"
    }
  }

  const handleUpload = () => {
    setUploadStep(2)
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStep(3)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const resetUpload = () => {
    setUploadStep(1)
    setUploadProgress(0)
    setUploadModalOpen(false)
  }

  const handleViewNotebook = (notebook: any) => {
    setSelectedNotebook(notebook)
    setViewModalOpen(true)
  }

  const handleReUpload = (notebookId: number) => {
    setNotebooks((prev) =>
      prev.map((notebook) =>
        notebook.id === notebookId ? { ...notebook, status: "pending" as const, reason: undefined } : notebook,
      ),
    )
    alert("تم إعادة رفع المحاضرة للمراجعة")
  }

  const handleEditNotebook = (notebookId: number) => {
    const notebook = notebooks.find((n) => n.id === notebookId)
    if (notebook) {
      const newTitle = prompt("عنوان جديد للمحاضرة:", notebook.title)
      if (newTitle && newTitle.trim()) {
        setNotebooks((prev) => prev.map((n) => (n.id === notebookId ? { ...n, title: newTitle.trim() } : n)))
        alert("تم تحديث المحاضرة بنجاح")
      }
    }
  }

  const handleDeleteNotebook = (notebookId: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المحاضرة؟")) {
      setNotebooks((prev) => prev.filter((n) => n.id !== notebookId))
      alert("تم حذف المحاضرة بنجاح")
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      {/* Header */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="إدارة المحاضرات">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/dashboard">
                    <ArrowRight className="w-4 h-4 ml-1" />
                    العودة للوحة التحكم
                  </Link>
                </Button>
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                إدارة المحاضرات
              </h1>
              <p className="text-gray-600">ارفع وإدارة محاضراتك المشتركة</p>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="محاضراتي">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    قائمة المحاضرات
                  </h2>
                  <p className="text-gray-600">إجمالي المحاضرات: {notebooks.length}</p>
                </div>
                <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                      <Upload className="w-4 h-4 ml-1" />
                      رفع محاضرة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="retro-window">
                    <DialogHeader>
                      <DialogTitle style={{ color: "var(--ink)" }}>رفع محاضرة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {uploadStep === 1 && (
                        <>
                          <Input
                            placeholder="عنوان المحاضرة"
                            className="retro-window"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                          />
                          <Select>
                            <SelectTrigger
                              className="retro-window"
                              style={{ background: "white", border: "2px inset #c0c0c0" }}
                            >
                              <SelectValue placeholder="اختر المقرر" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="law-101">LAW 101 - مبادئ القانون</SelectItem>
                              <SelectItem value="cs-101">CS 101 - مقدمة في البرمجة</SelectItem>
                              <SelectItem value="med-101">MED 101 - علم التشريح</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            className="retro-window"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpload}
                              className="retro-button"
                              style={{ background: "var(--primary)", color: "white" }}
                            >
                              بدء الرفع
                            </Button>
                            <Button variant="outline" onClick={resetUpload} className="retro-button bg-transparent">
                              إلغاء
                            </Button>
                          </div>
                        </>
                      )}
                      {uploadStep === 2 && (
                        <div className="space-y-4">
                          <p className="text-center">جاري رفع المحاضرة...</p>
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-center text-sm text-gray-600">{uploadProgress}%</p>
                        </div>
                      )}
                      {uploadStep === 3 && (
                        <div className="space-y-4 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-green-600 text-2xl">✓</span>
                          </div>
                          <p className="font-semibold">تم رفع المحاضرة بنجاح!</p>
                          <p className="text-sm text-gray-600">ستتم مراجعة المحاضرة وإشعارك بالنتيجة</p>
                          <Button onClick={resetUpload}>إغلاق</Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Notebooks Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notebooks.map((notebook) => (
                  <div key={notebook.id} className="retro-window bg-white hover:shadow-lg transition-shadow">
                    <div className="retro-titlebar mb-4">
                      <h3 className="text-sm font-bold text-white">{notebook.course}</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                          {notebook.title}
                        </h4>
                        <p className="text-sm text-gray-600">تاريخ الرفع: {notebook.uploadDate}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`${getStatusColor(notebook.status)} retro-button`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {getStatusLabel(notebook.status)}
                        </Badge>
                        {notebook.status === "approved" && (
                          <span className="text-sm text-gray-500">
                            <FileText className="w-4 h-4 inline ml-1" />
                            {notebook.views} مشاهدة
                          </span>
                        )}
                      </div>
                      {notebook.status === "rejected" && notebook.reason && (
                        <div className="retro-window bg-red-50 p-3" style={{ border: "2px inset #ffcccc" }}>
                          <p className="text-sm text-red-700">سبب الرفض: {notebook.reason}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 retro-button bg-transparent"
                          onClick={() => handleViewNotebook(notebook)}
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          عرض
                        </Button>
                        {notebook.status === "rejected" && (
                          <Button
                            size="sm"
                            className="flex-1 retro-button"
                            style={{ background: "var(--accent)", color: "white" }}
                            onClick={() => handleReUpload(notebook.id)}
                          >
                            <RefreshCw className="w-4 h-4 ml-1" />
                            إعادة رفع
                          </Button>
                        )}
                        {notebook.status === "approved" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="retro-button bg-transparent"
                              onClick={() => handleEditNotebook(notebook.id)}
                            >
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="retro-button bg-transparent text-red-600"
                              onClick={() => handleDeleteNotebook(notebook.id)}
                            >
                              حذف
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* View Notebook Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="retro-window max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--ink)" }}>عرض المحاضرة</DialogTitle>
          </DialogHeader>
          {selectedNotebook && (
            <div className="space-y-4">
              <div className="retro-window bg-gray-50 p-4">
                <h3 className="font-semibold mb-2">{selectedNotebook.title}</h3>
                <p className="text-sm text-gray-600 mb-2">المقرر: {selectedNotebook.course}</p>
                <p className="text-sm text-gray-600 mb-2">تاريخ الرفع: {selectedNotebook.uploadDate}</p>
                <Badge className={getStatusColor(selectedNotebook.status)}>
                  {getStatusLabel(selectedNotebook.status)}
                </Badge>
              </div>
              <div className="retro-window bg-white p-4 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">معاينة المحاضرة ستظهر هنا</p>
              </div>
              <Button onClick={() => setViewModalOpen(false)}>إغلاق</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
