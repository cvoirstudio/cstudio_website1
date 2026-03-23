import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'cvoir-studio',
  title: 'Cvoir Studio CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — Site Settings
            S.listItem()
              .title('Site Settings')
              .id('settings')
              .child(
                S.document().schemaType('settings').documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('team').title('Team'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
