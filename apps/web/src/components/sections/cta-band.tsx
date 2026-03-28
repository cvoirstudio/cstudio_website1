import Link from 'next/link'

export default function CtaBand() {
  return (
    <section className="relative py-14 overflow-hidden" style={{ background: 'var(--color-brass)' }}>
      {/* Subtle grain */}
      <div className="absolute inset-0 grain" aria-hidden />

      <div className="relative z-10 container-px text-center flex flex-col items-center gap-8">
        <h2 className="font-display text-4xl md:text-6xl font-light italic text-obsidian text-balance leading-tight max-w-[18ch]">
          Ready to create something extraordinary?
        </h2>
        <Link
          href="/contact"
          className="font-body text-sm tracking-wide px-10 py-4 bg-obsidian text-ivory rounded-full hover:bg-obsidian/80 transition-colors duration-200"
        >
          Start a Project
        </Link>
      </div>
    </section>
  )
}
