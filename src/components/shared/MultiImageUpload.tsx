'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import { HouseLoader } from '@/components/shared/HouseLoader'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'

interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void
  initialImages?: string[]
  label?: string
  minImages?: number
  bucket: 'property-images' | 'room-images'
}

export function MultiImageUpload({ 
  onUpload, 
  initialImages = [], 
  label, 
  minImages = 0,
  bucket 
}: MultiImageUploadProps) {
  const { t } = useSettings()
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    const newUrls: string[] = [...images]

    try {
      let successCount = 0
      let failCount = 0

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newUrls.push(data.url)
          successCount++
        } else {
          const errorData = await response.json()
          console.error('Upload failed:', errorData)
          failCount++
        }
      }

      setImages(newUrls)
      onUpload(newUrls)

      if (successCount > 0) {
        toast.success(`${successCount} photo(s) uploaded successfully`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} photo(s) failed to upload. Check storage permissions.`)
      }
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('An unexpected error occurred during upload')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUpload(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label} {minImages > 0 && t('common.upload.min_photos', { count: String(minImages) })}
          </label>
        )}
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
          images.length < minImages ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
        )}>
          {images.length} {t('property.photos', { count: String(images.length) })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-[var(--warm-gray-dark)]/20">
            <Image 
              src={url} 
              alt={`Property ${index + 1}`} 
              fill 
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
              className="object-cover transition-transform group-hover:scale-110"
            />
            <button 
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-[var(--primary)] text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg">
                {t('property.main_photo')}
              </div>
            )}
          </div>
        ))}

        <button 
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "aspect-square rounded-2xl border-2 border-dashed border-[var(--warm-gray-dark)] flex flex-col items-center justify-center text-gray-400 transition-all hover:bg-[var(--warm-gray)] group",
            isUploading && "opacity-50 cursor-wait"
          )}
        >
          {isUploading ? (
            <HouseLoader size="sm" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[var(--warm-gray)] flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Plus className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{t('common.upload.add_photo')}</span>
            </>
          )}
        </button>
      </div>

      <input 
        type="file" 
        multiple 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {images.length < minImages && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1 flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" />
          {t('property.add_more_photos', { count: String(minImages - images.length) })}
        </p>
      )}
    </div>
  )
}
