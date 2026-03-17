import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Velour — Real connections. Real places. Real people.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 60%, #1c1917 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,117,13,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,151,76,0.1) 0%, transparent 70%)',
        }} />

        {/* Logo mark */}
        <div style={{
          width: 72, height: 72,
          background: '#ff750d',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 8px 32px rgba(255,117,13,0.3)',
        }}>
          <span style={{ color: 'white', fontSize: 36, fontWeight: 700 }}>G</span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: 24,
          letterSpacing: '-1px',
        }}>
          Stop scrolling.
          <span style={{ color: '#ff750d', display: 'block', fontStyle: 'italic' }}>
            Start gathering.
          </span>
        </div>

        {/* Subline */}
        <div style={{
          fontSize: 26,
          color: '#a8a29e',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.5,
          marginBottom: 48,
        }}>
          Find real people doing real things near you. No algorithm. No feed. No doom.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['🥾 Hiking', '🍜 Cooking', '🎲 Games', '🎨 Arts', '🧘 Yoga'].map(pill => (
            <div key={pill} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 99,
              padding: '10px 20px',
              color: '#d6d3d1',
              fontSize: 18,
            }}>
              {pill}
            </div>
          ))}
        </div>

        {/* Bottom tag */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 18,
          color: '#57534e',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          velour.com &mdash; Free to join
        </div>
      </div>
    ),
    { ...size }
  )
}
