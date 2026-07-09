import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'lapak.click — Domain gratis untuk UMKM Indonesia'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.2)',
            fontSize: '72px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '32px',
          }}
        >
          L
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          lapak.click
        </div>
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          Domain gratis untuk UMKM Indonesia
        </div>
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              color: 'white',
            }}
          >
            subdomain.lapak.click
          </div>
          <div
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              fontSize: '18px',
              color: 'white',
            }}
          >
            DNS Management
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}