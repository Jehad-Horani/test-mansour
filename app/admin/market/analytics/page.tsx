"use client"

import { useState } from "react"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { ShoppingCart, TrendingUp, DollarSign, Package, Users, Star } from "lucide-react"

export default function MarketAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const marketStats = {
    totalSales: 45600,
    totalOrders: 1234,
    averageOrder: 37,
    totalProducts: 856,
    activeUsers: 2341,
    averageRating: 4.6,
  }

  const salesData = [
    { month: "يناير", sales: 12000, orders: 320 },
    { month: "فبراير", sales: 15000, orders: 405 },
    { month: "مارس", sales: 18500, orders: 500 },
    { month: "أبريل", sales: 16200, orders: 438 },
    { month: "مايو", sales: 21000, orders: 567 },
    { month: "يونيو", sales: 19800, orders: 535 },
  ]

  const topProducts = [
    { name: "كتاب القانون الدستوري", sales: 156, revenue: 4680 },
    { name: "مبادئ البرمجة", sales: 134, revenue: 4020 },
    { name: "أساسيات المحاسبة", sales: 128, revenue: 3840 },
    { name: "الإدارة الحديثة", sales: 98, revenue: 2940 },
    { name: "تشريح الإنسان", sales: 87, revenue: 2610 },
  ]

  return (
    <div className="p-6">
      <RetroWindow title="تحليلات السوق" className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" style={{ color: "var(--primary)" }} />
              <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                تحليلات السوق الأكاديمي
              </h1>
            </div>
            <div className="flex gap-2">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="retro-input">
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 3 أشهر</option>
                <option value="1y">آخر سنة</option>
              </select>
              <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                تصدير التقرير
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <DollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--primary)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.totalSales.toLocaleString()} د.أ
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                إجمالي المبيعات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <ShoppingCart className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.totalOrders.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                إجمالي الطلبات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: "#10b981" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.averageOrder} د.أ
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                متوسط الطلب
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Package className="w-6 h-6 mx-auto mb-2" style={{ color: "#f59e0b" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.totalProducts}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                إجمالي المنتجات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: "#8b5cf6" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                المستخدمون النشطون
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "#ef4444" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {marketStats.averageRating}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                متوسط التقييم
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="mb-6 p-4" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              المبيعات الشهرية
            </h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {salesData.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full min-h-[20px] mb-2"
                    style={{
                      height: `${(month.sales / Math.max(...salesData.map((d) => d.sales))) * 200}px`,
                      background: "var(--primary)",
                    }}
                  />
                  <div className="text-xs text-center" style={{ color: "var(--ink)", opacity: 0.7 }}>
                    {month.month}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                    {month.sales.toLocaleString()} د.أ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="p-4" style={{ background: "var(--bg)", border: "2px inset var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
              أفضل المنتجات مبيعاً
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3"
                  style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                      style={{ background: "var(--primary)" }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: "var(--ink)" }}>
                        {product.name}
                      </div>
                      <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                        {product.sales} مبيعة
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: "var(--primary)" }}>
                      {product.revenue.toLocaleString()} د.أ
                    </div>
                    <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                      إجمالي الإيرادات
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
