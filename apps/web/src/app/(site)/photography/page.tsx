import type { Metadata } from 'next'
import { getAllProjects, getSiteSettings } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import GalleryMasonry from '@/components/portfolio/gallery-masonry'
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

  const [photoProjects, videoProjects] = await Promise.all([
    getAllProjects('photography'),
    getAllProjects('videography'),
  ])

  const filteredPhoto = category
    ? photoProjects.filter((p) => p.subcategory === category)
    : photoProjects

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-end dark-section grain overflow-hidden">
        <div className="absolute inset-0 bg-obsidian/70" aria-hidden />
        <div className="relative z-10 container-px pb-16 pt-40">
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
        <div className="relative z-10 container-px pb-0">
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
      </section>

      {/* Photography gallery */}
      <section className="section-py container-px bg-ivory">
        {filteredPhoto.length > 0 ? (
          <GalleryMasonry projects={filteredPhoto} columns={3} />
        ) : (
          <p className="font-body text-slate text-center py-16">No projects found.</p>
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.coverImage.asset.url}
                        alt={project.coverImage.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
          {[
            { name: 'Essential', price: 'From $1,500', features: ['Half-day shoot', '50 edited images', '2 locations', 'Online gallery'] },
            { name: 'Signature', price: 'From $3,500', features: ['Full-day shoot', '200 edited images', 'Unlimited locations', 'Rush delivery available', 'Print-ready files'], featured: true },
            { name: 'Campaign', price: 'Custom', features: ['Multi-day production', 'Art direction', 'Styling & casting', 'Full usage rights', 'Dedicated account manager'] },
          ].map(({ name, price, features, featured }) => (
            <div
              key={name}
              className={`flex flex-col gap-6 p-10 ${featured ? 'bg-obsidian text-ivory' : 'bg-ivory text-obsidian'}`}
            >
              {featured && (
                <span className="font-body text-[9px] tracking-[0.2em] text-brass uppercase">Most Popular</span>
              )}
              <div>
                <h3 className="font-display text-2xl font-light">{name}</h3>
                <p className={`font-body text-sm mt-1 ${featured ? 'text-brass' : 'text-brass'}`}>{price}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {features.map((f) => (
                  <li key={f} className={`font-body text-sm flex items-center gap-2 ${featured ? 'text-slate-light' : 'text-slate'}`}>
                    <span className="w-1 h-1 rounded-full bg-brass shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className={`font-body text-xs tracking-wide text-center py-3 border transition-colors duration-200 ${
                  featured
                    ? 'border-brass text-brass hover:bg-brass hover:text-obsidian'
                    : 'border-obsidian text-obsidian hover:bg-obsidian hover:text-ivory'
                }`}
              >
                Enquire
              </a>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
