'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageLightboxProps) {
  const [index, setIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    if (open) {
      setIndex(initialIndex)
    }
  }, [open, initialIndex])

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIndex((prev) => (prev + 1) % images.length)
  }

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, images.length])

  if (!images.length) return null

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[101] flex items-center justify-center outline-none"
          onPointerDownOutside={(e) => e.preventDefault()} // Allow close only via button or Esc
        >
          <div className="relative h-full w-full flex items-center justify-center p-4 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative h-full w-full max-w-7xl max-h-[85vh]"
              >
                <Image
                  src={images[index]}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-8 md:size-10" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-8 md:size-10" />
                </button>
              </>
            )}

            {/* Close Button */}
            <DialogPrimitive.Close className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all outline-none">
              <X className="size-8" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/50 text-white/70 text-sm font-medium rounded-full border border-white/10">
              {index + 1} / {images.length}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
