import Link from 'next/link'
import { Instagram, Linkedin, Github } from 'lucide-react'

const workLinks = [
  { href: '/photography', label: 'Photography' },
  { href: '/photography', label: 'Videography' },
  { href: '/web-development', label: 'Web Development' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  {
    href: 'https://instagram.com/cvoirstudio',
    label: 'Instagram',
    icon: <Instagram size={18} strokeWidth={1.5} />,
  },
  {
    href: 'https://behance.net/cvoirstudio',
    label: 'Behance',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9h8a3 3 0 0 1 0 6H3V9z" />
        <path d="M3 15h9a3 3 0 0 1 0 6H3v-6z" />
        <path d="M15 9h6" />
        <path d="M15.5 6.5h5" />
        <path d="M21 14.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/company/cvoirstudio',
    label: 'LinkedIn',
    icon: <Linkedin size={18} strokeWidth={1.5} />,
  },
  {
    href: 'https://github.com/cvoirstudio',
    label: 'GitHub',
    icon: <Github size={18} strokeWidth={1.5} />,
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-obsidian text-ivory grain overflow-hidden">
      {/* Main grid */}
      <div className="container-px pt-20 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand column ── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link
              href="/"
              className="flex flex-col leading-none group w-fit"
              aria-label="Cvoir Studio home"
            >
              <span className="font-display text-3xl font-light tracking-[0.35em] text-ivory uppercase group-hover:text-brass transition-colors duration-200">
                CVOIR
              </span>
              <span className="font-body text-[9px] tracking-[0.3em] text-slate-light uppercase mt-1 group-hover:text-brass/70 transition-colors duration-200">
                STUDIO
              </span>
            </Link>

            <p className="font-body text-sm leading-relaxed text-slate-light max-w-[22ch]">
              Vision, Captured. Crafted.
            </p>

            <p className="font-body text-xs leading-relaxed text-slate-/60 max-w-[28ch]">
              Photography · Videography · Web Development — built with intention, delivered with excellence.
            </p>
          </div>

          {/* ── Work links ── */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] text-brass uppercase mb-6">
              Work
            </h3>
            <ul className="flex flex-col gap-3">
              {workLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-body text-sm text-slate-light hover:text-ivory transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company links ── */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] text-brass uppercase mb-6">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-slate-light hover:text-ivory transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect / social ── */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.2em] text-brass uppercase mb-6">
              Connect
            </h3>
            <ul className="flex flex-col gap-3">
              {socialLinks.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-body text-sm text-slate-light hover:text-ivory transition-colors duration-200 group"
                    aria-label={`Cvoir Studio on ${label}`}
                  >
                    <span className="group-hover:text-brass transition-colors duration-200">
                      {icon}
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-body text-xs text-slate/60 tracking-wide">
            &copy; {year} Cvoir Studio. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="font-body text-xs text-slate/60 hover:text-brass transition-colors duration-200 tracking-wide"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
