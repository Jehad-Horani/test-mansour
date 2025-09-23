"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  name: string
  email: string
  major: "law" | "it" | "medical" | "business"
  university: string
  year: string
  role: "student" | "admin"
  avatar?: string
  avatar_url?: string
  bio?: string
  phone?: string
  subscription_tier?: "free" | "standard" | "premium"
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

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  session: Session | null
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  isAdmin: () => boolean
  hasPermission: (permission: string) => boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile from database with fallback
  const fetchUserProfile = async (userId: string, authUser?: any): Promise<User | null> => {
    try {
      // First try to fetch from database
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.warn("Database profile fetch failed:", error.message)
        
        // If it's an RLS policy error, create a temporary profile from auth metadata
        if (error.code === '42P17' || error.message.includes('infinite recursion') || error.message.includes('policy')) {
          console.log("Creating temporary profile from auth metadata due to policy issue")
          
          if (authUser) {
            return {
              id: authUser.id,
              name: authUser.user_metadata?.name || authUser.email || 'مستخدم',
              email: authUser.email || '',
              major: authUser.user_metadata?.major || 'law',
              university: authUser.user_metadata?.university || 'جامعة افتراضية',
              year: authUser.user_metadata?.year || '2024',
              role: authUser.user_metadata?.role || 'student',
              avatar_url: authUser.user_metadata?.avatar_url,
              bio: authUser.user_metadata?.bio,
              phone: authUser.user_metadata?.phone,
              subscription_tier: authUser.user_metadata?.subscription_tier || 'free',
              stats: {
                uploadsCount: 0,
                viewsCount: 0,
                helpfulVotes: 0,
                coursesEnrolled: 0,
                booksOwned: 0,
                consultations: 0,
                communityPoints: 0,
              },
              permissions: [],
            }
          }
        }
        
        return null
      }

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email || authUser?.email,
        major: profile.major,
        university: profile.university,
        year: profile.year,
        role: profile.role,
        avatar: profile.avatar_url,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        phone: profile.phone,
        subscription_tier: profile.subscription_tier,
        stats: profile.stats,
        permissions: profile.permissions || [],
      }
    } catch (err) {
      console.error("Error loading user profile:", err)
      return null
    }
  }

  // Function to refresh user data
  const refreshUser = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    
    if (currentSession?.user) {
      const profile = await fetchUserProfile(currentSession.user.id)
      setUser(profile)
      setSession(currentSession)
    } else {
      setUser(null)
      setSession(null)
    }
    setLoading(false)
  }

  // Initialize and listen for auth changes
  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      
      if (!mounted) return

      console.log("Initial session:", !!initialSession?.user)

      if (initialSession?.user) {
        setSession(initialSession)
        const profile = await fetchUserProfile(initialSession.user.id)
        setUser(profile)
        console.log("Initial profile loaded:", !!profile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log("Auth state changed:", event, !!session?.user)

        if (session?.user) {
          setSession(session)
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
          console.log("Profile loaded after auth change:", !!profile)
        } else {
          setUser(null)
          setSession(null)
          console.log("User logged out")
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setLoading(true)
    try {
      console.log("Logging out...")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
        throw error
      }
      // State will be updated by the auth state change listener
      console.log("Logout successful")
    } catch (error) {
      console.error("Logout failed:", error)
      // Force state reset even if logout fails
      setUser(null)
      setSession(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating user:", error)
        throw error
      }

      // Update local state
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  }

  const isAdmin = (): boolean => {
    return user?.role === "admin" || false
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions?.includes(permission) || 
           user.permissions?.includes("full_access") || 
           isAdmin() || false
  }

  const value: UserContextType = {
    user,
    isLoggedIn: !!user,
    loading,
    session,
    logout,
    updateUser,
    isAdmin,
    hasPermission,
    refreshUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
