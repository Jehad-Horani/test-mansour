"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: number
  title: string
  author: string
  price: number
  quantity: number
  image?: string
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart)
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      try {
        localStorage.removeItem("cart")
      } catch (clearError) {
        console.error("Failed to clear corrupted cart:", clearError)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems))
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
        if (error.name === "QuotaExceededError") {
          console.warn("localStorage quota exceeded for cart")
        }
      }
    }
  }, [cartItems, isLoading])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    if (!item.id || !item.title || !item.price) {
      console.error("Invalid cart item data:", item)
      return
    }

    setCartItems((current) => {
      const existingItem = current.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
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
  }
}
