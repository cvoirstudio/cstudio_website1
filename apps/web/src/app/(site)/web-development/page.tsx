import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProjects, getSiteSettings } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import CtaBand from '@/components/sections/cta-band'

const PAGE_TITLE = 'Web Development'
const PAGE_DESC =
  'Performance-first websites and applications — from brand launches to complex e-commerce platforms.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogSrc = imageUrl(settings?.seo?.ogImage, { width: 1200 })

  return {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      ...(ogSrc ? { images: [{ url: ogSrc, width: 1200, height: 630 }] } : {}),
    },
  }
}

const techStack = [
  'Next.js', 'TypeScript', 'React', 'Tailwind CSS',
  'PostgreSQL', 'Supabase', 'Python', 'Sanity CMS',
  'Vercel', 'Cloudinary', 'Stripe', 'Resend',
]

const process = [
  { n: '01', title: 'Discovery', desc: 'Deep-dive into your goals, audience, and competitive landscape.' },
  { n: '02', title: 'Design', desc: 'Wireframes → high-fidelity UI with your brand language baked in.' },
  { n: '03', title: 'Build', desc: 'Clean, typed code. Accessible, performant, and built to scale.' },
  { n: '04', title: 'Launch', desc: 'End-to-end testing, SEO audit, and a smooth handoff with training.' },
  { n: '05', title: 'Support', desc: 'Ongoing retainer options for updates, analytics, and growth.' },
]

export default async function WebDevelopmentPage() {
  const projects = await getAllProjects('web-development')

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col justify-center dark-section overflow-hidden">
        {/* Floating characters background */}
        <div className="absolute inset-0 overflow-hidden select-none" aria-hidden>
          {['</', '/>', '{', '}', '=>', '[]', '()', '&&', '||', '??', '...', 'async'].map((char, i) => (
            <span
              key={i}
              className="absolute font-mono text-brass/10 text-2xl md:text-4xl animate-pulse"
              style={{
                left: `${(i * 17 + 5) % 90}%`,
                top: `${(i * 13 + 10) % 80}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className="relative z-10 container-px py-40">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            Digital Craft
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-ivory leading-tight">
            Web Development
            <br />
            <span className="font-body font-light text-slate-light text-3xl md:text-4xl">
              that performs.
            </span>
          </h1>

          <ul className="flex flex-wrap gap-3 mt-8">
            {['E-commerce', 'Branding Sites', 'Web Apps', 'SEO', 'Performance Audits'].map((s) => (
              <li key={s} className="font-body text-xs tracking-wide px-4 py-1.5 border border-white/20 text-slate-light">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Portfolio grid */}
      {projects.length > 0 && (
        <section className="section-py container-px bg-ivory">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            Selected Projects
          </p>
          <h2 className="font-display text-4xl font-light text-obsidian mb-10">Our Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const src = imageUrl(project.coverImage, { width: 900 })
              return (
                <div key={project._id} className="group flex flex-col gap-4">
                  <div className="relative aspect-video overflow-hidden bg-obsidian/5">
                    {src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={project.coverImage?.alt ?? project.title}
                        className="w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:translate-y-[-30%]"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-light text-obsidian">{project.title}</h3>
                    {project.client && (
                      <p className="font-body text-xs text-slate-light mt-0.5">{project.client}</p>
                    )}
                    {project.services && project.services.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.services.map((s) => (
                          <span key={s} className="font-body text-[10px] tracking-wide px-2 py-0.5 bg-obsidian/5 text-slate">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Tech stack */}
      <section className="section-py dark-section">
        <div className="container-px">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            Our Stack
          </p>
          <h2 className="font-display text-4xl font-light text-ivory mb-2">Tools We Trust</h2>
          <p className="font-body text-sm text-slate-light max-w-[50ch] mb-12">
            We pick tools for longevity and performance — nothing trendy, everything battle-tested.
          </p>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-body text-sm px-5 py-2.5 border border-white/20 text-slate-light hover:border-brass hover:text-brass transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="section-py container-px bg-ivory">
        <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
          How We Work
        </p>
        <h2 className="font-display text-4xl font-light text-obsidian mb-12">Our Process</h2>

        {/* Horizontal scrolling on mobile */}
        <div className="flex md:grid md:grid-cols-5 gap-0 overflow-x-auto pb-4 md:pb-0 scrollbar-none border-t border-border">
          {process.map(({ n, title, desc }) => (
            <div key={n} className="min-w-[240px] md:min-w-0 flex flex-col gap-4 pt-8 pr-8 md:pr-4">
              <span className="font-display text-5xl font-light text-brass/30">{n}</span>
              <div>
                <h3 className="font-body font-medium text-obsidian">{title}</h3>
                <p className="font-body text-sm text-slate leading-relaxed mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies — alternating layout */}
      {projects.length > 0 && (
        <section className="dark-section">
          <div className="container-px">
            <div className="py-16 border-b border-white/10">
              <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
                Deep Dives
              </p>
              <h2 className="font-display text-4xl font-light text-ivory">Case Studies</h2>
            </div>

            {projects.slice(0, 3).map((project, i) => {
              const src = imageUrl(project.coverImage, { width: 900 })
              const isEven = i % 2 === 0
              return (
                <div
                  key={project._id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-white/10 ${isEven ? '' : 'lg:[&>*:first-child]:order-last'}`}
                >
                  {src && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={project.coverImage?.alt ?? project.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-5 p-12">
                    <p className="font-body text-[10px] tracking-[0.2em] text-brass uppercase">{project.client}</p>
                    <h3 className="font-display text-3xl font-light text-ivory">{project.title}</h3>
                    {project.excerpt && (
                      <p className="font-body text-sm text-slate-light leading-relaxed">{project.excerpt}</p>
                    )}
                    {project.services && (
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((s) => (
                          <span key={s} className="font-body text-xs px-3 py-1 border border-white/20 text-slate-light">{s}</span>
                        ))}
                      </div>
                    )}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 font-body text-sm text-brass hover:text-brass-light transition-colors duration-200 mt-2"
                    >
                      Start a similar project →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
