"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Reply, Archive, Trash2, Flag, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminMessageDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [replyText, setReplyText] = useState("")

  const message = {
    id: params.id,
    subject: "استفسار حول نظام التسجيل",
    content:
      "السلام عليكم، أواجه مشكلة في تسجيل الدخول إلى النظام. عند إدخال البيانات الصحيحة، يظهر لي خطأ غير معروف. أرجو المساعدة في حل هذه المشكلة.",
    sender: {
      name: "أحمد محمد",
      email: "ahmed@example.com",
      id: "user_123",
    },
    timestamp: "2024-01-15 14:30:00",
    status: "unread",
    priority: "medium",
    category: "technical_support",
  }

  const replies = [
    {
      id: 1,
      content: "شكراً لتواصلك معنا. سنقوم بمراجعة المشكلة والرد عليك قريباً.",
      sender: "فريق الدعم",
      timestamp: "2024-01-15 15:00:00",
      isAdmin: true,
    },
  ]

  const handleReply = () => {
    if (replyText.trim()) {
      // Send reply logic here
      setReplyText("")
    }
  }

  const handleArchive = () => {
    // Archive message logic here
    router.push("/admin/messages")
  }

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      // Delete message logic here
      router.push("/admin/messages")
    }
  }

  return (
    <div className="p-6">
      <RetroWindow title={`الرسالة #${params.id}`} className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.back()}
                className="retro-button"
                style={{ background: "var(--panel)", color: "var(--ink)" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                  تفاصيل الرسالة
                </h1>
                <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                  {message.subject}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleArchive}
                className="retro-button"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <Archive className="w-4 h-4 ml-2" />
                أرشفة
              </Button>
              <Button onClick={handleDelete} className="retro-button" style={{ background: "#dc2626", color: "white" }}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>

          {/* Message Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" style={{ color: "var(--primary)" }} />
                <span className="font-medium" style={{ color: "var(--ink)" }}>
                  المرسل
                </span>
              </div>
              <div style={{ color: "var(--ink)" }}>{message.sender.name}</div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                {message.sender.email}
              </div>
            </div>

            <div className="p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="font-medium mb-2" style={{ color: "var(--ink)" }}>
                الحالة
              </div>
              <div
                className="inline-block px-2 py-1 rounded text-sm"
                style={{
                  background: message.status === "unread" ? "#ef4444" : "var(--accent)",
                  color: "white",
                }}
              >
                {message.status === "unread" ? "غير مقروءة" : "مقروءة"}
              </div>
            </div>

            <div className="p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="font-medium mb-2" style={{ color: "var(--ink)" }}>
                الأولوية
              </div>
              <div
                className="inline-block px-2 py-1 rounded text-sm"
                style={{
                  background:
                    message.priority === "high"
                      ? "#ef4444"
                      : message.priority === "medium"
                        ? "#f59e0b"
                        : "var(--accent)",
                  color: "white",
                }}
              >
                {message.priority === "high" ? "عالية" : message.priority === "medium" ? "متوسطة" : "منخفضة"}
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div className="mb-6 p-4" style={{ background: "var(--bg)", border: "2px inset var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
                الرسالة الأصلية
              </h3>
              <span className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                {message.timestamp}
              </span>
            </div>
            <div className="p-4" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              <h4 className="font-medium mb-2" style={{ color: "var(--ink)" }}>
                {message.subject}
              </h4>
              <p style={{ color: "var(--ink)", opacity: 0.8 }}>{message.content}</p>
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                الردود ({replies.length})
              </h3>
              <div className="space-y-3">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4"
                    style={{
                      background: reply.isAdmin ? "var(--accent)" : "var(--panel)",
                      border: "1px solid var(--border)",
                      color: reply.isAdmin ? "white" : "var(--ink)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{reply.sender}</span>
                      <span className="text-sm opacity-70">{reply.timestamp}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Form */}
          <div className="p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              إضافة رد
            </h3>
            <div className="space-y-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="retro-input w-full h-32"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReply}
                  className="retro-button"
                  style={{ background: "var(--primary)", color: "white" }}
                  disabled={!replyText.trim()}
                >
                  <Reply className="w-4 h-4 ml-2" />
                  إرسال الرد
                </Button>
                <Button className="retro-button" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                  <Flag className="w-4 h-4 ml-2" />
                  وضع علامة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
