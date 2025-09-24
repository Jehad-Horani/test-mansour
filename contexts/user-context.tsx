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
  error: string | null
  clearError: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Function to fetch user profile from database with fallback
  const fetchUserProfile = async (userId: string, authUser?: any, retryCount = 0): Promise<User | null> => {
    try {
      console.log(`[AUTH] Fetching profile for user: ${userId} (attempt ${retryCount + 1})`)
      
      // First try to fetch from database
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.warn(`[AUTH] Database profile fetch failed: ${error.message}`)
        
        // If profile not found and this is first attempt, try to create it
        if (error.code === 'PGRST116' && retryCount === 0) {
          console.log('[AUTH] Profile not found, attempting to create...')
          try {
            await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: authUser.id,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'مستخدم جديد',
                phone: authUser.user_metadata?.phone,
                university: authUser.user_metadata?.university,
                major: authUser.user_metadata?.major,
                year: authUser.user_metadata?.year
              })
            })
            
            // Retry fetching the profile
            return await fetchUserProfile(userId, authUser, retryCount + 1)
          } catch (createError) {
            console.error('[AUTH] Failed to create profile:', createError)
          }
        }
        
        // Create fallback profile from auth metadata
        if (authUser) {
          console.log('[AUTH] Creating fallback profile from auth metadata')
          return {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'مستخدم',
            email: authUser.email || '',
            major: (authUser.user_metadata?.major as any) || 'law',
            university: Array.isArray(authUser.user_metadata?.university) 
              ? authUser.user_metadata.university[0] 
              : authUser.user_metadata?.university || 'جامعة افتراضية',
            year: authUser.user_metadata?.year || '1',
            role: (authUser.user_metadata?.role as any) || 'student',
            avatar_url: authUser.user_metadata?.avatar_url,
            bio: authUser.user_metadata?.bio,
            phone: authUser.user_metadata?.phone,
            subscription_tier: (authUser.user_metadata?.subscription_tier as any) || 'free',
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
        
        return null
      }

      // Convert database profile to User format
      const formattedProfile: User = {
        id: profile.id,
        name: profile.name,
        email: authUser?.email || '',
        major: profile.major || 'law',
        university: Array.isArray(profile.university) 
          ? profile.university[0] 
          : profile.university || 'جامعة افتراضية',
        year: profile.year || '1',
        role: profile.role || 'student',
        avatar: profile.avatar_url,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        phone: profile.phone,
        subscription_tier: profile.subscription_tier || 'free',
        stats: profile.stats || {
          uploadsCount: 0,
          viewsCount: 0,
          helpfulVotes: 0,
          coursesEnrolled: 0,
          booksOwned: 0,
          consultations: 0,
          communityPoints: 0,
        },
        permissions: profile.permissions || [],
      }

      console.log(`[AUTH] Profile loaded successfully: ${formattedProfile.name}`)
      return formattedProfile

    } catch (err) {
      console.error("[AUTH] Error loading user profile:", err)
      setError("Failed to load user profile")
      return null
    }
  }

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      setError(null)
      console.log('[AUTH] Refreshing user data...')
      
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('[AUTH] Session error:', sessionError)
        setError('Session error occurred')
        setUser(null)
        setSession(null)
        return
      }
      
      if (currentSession?.user) {
        console.log('[AUTH] Valid session found, fetching profile...')
        setSession(currentSession)
        
        const profile = await fetchUserProfile(currentSession.user.id, currentSession.user)
        setUser(profile)
        
        if (profile) {
          console.log(`[AUTH] User refreshed successfully: ${profile.name}`)
        } else {
          console.warn('[AUTH] Profile could not be loaded')
          setError('Profile could not be loaded')
        }
      } else {
        console.log('[AUTH] No valid session found')
        setUser(null)
        setSession(null)
      }
    } catch (err) {
      console.error('[AUTH] Error refreshing user:', err)
      setError('Failed to refresh user data')
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
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
        const profile = await fetchUserProfile(initialSession.user.id, initialSession.user)
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
          const profile = await fetchUserProfile(session.user.id, session.user)
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
