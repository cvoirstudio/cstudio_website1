export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    dimensions: { width: number; height: number; aspectRatio: number }
    lqip: string
  }
}

export interface SanityImage {
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt: string
  caption?: string
}

export interface SanitySEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

export interface Author {
  name: string
  role: string
  bio?: string
  photo?: SanityImage
  social?: {
    instagram?: string
    linkedin?: string
    behance?: string
    github?: string
  }
}

export interface Category {
  title: string
  slug: { current: string }
  color?: string
  description?: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
}

export interface Project {
  _id: string
  _type: 'project'
  _updatedAt: string
  title: string
  slug: { current: string }
  category: 'photography' | 'videography' | 'web-development'
  subcategory?: string
  featured?: boolean
  excerpt?: string
  date?: string
  client?: string
  location?: string
  services?: string[]
  videoUrl?: string
  coverImage?: SanityImage
  images?: SanityImage[]
  testimonial?: Testimonial
  body?: SanityBlock[]
  seo?: SanitySEO
}

export interface Post {
  _id: string
  _type: 'post'
  _updatedAt: string
  title: string
  slug: { current: string }
  publishedAt?: string
  readingTime?: number
  featured?: boolean
  excerpt?: string
  coverImage?: SanityImage
  author?: Author
  categories?: Category[]
  body?: SanityBlock[]
  seo?: SanitySEO
}

export interface TeamMember {
  _id: string
  _type: 'team'
  _updatedAt: string
  name: string
  role: string
  bio?: string
  photo?: SanityImage
  social?: {
    instagram?: string
    linkedin?: string
    behance?: string
    github?: string
  }
  order?: number
}

export interface SiteSettings {
  _id: string
  _type: 'settings'
  _updatedAt: string
  siteName?: string
  tagline?: string
  contactEmail?: string
  phone?: string
  address?: string
  socialLinks?: {
    instagram?: string
    behance?: string
    linkedin?: string
    github?: string
  }
  heroVideo?: string
  showreelUrl?: string
  seo?: {
    metaDescription?: string
    ogImage?: SanityImage
  }
}

export interface SanityBlock {
  _key: string
  _type: string
  [key: string]: unknown
}
