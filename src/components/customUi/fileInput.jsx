import React, { useState, useCallback,  useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'

export default function FileInputZod({ name }) {
  const { setValue, clearErrors, formState: { errors }, control } = useFormContext()
  const file = useWatch({ name, control })
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(false)
  const errorMessage = errors?.[name]?.message

  console.log("Preview URL set to:", previewUrl);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setValue(name, droppedFile, { shouldValidate: true })
      clearErrors(name)
    }
  }, [name, setValue, clearErrors])
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false)
    }
  }
  
  const handleClick = () => {
    if (file) {
      setValue(name, undefined, { shouldValidate: true })
      setPreviewUrl(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } else {
      inputRef.current?.click()
    }
  }
  
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setValue(name, selected, { shouldValidate: true })
      clearErrors(name)
      setPreviewUrl(true)
    }
  }

  
  
  return (
    <div className="relative">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative group h-32 w-64 rounded-lg border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer border-2 text-center group transition-all duration-300 ease-in-out
          ${isDragging ? 'bg-rod-foreground border-gray-300 scale-110' : ''}
          ${errorMessage ? 'border-red-500' : 'border-border'}`}
      >
        {previewUrl ? (
          
            <div className="p-2 rounded-full bg-rod-foreground group-hover:scale-110 transition-all  flex items-center justify-center">
              <X className="text-rod-primary w-6 h-6" />
            </div>
        ) : (
          <div className={`p-2 rounded-full group-hover:scale-110 transition-all  ${isDragging ? 'bg-rod-primary' : 'bg-rod-foreground'}`}>
            <Upload size={24} className={`${errorMessage ? 'text-red-500' :  isDragging ? 'text-white' : 'text-rod-primary'}`} />
          </div>
        )}
        
        <p className="flex flex-col items-center gap-0.5">
          <span className={`text-sm font-medium truncate max-w-52 ${errorMessage && 'text-red-500'}`}>
            {errorMessage || (previewUrl ? file?.name : isDragging ? "Relâchez l'image ici" : "Glissez-déposez votre logo")}
          </span>
          <span className={`text-xs ${errorMessage ? 'text-red-500' : 'text-gray-500'}`}>
            {errorMessage ? "Format accepté : .jpg, .jpeg ou .webp" : 'ou cliquez pour sélectionner un fichier'}
          </span>
        </p>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}