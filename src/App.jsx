import { useEffect, useRef, useState } from 'react'
import { me, projects, jobs, tools, groups, degree, school, domains } from './data'
import Network from './Network'
import { Intro, Cursor, Portrait, ScrollWords, Work, Contact, Constellation, CvModal } from './extras'
import Icon from './icons'

const Sun = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>)
const Moon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>)

const NAV = [['about', 'About'], ['work', 'Work'], ['skills', 'Skills'], ['experience', 'Experience'], ['education', 'Education'], ['contact', 'Contact']]
const WORDS = ['Administer', 'Analyse', 'Build']

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.15 })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Count({ to, decimals = 0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => {
        const k = Math.min((t - t0) / 1400, 1)
        setV(to * (1 - Math.pow(1 - k, 3)))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{v.toFixed(decimals)}</span>
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [prog, setProg] = useState(0)
  const [active, setActive] = useState('')
  const [menu, setMenu] = useState(false)
  const [cv, setCv] = useState(false)
  useReveal()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme-v3', theme) } catch (e) { /* ignore */ }
  }, [theme])

  useEffect(() => {
    const f = () => {
      const h = document.documentElement
      setProg(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    f()
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu || cv ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [menu, cv])

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  const next = theme === 'dark' ? 'light' : 'dark'
  const glow = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--y', e.clientY - r.top + 'px')
  }
  const link = (id, label) => <a key={id} href={'#' + id} className={active === id ? 'on' : ''}>{label}</a>

  return (
    <>
      <Intro name={me.name} />
      <Cursor />
      <div className="bg" aria-hidden="true" style={{ '--p': prog }}>
        <i className="orb o1" /><i className="orb o2" /><i className="orb o3" />
        <i className="grid" /><Constellation /><i className="grain" />
      </div>
      <div className="progress" style={{ transform: `scaleX(${prog})` }} />

      <header className="top">
        <div className="nav wrap">
          <a className="brand" href="#top"><b>K</b><span>Kelvin</span></a>
          <nav className="links" aria-label="Main">
            {['about', 'work', 'skills', 'experience', 'contact'].map((id) => link(id, NAV.find((n) => n[0] === id)[1]))}
          </nav>
          <div className="right">
            <button className="pill" onClick={() => setCv(true)}><Icon n="eye" size={16} /> View CV</button>
            <button className="theme" onClick={() => setTheme(next)} aria-label={'Switch to ' + next + ' theme'}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button className={'burger' + (menu ? ' x' : '')} aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}>
              <i /><i />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={'sheet' + (menu ? ' open' : '')} aria-hidden={!menu}>
        {NAV.map(([id, label], i) => (
          <a key={id} href={'#' + id} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}
            style={{ transitionDelay: 120 + i * 60 + 'ms' }}>{label}</a>
        ))}
        <button className="btn primary" tabIndex={menu ? 0 : -1} onClick={() => { setMenu(false); setCv(true) }}><Icon n="eye" size={18} /> View CV</button>
      </div>

      <main id="top">
        <section className="hero" onMouseMove={spot}>
          <i className="rings" aria-hidden="true" />
          <p className="status"><i /> {me.status}</p>
          <Portrait me={me} />
          <h1 className="stack" aria-label="Administer. Analyse. Build.">
            {WORDS.map((w, li) => (
              <span className={'line l' + li} aria-hidden="true" key={w}>
                <span className="word">
                  {[...w].map((c, ci) => (
                    <span className="ch" key={ci} style={{ animationDelay: 1900 + (li * 9 + ci) * 45 + 'ms' }}>{c}</span>
                  ))}
                </span>
                {li === 2 && <i className="dot" />}
              </span>
            ))}
          </h1>
          <div className="hero-foot">
            <div><h2>{me.name}</h2><p className="role">{me.role}</p></div>
            <p className="lead">{me.intro}</p>
            <div className="actions">
              <a className="btn primary" href="#work">See my work <Icon n="arrow" size={16} /></a>
              <button className="btn" onClick={() => setCv(true)}><Icon n="eye" size={16} /> View CV</button>
              <a className="btn" href="#contact"><Icon n="mail" size={16} /> Contact</a>
            </div>
          </div>
          <span className="side">Information Systems · Accra</span>
          <span className="year">2026 / 001</span>
        </section>

        <section className="wrap section" id="about">
          <h2 className="sh">About</h2>
          <ScrollWords text={me.about} />
        </section>

        <Work projects={projects} />

        <section className="wrap section" id="skills">
          <h2 className="sh">Skills</h2>
          <div className="skills-grid">
            <Network />
            <div className="groups">
              {groups.map((g) => (
                <div className="glass" key={g.title} data-reveal>
                  <h3>{g.title}</h3>
                  <p className="chips left">{g.items.map((x) => <span key={x}>{x}</span>)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap section" id="experience">
          <h2 className="sh">Experience</h2>
          <ol className="timeline">
            {jobs.map((j) => (
              <li key={j.org + j.period} data-reveal>
                <span className="when">{j.period}</span>
                <h3>{j.role}, {j.org}</h3>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap section" id="education">
          <h2 className="sh">Education</h2>
          <div className="edu">
            <article className="deg" onMouseMove={glow} data-reveal>
              <span className="wm" aria-hidden="true"><Icon n="cap" size={280} /></span>
              <span className="chip-i"><Icon n="cap" size={22} /></span>
              <p className="eyebrow">Degree</p>
              <h3>{degree.course}</h3>
              <p className="where">{degree.school}</p>
              <div className="deg-meta">
                <div><strong><Count to={degree.cgpa} decimals={2} /></strong><small>CGPA</small></div>
                <div><b>{degree.honours}</b><small>Classification</small></div>
              </div>
            </article>
            <article className="hs" onMouseMove={glow} data-reveal>
              <span className="chip-i"><Icon n="clipboard" size={22} /></span>
              <p className="eyebrow">Secondary</p>
              <h3>{school.course}</h3>
              <p className="where">{school.school}, {school.place}</p>
            </article>
            <h3 className="sub edu-sub">Modules I studied</h3>
            {domains.map((d) => (
              <article className="dom" key={d.title} onMouseMove={glow} data-reveal>
                <div className="dom-h"><span className="chip-i"><Icon n={d.i} size={20} /></span><h3>{d.title}</h3></div>
                <ul>{d.items.map((m) => <li key={m}><Icon n="check" size={14} />{m}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <Contact me={me} />
      </main>

      <CvModal open={cv} onClose={() => setCv(false)} src={me.cv} />

      <footer className="sfoot">
        <div className="foot-tools">
          <div className="wrap"><h2 className="sub">Tools I work with</h2></div>
          <section className="toolbelt" aria-label="Tools I use">
            {[tools.slice(0, 7), tools.slice(7)].map((row, ri) => (
              <div className={'tool-row' + (ri ? ' rev' : '')} key={ri}>
                <ul>
                  {[...row, ...row].map((t, i) => (
                    <li className="tool" key={i} aria-hidden={i >= row.length}><Icon n={t.i} /><span>{t.n}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
        <div className="wrap foot-bar">
          <span>© {new Date().getFullYear()} {me.name}</span>
          <nav aria-label="Footer">{NAV.map(([id, l]) => <a key={id} href={'#' + id}>{l}</a>)}</nav>
          <a className="foot-mail" href={'mailto:' + me.email}><Icon n="mail" size={16} /> {me.email}</a>
          <a className="totop" href="#top" aria-label="Back to top"><Icon n="arrowup" size={18} /></a>
        </div>
        <p className="wordmark" aria-hidden="true">{me.name.split(' ')[0] + ' ' + me.name.split(' ').pop()}</p>
      </footer>
    </>
  )
}
