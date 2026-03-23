'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Project } from '@/types'
import { imageUrl } from '@/lib/sanity/image'

interface LightboxProps {
  projects: Project[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ projects, index, onClose, onPrev, onNext }: LightboxProps) {
  const isOpen = index !== null
  const project = index !== null ? projects[index] : null

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose, onPrev, onNext])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Swipe gesture
  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === -1) onNext()
      if (swipeX === 1) onPrev()
    },
    { swipe: { velocity: 0.2, distance: 50 } }
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose() },
    [onClose]
  )

  const src = project ? imageUrl(project.coverImage, { width: 1600 }) : ''
  const lqip = project?.coverImage?.asset?.metadata?.lqip

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-sm" aria-hidden />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2 text-ivory hover:text-brass transition-colors duration-200"
            aria-label="Close lightbox"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          {/* Prev */}
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-ivory hover:text-brass transition-colors duration-200 disabled:opacity-30"
            aria-label="Previous project"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-ivory hover:text-brass transition-colors duration-200"
            aria-label="Next project"
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>

          {/* Content */}
          <div
            className="relative z-10 flex flex-col lg:flex-row gap-6 w-full max-w-6xl px-16 py-10 items-center"
            {...bind()}
          >
            {/* Image */}
            <div className="relative flex-1 max-h-[75vh] flex items-center justify-center">
              {src && (
                <Image
                  key={project._id}
                  src={src}
                  alt={project.coverImage?.alt ?? project.title}
                  width={1200}
                  height={900}
                  sizes="(max-width: 1024px) 90vw, 65vw"
                  className="max-h-[75vh] w-auto object-contain"
                  placeholder={lqip ? 'blur' : 'empty'}
                  blurDataURL={lqip}
                  priority
                />
              )}
            </div>

            {/* Info panel */}
            <div className="lg:w-64 shrink-0 text-ivory space-y-4">
              <div>
                <span className="font-body text-[10px] tracking-[0.2em] text-brass uppercase">
                  {project.category}
                </span>
                <h2 className="font-display text-2xl font-light mt-1">{project.title}</h2>
              </div>

              {project.client && (
                <div>
                  <dt className="font-body text-[10px] tracking-widest text-slate-light uppercase">Client</dt>
                  <dd className="font-body text-sm text-ivory mt-0.5">{project.client}</dd>
                </div>
              )}

              {project.date && (
                <div>
                  <dt className="font-body text-[10px] tracking-widest text-slate-light uppercase">Date</dt>
                  <dd className="font-body text-sm text-ivory mt-0.5">
                    {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </dd>
                </div>
              )}

              {project.services && project.services.length > 0 && (
                <div>
                  <dt className="font-body text-[10px] tracking-widest text-slate-light uppercase mb-1">Services</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {project.services.map((s) => (
                      <span key={s} className="font-body text-xs px-2 py-0.5 border border-white/20 text-slate-light">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {/* Counter */}
              <p className="font-body text-xs text-slate/60 pt-2 border-t border-white/10">
                {(index ?? 0) + 1} / {projects.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
