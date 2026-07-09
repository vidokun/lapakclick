import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'lapak.click — Domain gratis untuk UMKM Indonesia',
    short_name: 'lapak.click',
    description: 'Dapatkan subdomain gratis .lapak.click untuk website UMKM kamu. Kelola DNS dengan mudah, 100% gratis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}