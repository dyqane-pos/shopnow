'use client'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#f5f5f3' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: 40, marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontWeight: 800, marginBottom: '.5rem' }}>Diçka shkoi keq</h2>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: 13 }}>
          Ndodhi një gabim i papritur. Provo përsëri.
        </p>
        <button
          onClick={reset}
          style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 7, fontWeight: 700, cursor: 'pointer' }}
        >
          Provo përsëri
        </button>
      </div>
    </div>
  )
}
