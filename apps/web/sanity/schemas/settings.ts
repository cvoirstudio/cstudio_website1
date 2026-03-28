import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Cvoir Studio',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Vision, Captured. Crafted.',
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Default Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Default Meta Description', type: 'text', validation: (Rule) => Rule.max(160) }),
        defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image' }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'photographyHero',
      title: 'Photography Page — Hero Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSlide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'project',
              title: 'Linked Project',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'behance', title: 'Behance URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video URL',
      type: 'url',
      description: 'Background video for the hero section',
    }),
    defineField({
      name: 'showreelUrl',
      title: 'Showreel URL',
      type: 'url',
      description: 'Full showreel video URL (Vimeo / YouTube)',
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
})
