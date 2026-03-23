import React from 'react'
import Image from 'next/image'
import { codeToHtml } from 'shiki'
import { PortableText as SanityPortableText, type PortableTextComponents } from 'next-sanity'
import type { SanityBlock } from '@/types'
import { imageUrl } from '@/lib/sanity/image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function CodeBlock({ value }: { value: any }) {
  const code: string = value.code ?? ''
  const lang: string = value.language ?? 'text'
  const html = await codeToHtml(code, { lang, theme: 'github-dark' })

  return (
    <figure className="my-6">
      {value.filename && (
        <figcaption className="font-mono text-xs bg-obsidian text-slate-light px-4 py-2 rounded-t border-b border-white/10">
          {value.filename}
        </figcaption>
      )}
      <div
        className={`[&>pre]:font-mono [&>pre]:text-sm [&>pre]:overflow-x-auto [&>pre]:p-5 [&>pre]:leading-relaxed ${value.filename ? '[&>pre]:rounded-b' : '[&>pre]:rounded'}`}
        // shiki output is safe — server-generated, not user HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base leading-relaxed text-obsidian mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-3xl font-light text-obsidian mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl font-light text-obsidian mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-body font-medium text-lg text-obsidian mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-display text-2xl font-light italic text-obsidian border-l-2 border-brass pl-6 my-8">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-brass underline underline-offset-2 hover:text-brass-light transition-colors duration-200"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="font-body text-base text-obsidian mb-5 space-y-2 list-disc list-outside pl-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="font-body text-base text-obsidian mb-5 space-y-2 list-decimal list-outside pl-6">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: { value: any }) => {
      const src = imageUrl(value, { width: 1200 })
      if (!src) return null
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={value.alt ?? ''}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 800px"
            className="w-full object-cover"
            placeholder={value.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={value.asset?.metadata?.lqip}
          />
          {value.caption && (
            <figcaption className="font-body text-xs text-slate-light text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callout: ({ value }: { value: any }) => {
      const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        tip: 'bg-brass/5 border-brass text-obsidian',
        warning: 'bg-amber-50 border-amber-300 text-amber-900',
      }
      const cls = variants[value.variant as keyof typeof variants] ?? variants.info
      return (
        <div className={`font-body text-sm leading-relaxed border-l-4 px-5 py-4 my-6 rounded-r ${cls}`}>
          {value.text}
        </div>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codeBlock: CodeBlock as unknown as React.ComponentType<any>,
  },
}

export default function PortableText({ value }: { value: SanityBlock[] }) {
  return <SanityPortableText value={value} components={components} />
}
