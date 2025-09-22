"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function useUserProfile() {
  const supabase = createClientComponentClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) console.error("خطأ في جلب البيانات:", error)
      else setProfile(data)

      setLoading(false)
    }

    fetchProfile()
  }, [])

  return { profile, loading }
}
