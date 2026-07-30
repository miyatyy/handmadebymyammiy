import { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from 'react'
import FlowerCursor from './FlowerCursor'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pos { x: number; y: number }
interface Confetti { id: number; x: number; y: number; emoji: string; dx: number; dy: number; rot: number }

// ─── Constants ────────────────────────────────────────────────────────────────
const CONFETTI_EMOJIS = ['🌸', '✨', '💮', '🌼', '🪷', '💫', '🌺', '⭐', '🌷']

const PRODUCTS = [
  {
    id: 1,
    name: 'Buket Custom Kawat Bulu',
    desc: 'Bisa custom bentuk dan warna bunga sesuai selera kamu. Unik & tahan lama!',
    price: 'Custom Chat',
    badge: 'Custom Order 🎨',
    clay: 'clay-pink',
    img: 'daisy.jpg', // Gambar buket kreasi unik
    alt: 'Buket Custom Kawat Bulu',
    accent: '#F4D5CC',
  },
  {
    id: 2,
    name: 'Buket Thumbelina (S, M, L, XL)',
    desc: 'Buket cantik berbagai ukuran dari S sampai XL. Bisa request warna & tema!',
    price: 'Start Rp65.000',
    badge: 'Bestseller ♡',
    clay: 'clay-lavender',
    img: 'thumbelina.jpg', // Gambar buket bunga pastel
    alt: 'Buket Thumbelina',
    accent: '#E8DFF5',
  },
  {
    id: 3,
    name: 'Buket Mini Daisy (Isi 15 Tangkai)',
    desc: 'Buket mungil nan menggemaskan. Bebas custom jumlah tangkai dan kombinasi warna.',
    price: 'Start Rp35.000',
    badge: 'Favorite 🌼',
    clay: 'clay-peach',
    img: 'daisy3.jpeg', // Gambar bunga daisy
    alt: 'Buket Mini Daisy',
    accent: '#FCE1E4',
  },
  {
    id: 4,
    name: 'Ganci Kawat Bulu (Chicken Cute & More)',
    desc: 'Gantungan kunci kawat bulu super imut. Chat mimin dulu untuk konsultasi custom ya!',
    price: 'Start Rp25.000',
    badge: 'Cute Item 🐥',
    clay: 'clay-sage',
    img: 'chiken.jpg', // Gambar gantungan lucu/boneka mungil
    alt: 'Gantungan Kunci Kawat Bulu',
    accent: '#E2F0CB',
  },
  {
    id: 5,
    name: 'Ganci Kain Flanel Custom',
    desc: 'Gantungan kunci kain flanel bebas request karakter apa saja sesuai kehendakmu!',
    price: 'Start Rp45.000',
    badge: 'Bebas Custom ✨',
    clay: 'clay-pink',
    img: 'kainflanel.jpg', // Gambar aksesoris/ganci handmade
    alt: 'Gantungan Kunci Kain Flanel',
    accent: '#F4D5CC',
  },
  {
    id: 6,
    name: 'Aesthetic Cotton Bag',
    desc: 'Tas katun cantik & estetik. Setiap pembelian sudah include Free Bagcharm Special!',
    price: 'Start Rp95.000',
    badge: 'Free Bagcharm 👜',
    clay: 'clay-lavender',
    img: 'cottonbag.jpg', // Gambar tote bag / cotton bag
    alt: 'Cotton Bag Handmade',
    accent: '#E8DFF5',
  },
]

// ─── Utility ─────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('in') }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`fade-up${delay ? ` d${delay}` : ''}`} style={style}>
      {children}
    </div>
  )
}

// ─── Animated Mesh Background ─────────────────────────────────────────────────
// ─── Animated Mesh Background (Gradasi Bergerak) ──────────────────────────────
function MeshBackground() {
  return (
    <>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          background: 'linear-gradient(-45deg, #FAF7F2, #FCE1E4, #E8DFF5, #F4D5CC, #FAF7F2)',
          backgroundSize: '400% 400%',
          animation: 'gradientMove 12s ease infinite',
        }}
      />
    </>
  )
}

// ─── Confetti System ─────────────────────────────────────────────────────────
function useConfetti() {
  const [particles, setParticles] = useState<Confetti[]>([])
  const idRef = useRef(0)

  const burst = useCallback((x: number, y: number) => {
    const count = 10
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360
      const rad = (angle * Math.PI) / 180
      const dist = 80 + Math.random() * 60
      const id = idRef.current++
      return {
        id,
        x,
        y,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        dx: Math.cos(rad) * dist,
        dy: Math.sin(rad) * dist,
        rot: (Math.random() - 0.5) * 360,
      }
    })
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      const ids = newParticles.map(p => p.id)
      setParticles(prev => prev.filter(p => !ids.includes(p.id)))
    }, 1200)
  }, [])

  const Renderer = () => (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: p.x,
            top: p.y,
            '--cf-end': `translate(${p.dx}px, ${p.dy}px)`,
            '--cf-rot': `${p.rot}deg`,
          } as CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </>
  )

  return { burst, Renderer }
}

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, scale: 1 })
  const animRef = useRef<number | null>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 10
    const rotX = -((y - cy) / cy) * 10
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(() => setTilt({ rotX, rotY, scale: 1.04 }))
  }

  function handleLeave() {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(() => setTilt({ rotX: 0, rotY: 0, scale: 1 }))
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transform: `perspective(700px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale(${tilt.scale})`,
        transition: tilt.scale === 1
          ? 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease'
          : 'transform 0.12s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

// ─── Floating 3D Element ──────────────────────────────────────────────────────
function Float3D({ emoji, size, style, animation = 'floatY 6s ease-in-out infinite' }: { emoji: string; size: number; style?: CSSProperties; animation?: string }) {
  return (
    <div style={{
      fontSize: size,
      lineHeight: 1,
      display: 'inline-block',
      animation,
      filter: `drop-shadow(0 ${size * 0.15}px ${size * 0.3}px rgba(200,150,150,0.35))`,
      ...style,
    }}>
      {emoji}
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hoverLink, setHoverLink] = useState<string | null>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: 'Home',           href: '#home' },
    { label: 'Flower & Craft', href: '#products' },
    { label: 'Cotton Bags ✨', href: '#bags' },
    { label: 'Our Story',      href: '#story' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '0 24px' : '8px 24px',
      transition: 'padding 0.3s',
    }}>
      <div
        className="glass"
        style={{
          maxWidth: 1160,
          margin: '12px auto 0',
          borderRadius: scrolled ? 20 : 28,
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: 20,
          transition: 'border-radius 0.3s, box-shadow 0.3s',
          boxShadow: scrolled
            ? '0 8px 40px rgba(200,150,150,0.2)'
            : '0 4px 24px rgba(200,150,150,0.12)',
        }}
      >
        <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(145deg, #FAEEE9, #EDE4FA)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(200,150,150,0.25), 0 1px 0 rgba(255,255,255,0.9) inset',
          }}>
            <img src="/logo.png" style={{ width: '200%', height: '100%', borderRadius: '100%' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, color: 'var(--taupe)', lineHeight: 1 }}>
              handmade
            </div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 300, fontSize: 10, color: 'var(--taupe-lt)', lineHeight: 1, letterSpacing: '0.04em' }}>
              by myammiy
            </div>
          </div>
        </a>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onMouseEnter={() => setHoverLink(l.label)}
              onMouseLeave={() => setHoverLink(null)}
              style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-h)',
                color: hoverLink === l.label ? 'var(--taupe)' : 'var(--taupe-lt)',
                background: hoverLink === l.label ? 'rgba(244,213,204,0.45)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href="https://id.shp.ee/uRr5bJn9"
            target="_blank"
            rel="noreferrer"
            className="clay-btn clay-btn-pink"
            style={{ padding: '9px 20px', fontSize: 13 }}
          >
            🛍️ Visit Shopee Store
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="show-mobile"
            style={{ background: 'rgba(244,213,204,0.5)', border: 'none', borderRadius: 12, width: 36, height: 36, fontSize: 18, }}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass show-mobile" style={{ maxWidth: 1160, margin: '4px auto 0', borderRadius: 20, padding: '16px 24px', display: 'none', flexDirection: 'column', gap: 4 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ padding: '12px 0', color: 'var(--taupe)', textDecoration: 'none', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: 15, borderBottom: '1px solid rgba(200,150,150,0.15)' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: '100dvh',
        paddingTop: 100,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 120, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(244,213,204,0.25)', filter: 'blur(2px)', border: '1px solid rgba(244,213,204,0.4)' }} />
      <div style={{ position: 'absolute', bottom: 60, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(232,223,245,0.2)', filter: 'blur(2px)', border: '1px solid rgba(232,223,245,0.35)' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 80px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <FadeUp>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div className="clay clay-pink" style={{ padding: '6px 16px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ animation: 'heartbeat 2.5s ease-in-out infinite', display: 'inline-block' }}>🌸</span>
                <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 12, color: '#5A3A35', letterSpacing: '0.05em' }}>
                  Small Batch · 100% Handcrafted
                </span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={1}>
            <h1 style={{
              fontFamily: 'var(--font-h)',
              fontSize: 'clamp(36px, 5vw, 62px)',
              fontWeight: 700,
              color: 'var(--taupe)',
              lineHeight: 1.2,
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}>
              Hand-Stitched<br />
              with Heart &{' '}
              <span style={{
  display: 'inline-block',
  background: 'linear-gradient(135deg, #D47A93 0%, #8E6C9E 50%, #D4808C 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
}}>
  Dreamy Pastel Magic
</span>
              {' '}♡
            </h1>
          </FadeUp>

          <FadeUp delay={2}>
            <p style={{ fontSize: 17, color: 'var(--taupe-lt)', lineHeight: 1.78, maxWidth: 420, marginBottom: 36, fontFamily: 'var(--font-b)' }}>
              Every stem carefully shaped, every seam hand-stitched with love. Discover cute pipe cleaner keychains, aesthetic bag charms, and everyday cotton bags designed to bring a little dreamy magic into your life. ✨
            </p>
          </FadeUp>

          <FadeUp delay={3}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 44 }}>
              <a href="#products" className="clay-btn clay-btn-pink" style={{ padding: '14px 28px', fontSize: 15, textDecoration: 'none' }}>
                ✿ Explore Collection
              </a>
              <a
                href="https://id.shp.ee/uRr5bJn9"
                target="_blank"
                rel="noreferrer"
                className="clay-btn clay-btn-lavender"
                style={{ padding: '14px 28px', fontSize: 15, textDecoration: 'none' }}
              >
                🛍️ Shopee Store
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={4}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { icon: '🌸', val: '200+', lbl: 'Bouquets Made' },
                { icon: '⭐', val: '4.9',  lbl: 'Avg Rating' },
                { icon: '🎀', val: '100%', lbl: 'Handmade' },
              ].map(s => (
                <div key={s.lbl} className="clay" style={{ padding: '12px 18px', borderRadius: 18, textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 20, color: 'var(--taupe)', lineHeight: 1.1, marginTop: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-b)', marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={2}>
          <div style={{ position: 'relative', height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="clay clay-peach" style={{ maxWidth: 320,width: '100%', height: 400, borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src="custom.jpeg"
                alt="Handmade fuzzy bouquet"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 36 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(250,240,240,0.35) 100%)', borderRadius: 36 }} />
              <div className="clay clay-pink" style={{ position: 'absolute', bottom: 16, left: 16, right: 16, padding: '10px 16px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🧶</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, color: '#5A3A35' }}>Handmade with Love</div>
                  <div style={{ fontSize: 11, color: '#8A6A65', fontFamily: 'var(--font-b)' }}>Every stitch placed by hand</div>
                </div>
              </div>
            </div>

            <Float3D emoji="🌸" size={52} animation="floatY 4.5s ease-in-out infinite" style={{ position: 'absolute', top: 30, left: 10 }} />
            <Float3D emoji="🌺" size={40} animation="floatY2 5.5s ease-in-out infinite" style={{ position: 'absolute', top: 60, right: 20, animationDelay: '1s' }} />
            <Float3D emoji="✨" size={34} animation="floatY3 3.8s ease-in-out infinite" style={{ position: 'absolute', bottom: 80, left: 0, animationDelay: '0.5s' }} />
            <Float3D emoji="🪷" size={44} animation="floatY 5s ease-in-out infinite" style={{ position: 'absolute', bottom: 40, right: 10, animationDelay: '2s' }} />
            <Float3D emoji="💫" size={28} animation="floatY2 4s ease-in-out infinite" style={{ position: 'absolute', top: 160, right: -10, animationDelay: '1.5s' }} />
            <Float3D emoji="🧵" size={36} animation="floatY3 6s ease-in-out infinite" style={{ position: 'absolute', top: 200, left: -15, animationDelay: '0.8s' }} />

            <div className="clay" style={{ position: 'absolute', top: 10, right: -20, padding: '10px 14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 10, animation: 'floatY2 7s ease-in-out infinite', animationDelay: '3s' }}>
              <span style={{ fontSize: 22 }}>🌷</span>
              <div>
                <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, color: 'var(--taupe)' }}>Fresh Drop!</div>
                <div style={{ fontSize: 10, color: 'var(--taupe-xlt)' }}>New bouquet styles</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #home > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Product Showcase ─────────────────────────────────────────────────────────
function ProductShowcase({ burst }: { burst: (x: number, y: number) => void }) {
  function handleCardClick(e: React.MouseEvent) {
    burst(e.clientX, e.clientY)
  }

  return (
    <section id="products" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <FadeUp>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18 }}>
              <Float3D emoji="🌸" size={28} animation="floatY 4s ease-in-out infinite" style={{ display: 'inline-block' }} />
              <Float3D emoji="🌺" size={28} animation="floatY2 5s ease-in-out infinite" style={{ display: 'inline-block' }} />
              <Float3D emoji="🌷" size={28} animation="floatY3 4.5s ease-in-out infinite" style={{ display: 'inline-block' }} />
            </div>
          </FadeUp>
          <FadeUp delay={1}>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, color: 'var(--taupe)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
              Flower & Craft Collection ✿
            </h2>
          </FadeUp>
          <FadeUp delay={2}>
            <p style={{ fontSize: 16, color: 'var(--taupe-lt)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontFamily: 'var(--font-b)' }}>
              Small batch, big love. Each piece is hand-crafted — hover to feel the magic, click for a surprise. 💫
            </p>
          </FadeUp>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {PRODUCTS.map((p, i) => (
            <FadeUp key={p.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <TiltCard
                className={`clay ${p.clay}`}
                style={{ borderRadius: 28, overflow: 'hidden', height: '100%' }}
              >
                <div onClick={handleCardClick}>
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '5/6', background: p.accent }}>
                    <img
                      src={p.img}
                      alt={p.alt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    <div className="clay" style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 999 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-h)', color: 'var(--taupe)' }}>
                        {p.badge}
                      </span>
                    </div>

                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 12,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-h)',
                      color: '#5A3A35',
                      border: '1px solid rgba(255,255,255,0.8)',
                    }}>
                      🤍 Handmade
                    </div>
                  </div>

                  <div style={{ padding: '18px 20px 20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 17, color: 'var(--taupe)', margin: '0 0 6px', lineHeight: 1.3 }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--taupe-lt)', lineHeight: 1.6, margin: '0 0 14px', fontFamily: 'var(--font-b)' }}>
                      {p.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 19, color: 'var(--taupe)' }}>
                        {p.price}
                      </span>
                      <a
                        href="https://id.shp.ee/uRr5bJn9"
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => { e.stopPropagation(); burst(e.clientX, e.clientY) }}
                        className="clay-btn clay-btn-pink"
                        style={{ padding: '9px 18px', fontSize: 12, textDecoration: 'none' }}
                      >
                        Buy on Shopee 🛍️
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <a
              href="https://id.shp.ee/uRr5bJn9"
              target="_blank"
              rel="noreferrer"
              className="clay-btn clay-btn-lavender"
              style={{ padding: '15px 40px', fontSize: 15, textDecoration: 'none' }}
            >
              ✿ See All on Shopee Store
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Cotton Bag Teaser ────────────────────────────────────────────────────────
function CottonBagTeaser({ burst }: { burst: (x: number, y: number) => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleNotify(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) { setSent(true); setEmail('') }
  }

  return (
    <section id="bags" style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(232,223,245,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          <FadeUp delay={1}>
  <div style={{ position: 'relative' }}>
    <TiltCard style={{ borderRadius: 36, overflow: 'hidden' }}>
      <div className="clay clay-lavender" style={{ borderRadius: 36, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          
          {/* 1. Gambar Kiri (Besar) */}
          <div style={{ gridRow: '1/3', borderRadius: 24, overflow: 'hidden', aspectRatio: '3/4', background: 'var(--lavender)' }}>
            <img
              src="/cottonbag1.jpg"
              alt="White cotton bag hanging on door"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 24 }}
            />
          </div>

          {/* 2. Gambar Kanan Atas */}
          <div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '1/1', background: 'var(--peach)' }}>
            <img
              src="/cottonbag2.jpg"
              alt="White tote bag"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 18 }}
            />
          </div>

          {/* 3. VIDEO KANAN BAWAH (Kotak Kecil Bawah) */}
          <div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '1/1', background: 'var(--sage)' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 18 }}
            >
              <source src="/sneak-peek.mp4" type="video/mp4" />
              Browser kamu tidak mendukung pemutaran video.
            </video>
          </div>

        </div>
      </div>
    </TiltCard>

    <div className="clay clay-pink" style={{ position: 'absolute', top: -16, right: -16, padding: '10px 18px', borderRadius: 20, transform: 'rotate(5deg)', animation: 'floatY2 5s ease-in-out infinite' }}>
      <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, color: '#5A3A35' }}>👀 Sneak Peek</span>
    </div>

    <Float3D emoji="🧺" size={42} animation="floatY 6s ease-in-out infinite" style={{ position: 'absolute', bottom: -20, left: -20 }} />
    <Float3D emoji="✨" size={28} animation="floatY3 4s ease-in-out infinite" style={{ position: 'absolute', top: 80, left: -30, animationDelay: '1s' }} />
  </div>
</FadeUp>

          <div>
            <FadeUp>
              <div style={{ display: 'inline-flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <div className="clay clay-pink" style={{ padding: '5px 14px', borderRadius: 999 }}>
                  <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 11, color: '#5A3A35', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✨ Coming Soon</span>
                </div>
                <div className="clay clay-sage" style={{ padding: '5px 14px', borderRadius: 999 }}>
                  <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 11, color: '#3A5A3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🧺 Cotton Bags</span>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={1}>
              <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--taupe)', margin: '0 0 18px', lineHeight: 1.25, letterSpacing: '-0.015em' }}>
                The Cute & Aesthetic{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #E8DFF5, #FCE1E4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Cotton Bag
                </span>{' '}
                Collection ♡
              </h2>
            </FadeUp>

            <FadeUp delay={2}>
              <p style={{ fontSize: 16, color: 'var(--taupe-lt)', lineHeight: 1.78, margin: '0 0 26px', fontFamily: 'var(--font-b)' }}>
                Versatile, soft, and hand-stitched cotton bags designed to elevate your daily aesthetic outfit. Perfect for campus, 
                market trips, and dreamy weekend adventures. 🌿
              </p>
            </FadeUp>

            <FadeUp delay={3}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
                {['🌿 Natural Cotton', '✂️ Hand-Stitched', '🎨 Custom Prints', '♻️ Eco-Friendly'].map(f => (
                  <div key={f} className="clay" style={{ padding: '7px 14px', borderRadius: 999 }}>
                    <span style={{ fontSize: 12, color: 'var(--taupe)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>{f}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={4}>
              {sent ? (
                <div className="clay clay-sage" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Float3D emoji="💌" size={32} animation="heartbeat 2s ease-in-out infinite" />
                  <div>
                    <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: '#3A5A3A', fontSize: 15 }}>You're on the wishlist! ✨</div>
                    <div style={{ fontSize: 13, color: '#5A8060', fontFamily: 'var(--font-b)' }}>We'll drop you a note when they launch.</div>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-b)', marginBottom: 12 }}>
                    🔔 Get notified when we launch:
                  </p>
                  <form onSubmit={handleNotify} style={{ display: 'flex', gap: 10, maxWidth: 400 }}>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1.5px solid rgba(244,213,204,0.7)',
                        borderRadius: 999,
                        padding: '12px 20px',
                        fontFamily: 'var(--font-b)',
                        fontSize: 14,
                        color: 'var(--taupe)',
                        outline: 'none',
                        boxShadow: '0 4px 16px rgba(200,150,150,0.12), 0 1px 0 rgba(255,255,255,0.9) inset',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#F4D5CC'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(244,213,204,0.7)'}
                    />
                    <button
                      type="submit"
                      onClick={e => burst(e.clientX, e.clientY)}
                      className="clay-btn clay-btn-pink"
                      style={{ padding: '12px 22px', fontSize: 13, whiteSpace: 'nowrap' }}
                    >
                      Wishlist ♡
                    </button>
                  </form>
                </div>
              )}
            </FadeUp>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){#bags>div>div{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </section>
  )
}

// ─── Brand Story ─────────────────────────────────────────────────────────────
function BrandStory() {
  return (
    <section id="story" style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(244,213,204,0.3) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', position: 'relative', zIndex: 1 }}>

        <FadeUp>
          <div style={{ position: 'relative', display: 'flex', gap: 16, justifyContent: 'center', padding: '24px 12px' }}>
            <div style={{ background: '#FFF', padding: '10px 10px 36px', boxShadow: 'var(--clay-shadow)', borderRadius: 4, transform: 'rotate(-3deg)', maxWidth: 240, flexShrink: 0 }}>
              <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: 'var(--peach)' }}>
                <img src="/gancikabul.jpeg" alt="Crafting tools and design workspace" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-h)', fontSize: 12, color: 'var(--taupe-lt)', textAlign: 'center', marginTop: 8 }}> Cute Pipe Cleaner Bag Charm </p>
            </div>
            <div style={{ background: '#FFF', padding: '10px 10px 36px', boxShadow: 'var(--clay-shadow)', borderRadius: 4, transform: 'rotate(2.5deg)', maxWidth: 200, marginTop: 40, flexShrink: 0 }}>
              <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: 'var(--lavender)' }}>
                <img src="/lamputidur.jpeg"alt="Colorful lighting" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-h)', fontSize: 12, color: 'var(--taupe-lt)', textAlign: 'center', marginTop: 8 }}>every colour ✿</p>
            </div>

            <div className="clay clay-peach" style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) rotate(-1.5deg)', padding: '10px 16px', maxWidth: 160, textAlign: 'center', borderRadius: 16, animation: 'floatY2 8s ease-in-out infinite' }}>
              <p style={{ fontFamily: 'var(--font-h)', fontSize: 12, color: '#5A3A35', lineHeight: 1.5, margin: 0 }}>"made from scratch<br />with lots of love" 💛</p>
            </div>

            <Float3D emoji="🌸" size={32} style={{ position: 'absolute', top: 0, right: 10 }} animation="floatY 5s ease-in-out infinite" />
            <Float3D emoji="✨" size={24} style={{ position: 'absolute', top: 100, left: -10 }} animation="floatY3 4s ease-in-out infinite" />
          </div>
        </FadeUp>

        <div>
          <FadeUp>
            <div className="clay clay-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 999, marginBottom: 22 }}>
              <span style={{ animation: 'heartbeat 2.5s ease-in-out infinite', display: 'inline-block' }}>🌸</span>
              <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 12, color: '#4A3A60', letterSpacing: '0.04em', textTransform: 'uppercase' }}>The Story Behind the Stitches</span>
            </div>
          </FadeUp>

          <FadeUp delay={1}>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--taupe)', margin: '0 0 18px', lineHeight: 1.3, letterSpacing: '-0.015em' }}>
              Hi, I'm Myammiy ♡<br />
              <span style={{ fontWeight: 300, fontSize: '0.8em', color: 'var(--taupe-lt)' }}>the hands behind it all.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={2}>
            <p style={{ fontSize: 15, color: 'var(--taupe-lt)', lineHeight: 1.85, margin: '0 0 14px', fontFamily: 'var(--font-b)' }}>
              What started as a quiet hobby during late-night study sessions grew into something I truly love. Every fabric is hand-picked, 
              every pipe cleaner is carefully shaped, and every stitch is intentional.
            </p>
            <p style={{ fontSize: 15, color: 'var(--taupe-lt)', lineHeight: 1.85, margin: '0 0 28px', fontFamily: 'var(--font-b)' }}>
             No mass production. Just small batches, quality materials — organic cotton, 
             soft fabrics, fuzzy stems — and a deep care for every person who receives one of my pieces. 🌿
            </p>
          </FadeUp>

          <FadeUp delay={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                { icon: '🪡', t: 'Quality Materials',    d: 'Selected soft fabrics & durable fuzzy wires' },
                { icon: '🤍', t: 'By Hand Only',    d: 'Every stitch, cut, and shape placed with care' },
                { icon: '♻️', t: 'Eco-Conscious',   d: 'Minimal waste & thoughtful crafting' },
                { icon: '📦', t: 'Dreamy Packaging', d: 'Unboxing is part of the magic' },
              ].map(f => (
                <div key={f.t} className="clay" style={{ padding: '14px 16px', borderRadius: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 13, color: 'var(--taupe)', marginBottom: 3 }}>{f.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-b)', lineHeight: 1.5 }}>{f.d}</div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={4}>
            <a href="#products" className="clay-btn clay-btn-pink" style={{ padding: '13px 28px', fontSize: 14, textDecoration: 'none' }}>
              ✿ See the Collection
            </a>
          </FadeUp>
        </div>
      </div>

      <style>{`@media(max-width:900px){#story>div>div{grid-template-columns:1fr!important;gap:48px!important;}}`}</style>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '60px 24px 36px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(232,223,245,0.25) 100%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="clay clay-lavender" style={{ borderRadius: 32, padding: '40px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>🌸</div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 22, color: 'var(--taupe)', lineHeight: 1.2 }}>
                handmade<br />
                <span style={{ fontWeight: 300, fontSize: 14, color: 'var(--taupe-lt)' }}>by myammiy</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--taupe-lt)', maxWidth: 280, lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-b)' }}>
              Handmade Pipe Cleaner crafts & flower bouquets made with love.
              Every stitch tells a story. ♡
            </p>
          </div>

          <div>
            <p style={{ fontSize: 12, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-h)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Find Me Here ✨
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: '🛍️', label: 'Shopee',    href: 'https://id.shp.ee/uRr5bJn9' },
                { icon: '📸', label: 'Instagram', href: 'https://www.instagram.com/myammiycraft.id?igsh=dDhkMWx1M2U2OTU5' },
                { icon: '🎵', label: 'TikTok',    href: 'https://www.tiktok.com/@myammiycraft?_r=1&_t=ZS-98SAaOHFHgD' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  className="clay"
                  style={{ width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15) translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--clay-shadow-hover)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="https://id.shp.ee/uRr5bJn9"
              target="_blank"
              rel="noreferrer"
              className="clay-btn clay-btn-pink"
              style={{ padding: '14px 28px', fontSize: 14, display: 'inline-flex', textDecoration: 'none' }}
            >
              🛍️ Visit Our Shopee Store
            </a>
            <p style={{ fontSize: 11, color: 'var(--taupe-xlt)', marginTop: 8, fontFamily: 'var(--font-b)' }}>
              id.shp.ee/uRr5bJn9
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-b)', margin: 0 }}>
            © 2026 handmade by myammiy · All rights reserved
          </p>
          <p style={{ fontSize: 13, color: 'var(--taupe-xlt)', fontFamily: 'var(--font-h)', fontStyle: 'italic', margin: 0 }}>
            Made with love & way too much carfting ✨
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── App Utamamu ─────────────────────────────────────────────────────────────
export default function App() {
  const { burst, Renderer: ConfettiRenderer } = useConfetti()

  return (
    <>
      <MeshBackground />
      {/* Panggil komponen FlowerCursor buatan kita */}
      <FlowerCursor /> 
      <ConfettiRenderer />
      <Nav />
      <Hero />
      <ProductShowcase burst={burst} />
      <CottonBagTeaser burst={burst} />
      <BrandStory />
      <Footer />
    </>
  )
}