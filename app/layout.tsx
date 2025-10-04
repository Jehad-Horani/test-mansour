import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/app/components/theme-provider"
import { RetroNavbar } from "@/app/components/retro-navbar"
import { RetroSidebar } from "@/app/components/retro-sidebar"
import { Breadcrumbs } from "@/app/components/breadcrumbs"
import { UserProvider } from "@/contexts/user-context"
import { MessagesProvider } from "@/contexts/messages-context"
import { AuthDebug } from "@/components/auth/auth-debug"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "تخصص.كُم - TAKHASSUS.com",
  description: "تخصص.كُم منصة جامعية بتسهل على الطلاب دراستهم من خلال توفير محاضرات، ملخصات، وأسئلة مراجعة، بمكان واحد منظم وسهل الاستخدام.",
  generator: "Jehad Horani",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <body className="font-sans antialiased overflow-x-hidden">
        <UserProvider>
          <MessagesProvider>
            <ThemeProvider>
              <RetroNavbar />
              <div className="flex">
                <main className="flex-1 md:mr-[200px] min-h-screen">
                  <div className="p-4">
                    <Breadcrumbs />
                    {children}
                    <Analytics />
                  </div>
                </main>
                <RetroSidebar />
              </div>
              <AuthDebug />
              <Toaster />
            </ThemeProvider>
          </MessagesProvider>
        </UserProvider>
      </body>
    </html>
  )
}
