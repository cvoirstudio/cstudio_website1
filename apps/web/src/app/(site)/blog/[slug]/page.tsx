import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import PortableText from '@/components/blog/portable-text'
import type { SanityBlock } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.seo?.metaTitle ?? post.title
  const description = post.seo?.metaDescription ?? post.excerpt
  const ogSrc =
    imageUrl(post.seo?.ogImage, { width: 1200 }) ??
    imageUrl(post.coverImage, { width: 1200 })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(ogSrc ? { images: [{ url: ogSrc, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const coverSrc = imageUrl(post.coverImage, { width: 1400 })
  const lqip = post.coverImage?.asset?.metadata?.lqip
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <article>
      {/* Hero */}
      <header className="section-py container-px pt-32 bg-ivory">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.categories.map((cat) => (
              <span
                key={cat.slug.current}
                className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-brass text-brass"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-4xl md:text-6xl font-light text-obsidian leading-tight max-w-[20ch] text-balance mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 font-body text-sm text-slate-light">
          {post.author && <span>{post.author.name}</span>}
          {dateStr && <time dateTime={post.publishedAt}>{dateStr}</time>}
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>
      </header>

      {/* Cover image */}
      {coverSrc && (
        <div className="container-px bg-ivory pb-12">
          <Image
            src={coverSrc}
            alt={post.coverImage?.alt ?? post.title}
            width={1400}
            height={700}
            sizes="(max-width: 768px) 100vw, 90vw"
            className="w-full aspect-[2/1] object-cover"
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
            priority
          />
        </div>
      )}

      {/* Body */}
      <div className="container-px bg-ivory pb-24">
        <div className="max-w-2xl">
          {post.body && <PortableText value={post.body as SanityBlock[]} />}
        </div>
      </div>
    </article>
  )
}
