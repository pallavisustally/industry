'use client'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #2e1065, #0f172a)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <img src="/brand/logomark-white.svg" alt="Sustally" style={{ height: '48px', width: '48px' }} />
          <div>
            <h1 style={{ fontSize: '32px', margin: 0, fontWeight: 800, background: 'linear-gradient(to right, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sustally Scope 1
            </h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '16px' }}>Backend API & CMS Portal</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px 16px', borderRadius: '8px', marginBottom: '32px', fontSize: '14px', fontWeight: 600 }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'ping 1s infinite' }} />
          Service Status: API & Database Online (Port 3000)
        </div>

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', marginBottom: '16px', color: '#e2e8f0' }}>
          Available Services
        </h2>
        
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '32px' }}>
          <a href="/admin" style={{
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>Payload CMS Admin Panel</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#ddd6fe', lineHeight: 1.4 }}>
              Manage organizations, facilities, emission factors, and view calculated logs in the database.
            </p>
          </a>

          <div style={{
            background: 'rgba(51, 65, 85, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>API v1 Endpoints</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              <li><code>GET /api/v1/factors</code></li>
              <li><code>POST /api/v1/calculations/cement/validate</code></li>
              <li><code>POST /api/v1/calculations/cement/calculate</code></li>
              <li><code>POST /api/v1/calculations/export</code></li>
            </ul>
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '16px 20px', borderRadius: '8px', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
          <strong>Note:</strong> The frontend user interface has been separated and runs on port <code>3001</code>. If you are developing locally, make sure both servers are running.
        </div>
      </div>
    </main>
  )
}
