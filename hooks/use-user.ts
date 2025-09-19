"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  major: "law" | "it" | "medical" | "business"
  university: string
  year: string
  isLoggedIn: boolean
  role: "student" | "admin"
  permissions: string[]
  avatar?: string
  bio?: string
  joinDate: string
  phone?: string
  graduationYear?: string
  studyLevel?: string
  stats: {
    uploadsCount: number
    viewsCount: number
    helpfulVotes: number
    coursesEnrolled: number
    booksOwned: number
    consultations: number
    communityPoints: number
  }
  preferences: {
    theme: "retro" | "modern"
    language: "ar" | "en"
    emailNotifications: boolean
    pushNotifications: boolean
    profileVisibility: "public" | "university" | "private"
  }
  subscription: {
    tier: "free" | "standard" | "premium"
    expiryDate?: string
    features: string[]
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage if available
    try {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      try {
        localStorage.removeItem("currentUser")
      } catch (clearError) {
        console.error("Failed to clear corrupted user data:", clearError)
      }
    } finally {
      setLoading(false)
    }
    return () => {
      // Cleanup any pending operations
    }
  }, [])

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      try {
        localStorage.setItem("currentUser", JSON.stringify(user))
      } catch (error) {
        console.error("Failed to save user to localStorage:", error)
        // Handle quota exceeded or other storage errors
        if (error === "QuotaExceededError") {
          console.warn("localStorage quota exceeded, clearing old data")
          try {
            localStorage.clear()
            localStorage.setItem("currentUser", JSON.stringify(user))
          } catch (retryError) {
            console.error("Failed to save user after clearing storage:", retryError)
          }
        }
      }
    } else {
      try {
        localStorage.removeItem("currentUser")
      } catch (error) {
        console.error("Failed to remove user from localStorage:", error)
      }
    }
  }, [user])

  const login = (
    userData: Omit<User, "isLoggedIn" | "joinDate" | "stats" | "preferences" | "subscription" | "role" | "permissions">,
  ) => {
    const newUser: User = {
      ...userData,
      isLoggedIn: true,
      role: "student",
      permissions: ["view_content", "upload_files", "participate_community"],
      joinDate: new Date().toISOString(),
      stats: {
        uploadsCount: 12,
        viewsCount: 340,
        helpfulVotes: 28,
        coursesEnrolled: 5,
        booksOwned: 28,
        consultations: 5,
        communityPoints: 340,
      },
      preferences: {
        theme: "retro",
        language: "ar",
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: "public",
      },
      subscription: {
        tier: "premium",
        expiryDate: "2024-03-15",
        features: ["unlimited_books", "consultations", "group_sessions", "priority_support"],
      },
    }
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    // Clear any other user-related data
    localStorage.removeItem("userPreferences")
    localStorage.removeItem("userCart")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
    }
  }

  const updateStats = (statUpdates: Partial<User["stats"]>) => {
    if (user) {
      const updatedUser = {
        ...user,
        stats: { ...user.stats, ...statUpdates },
      }
      setUser(updatedUser)
    }
  }

  const updatePreferences = (prefUpdates: Partial<User["preferences"]>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...prefUpdates },
      }
      setUser(updatedUser)
    }
  }

  const updateSubscription = (subUpdates: Partial<User["subscription"]>) => {
    if (user) {
      const updatedUser = {
        ...user,
        subscription: { ...user.subscription, ...subUpdates },
      }
      setUser(updatedUser)
    }
  }

  const mockLogin = (major: "law" | "it" | "medical" | "business") => {
    const mockUsers = {
      law: {
        id: "user-law-1",
        name: "أحمد محمد السالم",
        email: "ahmed.salem@example.com",
        major: "law" as const,
        university: "الجامعة الأردنية",
        year: "السنة الثالثة",
        phone: "+962791234567",
        graduationYear: "2025",
        studyLevel: "بكالوريوس",
        avatar: "/diverse-user-avatars.png",
        bio: "طالب قانون مهتم بالقانون المدني والتجاري، أسعى لأن أصبح محامياً متخصصاً في القانون التجاري.",
      },
      it: {
        id: "user-it-1",
        name: "فاطمة عبدالله النمر",
        email: "fatima.alnamir@example.com",
        major: "it" as const,
        university: "الجامعة الأردنية للعلوم والتكنولوجيا",
        year: "السنة الثانية",
        phone: "+962792345678",
        graduationYear: "2026",
        studyLevel: "بكالوريوس",
        avatar: "/diverse-user-avatars.png",
        bio: "مطورة مواقع ومهتمة بالذكاء الاصطناعي وتطوير التطبيقات المحمولة.",
      },
      medical: {
        id: "user-med-1",
        name: "نورا الشهري",
        email: "nora.alshahri@example.com",
        major: "medical" as const,
        university: "الجامعة الأردنية",
        year: "السنة الرابعة",
        phone: "+962793456789",
        graduationYear: "2025",
        studyLevel: "بكالوريوس",
        avatar: "/diverse-user-avatars.png",
        bio: "طالبة طب مهتمة بطب الأطفال والرعاية الصحية الأولية.",
      },
      business: {
        id: "user-bus-1",
        name: "خالد الأحمد",
        email: "khalid.alahmad@example.com",
        major: "business" as const,
        university: "جامعة اليرموك",
        year: "السنة الثالثة",
        phone: "+962794567890",
        graduationYear: "2025",
        studyLevel: "بكالوريوس",
        avatar: "/diverse-user-avatars.png",
        bio: "طالب إدارة أعمال مهتم بريادة الأعمال والتسويق الرقمي.",
      },
    }

    login(mockUsers[major])
  }

  const adminLogin = () => {
    console.log("[v0] AdminLogin function called")

    const adminUser: User = {
      id: "admin-1",
      name: "مدير النظام",
      email: "admin@takhassus.com",
      major: "it",
      university: "إدارة النظام",
      year: "مدير",
      isLoggedIn: true,
      role: "admin",
      permissions: [
        "manage_users",
        "moderate_content",
        "manage_announcements",
        "manage_market",
        "view_analytics",
        "manage_subscriptions",
        "send_messages",
        "delete_posts",
        "approve_content",
        "reject_content",
        "upload_files",
        "manage_courses",
        "manage_books",
        "full_access",
      ],
      joinDate: new Date().toISOString(),
      avatar: "/diverse-user-avatars.png",
      bio: "مدير النظام المسؤول عن إدارة المنصة والمحتوى",
      graduationYear: "N/A",
      studyLevel: "إدارة",
      stats: {
        uploadsCount: 150,
        viewsCount: 5000,
        helpfulVotes: 200,
        coursesEnrolled: 0,
        booksOwned: 500,
        consultations: 0,
        communityPoints: 1000,
      },
      preferences: {
        theme: "retro",
        language: "ar",
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: "public",
      },
      subscription: {
        tier: "premium",
        features: ["unlimited_access", "admin_tools", "full_permissions"],
      },
    }

    console.log("[v0] Setting admin user:", adminUser)
    setUser(adminUser)
    console.log("[v0] Admin user set successfully")
  }

  const register = (userData: {
    name: string
    email: string
    password: string
    major: "law" | "it" | "medical" | "business"
    university: string
    year: string
    phone?: string
  }) => {
    if (!userData.name.trim() || !userData.email.trim() || !userData.password.trim()) {
      throw new Error("جميع الحقول المطلوبة يجب ملؤها")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error("البريد الإلكتروني غير صحيح")
    }

    const newUser: User = {
      id: `user-${userData.major}-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      major: userData.major,
      university: userData.university,
      year: userData.year,
      phone: userData.phone,
      isLoggedIn: true,
      role: "student",
      permissions: ["view_content", "upload_files", "participate_community"],
      joinDate: new Date().toISOString(),
      graduationYear: new Date().getFullYear() + 4 + "",
      studyLevel: "بكالوريوس",
      avatar: "/diverse-user-avatars.png",
      bio: "",
      stats: {
        uploadsCount: 0,
        viewsCount: 0,
        helpfulVotes: 0,
        coursesEnrolled: 0,
        booksOwned: 0,
        consultations: 0,
        communityPoints: 0,
      },
      preferences: {
        theme: "retro",
        language: "ar",
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: "public",
      },
      subscription: {
        tier: "free",
        features: ["basic_access", "community_participation"],
      },
    }
    setUser(newUser)
    return newUser
  }

  const getMajorLabel = (major: "law" | "it" | "medical" | "business") => {
    const labels = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
    }
    return labels[major]
  }

  const canAccessFeature = (feature: string): boolean => {
    if (!user) return false
    return user.subscription.features.includes(feature)
  }

  const getTierLabel = (tier: "free" | "standard" | "premium") => {
    const labels = {
      free: "مجاني",
      standard: "قياسي",
      premium: "مميز",
    }
    return labels[tier]
  }

  const isSubscriptionActive = (): boolean => {
    if (!user || !user.subscription.expiryDate) return user?.subscription.tier === "free"
    return new Date(user.subscription.expiryDate) > new Date()
  }

  const isAdmin = (): boolean => {
    return user?.role === "admin" || false
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission) || user.permissions.includes("full_access")
  }

  const canModerateContent = (): boolean => {
    return hasPermission("moderate_content")
  }

  const canManageUsers = (): boolean => {
    return hasPermission("manage_users")
  }

  return {
    user,
    login,
    logout,
    register,
    updateUser,
    updateStats,
    updatePreferences,
    updateSubscription,
    mockLogin,
    adminLogin,
    isAdmin,
    hasPermission,
    canModerateContent,
    canManageUsers,
    getMajorLabel,
    getTierLabel,
    canAccessFeature,
    isSubscriptionActive,
    isLoggedIn: user?.isLoggedIn || false,
    loading,
  }
}
