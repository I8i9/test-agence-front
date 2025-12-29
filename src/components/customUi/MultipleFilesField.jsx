import { Upload, X } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import ReactDOM from 'react-dom';

const images = ['image/jpeg', 'image/png', 'image/webp' , 'image/jpg' , 'image/tiff' , 'image/bmp','image/heic','image/heif'];

const MultipleFilesField = ({ files, setFiles , className = "", smallVariant = false }) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [errors, setErrors] = React.useState(null)
    const [maximized, setMaximized] = React.useState(null);
    const closeFact = () => {
        setMaximized(null)
    }

    const openPhoto = (src, label) => {
        setMaximized({ label, src });
    }

    const removeFile = (index , url) => {
        // Remove file from the list
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        URL.revokeObjectURL(url);
    }

    const inputRef = React.useRef(null)

    useEffect(() => {
        // cleanup function to revoke object URLs
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        }
    }, []);

    // 1. Stable function to clear errors
    const clearErrors = useCallback(() => setErrors(null), [setErrors]);

    console.log("Current files:", files);
    // 2. Stable function to handle file processing and setting
    const setValue = useCallback((value) => {
        console.log("Processing files:", value);
        if (!value) return;


         console.log("checking:", value);
        // Check for non-image files
        if (Array.from(value).some(file => !images.includes(file.type))) {
            setErrors("Format accepté : .jpg, .jpeg, .png, .webp, .tiff, .bmp, .heic, .heif");
            return;
        }

        clearErrors();

        console.log("Adding files:", value);

        // Filter out files that already exist by name
        const newFiles = Array.from(value).filter(
            newFile => !files.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
        );

        if (newFiles.length === 0) return;

        // Append the new, unique files to the existing array
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
       

    }, [files, setFiles, setErrors]); // Dependencies: Needs 'files' to check for duplicates and 'setFiles'/'setErrors' to update state.

    // 3. Handlers for Drag and Drop
    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (files.length >= 10) {
            setErrors("Vous ne pouvez pas ajouter plus de 10 images.")
            return;
        }
        
        const droppedFiles = e.dataTransfer.files
        if (droppedFiles && files.length < 10) {
            setValue(droppedFiles)
            clearErrors()
        }
    }, [setValue, clearErrors]); // Dependencies: Needs the stable setValue and clearErrors functions.
    
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }
    
    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // Only set isDragging to false if the mouse leaves the component boundary
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false)
        }
    }
     
    // 4. Handler for manual file selection via input click
    const handleFileChange = (e) => {
        const selected = e.target.files

         if (files.length >= 10) {
            setErrors("Vous ne pouvez pas ajouter plus de 10 images.")
            return;
        }

        if (selected && files.length < 10) {
            setValue(selected)
        }
        
        // This allows the user to re-select the same file(s) later.
        e.target.value = null; // Setting to null clears the value
    }

    return (
        <div className={`flex flex-col w-full gap-4 mt-6 px-12 ${className} `}>
            <div className="relative w-full">
                <div
                    onClick={() => { inputRef.current.click() }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative w-full group ${smallVariant ? "h-26 gap-0" : "h-48 gap-3"} rounded-lg border-dashed flex flex-col items-center justify-center  cursor-pointer border-2 text-center group transition-all duration-300 ease-in-out
                    ${isDragging ? 'bg-rod-foreground border-gray-300 scale-105' : ''}
                    ${errors ? 'border-red-500' : 'border-border hover:bg-rod-foreground'}`}
                >
                    {/* Upload Icon and Spinner (optional, simplified) */}
                    <div className={`p-2 rounded-full group-hover:scale-110 transition-all ${isDragging ? 'bg-rod-primary' : 'bg-rod-foreground'}`}>
                        <Upload size={smallVariant ? 16 : 24} className={`${errors ? 'text-red-500' : isDragging ? 'text-white' : 'text-rod-primary'}`} />
                    </div>
                    
                    {/* Text content */}
                    <p className={`flex flex-col items-center ${smallVariant ? "gap-0" : "gap-1"}`}>
                        <span className={`${smallVariant ? "text-sm" : "text-base"} font-medium truncate max-w-full ${errors && 'text-red-500'}`}>
                            {errors ? "Seules les images sont acceptées" : (isDragging ? "Relâchez l'image ici" : "Glissez-déposez vos images")}
                        </span>
                        <span className={`${smallVariant ? "text-xs" : "text-sm"} ${errors ? 'text-red-500' : 'text-gray-500'}`}>
                            {errors ? errors : 'ou cliquez pour ajouter des images'}
                        </span>
                    </p>
                </div>
                
                {/* Hidden File Input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple // Added 'multiple' to support selecting multiple files at once
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <div className={`grid gap-y-2 ${smallVariant ? "max-h-[123px]" : "max-h-[230px]"} overflow-y-scroll -mr-4 pr-2`}>
                {files && files.length > 0 && files.map((file, index) => {

                    const previewUrl = URL.createObjectURL(file);

                return (
                    <div
                        key={index} className={`flex  items-center justify-between  ${smallVariant ? "p-2" : "p-3"} transition-all duration-300 border rounded-md`}>
                            <div className='flex items-center gap-4'> 
                                <img src={previewUrl} onClick={() => openPhoto(previewUrl, file.name)} alt={file.name} className="w-10 h-10 cursor-pointer object-cover hover:brightness-95 border transition-all duration-300 rounded-full" />
                                <div key={index} className="flex flex-col items-start">
                                    <span className="text-sm truncate max-w-sm">{file.name}</span>
                                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                                </div>

                            </div>
                       
                        <Button type="button"  onClick={() => removeFile(index, previewUrl)} variant="ghost" >
                            
                            <X className="size-4" />
                        </Button>
                    </div>
                )
                })}
            </div>
            {maximized &&
                ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-[100] bg-rod-primary/80 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={closeFact}
                    style={{ pointerEvents: 'auto' }} // make sure it's clickable
                >
    
    
                    {/* Invisible blocker to prevent background interactions */}
                    <div className="absolute inset-0 z-0" />
    
                    {/* Content wrapper that stops propagation */}
                    <div
                    className="relative z-10 max-w-full max-h-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                    >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        closeFact();
                        }}
                        className="fixed top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                    >
                        <X className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    </button>
    
                    {/* Image */}
                    <img
                        src={maximized.src}
                        alt={maximized.label}
                        className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
                    />
    
                    
    
                    {/* Caption */}
                    <div className="mt-6 text-center text-white">
                        <h2 className="text-xl max-w-[90dvh] truncate font-semibold">{maximized.label}</h2>
                    </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default MultipleFilesField