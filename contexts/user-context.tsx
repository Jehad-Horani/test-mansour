"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useUser, type User } from "@/hooks/use-user"

interface UserContextType {
  user: User | null
  login: (
    userData: Omit<User, "isLoggedIn" | "joinDate" | "stats" | "preferences" | "subscription" | "role" | "permissions">,
  ) => void
  logout: () => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    major: "law" | "it" | "medical" | "business"
    university: string
    year: string
    phone?: string
  }) => User
  updateUser: (updates: Partial<User>) => void
  updateStats: (statUpdates: Partial<User["stats"]>) => void
  updatePreferences: (prefUpdates: Partial<User["preferences"]>) => void
  updateSubscription: (subUpdates: Partial<User["subscription"]>) => void
  mockLogin: (major: "law" | "it" | "medical" | "business") => void
  adminLogin: () => void
  isAdmin: () => boolean
  hasPermission: (permission: string) => boolean
  canModerateContent: () => boolean
  canManageUsers: () => boolean
  getMajorLabel: (major: "law" | "it" | "medical" | "business") => string
  getTierLabel: (tier: "free" | "standard" | "premium") => string
  canAccessFeature: (feature: string) => boolean
  isSubscriptionActive: () => boolean
  isLoggedIn: boolean
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const userHook = useUser()

  return <UserContext.Provider value={userHook}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
