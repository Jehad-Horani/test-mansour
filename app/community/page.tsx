"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RetroWindow } from "@/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Eye, Plus, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState("latest")

  const questions = [
    {
      id: 1,
      title: "ما هي أفضل طريقة لمراجعة القانون الدستوري؟",
      content: "أحتاج نصائح لمراجعة مادة القانون الدستوري قبل الامتحان النهائي...",
      author: "محمد أحمد",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "قانون",
      tags: ["قانون دستوري", "مراجعة", "امتحانات"],
      answers: 5,
      likes: 12,
      views: 89,
      createdAt: "2024-01-20",
      isAnswered: true,
      isPinned: false,
    },
    {
      id: 2,
      title: "كيف أتعلم React.js بشكل فعال؟",
      content: "أريد تعلم React.js ولكن لا أعرف من أين أبدأ. ما هي أفضل المصادر؟",
      author: "فاطمة علي",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "تقنية",
      tags: ["React", "JavaScript", "تطوير ويب"],
      answers: 12,
      likes: 25,
      views: 156,
      createdAt: "2024-01-19",
      isAnswered: true,
      isPinned: true,
    },
    {
      id: 3,
      title: "ما هي أهم المراجع في علم التشريح؟",
      content: "أبحث عن أفضل الكتب والمراجع لدراسة علم التشريح البشري...",
      author: "سارة محمد",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "طب",
      tags: ["تشريح", "طب", "مراجع"],
      answers: 8,
      likes: 18,
      views: 134,
      createdAt: "2024-01-18",
      isAnswered: true,
      isPinned: false,
    },
    {
      id: 4,
      title: "نصائح للتفوق في مادة المحاسبة المالية",
      content: "أواجه صعوبة في فهم بعض مفاهيم المحاسبة المالية، أحتاج نصائح عملية...",
      author: "أحمد سالم",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "إدارة",
      tags: ["محاسبة", "مالية", "نصائح"],
      answers: 15,
      likes: 31,
      views: 203,
      createdAt: "2024-01-17",
      isAnswered: true,
      isPinned: false,
    },
    {
      id: 5,
      title: "أفضل استراتيجيات المذاكرة قبل الامتحانات",
      content: "ما هي أفضل الطرق للمذاكرة والمراجعة قبل فترة الامتحانات؟",
      author: "نور الدين",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "عام",
      tags: ["مذاكرة", "امتحانات", "استراتيجيات"],
      answers: 23,
      likes: 45,
      views: 312,
      createdAt: "2024-01-16",
      isAnswered: true,
      isPinned: false,
    },
    {
      id: 6,
      title: "كيفية كتابة بحث قانوني متميز؟",
      content: "أحتاج إرشادات لكتابة بحث قانوني أكاديمي بمعايير عالية...",
      author: "ليلى أحمد",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      category: "قانون",
      tags: ["بحث قانوني", "كتابة أكاديمية", "منهجية"],
      answers: 7,
      likes: 14,
      views: 98,
      createdAt: "2024-01-15",
      isAnswered: false,
      isPinned: false,
    },
  ]

  const categories = ["الكل", "قانون", "تقنية", "طب", "إدارة", "عام"]

  const filteredQuestions = questions.sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "answers":
        return b.answers - a.answers
      case "views":
        return b.views - a.views
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>المجتمع الأكاديمي</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <RetroWindow title="المجتمع الأكاديمي - الأسئلة والأجوبة">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">مجتمع الطلاب</h1>
                  <p className="text-gray-600">شارك أسئلتك واحصل على إجابات من زملائك والخبراء</p>
                </div>
                <Button asChild className="retro-button" style={{ background: "var(--accent)", color: "white" }}>
                  <Link href="/community/ask">
                    <Plus className="w-4 h-4 ml-2" />
                    اطرح سؤالاً
                  </Link>
                </Button>
              </div>
            </RetroWindow>

            {/* Filters and Search */}
            <RetroWindow title="البحث والتصفية">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="ابحث في الأسئلة..." className="retro-button pr-10" />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="retro-button w-full md:w-48">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">الأحدث</SelectItem>
                    <SelectItem value="popular">الأكثر إعجاباً</SelectItem>
                    <SelectItem value="answers">الأكثر إجابات</SelectItem>
                    <SelectItem value="views">الأكثر مشاهدة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </RetroWindow>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="retro-window bg-white">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={question.authorAvatar || "/placeholder.svg"}
                        alt={question.author}
                        className="w-12 h-12 rounded-full bg-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {question.isPinned && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                مثبت
                              </Badge>
                            )}
                            <Badge variant="outline">{question.category}</Badge>
                            {question.isAnswered && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                تم الإجابة
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(question.createdAt).toLocaleDateString("ar-SA")}
                          </span>
                        </div>

                        <Link href={`/community/${question.id}`} className="block hover:text-blue-600">
                          <h3 className="text-lg font-bold mb-2">{question.title}</h3>
                        </Link>

                        <p className="text-gray-600 mb-3 line-clamp-2">{question.content}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{question.answers} إجابة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{question.likes} إعجاب</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{question.views} مشاهدة</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">بواسطة {question.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <Button variant="outline" className="retro-button bg-transparent">
                السابق
              </Button>
              <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                1
              </Button>
              <Button variant="outline" className="retro-button bg-transparent">
                2
              </Button>
              <Button variant="outline" className="retro-button bg-transparent">
                3
              </Button>
              <Button variant="outline" className="retro-button bg-transparent">
                التالي
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <RetroWindow title="التصنيفات">
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="retro-button w-full justify-start bg-transparent hover:bg-gray-100"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </RetroWindow>

            {/* Popular Tags */}
            <RetroWindow title="الوسوم الشائعة">
              <div className="flex flex-wrap gap-2">
                {["قانون", "برمجة", "طب", "محاسبة", "امتحانات", "مراجعة", "نصائح", "بحث"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </RetroWindow>

            {/* Community Stats */}
            <RetroWindow title="إحصائيات المجتمع">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>إجمالي الأسئلة:</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>الإجابات:</span>
                  <span className="font-bold">3,891</span>
                </div>
                <div className="flex justify-between">
                  <span>الأعضاء النشطون:</span>
                  <span className="font-bold">892</span>
                </div>
                <div className="flex justify-between">
                  <span>أسئلة اليوم:</span>
                  <span className="font-bold">23</span>
                </div>
              </div>
            </RetroWindow>

            {/* Top Contributors */}
            <RetroWindow title="أفضل المساهمين">
              <div className="space-y-3">
                {[
                  { name: "د. أحمد محمد", points: 1250, avatar: "/placeholder.svg?height=32&width=32" },
                  { name: "م. فاطمة علي", points: 980, avatar: "/placeholder.svg?height=32&width=32" },
                  { name: "د. سارة أحمد", points: 875, avatar: "/placeholder.svg?height=32&width=32" },
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={contributor.avatar || "/placeholder.svg"}
                      alt={contributor.name}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contributor.name}</p>
                      <p className="text-xs text-gray-600">{contributor.points} نقطة</p>
                    </div>
                  </div>
                ))}
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}
