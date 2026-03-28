import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types'
import { imageUrl } from '@/lib/sanity/image'

interface PostCardProps {
  post: Post
  featured?: boolean
  priority?: boolean
}

export default function PostCard({ post, featured, priority }: PostCardProps) {
  const src = imageUrl(post.coverImage, { width: featured ? 1200 : 800 })
  const lqip = post.coverImage?.asset?.metadata?.lqip
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col focus-visible:outline-2 focus-visible:outline-brass"
    >
      {/* Cover image */}
      <div className="relative overflow-hidden bg-obsidian/10 rounded-2xl">
        {src ? (
          <Image
            src={src}
            alt={post.coverImage?.alt ?? post.title}
            width={featured ? 1200 : 800}
            height={featured ? 600 : 500}
            sizes={featured ? '(max-width: 768px) 100vw, 70vw' : '(max-width: 768px) 100vw, 50vw'}
            className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
            priority={priority}
          />
        ) : (
          <div className={`w-full bg-obsidian/10 ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`} aria-hidden />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 pt-4">
        {/* Category badges */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.categories.map((cat) => (
              <span
                key={cat.slug.current}
                className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-brass text-brass"
                style={cat.color ? { borderColor: cat.color, color: cat.color } : undefined}
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        <h2 className={`font-display font-light text-obsidian group-hover:text-brass transition-colors duration-200 leading-snug ${featured ? 'text-3xl' : 'text-xl'}`}>
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="font-body text-sm text-slate leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-1">
          {post.author && (
            <span className="font-body text-xs text-slate-light">{post.author.name}</span>
          )}
          {dateStr && (
            <>
              {post.author && <span className="text-slate/40" aria-hidden>·</span>}
              <time dateTime={post.publishedAt} className="font-body text-xs text-slate-light">
                {dateStr}
              </time>
            </>
          )}
          {post.readingTime && (
            <>
              <span className="text-slate/40" aria-hidden>·</span>
              <span className="font-body text-xs text-slate-light">{post.readingTime} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
