"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { marketplaceApi, type CartItem as SupabaseCartItem } from "@/lib/supabase/marketplace"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  title: string
  author: string
  price: number
  quantity: number
  image?: string
}

export function useCart() {
  const { user } = useAuth()
  const supabase = createClient()
  const [cartItems, setCartItems] = useState<SupabaseCartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from Supabase
  const loadCart = async () => {
    if (!user) {
      setCartItems([])
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await marketplaceApi.getCart(user.id)
      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [user])

  // Real-time cart updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('cart-changes-hook')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadCart() // Reload cart when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const addToCart = async (item: { id: string; title: string; author: string; price: number; image?: string }) => {
    if (!user) {
      console.error("User must be logged in to add to cart")
      return
    }

    try {
      const { error } = await marketplaceApi.addToCart(user.id, item.id, 1)
      if (error) throw error
      await loadCart() // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to add to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await marketplaceApi.removeFromCart(cartItemId)
      if (error) throw error
      await loadCart() // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      throw error
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const { error } = await marketplaceApi.updateCartQuantity(cartItemId, quantity)
      if (error) throw error
      await loadCart() // Reload cart to get updated data
    } catch (error) {
      console.error("Failed to update quantity:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return
    
    try {
      const { error } = await marketplaceApi.clearCart(user.id)
      if (error) throw error
      setCartItems([])
    } catch (error) {
      console.error("Failed to clear cart:", error)
      throw error
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.book) {
        return total + (item.book.selling_price * item.quantity)
      }
      return total
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoading,
    refreshCart: loadCart,
  }
}
