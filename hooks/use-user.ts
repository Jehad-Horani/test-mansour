"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface User {
  id: string
  name: string
  email: string
  major: "law" | "it" | "medical" | "business"
  university: string
  year: string
  role: "student" | "admin"
  avatar?: string
  bio?: string
  phone?: string
  stats?: {
    uploadsCount?: number
    viewsCount?: number
    helpfulVotes?: number
    coursesEnrolled?: number
    booksOwned?: number
    consultations?: number
    communityPoints?: number
  }
  permissions?: string[]
}

export function useUser() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (!currentUser) {
          setUser(null)
          setLoading(false)
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          setUser(null)
        } else {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            major: profile.major,
            university: profile.university,
            year: profile.year,
            role: profile.role,
            avatar: profile.avatar_url,
            bio: profile.bio,
            phone: profile.phone,
            stats: profile.stats,
            permissions: profile.permissions || [],
          })
        }
      } catch (err) {
        console.error("Error loading user:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      return
    }

    setUser(data)
  }

  const isAdmin = (): boolean => {
    return user?.role === "admin" || false
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions?.includes(permission) || user.permissions?.includes("full_access") || false
  }

  return {
    user,
    loading,
    isLoggedIn: !!user,
    logout,
    updateUser,
    isAdmin,
    hasPermission,
  }
}
