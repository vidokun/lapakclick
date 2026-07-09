import { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: {
    default: 'lapak.click — Domain gratis untuk UMKM Indonesia',
    template: '%s | lapak.click',
  },
  description: 'Dapatkan subdomain gratis .lapak.click untuk website UMKM kamu. Kelola DNS dengan mudah, 100% gratis.',
  keywords: ['subdomain gratis', 'domain UMKM', 'lapak click', 'DNS management gratis', 'website UMKM', 'domain gratis Indonesia'],
  authors: [{ name: 'lapak.click' }],
  creator: 'lapak.click',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lapak.click',
    title: 'lapak.click — Domain gratis untuk UMKM Indonesia',
    description: 'Dapatkan subdomain gratis .lapak.click untuk website UMKM kamu. Kelola DNS dengan mudah, 100% gratis.',
    siteName: 'lapak.click',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'lapak.click — Domain gratis untuk UMKM Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lapak.click — Domain gratis untuk UMKM Indonesia',
    description: 'Dapatkan subdomain gratis .lapak.click untuk website UMKM kamu. Kelola DNS dengan mudah, 100% gratis.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://lapak.click'),
}
