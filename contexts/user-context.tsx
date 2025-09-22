"use client"

import { createContext, useContext, ReactNode } from "react"
import { useUser, type User } from "@/hooks/use-user"

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  isAdmin: () => boolean
  hasPermission: (permission: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const userHook = useUser()

  return <UserContext.Provider value={userHook}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUserContext must be used within a UserProvider")
  return context
}
