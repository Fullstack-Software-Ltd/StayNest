'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { HouseLoader } from '@/components/shared/HouseLoader'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface FileUploadProps {
  onUpload: (url: string) => void
  label?: string
  bucket: 'avatars' | 'property-images' | 'room-images'
  initialImage?: string | null
  className?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export function FileUpload({ 
  onUpload, 
  label, 
  bucket, 
  initialImage, 
  className,
  aspectRatio = 'square' 
}: FileUploadProps) {
  const { t } = useSettings()
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || t('common.upload.error'))
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed border-[var(--warm-gray-dark)] rounded-3xl overflow-hidden cursor-pointer transition-all hover:bg-[var(--warm-gray)]/50',
          aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'min-h-[150px]',
          isUploading && 'opacity-70 cursor-wait',
          error && 'border-red-300 bg-red-50/30'
        )}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="bg-white text-red-500 p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <Upload className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('common.upload.click')}</span>
            <span className="text-[10px] opacity-70 mt-1">{t('common.upload.hint')}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <HouseLoader size="sm" />
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{error}</p>}
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
