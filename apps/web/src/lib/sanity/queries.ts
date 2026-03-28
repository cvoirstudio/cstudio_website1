import { groq } from 'next-sanity'
import type { Post, Project } from '@/types/sanity'
import { sanityClient } from './client'

// ─── Fragment helpers ─────────────────────────────────────────────────────────

const imageFragment = groq`{
  asset->{ _id, url, metadata { dimensions, lqip } },
  hotspot,
  crop,
  alt
}`

const seoFragment = groq`{
  metaTitle,
  metaDescription,
  ogImage ${imageFragment}
}`

const cacheFields = groq`_id, _type, _updatedAt`

// ─── Projects ─────────────────────────────────────────────────────────────────

const projectCardFields = groq`
  ${cacheFields},
  title,
  slug,
  category,
  subcategory,
  featured,
  excerpt,
  date,
  client,
  "coverImage": coverImage ${imageFragment}
`

export const allProjectsQuery = groq`
  *[_type == "project" ${ '${categoryFilter}' }] | order(date desc) {
    ${projectCardFields}
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(date desc)[0...6] {
    ${projectCardFields}
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${cacheFields},
    title,
    slug,
    category,
    subcategory,
    featured,
    excerpt,
    date,
    client,
    location,
    services,
    videoUrl,
    "coverImage": coverImage ${imageFragment},
    "images": images[] ${imageFragment},
    testimonial,
    body[] {
      ...,
      _type == "image" => { ... ${imageFragment} }
    },
    seo ${seoFragment}
  }
`

// ─── Posts ────────────────────────────────────────────────────────────────────

const postCardFields = groq`
  ${cacheFields},
  title,
  slug,
  publishedAt,
  featured,
  readingTime,
  excerpt,
  "coverImage": coverImage ${imageFragment},
  "author": author->{ name, role, "photo": photo ${imageFragment} },
  "categories": categories[]->{ title, slug, color }
`

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$offset...$limit] {
    ${postCardFields}
  }
`

export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    ${postCardFields}
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${cacheFields},
    title,
    slug,
    publishedAt,
    readingTime,
    excerpt,
    "coverImage": coverImage ${imageFragment},
    "author": author->{ name, role, bio, "photo": photo ${imageFragment}, social },
    "categories": categories[]->{ title, slug, color },
    body[] {
      ...,
      _type == "image" => { ... ${imageFragment} }
    },
    seo ${seoFragment}
  }
`

// ─── Team ─────────────────────────────────────────────────────────────────────

export const teamQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    ${cacheFields},
    name,
    role,
    bio,
    instagram,
    linkedin,
    "photo": image ${imageFragment}
  }
`

// ─── Settings (singleton) ─────────────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    ${cacheFields},
    siteName,
    tagline,
    contactEmail,
    phone,
    address,
    socialLinks,
    heroVideo,
    showreelUrl,
    heroImage { asset->, alt },
    "photographyHero": photographyHero[] {
      image ${imageFragment},
      "project": project->{ _id, title, slug, category }
    },
    seo ${seoFragment}
  }
`

// ─── Typed fetcher functions ──────────────────────────────────────────────────

export async function getAllProjects(category?: string): Promise<Project[]> {
  const filter = category ? `&& category == "${category}"` : ''
  const query = groq`
    *[_type == "project" ${filter}] | order(date desc) {
      ${projectCardFields}
    }
  `
  return sanityClient.fetch(query, {}, { next: { tags: ['project'] } })
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return sanityClient.fetch(featuredProjectsQuery, {}, { next: { tags: ['project'] } })
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return sanityClient.fetch(projectBySlugQuery, { slug }, { next: { tags: [`project:${slug}`] } })
}

export async function getAllPosts(limit = 10, offset = 0): Promise<Post[]> {
  return sanityClient.fetch(
    allPostsQuery,
    { limit: offset + limit, offset },
    { next: { tags: ['post'] } }
  )
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return sanityClient.fetch(featuredPostsQuery, {}, { next: { tags: ['post'] } })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(postBySlugQuery, { slug }, { next: { tags: [`post:${slug}`] } })
}

export async function getTeam() {
  return sanityClient.fetch(teamQuery, {}, { next: { tags: ['team'] } })
}

// ─── Sitemap slug fetchers ────────────────────────────────────────────────────

export async function getAllProjectSlugs(): Promise<{ slug: string; _updatedAt: string }[]> {
  return sanityClient.fetch(
    groq`*[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
    {},
    { next: { tags: ['project'], revalidate: 3600 } }
  )
}

export async function getAllPostSlugs(): Promise<{ slug: string; _updatedAt: string }[]> {
  return sanityClient.fetch(
    groq`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
    {},
    { next: { tags: ['post'], revalidate: 3600 } }
  )
}

export async function getSiteSettings() {
  return sanityClient.fetch(siteSettingsQuery, {}, { next: { tags: ['settings'], revalidate: 3600 } })
}
