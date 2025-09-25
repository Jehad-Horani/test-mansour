"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar"
import { Upload, Camera, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentAvatarUrl?: string
  userId: string
  userName: string
  onAvatarUpdate?: (newAvatarUrl: string) => void
  size?: "sm" | "md" | "lg"
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  userId, 
  userName, 
  onAvatarUpdate, 
  size = "md" 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  }

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة')
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الملف يجب أن يكون أقل من 5 ميجابايت')
      }

      // Create file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      toast.success('تم تحديث صورة الملف الشخصي بنجاح')
      setPreviewUrl(urlData.publicUrl)
      
      if (onAvatarUpdate) {
        onAvatarUpdate(urlData.publicUrl)
      }

    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error(`خطأ في رفع الصورة: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload file
      uploadAvatar(file)
    }
  }

  const removeAvatar = async () => {
    try {
      setUploading(true)

      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('تم حذف صورة الملف الشخصي')
      setPreviewUrl(null)
      
      if (onAvatarUpdate) {
        onAvatarUpdate('')
      }

    } catch (error: any) {
      console.error('Error removing avatar:', error)
      toast.error('خطأ في حذف الصورة')
    } finally {
      setUploading(false)
    }
  }

  const displayUrl = previewUrl || currentAvatarUrl
  const userInitials = userName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-gray-300`}>
          <AvatarImage src={displayUrl} alt={userName} />
          <AvatarFallback className="text-lg font-semibold bg-gray-100">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        {displayUrl && !uploading && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -top-1 -right-1 w-6 h-6 p-0 bg-red-500 text-white border-0 rounded-full"
            onClick={removeAvatar}
            title="حذف الصورة"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="retro-button bg-transparent"
          disabled={uploading}
          asChild
        >
          <label htmlFor={`avatar-upload-${userId}`} className="cursor-pointer">
            {uploading ? (
              <>جاري الرفع...</>
            ) : (
              <>
                <Camera className="w-4 h-4 ml-1" />
                {displayUrl ? 'تغيير' : 'رفع صورة'}
              </>
            )}
          </label>
        </Button>
        
        <input
          id={`avatar-upload-${userId}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      <p className="text-xs text-gray-500 text-center max-w-xs">
        يُفضل استخدام صورة مربعة بحجم أقل من 5 ميجابايت
      </p>
    </div>
  )
}