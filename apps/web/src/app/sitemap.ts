import type { MetadataRoute } from 'next'
import { getAllProjectSlugs, getAllPostSlugs } from '@/lib/sanity/queries'

const BASE = 'https://cvoirstudio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getAllProjectSlugs(), getAllPostSlugs()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/photography`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/web-development`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map(({ slug, _updatedAt }) => ({
    url: `${BASE}/photography/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map(({ slug, _updatedAt }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
