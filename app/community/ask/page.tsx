"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RetroWindow } from "@/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, X, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AskQuestionPage() {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const suggestedTags = ["قانون", "برمجة", "طب", "محاسبة", "امتحانات", "مراجعة", "نصائح", "بحث"]

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
            <Link href="/community" className="hover:text-gray-900">
              المجتمع
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>اطرح سؤالاً</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Question Form */}
          <div className="lg:col-span-2 space-y-6">
            <RetroWindow title="اطرح سؤالك الجديد">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">
                    عنوان السؤال *
                  </Label>
                  <Input
                    id="title"
                    placeholder="مثال: ما هي أفضل طريقة لمراجعة القانون الدستوري؟"
                    className="retro-button mt-2"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">اكتب عنواناً واضحاً ومحدداً لسؤالك</p>
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-semibold">
                    التصنيف *
                  </Label>
                  <Select>
                    <SelectTrigger className="retro-button mt-2">
                      <SelectValue placeholder="اختر التصنيف المناسب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="law">قانون</SelectItem>
                      <SelectItem value="tech">تقنية</SelectItem>
                      <SelectItem value="medical">طب</SelectItem>
                      <SelectItem value="business">إدارة أعمال</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content" className="text-base font-semibold">
                    تفاصيل السؤال *
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="اشرح سؤالك بالتفصيل. كلما كانت التفاصيل أكثر، كانت الإجابات أفضل..."
                    className="retro-button mt-2 min-h-[150px]"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">اكتب على الأقل 50 حرفاً لوصف سؤالك بوضوح</p>
                </div>

                <div>
                  <Label className="text-base font-semibold">الوسوم (اختياري)</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="أضف وسماً..."
                        className="retro-button flex-1"
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        className="retro-button"
                        style={{ background: "var(--primary)", color: "white" }}
                        disabled={!newTag.trim() || tags.length >= 5}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            #{tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-600 mb-2">وسوم مقترحة:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter((tag) => !tags.includes(tag))
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                if (tags.length < 5) {
                                  setTags([...tags, tag])
                                }
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    يمكنك إضافة حتى 5 وسوم لمساعدة الآخرين في العثور على سؤالك
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button className="retro-button flex-1" style={{ background: "var(--accent)", color: "white" }}>
                    نشر السؤال
                  </Button>
                  <Button asChild variant="outline" className="retro-button bg-transparent">
                    <Link href="/community">إلغاء</Link>
                  </Button>
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <RetroWindow title="إرشادات طرح الأسئلة">
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">اكتب عنواناً واضحاً</h4>
                    <p className="text-gray-600">استخدم عنواناً محدداً يلخص سؤالك</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">أضف التفاصيل</h4>
                    <p className="text-gray-600">اشرح المشكلة بالتفصيل وما جربته من حلول</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">استخدم الوسوم</h4>
                    <p className="text-gray-600">أضف وسوماً مناسبة لمساعدة الآخرين في العثور على سؤالك</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">كن محترماً</h4>
                    <p className="text-gray-600">استخدم لغة مهذبة واحترم آراء الآخرين</p>
                  </div>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow title="أسئلة مشابهة">
              <div className="space-y-3">
                {["كيفية مراجعة القانون المدني؟", "أفضل طرق المذاكرة للامتحانات", "نصائح لكتابة البحث القانوني"].map(
                  (question, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <Link href="/community" className="text-sm text-blue-600 hover:underline">
                        {question}
                      </Link>
                    </div>
                  ),
                )}
              </div>
            </RetroWindow>

            <RetroWindow title="إحصائياتك">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>أسئلتك:</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>إجاباتك:</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>نقاط السمعة:</span>
                  <span className="font-bold">245</span>
                </div>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}
