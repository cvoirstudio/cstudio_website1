import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const services = [
  {
    title: 'Photography & Videography',
    category: 'Visual Stories',
    href: '/photography',
  },
  {
    title: 'Web Development',
    category: 'Digital Craft',
    href: '/web-development',
  },
]

export default function ServicesGrid() {
  return (
    <section className="section-py container-px bg-ivory">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
        {/* Left column — heading + description */}
        <div className="flex flex-col gap-16 lg:pr-8 mt-8 mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-light text-obsidian leading-[1.1]">
              The Art of<br />Visual Craft
            </h2>

            <Link
              href="/about"
              className="hidden lg:inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200 mt-8"
            >
              Explore Services
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div>
            <p className="font-body text-[10px] tracking-[0.3em] text-slate uppercase mb-4">
              ( Services )
            </p>
            <p className="font-body text-base text-slate leading-relaxed max-w-[38ch]">
              Every project serves a creative purpose. We strip away the superfluous, leaving only what actively contributes to your brand&apos;s story. Craft is tested for intention, ensuring longevity without aesthetic compromise.
            </p>
          </div>
        </div>

        {/* Service cards */}
        {services.map(({ title, category, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] bg-slate/8 rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center text-slate-light/60 font-body text-sm">
                {title}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 px-1">
              <div>
                <span className="font-body text-xs text-slate">{category}</span>
                <h3 className="font-display text-lg font-medium text-obsidian">
                  {title}
                </h3>
              </div>
            </div>
          </Link>
        ))}

        {/* Mobile CTA */}
        <div className="flex lg:hidden justify-start">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200"
          >
            Explore Services
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
