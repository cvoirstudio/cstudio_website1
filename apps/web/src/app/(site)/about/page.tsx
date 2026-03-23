import type { Metadata } from 'next'
import Image from 'next/image'
import { Instagram, Linkedin, Github } from 'lucide-react'
import { getTeam, getSiteSettings } from '@/lib/sanity/queries'
import type { TeamMember } from '@/types'
import { imageUrl } from '@/lib/sanity/image'
import AnimatedCounter from '@/components/ui/animated-counter'
import CtaBand from '@/components/sections/cta-band'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogSrc = imageUrl(settings?.seo?.ogImage, { width: 1200 })
  const title = 'About Us'
  const description =
    'We are Cvoir Studio — a creative studio at the intersection of visual storytelling and digital craft.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogSrc ? { images: [{ url: ogSrc, width: 1200, height: 630 }] } : {}),
    },
  }
}

const stats = [
  { to: 120, suffix: '+', label: 'Projects Completed' },
  { to: 6, suffix: '+', label: 'Years of Experience' },
  { to: 94, suffix: '%', label: 'Client Satisfaction' },
  { to: 18, suffix: '', label: 'Cities Worked In' },
]

const values = [
  {
    title: 'Intentionality',
    body: 'Every decision — from composition to colour palette to code architecture — is made with purpose. We don\'t guess; we design.',
  },
  {
    title: 'Craft Obsession',
    body: 'We believe the best creative work lives at the intersection of discipline and obsession. We sweat the details so you don\'t have to.',
  },
  {
    title: 'Radical Clarity',
    body: 'No jargon, no vague timelines. Transparent communication from first conversation to final delivery.',
  },
  {
    title: 'Long-term Thinking',
    body: 'We build things that last — relationships, brands, and code. Our clients return because we invest in their success as our own.',
  },
]

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <>
      {/* Hero — split layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left: editorial image */}
        <div className="relative bg-obsidian min-h-[50vh] lg:min-h-0 order-last lg:order-first">
          <div className="absolute inset-0 flex items-center justify-center text-slate-light font-body text-sm">
            Studio editorial photo
          </div>
        </div>

        {/* Right: text */}
        <div className="flex flex-col justify-center section-py container-px bg-ivory">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-obsidian leading-tight mb-6">
            We are<br />Cvoir Studio.
          </h1>
          <p className="font-body text-base text-slate leading-relaxed max-w-[48ch]">
            Founded at the crossroads of visual storytelling and digital engineering, Cvoir Studio was built on a simple belief: great creative work and great technical work aren't mutually exclusive — they're inseparable.
          </p>
          <p className="font-body text-base text-slate leading-relaxed max-w-[48ch] mt-4">
            We are photographers, filmmakers, and engineers who refuse to choose a lane. Every project we take on, we bring the same obsessive attention to detail — whether it's the light in a portrait or the performance budget of a web application.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-py container-px bg-ivory">
        <div className="text-center mb-12">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-3">
            What Drives Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
          {values.map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-4 p-10 bg-ivory border-r border-b border-border last:border-r-0">
              {/* Brass accent line */}
              <div className="w-8 h-px bg-brass" aria-hidden />
              <h3 className="font-display text-2xl font-light text-obsidian">{title}</h3>
              <p className="font-body text-sm text-slate leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && (
        <section className="section-py container-px bg-ivory">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            The People
          </p>
          <h2 className="font-display text-4xl font-light text-obsidian mb-12">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(team as TeamMember[]).map((member) => {
              const src = imageUrl(member.photo, { width: 600 })
              const lqip = member.photo?.asset?.metadata?.lqip

              return (
                <div key={member._id} className="group flex flex-col gap-4">
                  {/* Portrait */}
                  <div className="relative aspect-square overflow-hidden rounded-full bg-obsidian/5 ring-2 ring-transparent group-hover:ring-brass transition-all duration-300">
                    {src ? (
                      <Image
                        src={src}
                        alt={member.photo?.alt ?? member.name}
                        width={400}
                        height={400}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder={lqip ? 'blur' : 'empty'}
                        blurDataURL={lqip}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-light font-body text-sm">
                        {member.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-body font-medium text-obsidian">{member.name}</h3>
                    <p className="font-body text-xs text-brass tracking-wide mt-0.5">{member.role}</p>
                    {member.bio && (
                      <p className="font-body text-xs text-slate leading-relaxed mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}

                    {/* Social icons */}
                    {member.social && (
                      <div className="flex justify-center gap-3 mt-3">
                        {member.social.instagram && (
                          <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label={`${member.name} on Instagram`}>
                            <Instagram size={14} strokeWidth={1.5} />
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label={`${member.name} on LinkedIn`}>
                            <Linkedin size={14} strokeWidth={1.5} />
                          </a>
                        )}
                        {member.social.github && (
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label={`${member.name} on GitHub`}>
                            <Github size={14} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Stats band */}
      <section className="section-py dark-section grain">
        <div className="container-px grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ to, suffix, label }) => (
            <div key={label} className="flex flex-col gap-2">
              <span className="font-display text-5xl md:text-6xl font-light text-brass leading-none">
                <AnimatedCounter to={to} suffix={suffix} />
              </span>
              <span className="font-body text-xs tracking-[0.15em] text-slate-light uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Studio photo strip */}
      <section className="py-12 bg-ivory overflow-hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-none container-px pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-64 aspect-[3/4] bg-obsidian/5 flex items-center justify-center text-slate-light font-body text-xs"
            >
              Studio photo {i + 1}
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
