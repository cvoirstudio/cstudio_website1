'use client'

import { useState } from 'react'
import type { Project } from '@/types'
import ProjectCard from './project-card'
import Lightbox from './lightbox'

interface GalleryMasonryProps {
  projects: Project[]
  columns?: 2 | 3
}

export default function GalleryMasonry({ projects, columns = 3 }: GalleryMasonryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const colClass = columns === 2 ? 'columns-1 sm:columns-2' : 'columns-1 sm:columns-2 lg:columns-3'

  return (
    <>
      <div className={`${colClass} gap-4`}>
        {projects.map((project, i) => (
          <div key={project._id} className="break-inside-avoid mb-4">
            <ProjectCard
              project={project}
              onClick={() => setActiveIndex(i)}
              priority={i < 4}
            />
          </div>
        ))}
      </div>

      <Lightbox
        projects={projects}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex((i) => (i === null ? 0 : (i - 1 + projects.length) % projects.length))}
        onNext={() => setActiveIndex((i) => (i === null ? 0 : (i + 1) % projects.length))}
      />
    </>
  )
}
