import type { Testimonial } from '@/types'

const fallback: Testimonial[] = [
  {
    quote: "Cvoir Studio delivered imagery that perfectly captured our brand's essence. The attention to detail was extraordinary.",
    author: 'Sarah Chen',
    role: 'Creative Director, Maison Blanc',
  },
  {
    quote: 'Our new website transformed how clients perceive us. The team understood our vision immediately and executed flawlessly.',
    author: 'Marcus Williams',
    role: 'Founder, Apex Ventures',
  },
  {
    quote: "The photography and web work together seamlessly. It's a rare studio that excels at both with the same level of craft.",
    author: 'Elena Rossi',
    role: 'Editor-in-Chief, Forma Magazine',
  },
]

interface TestimonialsProps {
  items?: Testimonial[]
}

export default function Testimonials({ items }: TestimonialsProps) {
  const list = items && items.length > 0 ? items : fallback

  return (
    <section className="section-py dark-section grain overflow-hidden">
      <div className="container-px">
        {/* Section label */}
        <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-12">
          Client Stories
        </p>

        {/* Scroll container — horizontal on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-none">
          {list.map((t, i) => (
            <div
              key={i}
              className="min-w-[80vw] sm:min-w-[60vw] md:min-w-0 flex flex-col gap-6 snap-start shrink-0 md:shrink"
            >
              {/* Decorative quote mark */}
              <span className="font-display text-6xl text-brass/30 leading-none select-none" aria-hidden>
                &ldquo;
              </span>

              <blockquote className="font-display text-xl md:text-2xl font-light italic text-ivory leading-relaxed -mt-8">
                {t.quote}
              </blockquote>

              <footer className="flex flex-col gap-0.5 border-t border-white/10 pt-4">
                <cite className="font-body text-sm text-ivory not-italic font-medium">
                  {t.author}
                </cite>
                <span className="font-body text-xs text-slate-light">{t.role}</span>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
