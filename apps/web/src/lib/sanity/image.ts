import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImage) {
  return builder.image(source).auto('format').fit('max')
}

/** Returns a plain URL string, ready for next/image src */
export function imageUrl(
  source: SanityImage | undefined | null,
  { width, height }: { width?: number; height?: number } = {}
): string {
  if (!source?.asset) return ''
  let b = builder.image(source).auto('format')
  if (width) b = b.width(width)
  if (height) b = b.height(height)
  return b.url()
}
