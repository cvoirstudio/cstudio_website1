import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the sanity client module before importing queries
vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
  writeClient: {
    fetch: vi.fn(),
  },
}))

import { sanityClient } from '@/lib/sanity/client'
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getTeam,
  getSiteSettings,
  getAllProjectSlugs,
  getAllPostSlugs,
} from '@/lib/sanity/queries'

// Cast to `any` so we can resolve with plain fixture objects rather than
// RawQuerylessQueryResponse — acceptable in test-only code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = vi.mocked(sanityClient.fetch) as unknown as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolve = (value: any) => mockFetch.mockResolvedValueOnce(value)

beforeEach(() => {
  mockFetch.mockReset()
})

// ─── Projects ────────────────────────────────────────────────────────────────

describe('getAllProjects', () => {
  it('fetches projects and returns an array', async () => {
    const fixture = [{ _id: 'p1', title: 'Project One', slug: { current: 'project-one' } }]
    resolve(fixture)

    const result = await getAllProjects()

    expect(mockFetch).toHaveBeenCalledOnce()
    expect(result).toEqual(fixture)
  })

  it('passes category filter when provided', async () => {
    resolve([])

    await getAllProjects('photography')

    const query: string = mockFetch.mock.calls[0][0] as string
    expect(query).toContain('photography')
  })

  it('does not include category filter when omitted', async () => {
    resolve([])

    await getAllProjects()

    const query: string = mockFetch.mock.calls[0][0] as string
    expect(query).not.toContain('"photography"')
  })
})

describe('getFeaturedProjects', () => {
  it('only fetches featured projects', async () => {
    resolve([])

    await getFeaturedProjects()

    const query: string = mockFetch.mock.calls[0][0] as string
    expect(query).toContain('featured == true')
  })
})

describe('getProjectBySlug', () => {
  it('passes slug as a parameter', async () => {
    resolve(null)

    await getProjectBySlug('my-project')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      { slug: 'my-project' },
      expect.objectContaining({ next: { tags: ['project:my-project'] } })
    )
  })

  it('returns null when no document found', async () => {
    resolve(null)
    const result = await getProjectBySlug('nonexistent')
    expect(result).toBeNull()
  })
})

// ─── Posts ───────────────────────────────────────────────────────────────────

describe('getAllPosts', () => {
  it('applies limit and offset parameters', async () => {
    resolve([])

    await getAllPosts(6, 12)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      { limit: 18, offset: 12 },
      expect.any(Object)
    )
  })

  it('defaults to limit=10, offset=0', async () => {
    resolve([])

    await getAllPosts()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      { limit: 10, offset: 0 },
      expect.any(Object)
    )
  })
})

describe('getPostBySlug', () => {
  it('returns post data', async () => {
    const fixture = { _id: 'post1', title: 'Hello World', slug: { current: 'hello-world' } }
    resolve(fixture)

    const result = await getPostBySlug('hello-world')

    expect(result).toEqual(fixture)
  })
})

describe('getFeaturedPosts', () => {
  it('only fetches featured posts', async () => {
    resolve([])

    await getFeaturedPosts()

    const query: string = mockFetch.mock.calls[0][0] as string
    expect(query).toContain('featured == true')
  })
})

// ─── Team ────────────────────────────────────────────────────────────────────

describe('getTeam', () => {
  it('fetches team members ordered by order asc', async () => {
    const fixture = [{ _id: 't1', name: 'Alice', role: 'Photographer' }]
    resolve(fixture)

    const result = await getTeam()

    expect(result).toEqual(fixture)
    const query: string = mockFetch.mock.calls[0][0] as string
    expect(query).toContain('order asc')
  })
})

// ─── Settings ────────────────────────────────────────────────────────────────

describe('getSiteSettings', () => {
  it('uses revalidate cache strategy', async () => {
    resolve({ siteName: 'Cvoir Studio' })

    await getSiteSettings()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({ next: expect.objectContaining({ revalidate: 3600 }) })
    )
  })
})

// ─── Sitemap slug fetchers ────────────────────────────────────────────────────

describe('getAllProjectSlugs', () => {
  it('returns slug + _updatedAt shape', async () => {
    const fixture = [{ slug: 'project-a', _updatedAt: '2025-01-01T00:00:00Z' }]
    resolve(fixture)

    const result = await getAllProjectSlugs()

    expect(result).toEqual(fixture)
  })
})

describe('getAllPostSlugs', () => {
  it('returns slug + _updatedAt shape', async () => {
    const fixture = [{ slug: 'post-a', _updatedAt: '2025-06-01T00:00:00Z' }]
    resolve(fixture)

    const result = await getAllPostSlugs()

    expect(result).toEqual(fixture)
  })
})
