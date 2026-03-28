import type { Metadata } from 'next'
import { getSiteSettings, getFeaturedProjects, getFeaturedPosts } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import Hero from '@/components/sections/hero'
import ServicesGrid from '@/components/sections/services-grid'
import PortfolioGrid from '@/components/sections/portfolio-grid'
import Testimonials from '@/components/sections/testimonials'
import BlogPreview from '@/components/sections/blog-preview'
import CtaBand from '@/components/sections/cta-band'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.seo?.metaTitle ?? 'Cvoir Studio — Vision, Captured. Crafted.'
  const description =
    settings?.seo?.metaDescription ??
    'Luxury photography, videography, and web development studio. We create visual experiences that captivate and convert.'
  const ogSrc = imageUrl(settings?.seo?.ogImage, { width: 1200 })

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

export default async function HomePage() {
  const [settings, featuredProjects, featuredPosts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getFeaturedPosts(),
  ])

  const testimonials = featuredProjects
    .filter((p) => p.testimonial?.quote)
    .map((p) => p.testimonial!)

  return (
    <>
      {/* A — Hero */}
      <Hero
        videoUrl={settings?.showreelUrl}
        imageUrl={imageUrl(settings?.heroImage)}
        imageAlt={settings?.heroImage?.alt ?? ''}
      />

      {/* B — Services teaser */}
      <ServicesGrid />

      {/* C — Featured work */}
      {featuredProjects.length > 0 && (
        <PortfolioGrid projects={featuredProjects} />
      )}

      {/* D — Process / Philosophy */}
      <section className="section-py container-px bg-ivory">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: editorial image placeholder */}
          <div className="relative aspect-[3/4] bg-obsidian/5 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 flex items-center justify-center text-slate-light font-body text-sm">
              Team editorial image
            </div>
          </div>

          {/* Right: principles */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
                Our Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian leading-tight">
                Craft over<br />everything.
              </h2>
            </div>

            {[
              { n: '01', title: 'Intention First', body: 'Every frame and every line of code starts with a clear purpose. We ask why before we ask how.' },
              { n: '02', title: 'Minimal, Not Minimal Effort', body: 'Restraint is a craft. We remove until only the essential remains — then we perfect it.' },
              { n: '03', title: 'Details Define Excellence', body: 'The kerning, the timing, the micro-interaction. These are what separate good from extraordinary.' },
              { n: '04', title: 'Partnership Over Transactions', body: 'We invest in understanding your world so deeply that our work becomes an extension of your vision.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-6 items-start">
                <span className="font-display text-3xl font-light text-brass/40 leading-none shrink-0 w-8">
                  {n}
                </span>
                <div>
                  <h3 className="font-body font-medium text-obsidian mb-1">{title}</h3>
                  <p className="font-body text-sm text-slate leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E — Testimonials */}
      <Testimonials items={testimonials} />

      {/* F — Blog preview */}
      {featuredPosts.length > 0 && <BlogPreview posts={featuredPosts} />}

      {/* G — CTA band */}
      <CtaBand />
    </>
  )
}
