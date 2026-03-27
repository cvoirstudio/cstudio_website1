import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  videoUrl?: string
  imageUrl?: string
  imageAlt?: string
}

export default function Hero({ videoUrl, imageUrl, imageAlt = '' }: HeroProps) {
  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center dark-section grain overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 container-px text-center flex flex-col items-center gap-8 py-32">
        {/* Label */}
        <span className="font-body text-[10px] tracking-[0.35em] text-brass uppercase">
          Cvoir Studio
        </span>

        {/* Heading */}
        <h1 className="font-display font-bold italic text-ivory text-balance leading-[0.9]" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
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
        <div className="flex flex-wrap gap-4 justify-center mt-2">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden>
        <span className="font-body text-[9px] tracking-[0.3em] text-slate-light uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-brass to-transparent animate-pulse" />
      </div>
    </section>
  )
}
