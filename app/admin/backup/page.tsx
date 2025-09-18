"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/components/retro-window"

interface BackupInfo {
  id: string
  name: string
  type: "full" | "incremental" | "database" | "files"
  size: string
  created_at: string
  status: "completed" | "in_progress" | "failed" | "scheduled"
  location: string
  description: string
}

export default function AdminBackupPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push("/auth/login")
      return
    }
    fetchBackups()
  }, [isLoggedIn, isAdmin, router])

  const fetchBackups = async () => {
    try {
      setLoading(true)

      // Mock backup data - in real implementation, this would come from database
      const mockBackups: BackupInfo[] = [
        {
          id: "backup-1",
          name: "نسخة احتياطية كاملة - يناير 2024",
          type: "full",
          size: "2.5 GB",
          created_at: new Date().toISOString(),
          status: "completed",
          location: "/backups/full_backup_2024_01_15.tar.gz",
          description: "نسخة احتياطية كاملة تشمل قاعدة البيانات والملفات",
        },
        {
          id: "backup-2",
          name: "نسخة احتياطية تدريجية",
          type: "incremental",
          size: "450 MB",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: "completed",
          location: "/backups/incremental_backup_2024_01_14.tar.gz",
          description: "نسخة احتياطية للتغييرات منذ آخر نسخة كاملة",
        },
        {
          id: "backup-3",
          name: "نسخة احتياطية لقاعدة البيانات",
          type: "database",
          size: "1.2 GB",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
          location: "/backups/database_backup_2024_01_13.sql.gz",
          description: "نسخة احتياطية لقاعدة البيانات فقط",
        },
      ]

      setBackups(mockBackups)
    } catch (error) {
      console.error("Error fetching backups:", error)
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async (type: "full" | "incremental" | "database" | "files") => {
    try {
      setBackupInProgress(true)

      // Mock backup creation - in real implementation, this would trigger actual backup
      console.log(`[v0] Creating ${type} backup...`)

      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Add new backup to list
      const newBackup: BackupInfo = {
        id: `backup-${Date.now()}`,
        name: `نسخة احتياطية ${type === "full" ? "كاملة" : type === "incremental" ? "تدريجية" : type === "database" ? "لقاعدة البيانات" : "للملفات"} - ${new Date().toLocaleDateString("ar-SA")}`,
        type,
        size: "جاري الحساب...",
        created_at: new Date().toISOString(),
        status: "completed",
        location: `/backups/${type}_backup_${new Date().toISOString().split("T")[0]}.tar.gz`,
        description: `نسخة احتياطية ${type === "full" ? "كاملة تشمل جميع البيانات" : type === "incremental" ? "للتغييرات الأخيرة" : type === "database" ? "لقاعدة البيانات فقط" : "للملفات فقط"}`,
      }

      setBackups((prev) => [newBackup, ...prev])
    } catch (error) {
      console.error("Error creating backup:", error)
    } finally {
      setBackupInProgress(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتملة"
      case "in_progress":
        return "قيد التنفيذ"
      case "failed":
        return "فشلت"
      case "scheduled":
        return "مجدولة"
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "full":
        return "💾"
      case "incremental":
        return "📈"
      case "database":
        return "🗄️"
      case "files":
        return "📁"
      default:
        return "💾"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "full":
        return "كاملة"
      case "incremental":
        return "تدريجية"
      case "database":
        return "قاعدة البيانات"
      case "files":
        return "الملفات"
      default:
        return type
    }
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="إدارة النسخ الاحتياطية">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">إدارة النسخ الاحتياطية</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => createBackup("full")}
                    disabled={backupInProgress}
                    className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600 disabled:opacity-50"
                  >
                    {backupInProgress ? "جاري الإنشاء..." : "نسخة كاملة"}
                  </button>
                  <button
                    onClick={() => createBackup("incremental")}
                    disabled={backupInProgress}
                    className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
                  >
                    نسخة تدريجية
                  </button>
                  <button
                    onClick={() => createBackup("database")}
                    disabled={backupInProgress}
                    className="retro-button bg-purple-500 text-white px-4 py-2 hover:bg-purple-600 disabled:opacity-50"
                  >
                    قاعدة البيانات
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {backups.filter((b) => b.status === "completed").length}
                  </div>
                  <div className="text-sm text-green-600">نسخ مكتملة</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">
                    {backups
                      .reduce((total, backup) => {
                        const size = Number.parseFloat(backup.size.replace(/[^\d.]/g, ""))
                        return total + (isNaN(size) ? 0 : size)
                      }, 0)
                      .toFixed(1)}{" "}
                    GB
                  </div>
                  <div className="text-sm text-blue-600">إجمالي الحجم</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-3 text-center">
                  <div className="text-lg font-bold text-purple-800">
                    {backups.filter((b) => b.created_at > new Date(Date.now() - 604800000).toISOString()).length}
                  </div>
                  <div className="text-sm text-purple-600">هذا الأسبوع</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-3 text-center">
                  <div className="text-lg font-bold text-orange-800">
                    {backups.filter((b) => b.status === "failed").length}
                  </div>
                  <div className="text-sm text-orange-600">فشلت</div>
                </div>
              </div>

              {/* Backup Schedule Settings */}
              <div className="bg-gray-50 border border-gray-300 p-4 mb-4">
                <h3 className="font-semibold text-black mb-3">إعدادات الجدولة التلقائية</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">النسخ الكاملة</label>
                    <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                      <option value="weekly">أسبوعياً</option>
                      <option value="monthly">شهرياً</option>
                      <option value="disabled">معطل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">النسخ التدريجية</label>
                    <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                      <option value="daily">يومياً</option>
                      <option value="weekly">أسبوعياً</option>
                      <option value="disabled">معطل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">الاحتفاظ بالنسخ</label>
                    <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm">
                      <option value="30">30 يوم</option>
                      <option value="60">60 يوم</option>
                      <option value="90">90 يوم</option>
                    </select>
                  </div>
                </div>
                <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 mt-3">
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Backups List */}
        <RetroWindow title="قائمة النسخ الاحتياطية">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">جاري التحميل...</div>
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">لا توجد نسخ احتياطية</div>
              </div>
            ) : (
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="bg-white border border-gray-400 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{getTypeIcon(backup.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{backup.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(backup.status)}`}>
                              {getStatusText(backup.status)}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {getTypeText(backup.type)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{backup.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div>
                              <strong>الحجم:</strong> {backup.size}
                            </div>
                            <div>
                              <strong>تاريخ الإنشاء:</strong> {new Date(backup.created_at).toLocaleDateString("ar-SA")}
                            </div>
                            <div>
                              <strong>الموقع:</strong> {backup.location}
                            </div>
                            <div>
                              <strong>النوع:</strong> {getTypeText(backup.type)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                          تحميل
                        </button>
                        <button className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600">
                          استعادة
                        </button>
                        <button className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600">
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
