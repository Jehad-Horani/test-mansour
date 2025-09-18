import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-2xl mx-auto">
        <RetroWindow title="الكتاب غير موجود">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              عذراً، الكتاب غير موجود
            </h1>
            <p className="text-gray-600 mb-6">الكتاب الذي تبحث عنه غير متوفر أو تم حذفه من المتجر</p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/store">تصفح المتجر</Link>
              </Button>
              <Button asChild variant="outline" className="retro-button bg-transparent">
                <Link href="/">العودة للرئيسية</Link>
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
