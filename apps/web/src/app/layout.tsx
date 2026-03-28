import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cvoirstudio.com'),
  title: {
    default: 'Cvoir Studio',
    template: '%s | Cvoir Studio',
  },
  description: 'Photography, videography, and web development studio.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Cvoir Studio',
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
