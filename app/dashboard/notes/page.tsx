"use client"

import { useState } from "react"
import { RetroWindow } from "@/app/components/retro-window"
import { RetroToggle } from "@/app/components/retro-toggle"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "ملاحظات محاضرة القانون الدستوري",
    content: "النقاط المهمة من المحاضرة الأولى:\n- تعريف القانون الدستوري\n- مصادر القانون\n- الهرم القانوني",
    category: "قانون",
    tags: ["دستوري", "محاضرة", "مهم"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    user_id: "user1",
  },
  {
    id: "2",
    title: "أفكار مشروع التخرج",
    content: "أفكار أولية للمشروع:\n- تطبيق إدارة المهام\n- نظام إدارة المكتبة\n- منصة تعليمية",
    category: "مشاريع",
    tags: ["تخرج", "أفكار", "تطوير"],
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-14T15:30:00Z",
    user_id: "user1",
  },
]

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const categories = ["الكل", "قانون", "مشاريع", "دراسة", "شخصي", "عمل"]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "الكل" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert("يرجى ملء العنوان والمحتوى")
      return
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category || "عام",
      tags: newNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user?.id || "guest",
    }

    setNotes([note, ...notes])
    setNewNote({ title: "", content: "", category: "", tags: "" })
    alert("تم حفظ الملاحظة بنجاح!")
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      setNotes(notes.filter((note) => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    }
  }

  const exportNotes = () => {
    const notesText = notes
      .map(
        (note) =>
          `العنوان: ${note.title}\nالفئة: ${note.category}\nالتاريخ: ${new Date(note.created_at).toLocaleDateString("ar")}\n\n${note.content}\n\n---\n\n`,
      )
      .join("")

    const blob = new Blob([notesText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ملاحظاتي.txt"
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
          <span>الملاحظات - نظم وأرشف أفكارك ومعلوماتك</span>
        </div>
        <div className="p-4">
          <Link href="/dashboard" className="retro-button inline-block mb-4">
            ← العودة للوحة التحكم
          </Link>
        </div>
      </section>

      <div className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="lg:col-span-1 space-y-4">
              <RetroWindow title="ملاحظاتي" className="h-fit">
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="space-y-2">
                    <input
                      className="retro-input w-full"
                      placeholder="البحث في الملاحظات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      className="retro-input w-full"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Export Button */}
                  <button onClick={exportNotes} className="retro-button w-full">
                    تصدير الملاحظات
                  </button>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 border-2 cursor-pointer transition-colors ${
                          selectedNote?.id === note.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--ink)" }}>
                          {note.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{note.content.substring(0, 80)}...</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded">{note.category}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(note.created_at).toLocaleDateString("ar")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RetroWindow>
            </div>

            {/* Note Viewer/Editor */}
            <div className="lg:col-span-2 space-y-4">
              {selectedNote ? (
                <RetroWindow title={selectedNote.title} className="h-fit">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 rounded">{selectedNote.category}</span>
                        {selectedNote.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="retro-button text-xs">تعديل</button>
                        <button
                          className="retro-button text-xs"
                          style={{ background: "#ff6b6b", color: "white" }}
                          onClick={() => handleDeleteNote(selectedNote.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded min-h-64">
                      <pre className="whitespace-pre-wrap font-sans text-sm" style={{ color: "var(--ink)" }}>
                        {selectedNote.content}
                      </pre>
                    </div>

                    <div className="text-xs text-gray-500">
                      تم الإنشاء: {new Date(selectedNote.created_at).toLocaleString("ar")}
                      {selectedNote.updated_at !== selectedNote.created_at && (
                        <span className="block">
                          آخر تحديث: {new Date(selectedNote.updated_at).toLocaleString("ar")}
                        </span>
                      )}
                    </div>
                  </div>
                </RetroWindow>
              ) : (
                <RetroWindow title="إنشاء ملاحظة جديدة" className="h-fit">
                  <div className="space-y-4">
                    <input
                      className="retro-input w-full"
                      placeholder="عنوان الملاحظة"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <select
                        className="retro-input w-full"
                        value={newNote.category}
                        onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                      >
                        <option value="">اختر الفئة</option>
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>

                      <input
                        className="retro-input w-full"
                        placeholder="العلامات (مفصولة بفواصل)"
                        value={newNote.tags}
                        onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                      />
                    </div>

                    <textarea
                      className="retro-input w-full h-64 resize-none"
                      placeholder="محتوى الملاحظة..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    />

                    <button
                      onClick={handleSaveNote}
                      className="retro-button w-full"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      حفظ الملاحظة
                    </button>
                  </div>
                </RetroWindow>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
