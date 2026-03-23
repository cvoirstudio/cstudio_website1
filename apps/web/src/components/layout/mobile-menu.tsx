'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'

const links = [
  { href: '/photography', label: 'Photography' },
  { href: '/web-development', label: 'Web Dev' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  pathname: string
}

export default function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-obsidian flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header row */}
          <div className="container-px flex items-center justify-between h-16 md:h-20 border-b border-white/10">
            <Link
              href="/"
              onClick={onClose}
              className="flex flex-col leading-none"
              aria-label="Cvoir Studio home"
            >
              <span className="font-display text-2xl font-light tracking-[0.3em] text-ivory uppercase">
                CVOIR
              </span>
              <span className="font-body text-[10px] tracking-[0.25em] text-slate-light uppercase mt-0.5">
                STUDIO
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-ivory hover:text-brass transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav links */}
          <motion.nav
            className="flex flex-col justify-center flex-1 container-px gap-0 pb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {links.map(({ href, label }) => (
              <motion.div key={href} variants={itemVariants}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between
                    font-display text-4xl sm:text-5xl font-light tracking-wide
                    py-5 border-b border-white/10
                    transition-colors duration-200 hover:text-brass
                    ${pathname.startsWith(href) ? 'text-brass' : 'text-ivory'}
                  `}
                >
                  {label}
                  {pathname.startsWith(href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass" aria-hidden />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Footer tagline */}
          <motion.p
            className="container-px pb-10 font-body text-xs tracking-[0.2em] text-slate-light uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Vision, Captured. Crafted.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
