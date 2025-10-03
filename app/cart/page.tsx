"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Trash2, MessageCircle, User, ArrowRight, ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi, type CartItem, type Book } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function CartPage() {
  const { user, isLoggedIn } = useAuth()
  const supabase = createClient()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Load cart items from Supabase
  const loadCart = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await marketplaceApi.getCart(user.id)
      if (error) throw error
      
      setCartItems(data || [])
    } catch (error: any) {
      console.error("Error loading cart:", error)
      toast.error("حدث خطأ أثناء تحميل السلة")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [user])

  // Real-time cart updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('cart-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log('Cart updated:', payload)
          loadCart() // Reload cart when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      setUpdating(cartItemId)
      const { error } = await marketplaceApi.updateCartQuantity(cartItemId, newQuantity)
      
      if (error) throw error
      
      // Update local state immediately for better UX
      setCartItems(prev => 
        prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        ).filter(item => item.quantity > 0)
      )
      
    } catch (error: any) {
      console.error("Error updating quantity:", error)
      toast.error("حدث خطأ أثناء تحديث الكمية")
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (cartItemId: string) => {
    if (!confirm("هل تريد إزالة هذا الكتاب من السلة؟")) return

    try {
      setUpdating(cartItemId)
      const { error } = await marketplaceApi.removeFromCart(cartItemId)
      
      if (error) throw error
      
      // Update local state immediately
      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
      toast.success("تم إزالة الكتاب من السلة")
      
    } catch (error: any) {
      console.error("Error removing item:", error)
      toast.error("حدث خطأ أثناء إزالة الكتاب")
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    if (!user) return
    if (!confirm("هل تريد مسح جميع العناصر من السلة؟")) return

    try {
      const { error } = await marketplaceApi.clearCart(user.id)
      if (error) throw error
      
      setCartItems([])
      toast.success("تم مسح السلة بنجاح")
    } catch (error: any) {
      console.error("Error clearing cart:", error)
      toast.error("حدث خطأ أثناء مسح السلة")
    }
  }

  // Calculate totals
  const totalAmount = cartItems.reduce((sum, item) => {
    if (item.book) {
      return sum + (item.book.selling_price * item.quantity)
    }
    return sum
  }, 0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="سلة التسوق">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض سلة التسوق</p>
              <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="سلة التسوق">
            <div className="text-center py-12">
              <p className="text-gray-600">جاري تحميل السلة...</p>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/market">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للسوق
            </Link>
          </Button>
        </div>

        <RetroWindow title={`سلة التسوق (${totalItems} عنصر)`}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">سلة التسوق فارغة</p>
              <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/market">تصفح الكتب</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="retro-window bg-white">
                    <div className="p-4 flex items-center gap-4">
                      <img
                        src={item.book?.images?.[0]?.image_url || "/placeholder.svg"}
                        alt={item.book?.title || "كتاب"}
                        className="w-16 h-20 object-cover bg-gray-200 rounded"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.book?.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.book?.author}</p>
                        <p className="text-sm mb-2">
                          <User className="w-4 h-4 inline mr-1" />
                          البائع: {item.book?.seller?.name}
                        </p>
                        <p className="font-bold" style={{ color: "var(--primary)" }}>
                          {item.book?.selling_price} {item.book?.currency}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="retro-button bg-transparent w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="retro-button bg-transparent w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          className="retro-button"
                          style={{ background: "var(--accent)", color: "white" }}
                        >
                          <Link href={`/messages/new?user=${item.book?.seller_id}&book=${item.book_id}`}>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            تواصل
                          </Link>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="retro-button text-red-600 bg-transparent"
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="retro-window bg-gray-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">المجموع:</span>
                    <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                      {totalAmount.toFixed(2)} دينار
                    </span>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      asChild
                      className="retro-button flex-1"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      <Link href="/checkout">
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        إتمام الشراء
                      </Link>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="retro-button bg-transparent"
                      onClick={clearCart}
                    >
                      مسح السلة
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600 text-center">
                      💡 للحصول على هذه الكتب، تواصل مع البائعين مباشرة
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      الدفع والتسليم يتم بالاتفاق المباشر مع البائع
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/market">متابعة التسوق</Link>
                </Button>
              </div>
            </>
          )}
        </RetroWindow>
      </div>
    </div>
  )
}