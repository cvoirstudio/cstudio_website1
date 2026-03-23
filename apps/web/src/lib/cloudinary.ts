export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number; format?: string } = {}
) {
  const { width, height, quality = 'auto', format = 'auto' } = options
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const transforms = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}
