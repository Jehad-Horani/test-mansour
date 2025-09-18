"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSupabaseClient } from "@/app/lib/supabase/client-wrapper"
import { useUserContext } from "./user-context"

interface MessagesContextType {
  unreadCount: number
  refreshUnreadCount: () => void
  markConversationAsRead: (conversationId: string) => void
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, isLoggedIn } = useUserContext()
const { data, loading1, error1 } = useSupabaseClient()

useEffect(() => {
  if (!isLoggedIn || !user) {
    setUnreadCount(0)
    return
  }

  let intervalId: NodeJS.Timeout

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages/unread-count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await res.json()
      if (res.ok) {
        setUnreadCount(data.unreadCount || 0)
      } else {
        console.error("Error fetching unread count:", data.error)
      }
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }

  // تحميل أولي
  fetchUnreadCount()

  // تحديث دوري كل 5 ثواني (يمكن تغييره حسب الحاجة)
  intervalId = setInterval(fetchUnreadCount, 5000)

  return () => clearInterval(intervalId)
}, [user, isLoggedIn])


  const refreshUnreadCount = async () => {
  if (!user) return

  try {
    const res = await fetch("/api/messages/unread-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    })

    const data = await res.json()

    if (res.ok) {
      setUnreadCount(data.unreadCount || 0)
    } else {
      console.error("Error fetching unread count:", data.error)
    }
  } catch (error) {
    console.error("Error fetching unread count:", error)
  }
}


 const markConversationAsRead = async (conversationId: string) => {
  if (!user) return

  try {
    const res = await fetch("/api/messages/mark-as-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversationId, userId: user.id }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Error marking conversation as read:", data.error)
    } else {
      // بعد ما ننجح في تحديث الحالة، نحدث عدد الرسائل غير المقروءة
      refreshUnreadCount()
    }
  } catch (error) {
    console.error("Error marking conversation as read:", error)
  }
}


  return (
    <MessagesContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        markConversationAsRead,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider")
  }
  return context
}
