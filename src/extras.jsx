import { useEffect, useRef, useState } from 'react'
import Icon from './icons'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v) => Math.min(1, Math.max(0, v))

export function Intro({ name }) {
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(reduced)
  useEffect(() => {
    if (gone) return
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const k = clamp((t - t0) / 1400)
      setN(Math.round(k * 100))
      if (k < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setGone(true), 1100)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [gone])
  if (gone) return null
  return (
    <div className={'intro' + (n === 100 ? ' lift' : '')} aria-hidden="true">
      <span>{name}</span>
      <strong>{n}</strong>
    </div>
  )
}

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
    const f = () => setP(clamp((innerHeight * 0.9 - ref.current.getBoundingClientRect().top) / (innerHeight * 0.5)))
    f()
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  const w = text.split(' ')
  return <p className="about" ref={ref}>{w.map((x, i) => <span key={i} className={i < p * w.length ? 'lit' : ''}>{x} </span>)}</p>
}

export function Work({ projects }) {
  const sec = useRef(null)
  const track = useRef(null)
  useEffect(() => {
    const wide = matchMedia('(min-width: 861px)')
    const f = () => {
      const s = sec.current, t = track.current
      if (!wide.matches) { t.style.transform = ''; s.style.height = ''; return }
      const dist = Math.max(0, t.scrollWidth - innerWidth)
      s.style.height = dist + innerHeight + 'px'
      t.style.transform = `translateX(${-clamp(-s.getBoundingClientRect().top / (dist || 1)) * dist}px)`
    }
    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f) }
  }, [])
  return (
    <section className="work" id="work" ref={sec}>
      <div className="pin">
        <div className="wrap"><h2 className="sh">Selected work</h2></div>
        <div className="track" ref={track}>
          {projects.map((p, i) => (
            <article className="pcard" key={p.title} style={{ '--h': [220, 165, 280][i % 3] }}>
              <div className="cover"><span>{p.title[0]}</span></div>
              <div className="pbody">
                <p className="chips left">{p.tags.map((t) => <span key={t}>{t}</span>)}</p>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                {p.href && <a className="btn" href={p.href} target="_blank" rel="noreferrer">Open project</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact({ me }) {
  const [st, setSt] = useState('idle')
  const [fb, setFb] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const d = Object.fromEntries(new FormData(f))
    if (d.company) return
    const subject = 'Portfolio message from ' + d.name
    setFb('mailto:' + me.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(d.message + '\n\n' + d.name + ' (' + d.email + ')'))
    setSt('sending')
    try {
      const own = me.formId && me.formId !== 'YOUR_FORM_ID'
      const r = await fetch(own ? 'https://formspree.io/f/' + me.formId : 'https://formsubmit.co/ajax/' + me.email, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: d.name, email: d.email, message: d.message, _subject: subject, _template: 'table' }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || j.success === 'false' || j.success === false) throw new Error('send failed')
      setSt('done'); f.reset()
    } catch (x) { setSt('error') }
  }
  return (
    <section className="wrap section contact" id="contact">
      <div>
        <h2 className="sh">Get in touch</h2>
        <a className="mail" href={'mailto:' + me.email}>{me.email}</a>
        <p className="links">{me.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</p>
      </div>
      <form className="form" onSubmit={submit}>
        <label>Name<input name="name" required autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Message<textarea name="message" rows="5" required /></label>
        <input className="hp" name="company" tabIndex="-1" autoComplete="off" aria-hidden="true" />
        <button className="btn primary" disabled={st === 'sending'}><Icon n="mail" size={16} /> {st === 'sending' ? 'Sending' : 'Send message'}</button>
        <p className={'note ' + st} role="status">
          {st === 'done' && 'Thank you. Your message has been sent, and I will reply soon.'}
          {st === 'error' && <>It did not send from here. <a className="fallback" href={fb}>Open it in your email app instead</a>.</>}
        </p>
      </form>
    </section>
  )
}

export function CvModal({ open, onClose, src }) {
  const btn = useRef(null)
  useEffect(() => {
    if (!open) return
    btn.current && btn.current.focus()
    const esc = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [open, onClose])
  const t = open ? 0 : -1
  return (
    <div className={'modal' + (open ? ' open' : '')} aria-hidden={!open} onClick={onClose}>
      <div className="sheetbox" role="dialog" aria-modal="true" aria-label="Curriculum vitae" onClick={(e) => e.stopPropagation()}>
        <div className="mbar">
          <strong>Curriculum vitae</strong>
          <span className="mact">
            <a className="btn" href={src} download tabIndex={t}><Icon n="download" size={16} /> Download</a>
            <a className="btn" href={src} target="_blank" rel="noreferrer" tabIndex={t}><Icon n="arrow" size={16} /> New tab</a>
            <button className="theme" ref={btn} onClick={onClose} aria-label="Close CV" tabIndex={t}><Icon n="x" size={18} /></button>
          </span>
        </div>
        {open && <iframe title="Kelvin Odei Asare CV" src={src + '#view=FitH'} />}
      </div>
    </div>
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
