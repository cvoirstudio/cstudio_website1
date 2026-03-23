import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Post } from '@/types'
import PostCard from '@/components/blog/post-card'

interface BlogPreviewProps {
  posts: Post[]
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="section-py bg-ivory">
      <div className="container-px">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-3">
              Stories & Insights
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian">
              From the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 font-body text-sm tracking-wide text-brass hover:text-brass-light transition-colors duration-200 group"
          >
            All Posts
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <PostCard key={post._id} post={post} priority={i === 0} />
          ))}
        </div>

        {/* Mobile "all posts" link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-body text-sm tracking-wide text-brass"
          >
            All Posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
