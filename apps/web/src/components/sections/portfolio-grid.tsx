import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/types'
import ProjectCard from '@/components/portfolio/project-card'

interface PortfolioGridProps {
  projects: Project[]
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <section className="section-py dark-section">
      <div className="container-px">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl md:text-5xl font-light text-ivory">
            Selected Work
          </h2>
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 font-body text-sm tracking-wide text-brass hover:text-brass-light transition-colors duration-200 group"
          >
            View All
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid — 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
