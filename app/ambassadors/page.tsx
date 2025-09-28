"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "../components/retro-window"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AmbassadorsPage() {
  const supabase = createClient()

  const [ambassadors, setAmbassadors] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")
  const [universityFilter, setUniversityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // fetch ambassadors
  useEffect(() => {
    const fetchAmbassadors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "ambassador")

      if (error) {
        console.error("Error fetching ambassadors:", error.message)
      } else {
        setAmbassadors(data || [])
      }
    }

    fetchAmbassadors()
  }, [supabase])

 // filters
const filteredAmbassadors = ambassadors.filter((amb) => {
  const name = amb.name?.toLowerCase() || ""
  const major = amb.major?.toLowerCase() || ""
  const university = amb.university?.toLowerCase() || ""

  const matchesSearch =
    name.includes(search.toLowerCase()) ||
    major.includes(search.toLowerCase()) ||
    university.includes(search.toLowerCase())

  const matchesMajor =
    majorFilter === "all" || major === majorFilter.toLowerCase()

  const matchesUniversity =
    universityFilter === "all" ||
    university === universityFilter.toLowerCase()

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "available" && amb.available === true) ||
    (statusFilter === "busy" && amb.available === false)

  return matchesSearch && matchesMajor && matchesUniversity && matchesStatus
})


  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>السفراء الأكاديميون</span>
          </div>
        </div>

        <RetroWindow title="السفراء الأكاديميون">
          <div className="space-y-6">
            {/* Filters */}
            <div className="retro-window bg-gray-50">
              <div className="p-4">
                <div className="grid md:grid-cols-1 gap-4">
                  {/* البحث */}
                  <label className="font-bold text-3xl">ابحث عن اسم الجامعة\التخصص او اسم السفير :</label>
                  <Input
                    placeholder="ابحث ..."
                    className="retro-button"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

              

                </div>
              </div>
            </div>


            {/* Ambassadors list */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAmbassadors.map((amb) => (
                <div key={amb.id} className="retro-window bg-white">
                  <div className="p-6">
                    {/* Ambassador Header */}
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-xl mb-2 text-gray-800">
                        السفير : {amb.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-blue-600">
                          التخصص : {amb.major}
                        </p>
                        <p className="text-sm text-gray-600">
                          الجامعة : {amb.university}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="retro-button w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Link
                          href={`https://wa.me/${amb.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 ml-2" />
                          بدء محادثة
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAmbassadors.length === 0 && (
                <p className="text-center col-span-full text-gray-500">
                  لا يوجد سفراء حسب الفلاتر المختارة
                </p>
              )}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
