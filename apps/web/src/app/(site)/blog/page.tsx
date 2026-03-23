import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getFeaturedPosts, getSiteSettings } from '@/lib/sanity/queries'
import { imageUrl } from '@/lib/sanity/image'
import PostCard from '@/components/blog/post-card'

const PAGE_TITLE = 'Blog — Stories & Insights'
const PAGE_DESC = 'Photography tips, web trends, and behind-the-scenes stories from Cvoir Studio.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogSrc = imageUrl(settings?.seo?.ogImage, { width: 1200 })

  return {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      ...(ogSrc ? { images: [{ url: ogSrc, width: 1200, height: 630 }] } : {}),
    },
  }
}

const POSTS_PER_PAGE = 6

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const offset = (page - 1) * POSTS_PER_PAGE

  const [featured, posts] = await Promise.all([
    getFeaturedPosts(),
    getAllPosts(POSTS_PER_PAGE, offset),
  ])

  const featuredPost = featured[0] ?? posts[0]
  const gridPosts = posts.filter((p) => p._id !== featuredPost?._id)
  const hasNext = posts.length === POSTS_PER_PAGE

  return (
    <>
      {/* Hero */}
      <section className="section-py container-px pt-40 bg-ivory">
        <p className="font-body text-[10px] tracking-[0.3em] text-brass uppercase mb-4">
          Journal
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-light text-obsidian leading-tight mb-4">
          Stories &<br />Insights
        </h1>
        <p className="font-body text-base text-slate max-w-[48ch] leading-relaxed">
          Photography tips, web trends, client stories, and behind-the-scenes dispatches from the studio.
        </p>
      </section>

      <div className="container-px pb-24 bg-ivory">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
          {/* Main content */}
          <main>
            {/* Featured post */}
            {featuredPost && (
              <div className="mb-16 pb-16 border-b border-border">
                <PostCard post={featuredPost} featured priority />
              </div>
            )}

            {/* Post grid */}
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {gridPosts.map((post, i) => (
                  <PostCard key={post._id} post={post} priority={i < 2} />
                ))}
              </div>
            ) : (
              <p className="font-body text-slate text-center py-16">No more posts.</p>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
              <Link
                href={`/blog${page > 2 ? `?page=${page - 1}` : ''}`}
                className={`font-body text-sm tracking-wide px-6 py-2.5 border border-border text-obsidian hover:border-brass hover:text-brass transition-colors duration-200 ${page <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
                aria-disabled={page <= 1}
              >
                ← Previous
              </Link>
              <span className="font-body text-xs text-slate-light">Page {page}</span>
              <Link
                href={`/blog?page=${page + 1}`}
                className={`font-body text-sm tracking-wide px-6 py-2.5 border border-border text-obsidian hover:border-brass hover:text-brass transition-colors duration-200 ${!hasNext ? 'opacity-30 pointer-events-none' : ''}`}
                aria-disabled={!hasNext}
              >
                Next →
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-10 pt-2">
            {/* Categories */}
            <div>
              <h2 className="font-body text-[10px] tracking-[0.2em] text-brass uppercase mb-4">
                Categories
              </h2>
              <ul className="flex flex-col gap-1">
                {['Photography', 'Videography', 'Web Development', 'Behind the Scenes', 'Industry'].map((cat) => (
                  <li key={cat}>
                    <a
                      href="#"
                      className="flex items-center justify-between font-body text-sm text-slate hover:text-brass py-1.5 border-b border-border/50 transition-colors duration-200"
                    >
                      {cat}
                      <span className="text-slate-light text-xs">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div className="bg-obsidian p-6 flex flex-col gap-4">
              <h2 className="font-display text-xl font-light text-ivory">
                Stay in the loop
              </h2>
              <p className="font-body text-xs text-slate-light leading-relaxed">
                Monthly digest: new work, blog posts, and studio updates. No spam.
              </p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="font-body text-sm px-4 py-2.5 bg-white/5 border border-white/20 text-ivory placeholder:text-slate-light focus:outline-none focus:border-brass"
                />
                <button
                  type="submit"
                  className="font-body text-xs tracking-wide py-2.5 bg-brass text-obsidian hover:bg-brass-light transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
