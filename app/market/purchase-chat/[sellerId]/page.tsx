// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useUser } from "../../../../hooks/use-user"
// import { RetroWindow } from "@/app/components/retro-window"
// import { Button } from "@/app/components/ui/button"
// import { Input } from "@/app/components/ui/input"
// import PixelIcon from "@/app/components/pixel-icon"
// import { useSupabaseClient } from "@/lib/supabase/client-wrapper"

// interface Message {
//   id: string
//   conversation_id: string
//   sender_id: string
//   sender_name: string
//   receiver_id: string
//   receiver_name: string
//   message: string
//   message_type: "text" | "purchase_inquiry" | "seller_response" | "system"
//   status: "sent" | "delivered" | "read"
//   book_title?: string
//   book_price?: string
//   created_at: string
// }

// interface Conversation {
//   id: string
//   buyer_id: string
//   seller_id: string
//   book_title?: string
//   book_price?: string
//   last_message_at: string
// }

// export default function PurchaseChatPage({ params }: { params: { sellerId: string } }) {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const [conversation, setConversation] = useState<Conversation | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { user } = useUser()
//   const router = useRouter()
//   const searchParams = useSearchParams()
// const { data, loading1, error1 } = useSupabaseClient()

//   const bookTitle = searchParams.get("bookTitle") || "كتاب غير محدد"
//   const bookPrice = searchParams.get("bookPrice") || "0"
//   const sellerName = searchParams.get("sellerName") || "بائع غير محدد"

//   const seller = {
//     id: params.sellerId,
//     name: sellerName,
//     university: "الجامعة الأردنية",
//     avatar: "/placeholder.svg?height=40&width=40",
//     isOnline: Math.random() > 0.5,
//     lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
//   }

// useEffect(() => {
//   if (!user) return

//   initializeConversation()

//   // لا يمكن عمل real-time هنا مباشرة في Client Component بدون supabase
//   // الحل: استخدام polling كل 3 ثواني مثلاً لتحميل الرسائل
//   const interval = setInterval(() => {
//     if (conversation) {
//       loadMessages(conversation.id)
//     }
//   }, 3000)

//   return () => clearInterval(interval)
// }, [user, params.sellerId, bookTitle, conversation])


//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const getConversationId = () => {
//     return `${user?.id}_${params.sellerId}_${bookTitle.replace(/\s+/g, "_")}`
//   }

//   const initializeConversation = async () => {
//   if (!user) return

//   const conversationId = getConversationId()

//   try {
//     const res = await fetch("/api/chat/init-conversation", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         conversationId,
//         buyerId: user.id,
//         sellerId: params.sellerId,
//         bookTitle,
//         bookPrice,
//       }),
//     })
//     const data = await res.json()

//     if (!res.ok) throw new Error(data.error || "حدث خطأ عند تهيئة المحادثة")

//     setConversation(data.conversation)
//     setMessages(data.messages || [])
//   } catch (err: any) {
//     console.error("Error initializing conversation:", err)
//   }
// }


//  const loadMessages = async (conversationId: string) => {
//   try {
//     const res = await fetch("/api/chat/get-messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ conversationId, userId: user?.id }),
//     })
//     const data = await res.json()
//     setMessages(data.messages || [])
//   } catch (err: any) {
//     console.error("Error loading messages:", err)
//   }
// }


//  const sendMessage = async (messageText: string, messageType: Message["message_type"] = "text") => {
//   if (!user || !messageText.trim()) return
//   const conversationId = getConversationId()

//   try {
//     const res = await fetch("/api/chat/send-message", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         conversationId,
//         senderId: user.id,
//         senderName: user.name || "مستخدم",
//         receiverId: params.sellerId,
//         receiverName: sellerName,
//         message: messageText,
//         messageType,
//         bookTitle,
//         bookPrice,
//       }),
//     })

//     const data = await res.json()
//     if (!res.ok) throw new Error(data.error || "حدث خطأ عند إرسال الرسالة")

//     if (messageType !== "seller_response") {
//       setTimeout(() => simulateSellerResponse(conversationId), 2000 + Math.random() * 3000)
//     }
//   } catch (err: any) {
//     console.error("Error sending message:", err)
//   }
// }


// const simulateSellerResponse = async (conversationId: string) => {
//   const responses = [
//     "شكراً لاهتمامك! الكتاب متوفر وحالته ممتازة",
//     "أهلاً وسهلاً! يمكننا الاتفاق على موعد للتسليم",
//     "مرحباً! السعر قابل للتفاوض قليلاً",
//     "الكتاب متوفر، متى يمكنك استلامه؟",
//     "أهلاً بك! هل تريد رؤية صور إضافية للكتاب؟",
//   ]

//   const randomResponse = responses[Math.floor(Math.random() * responses.length)]

//   try {
//     await fetch("/api/chat/send-message", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         conversationId,
//         senderId: params.sellerId,
//         senderName: sellerName,
//         receiverId: user?.id || "",
//         receiverName: user?.name || "مشتري",
//         message: randomResponse,
//         messageType: "seller_response",
//         bookTitle,
//         bookPrice,
//       }),
//     })
//   } catch (err: any) {
//     console.error("Error sending seller response:", err)
//   }
// }



//  const markMessageAsDelivered = async (messageId: string) => {
//   try {
//     await fetch("/api/chat/mark-delivered", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ messageId }),
//     })
//   } catch (err: any) {
//     console.error("Error marking message as delivered:", err)
//   }
// }


//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return

//     setIsLoading(true)
//     await sendMessage(newMessage)
//     setNewMessage("")
//     setIsLoading(false)
//   }

//   const quickActions = [
//     "هل يمكنني رؤية صور إضافية؟",
//     "متى يمكن التسليم؟",
//     "هل السعر قابل للتفاوض؟",
//     "أين مكان التسليم؟",
//   ]

//   const handleQuickAction = (action: string) => {
//     setNewMessage(action)
//   }

//   const getMessageStatus = (message: Message) => {
//     if (message.sender_id !== user?.id) return null

//     switch (message.status) {
//       case "sent":
//         return "✓"
//       case "delivered":
//         return "✓✓"
//       case "read":
//         return <span className="text-blue-200">✓✓</span>
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
//       <div className="max-w-4xl mx-auto">
//         <RetroWindow title={`محادثة شراء: ${bookTitle}`}>
//           {/* Chat Header */}
//           <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <img
//                   src={seller.avatar || "/placeholder.svg"}
//                   alt={seller.name}
//                   className="w-10 h-10 rounded-full bg-gray-200"
//                 />
//                 {seller.isOnline && (
//                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-bold">{seller.name}</h3>
//                 <p className="text-xs text-gray-600">
//                   {seller.isOnline
//                     ? "متصل الآن"
//                     : `آخر ظهور ${seller.lastSeen.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}`}
//                 </p>
//               </div>
//             </div>
//             <Button onClick={() => router.back()} variant="outline" className="retro-button bg-transparent">
//               <PixelIcon type="arrow-right" className="w-4 h-4 ml-1" />
//               العودة
//             </Button>
//           </div>

//           {/* Purchase Context */}
//           <div className="p-4 bg-blue-50 border-b" style={{ borderColor: "var(--border)" }}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2 text-sm">
//                 <PixelIcon type="shopping-cart" className="w-4 h-4 text-blue-600" />
//                 <span className="font-medium">كتاب: {bookTitle}</span>
//                 <span className="text-gray-600">- السعر: {bookPrice} دينار</span>
//               </div>
//               <div className="text-xs text-gray-500">معرف المحادثة: #{params.sellerId.slice(-4)}</div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                     message.sender_id === user?.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   <p className="text-sm">{message.message}</p>
//                   <div className="flex items-center justify-between mt-1">
//                     <p className="text-xs opacity-70">
//                       {new Date(message.created_at).toLocaleTimeString("ar-SA", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                     {getMessageStatus(message)}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
//                   <div className="flex items-center gap-1">
//                     <span className="text-sm">{seller.name} يكتب</span>
//                     <div className="flex gap-1">
//                       <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Actions */}
//           <div className="p-2 border-t bg-gray-50" style={{ borderColor: "var(--border)" }}>
//             <div className="flex gap-2 overflow-x-auto">
//               {quickActions.map((action, index) => (
//                 <Button
//                   key={index}
//                   onClick={() => handleQuickAction(action)}
//                   variant="outline"
//                   className="retro-button text-xs whitespace-nowrap"
//                   size="sm"
//                 >
//                   {action}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
//             <div className="flex gap-2">
//               <Input
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="اكتب رسالتك هنا..."
//                 className="retro-input flex-1"
//                 onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
//                 disabled={isLoading}
//               />
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={isLoading || !newMessage.trim()}
//                 className="retro-button"
//                 style={{ background: "var(--primary)", color: "white" }}
//               >
//                 {isLoading ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <PixelIcon type="send" className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Purchase Guidelines */}
//           <div className="p-4 bg-yellow-50 border-t" style={{ borderColor: "var(--border)" }}>
//             <div className="flex items-start gap-3">
//               <PixelIcon type="shield" className="w-5 h-5 text-yellow-600 mt-0.5" />
//               <div>
//                 <h4 className="font-bold text-sm mb-2">إرشادات الشراء الآمن:</h4>
//                 <ul className="text-xs text-gray-600 space-y-1">
//                   <li>• تأكد من حالة الكتاب قبل الشراء</li>
//                   <li>• اتفق على مكان وطريقة التسليم المناسبة</li>
//                   <li>• تأكد من صحة المعلومات قبل الدفع</li>
//                   <li>• لا تشارك معلومات شخصية حساسة</li>
//                   <li>• يمكنك الإبلاغ عن أي مشكلة للإدارة</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </RetroWindow>
//       </div>
//     </div>
//   )
// }