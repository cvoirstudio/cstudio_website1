import type { Metadata } from 'next'
import { Instagram, Linkedin, Github, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { getSiteSettings } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import ContactForm from '@/components/forms/contact-form'

const PAGE_TITLE = 'Contact Us'
const PAGE_DESC =
  'Start a project with Cvoir Studio. Photography, videography, and web development enquiries welcome.'

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

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const email = settings?.contactEmail ?? 'studio@cvoirstudio.com'
  const phone = settings?.phone ?? ''
  const address = settings?.address ?? ''
  const social = settings?.socialLinks

  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
      {/* ── Left info panel ── */}
      <aside className="dark-section grain flex flex-col justify-between section-py container-px pt-32 relative overflow-hidden">
        <div className="flex flex-col gap-10">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl font-light text-ivory leading-tight">
              Let's create<br />something<br />extraordinary.
            </h1>
          </div>

          {/* Contact details */}
          <ul className="flex flex-col gap-5">
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 font-body text-sm text-slate-light hover:text-ivory transition-colors duration-200 group"
                >
                  <Mail size={16} strokeWidth={1.5} className="mt-0.5 text-brass group-hover:text-brass-light shrink-0" />
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-4 font-body text-sm text-slate-light hover:text-ivory transition-colors duration-200 group"
                >
                  <Phone size={16} strokeWidth={1.5} className="mt-0.5 text-brass group-hover:text-brass-light shrink-0" />
                  {phone}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-4">
                <MapPin size={16} strokeWidth={1.5} className="mt-0.5 text-brass shrink-0" />
                <span className="font-body text-sm text-slate-light whitespace-pre-line">{address}</span>
              </li>
            )}
            <li className="flex items-start gap-4">
              <Clock size={16} strokeWidth={1.5} className="mt-0.5 text-brass shrink-0" />
              <span className="font-body text-sm text-slate-light">
                Mon–Fri, 9am–6pm EST<br />
                Response within 1–2 business days
              </span>
            </li>
          </ul>

          {/* Social */}
          {social && (
            <div className="flex gap-4">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label="Instagram">
                  <Instagram size={18} strokeWidth={1.5} />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label="LinkedIn">
                  <Linkedin size={18} strokeWidth={1.5} />
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-slate-light hover:text-brass transition-colors duration-200" aria-label="GitHub">
                  <Github size={18} strokeWidth={1.5} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tagline watermark */}
        <p className="font-display text-[10px] tracking-[0.3em] text-white/10 uppercase mt-auto pt-16 select-none" aria-hidden>
          Vision, Captured. Crafted.
        </p>
      </aside>

      {/* ── Right: form panel ── */}
      <main className="flex flex-col justify-center section-py container-px bg-ivory pt-20 lg:pt-12">
        <div className="max-w-2xl w-full mx-auto">
          <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
            Start a Project
          </p>
          <h2 className="font-display text-3xl font-light text-obsidian mb-8">
            Tell us about your vision.
          </h2>
          <ContactForm />
        </div>
      </main>
    </div>
  )
}
