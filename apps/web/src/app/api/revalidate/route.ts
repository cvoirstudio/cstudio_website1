import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Map Sanity document types to cache tags used in fetchers
const typeToTags: Record<string, string[]> = {
  project: ['project'],
  post: ['post'],
  team: ['team'],
  settings: ['settings'],
  category: ['post'], // category changes affect post listings
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret')
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const body = await request.json() as {
      _type?: string
      slug?: { current: string }
    }

    const docType = body._type
    if (!docType) {
      return NextResponse.json({ message: 'Missing _type' }, { status: 400 })
    }

    const tags = typeToTags[docType]
    if (!tags) {
      return NextResponse.json({ message: `Unknown type: ${docType}`, revalidated: false })
    }

    // Revalidate broad tag
    for (const tag of tags) {
      revalidateTag(tag, 'max')
    }

    // Also revalidate slug-specific tag when available
    if (body.slug?.current) {
      revalidateTag(`${docType}:${body.slug.current}`, 'max')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error('[revalidate]', error)
    return NextResponse.json({ message: 'Revalidation failed' }, { status: 500 })
  }
}
