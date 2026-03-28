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

interface PortfolioGridProps {
  projects: Project[]
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <section className="section-py container-px bg-ivory">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
        {/* Left column — heading + description */}
        <div className="flex flex-col gap-16 lg:pr-8 mt-8 mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-light text-obsidian leading-[1.1]">
              Selected<br />Work
            </h2>

            <Link
              href="/photography"
              className="hidden lg:inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200 mt-8"
            >
              View All Projects
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div>
            <p className="font-body text-[10px] tracking-[0.3em] text-slate uppercase mb-4">
              ( Portfolio )
            </p>
            <p className="font-body text-base text-slate leading-relaxed max-w-[38ch]">
              A curated selection of our most impactful work — from editorial campaigns to digital experiences crafted with precision.
            </p>
          </div>
        </div>

        {/* Project cards — show first 2 */}
        {projects.slice(0, 2).map((project) => {
          const src = imageUrl(project.coverImage, { width: 800 })
          const lqip = project.coverImage?.asset?.metadata?.lqip
          const label = categoryLabel[project.category] ?? project.category

          return (
            <Link
              key={project._id}
              href={`/photography/${project.slug.current}`}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[4/5] bg-slate/8 rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                {src ? (
                  <Image
                    src={src}
                    alt={project.coverImage?.alt ?? project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder={lqip ? 'blur' : 'empty'}
                    blurDataURL={lqip}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-light/60 font-body text-sm">
                    {project.title}
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-4 px-1">
                <div>
                  <span className="font-body text-xs text-slate">{label}</span>
                  <h3 className="font-display text-lg font-medium text-obsidian">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Mobile CTA */}
        <div className="flex lg:hidden justify-start">
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200"
          >
            View All Projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
