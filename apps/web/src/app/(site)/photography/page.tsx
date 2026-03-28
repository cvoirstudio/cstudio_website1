import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getAllProjects, getSiteSettings } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import CtaBand from '@/components/sections/cta-band'

const PAGE_TITLE = 'Photography & Videography'
const PAGE_DESC =
  'Editorial portraits, commercial campaigns, wedding films, and brand content — captured with intention.'

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

const categories = [
  { value: '', label: 'All' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'events', label: 'Events' },
  { value: 'aerial', label: 'Aerial' },
]

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function PhotographyPage({ searchParams }: Props) {
  const { category } = await searchParams

  const [photoProjects, videoProjects, settings] = await Promise.all([
    getAllProjects('photography'),
    getAllProjects('videography'),
    getSiteSettings(),
  ])

  const heroSlides = settings?.photographyHero ?? []

  const filteredPhoto = category
    ? photoProjects.filter((p) => p.subcategory === category)
    : photoProjects

  return (
    <>
      {/* Hero — 3 images: 50% / 25% / 25% */}
      <section className="relative dark-section overflow-hidden">
        {/* Image grid */}
        <div className="flex h-[70vh] min-h-[480px]">
          {[0, 1, 2].map((i) => {
            const slide = heroSlides[i]
            const src = slide ? imageUrl(slide.image, { width: i === 0 ? 1200 : 600 }) : ''
            const lqip = slide?.image?.asset?.metadata?.lqip
            const projectSlug = slide?.project?.slug?.current
            const projectTitle = slide?.project?.title

            return (
              <div
                key={i}
                className={`relative overflow-hidden ${i === 0 ? 'w-1/2' : 'w-1/4'}`}
              >
                {src ? (
                  <Image
                    src={src}
                    alt={slide.image?.alt ?? projectTitle ?? ''}
                    fill
                    sizes={i === 0 ? '50vw' : '25vw'}
                    className="object-cover"
                    placeholder={lqip ? 'blur' : 'empty'}
                    blurDataURL={lqip}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-obsidian/40" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" aria-hidden />

                {/* Translucent project button */}
                {projectSlug && projectTitle && (
                  <Link
                    href={`/photography/${projectSlug}`}
                    className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 font-body text-xs tracking-wide text-ivory/90 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 hover:bg-white/20 transition-colors duration-200"
                  >
                    {projectTitle}
                    <ArrowUpRight size={12} />
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="container-px pb-16 pt-24 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent">
            <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
              Our Work
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-ivory leading-tight max-w-[14ch]">
              Photography &<br />Videography
            </h1>
            <p className="font-body text-base text-slate-light mt-4 max-w-[50ch]">
              Editorial portraits, commercial campaigns, wedding films, and brand content — captured with intention and crafted with care.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="container-px bg-obsidian">
            <div className="flex gap-0 border-t border-white/10 overflow-x-auto scrollbar-none">
              {categories.map(({ value, label }) => {
                const isActive = (category ?? '') === value
                return (
                  <a
                    key={value}
                    href={value ? `/photography?category=${value}` : '/photography'}
                    className={`font-body text-xs tracking-[0.15em] uppercase px-5 py-4 whitespace-nowrap border-b-2 transition-colors duration-200 ${
                      isActive
                        ? 'border-brass text-brass'
                        : 'border-transparent text-slate-light hover:text-ivory'
                    }`}
                  >
                    {label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Photography gallery */}
      <section className="section-py container-px bg-ivory">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {/* Left column — heading + description */}
          <div className="flex flex-col gap-16 lg:pr-8 mt-8 mb-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-light text-obsidian leading-[1.1]">
                {category
                  ? categories.find((c) => c.value === category)?.label ?? 'Photography'
                  : (<>All<br />Photography</>)}
              </h2>

              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200 mt-8"
              >
                Book a Session
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-slate uppercase mb-4">
                ( Gallery )
              </p>
              <p className="font-body text-base text-slate leading-relaxed max-w-[38ch]">
                Editorial portraits, commercial campaigns, wedding films, and brand content — captured with intention and crafted with care.
              </p>
            </div>
          </div>

          {/* Project cards — first 2 */}
          {filteredPhoto.slice(0, 2).map((project) => {
            const src = project.coverImage ? imageUrl(project.coverImage, { width: 800 }) : ''
            const lqip = project.coverImage?.asset?.metadata?.lqip

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
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-light/60 font-body text-sm">
                      {project.title}
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4 px-1">
                  <div>
                    <span className="font-body text-xs text-slate">
                      {project.subcategory ?? 'Photography'}
                    </span>
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
              href="/contact"
              className="inline-flex items-center gap-2 font-body text-sm tracking-wide px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200"
            >
              Book a Session
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Full gallery below */}
        {filteredPhoto.length > 2 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhoto.slice(2).map((project) => {
              const src = project.coverImage ? imageUrl(project.coverImage, { width: 800 }) : ''
              const lqip = project.coverImage?.asset?.metadata?.lqip

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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        placeholder={lqip ? 'blur' : 'empty'}
                        blurDataURL={lqip}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-light/60 font-body text-sm">
                        {project.title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4 px-1">
                    <div>
                      <span className="font-body text-xs text-slate">
                        {project.subcategory ?? 'Photography'}
                      </span>
                      <h3 className="font-display text-lg font-medium text-obsidian">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Videography sub-section */}
      {videoProjects.length > 0 && (
        <section className="section-py dark-section">
          <div className="container-px">
            <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
              Moving Image
            </p>
            <h2 className="font-display text-4xl font-light text-ivory mb-10">
              Videography
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoProjects.map((project) => (
                <div key={project._id} className="relative group">
                  <div className="relative aspect-video bg-obsidian/50 overflow-hidden">
                    {project.coverImage?.asset?.url && (
                      <Image
                        src={project.coverImage.asset.url}
                        alt={project.coverImage.alt ?? project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-obsidian/40 group-hover:bg-obsidian/60 transition-colors duration-300">
                      <div className="w-14 h-14 rounded-full border-2 border-ivory flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-ivory ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display text-lg font-light text-ivory">{project.title}</h3>
                    {project.client && (
                      <p className="font-body text-xs text-slate-light mt-0.5">{project.client}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages teaser */}
      <section className="section-py container-px bg-ivory">
        <div className="text-center mb-12">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-3">
            Investment
          </p>
          <h2 className="font-display text-4xl font-light text-obsidian">
            Photography Packages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Essential', price: 'From $1,500', features: ['Half-day shoot', '50 edited images', '2 locations', 'Online gallery'] },
            { name: 'Signature', price: 'From $3,500', features: ['Full-day shoot', '200 edited images', 'Unlimited locations', 'Rush delivery available', 'Print-ready files'], featured: true },
            { name: 'Campaign', price: 'Custom', features: ['Multi-day production', 'Art direction', 'Styling & casting', 'Full usage rights', 'Dedicated account manager'] },
          ].map(({ name, price, features, featured }) => (
            <div
              key={name}
              className={`flex flex-col gap-6 p-10 rounded-2xl transition-shadow duration-300 hover:shadow-lg ${featured ? 'bg-obsidian text-ivory' : 'bg-slate/8 text-obsidian shadow-sm'}`}
            >
              {featured && (
                <span className="font-body text-[9px] tracking-[0.2em] text-brass uppercase">Most Popular</span>
              )}
              <div>
                <h3 className="font-display text-2xl font-light">{name}</h3>
                <p className="font-body text-sm mt-1 text-brass">{price}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {features.map((f) => (
                  <li key={f} className={`font-body text-sm flex items-center gap-2 ${featured ? 'text-slate-light' : 'text-slate'}`}>
                    <span className="w-1 h-1 rounded-full bg-brass shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`font-body text-xs tracking-wide text-center py-3 rounded-full transition-colors duration-200 ${
                  featured
                    ? 'bg-brass text-obsidian hover:bg-brass/80'
                    : 'bg-obsidian text-ivory hover:bg-obsidian/80'
                }`}
              >
                Enquire
              </Link>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
