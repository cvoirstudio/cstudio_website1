import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Cvoir Studio',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Vision, Captured. Crafted.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'behance', type: 'url', title: 'Behance' },
        { name: 'vimeo', type: 'url', title: 'Vimeo' },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Shown as the hero background when no video is set.',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image for screen readers.',
        },
      ],
    }),
    defineField({
      name: 'photographyHero',
      title: 'Photography Page — Hero Images',
      description: 'Three featured images for the photography hero section (displayed at 50%–25%–25% width). Each links to a project.',
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
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                  description: 'Describe the image for screen readers.',
                },
              ],
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'project',
              title: 'Linked Project',
              type: 'reference',
              to: [{ type: 'project' }],
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: {
              title: 'project.title',
              media: 'image',
            },
          },
        },
      ],
      validation: (R) => R.max(3),
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          initialValue: 'Cvoir Studio',
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          initialValue: 'Photography, videography, and web development studio.',
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Default OG Image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
})
