"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { ArrowRight, Send, Phone, Video, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ambassador",
      content: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      sender: "user",
      content: "مرحباً، أريد استشارة حول مواد القانون التجاري",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: 3,
      sender: "ambassador",
      content: "بالطبع! سأكون سعيداً لمساعدتك. ما هي المواضيع المحددة التي تريد التركيز عليها؟",
      timestamp: new Date(Date.now() - 180000),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const ambassador = {
    id: params.id,
    name: "د. أحمد محمد السالم",
    specialty: "القانون التجاري",
    university: "الجامعة الأردنية",
    image: "/placeholder.svg?height=50&width=50&text=أحمد+السالم",
    online: true,
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user" as const,
        content: message,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // Simulate ambassador response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          sender: "ambassador" as const,
          content: "شكراً لك على سؤالك. سأجيب عليه بالتفصيل...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/ambassadors" className="hover:text-gray-900">
              السفراء
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>محادثة مع {ambassador.name}</span>
          </div>
        </div>

        <RetroWindow title={`محادثة مع ${ambassador.name}`}>
          <div className="flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-gray-300 bg-gray-50">
              <div className="flex items-center gap-3">
                <img
                  src={ambassador.image || "/placeholder.svg"}
                  alt={ambassador.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{ambassador.name}</h3>
                  <p className="text-sm text-gray-600">{ambassador.specialty}</p>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${ambassador.online ? "bg-green-400" : "bg-gray-400"}`} />
                    <span className="text-xs text-gray-500">{ambassador.online ? "متصل الآن" : "غير متصل"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="retro-button bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" className="retro-button bg-green-600 hover:bg-green-700 text-white">
                  <Video className="w-4 h-4" />
                </Button>
                <Button size="sm" className="retro-button">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {msg.timestamp.toLocaleTimeString("ar-JO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t-2 border-gray-300 bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="retro-button flex-1"
                />
                <Button onClick={sendMessage} className="retro-button bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
