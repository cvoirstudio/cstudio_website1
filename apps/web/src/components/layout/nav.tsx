'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import MobileMenu from './mobile-menu'

const desktopLinks = [
  { href: '/photography', label: 'Photography' },
  { href: '/web-development', label: 'Web Dev' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    startTransition(() => setMenuOpen(false))
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-500
          ${scrolled
            ? 'backdrop-blur-md bg-obsidian/90 border-b border-white/10 shadow-lg'
            : 'bg-transparent'}
        `}
      >
        <nav className="container-px flex items-center justify-between h-16 md:h-20">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex flex-col leading-none group"
            aria-label="Cvoir Studio home"
          >
            <span className="font-display text-[1.6rem] font-light tracking-[0.35em] text-ivory uppercase group-hover:text-brass transition-colors duration-200">
              CVOIR
            </span>
            <span className="font-body text-[9px] tracking-[0.3em] text-slate-light uppercase mt-0.5 group-hover:text-brass/70 transition-colors duration-200">
              STUDIO
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-8">
            {desktopLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative font-body text-sm tracking-wide pb-0.5
                    transition-colors duration-200 hover:text-brass
                    ${isActive ? 'text-ivory' : 'text-slate-light'}
                  `}
                >
                  {label}
                  {/* Active brass underline */}
                  <span
                    className={`
                      absolute bottom-0 left-0 right-0 h-[2px] bg-brass
                      transition-transform duration-200 origin-left
                      ${isActive ? 'scale-x-100' : 'scale-x-0'}
                    `}
                    aria-hidden
                  />
                </Link>
              )
            })}

            {/* Contact CTA */}
            <Link
              href="/contact"
              className={`
                font-body text-sm tracking-wide px-5 py-2
                border border-brass text-brass
                hover:bg-brass hover:text-obsidian
                transition-all duration-200
                ${pathname === '/contact' ? 'bg-brass text-obsidian' : ''}
              `}
            >
              Contact
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 text-ivory hover:text-brass transition-colors duration-200"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  )
}
