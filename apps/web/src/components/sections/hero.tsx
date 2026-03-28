import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  videoUrl?: string
  imageUrl?: string
  imageAlt?: string
}

export default function Hero({ videoUrl, imageUrl, imageAlt = '' }: HeroProps) {
  return (
    <section className="relative dark-section grain overflow-hidden">
      {/* Background image */}
      {imageUrl && !videoUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden={!imageAlt}
        />
      )}

      {/* Background video */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={videoUrl} />
        </video>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/20 to-obsidian"
        aria-hidden
      />

      {/* Content — min-h handles 70vh, padding clears the fixed nav */}
      <div className="relative z-10 h-[85vh] flex flex-col items-start justify-center container-px gap-6 pt-24 pb-12">
        {/* Label */}
        <span className="font-body text-[10px] tracking-[0.35em] text-brass uppercase">
          Cvoir Studio
        </span>

        {/* Heading */}
        <h1 className="font-display font-bold italic text-ivory text-balance leading-[0.9]" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
          Vision,
          <br />
          Captured.
          <br />
          Crafted.
        </h1>

        {/* Tagline */}
        <p className="font-body text-base text-slate-light max-w-[36ch] leading-relaxed">
          Photography · Videography · Web Development
          <br />
          built with intention, delivered with excellence.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/photography"
            className="font-body text-sm tracking-wide px-8 py-3.5 bg-brass text-obsidian hover:bg-brass-light transition-colors duration-200"
          >
            View Our Work
          </Link>
          <Link
            href="/contact"
            className="font-body text-sm tracking-wide px-8 py-3.5 border border-ivory/40 text-ivory hover:border-brass hover:text-brass transition-colors duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}
