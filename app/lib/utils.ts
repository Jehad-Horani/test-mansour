import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatPrice(price: string): string {
  // Handle both Arabic and English numbers
  return price.replace(/\d+/g, (match) => {
    return new Intl.NumberFormat("ar-SA").format(Number.parseInt(match))
  })
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "منذ لحظات"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `منذ ${minutes} دقيقة`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `منذ ${hours} ساعة`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `منذ ${days} يوم`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `منذ ${months} شهر`
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getMajorColor(major: "law" | "it" | "medical"): string {
  const colors = {
    law: "blue",
    it: "green",
    medical: "pink",
  }
  return colors[major]
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(\+966|966|0)?5[0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}
