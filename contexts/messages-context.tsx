"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "../app/lib/supabase/client"
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
  const supabase = createClient()

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setUnreadCount(0)
      return
    }

    // Initial load
    refreshUnreadCount()

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel("messages_unread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          refreshUnreadCount()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          refreshUnreadCount()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isLoggedIn])

  const refreshUnreadCount = async () => {
    if (!user) return

    try {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .neq("status", "read")

      setUnreadCount(count || 0)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const markConversationAsRead = async (conversationId: string) => {
    if (!user) return

    try {
      await supabase
        .from("messages")
        .update({ status: "read" })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", user.id)
        .neq("status", "read")

      refreshUnreadCount()
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
