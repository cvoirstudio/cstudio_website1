import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    number: '01',
    title: 'Photography & Videography',
    description: 'Editorial portraits, commercial campaigns, wedding films, and brand content that stop the scroll.',
    href: '/photography',
    cta: 'Explore Work',
  },
  {
    number: '02',
    title: 'Web Development',
    description: 'Performance-first websites and applications — from brand launches to complex e-commerce platforms.',
    href: '/web-development',
    cta: 'See Projects',
  },
]

export default function ServicesGrid() {
  return (
    <section className="section-py container-px bg-ivory">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
        {services.map(({ number, title, description, href, cta }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-6 p-10 bg-ivory hover:bg-obsidian transition-colors duration-500 border-r border-border last:border-r-0 focus-visible:outline-2 focus-visible:outline-brass"
          >
            {/* Hover border */}
            <span className="absolute inset-0 border-2 border-brass opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />

            <span className="font-display text-7xl font-light text-brass/20 group-hover:text-brass/40 transition-colors duration-500 leading-none select-none">
              {number}
            </span>

            <div className="flex flex-col gap-3 flex-1">
              <h2 className="font-display text-2xl font-light text-obsidian group-hover:text-ivory transition-colors duration-500">
                {title}
              </h2>
              <p className="font-body text-sm text-slate group-hover:text-slate-light transition-colors duration-500 leading-relaxed">
                {description}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-body text-xs tracking-wide text-brass group-hover:text-brass-light transition-colors duration-200 uppercase">
              {cta}
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
