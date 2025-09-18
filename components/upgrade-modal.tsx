"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useTier, type UserTier } from "@/hooks/use-tier"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { tier, upgradeTier, getTierLabel, getTierPrice } = useTier()

  const tiers: { type: UserTier; features: string[] }[] = [
    {
      type: "free",
      features: ["رفع 5 ملفات شهرياً", "عرض محدود للمحاضرات", "دعم المجتمع"],
    },
    {
      type: "standard",
      features: ["رفع غير محدود", "وصول كامل للمحاضرات", "جدولة الامتحانات", "تصدير ICS", "دعم أولوية"],
    },
    {
      type: "premium",
      features: [
        "جميع مميزات القياسي",
        "استشارات مع السفراء",
        "جلسات دراسية جماعية",
        "وصول للسوق الأكاديمي",
        "دعم مميز",
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">اختر خطة الاشتراك المناسبة</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-6 py-6">
          {tiers.map((tierOption) => (
            <div
              key={tierOption.type}
              className={`border rounded-lg p-6 relative ${
                tierOption.type === "standard" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              {tierOption.type === "standard" && (
                <Badge className="absolute -top-3 right-4 bg-blue-500">الأكثر شعبية</Badge>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{getTierLabel(tierOption.type)}</h3>
                <div className="text-3xl font-bold mb-2">{getTierPrice(tierOption.type)}</div>
                <p className="text-gray-600">شهرياً</p>
              </div>
              <ul className="space-y-3 mb-6">
                {tierOption.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => upgradeTier(tierOption.type)}
                disabled={tier === tierOption.type}
                className={`w-full ${
                  tierOption.type === "standard"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : tierOption.type === "premium"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-600 hover:bg-gray-700"
                }`}
                variant={tier === tierOption.type ? "outline" : "default"}
              >
                {tier === tierOption.type ? "الخطة الحالية" : "اختر هذه الخطة"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
