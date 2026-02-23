import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Minu Kitchen - Restaurant Ordering System',
    short_name: 'Minu Kitchen',
    description: 'Order delicious food from Minu Kitchen with QR code',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f97316',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
      // Uncomment khi đã có icon files:
      // {
      //   src: '/icon-192.png',
      //   sizes: '192x192',
      //   type: 'image/png',
      //   purpose: 'any maskable'
      // },
      // {
      //   src: '/icon-512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      //   purpose: 'any maskable'
      // }
    ],
    orientation: 'portrait',
    categories: ['food', 'restaurant', 'lifestyle'],
    lang: 'vi'
  }
}
