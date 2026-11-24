import { useEffect, useRef, useState } from 'react'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v) => Math.min(1, Math.max(0, v))

export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    let x = 0, y = 0, rx = 0, ry = 0, raf
    const mv = (e) => {
      x = e.clientX; y = e.clientY
      dot.current.style.opacity = ring.current.style.opacity = 1
      dot.current.style.transform = `translate(${x}px,${y}px)`
      ring.current.classList.toggle('hot', !!e.target.closest('a,button,input,textarea'))
    }
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18
      ring.current.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    const pull = (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`
    }
    const drop = (e) => { e.currentTarget.style.transform = '' }
    const mags = [...document.querySelectorAll('.btn, .theme')]
    mags.forEach((m) => { m.addEventListener('mousemove', pull); m.addEventListener('mouseleave', drop) })
    addEventListener('mousemove', mv)
    loop()
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('mousemove', mv)
      mags.forEach((m) => { m.removeEventListener('mousemove', pull); m.removeEventListener('mouseleave', drop) })
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  return (<><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>)
}

export function Portrait({ me }) {
  const [bad, setBad] = useState(false)
  const el = useRef(null)
  const move = (e) => {
    const r = el.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`
  }
  const initials = me.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <div className="stage" onMouseMove={move} onMouseLeave={() => { el.current.style.transform = '' }}>
      <div className="portrait" ref={el}>
        <span className="ring r1" /><span className="ring r2" />
        <div className="frame">
          {bad ? <span className="initials">{initials}</span>
            : <img src={me.photo} alt={'Portrait of ' + me.name} onError={() => setBad(true)} />}
        </div>
        <span className="float f1">Systems</span>
        <span className="float f2">Data</span>
        <span className="float f3">Web</span>
      </div>
    </div>
  )
}

export function ScrollWords({ text }) {
  const ref = useRef(null)
  const [p, setP] = useState(reduced() ? 1 : 0)
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const f = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const next = clamp((innerHeight * 0.9 - ref.current.getBoundingClientRect().top) / (innerHeight * 0.5))
        setP((current) => Math.abs(current - next) < 0.01 ? current : next)
      })
    }
    f()
    addEventListener('scroll', f, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', f)
    }
  }, [])
  const w = text.split(' ')
  return <p className="about" ref={ref}>{w.map((x, i) => <span key={i} className={i < p * w.length ? 'lit' : ''}>{x} </span>)}</p>
}

export function Work({ projects }) {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-heading">
          <div>
            <p className="work-kicker">Selected projects</p>
            <h2 className="sh">Selected work</h2>
          </div>
          <span className="work-count">0{projects.length} projects</span>
        </div>
        <div className="track">
          {projects.map((p, i) => {
            const destination = p.href || p.readHref
            return (
              <article className="pcard" key={p.title} style={{ '--h': [220, 165, 280][i % 3] }}>
                {destination && <a className="card-hit" href={destination} target="_blank" rel="noreferrer" aria-label={'Open ' + p.title} />}
                <div className="cover" aria-hidden="true">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <i>{p.category}</i>
                  <b>↗</b>
                </div>
                <div className="pbody">
                  <p className="chips left">{p.tags.map((t) => <span key={t}>{t}</span>)}</p>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  {p.href && <a className="btn" href={p.href} target="_blank" rel="noreferrer">Visit project</a>}
                  {p.readHref && (
                    <div className="project-actions">
                      <a className="btn" href={p.readHref} target="_blank" rel="noreferrer">Read thesis</a>
                      {p.downloadHref && <a className="btn primary" href={p.downloadHref} download>Download thesis</a>}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Contact({ me }) {
  const [st, setSt] = useState('idle')
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const d = new FormData(f)
    if (d.get('company')) return
    if (!me.formId || me.formId === 'YOUR_FORM_ID') {
      setSt('error'); setErr('The form is not connected yet. Please email me directly.'); return
    }
    setSt('sending')
    try {
      const r = await fetch('https://formspree.io/f/' + me.formId, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
      if (!r.ok) throw new Error('bad')
      setSt('done'); f.reset()
    } catch (x) { setSt('error'); setErr('Your message did not send. Please try again or email me.') }
  }
  return (
    <section className="wrap section contact" id="contact">
      <div className="contact-intro">
        <p className="contact-kicker">Open to thoughtful projects</p>
        <h2 className="sh">Get in touch</h2>
        <p className="contact-copy">Have a system to improve, a data question, or a project in mind? Send me a note and tell me what you are working on.</p>
        <span className="contact-email-label">Email me directly</span>
        <a className="mail" href={'mailto:' + me.email}>{me.email}<span aria-hidden="true"> ↗</span></a>
        <p className="links">{me.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</p>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="form-heading">
          <span>Send a message</span>
          <p>I’ll get back to you as soon as I can.</p>
        </div>
        <div className="form-row">
          <label>Name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
        </div>
        <label>Message<textarea name="message" rows="5" required placeholder="What would you like to discuss?" /></label>
        <input className="hp" name="company" tabIndex="-1" autoComplete="off" aria-hidden="true" />
        <button className="btn primary" disabled={st === 'sending'}>{st === 'sending' ? 'Sending' : 'Send message'} <span aria-hidden="true">↗</span></button>
        <p className={'note ' + st} role="status">{st === 'done' ? 'Thank you. Your message is on its way, and I will reply soon.' : st === 'error' ? err : ''}</p>
      </form>
    </section>
  )
}

export function Constellation() {
  const c = useRef(null)
  useEffect(() => {
    const cv = c.current, ctx = cv.getContext('2d')
    const dpr = Math.min(devicePixelRatio, 2)
    let w = 0, h = 0, raf, mx = -1e4, my = -1e4
    const N = innerWidth < 700 ? 34 : 70
    const pts = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003 }))
    const size = () => { w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr }
    const move = (e) => { mx = e.clientX * dpr; my = e.clientY * dpr }
    const draw = (animate) => {
      ctx.clearRect(0, 0, w, h)
      const col = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      ctx.fillStyle = col; ctx.strokeStyle = col
      const L = 170 * dpr
      pts.forEach((p, i) => {
        if (animate) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1 }
        const x = p.x * w, y = p.y * h
        ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(x, y, 1.8 * dpr, 0, 6.3); ctx.fill()
        for (let j = i + 1; j < N; j++) {
          const q = pts[j], d = Math.hypot(x - q.x * w, y - q.y * h)
          if (d < L) { ctx.globalAlpha = (1 - d / L) * 0.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(q.x * w, q.y * h); ctx.stroke() }
        }
        const dm = Math.hypot(x - mx, y - my)
        if (dm < L * 1.3) { ctx.globalAlpha = (1 - dm / (L * 1.3)) * 0.7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(mx, my); ctx.stroke() }
      })
      if (animate) raf = requestAnimationFrame(() => draw(true))
    }
    size(); addEventListener('resize', size)
    if (reduced()) draw(false)
    else { addEventListener('pointermove', move); draw(true) }
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move) }
  }, [])
  return <canvas ref={c} className="const" />
}
