import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { imageUrl } from '@/lib/sanity/image'

const categoryLabel: Record<string, string> = {
  photography: 'Photography',
  videography: 'Videography',
  'web-development': 'Web Development',
}

interface ProjectCardProps {
  project: Project
  /** When true, renders as a <button> for lightbox instead of a <Link> */
  onClick?: (project: Project) => void
  priority?: boolean
}

export default function ProjectCard({ project, onClick, priority }: ProjectCardProps) {
  const src = imageUrl(project.coverImage, { width: 800 })
  const lqip = project.coverImage?.asset?.metadata?.lqip
  const label = categoryLabel[project.category] ?? project.category

  const inner = (
    <div className="group relative overflow-hidden bg-obsidian">
      {/* Image */}
      {src ? (
        <Image
          src={src}
          alt={project.coverImage?.alt ?? project.title}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          priority={priority}
        />
      ) : (
        <div className="w-full aspect-[4/3] bg-obsidian/50" aria-hidden />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-6">
        {/* Arrow icon */}
        <div className="absolute top-5 right-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
          <ArrowUpRight size={20} className="text-ivory" strokeWidth={1.5} />
        </div>

        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
          <span className="font-body text-[10px] tracking-[0.2em] text-brass uppercase mb-2 block">
            {label}
          </span>
          <h3 className="font-display text-xl font-light text-ivory leading-snug">
            {project.title}
          </h3>
          {project.client && (
            <p className="font-body text-xs text-slate-light mt-1">{project.client}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-brass"
        onClick={() => onClick(project)}
        aria-label={`View ${project.title}`}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link
      href={`/photography/${project.slug.current}`}
      className="block focus-visible:outline-2 focus-visible:outline-brass"
    >
      {inner}
    </Link>
  )
}
