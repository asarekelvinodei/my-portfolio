import { useEffect, useRef, useState } from 'react'
import { me, projects, jobs, education, tools, groups } from './data'
import Network from './Network'
import { Cursor, Portrait, ScrollWords, Work, Contact, Constellation } from './extras'

const Sun = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>)
const Moon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>)

const NAV = [['work', 'Work'], ['skills', 'Skills'], ['experience', 'Experience'], ['education', 'Education']]
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

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [active, setActive] = useState('')
  const [menu, setMenu] = useState(false)
  const progressRef = useRef(null)
  const backdropRef = useRef(null)
  useReveal()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme-v3', theme) } catch (e) { /* ignore */ }
  }, [theme])

  useEffect(() => {
    let raf = 0
    const f = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = document.documentElement
        const progress = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
        backdropRef.current?.style.setProperty('--p', progress)
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
      })
    }
    f()
    addEventListener('scroll', f, { passive: true })
    addEventListener('resize', f)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', f)
      removeEventListener('resize', f)
    }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [menu])

  useEffect(() => {
    const smoothAnchor = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href').slice(1)
      const target = id ? document.getElementById(id) : document.getElementById('top')
      if (!target) return
      e.preventDefault()
      setMenu(false)
      history.pushState(null, '', '#' + id)
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    }
    document.addEventListener('click', smoothAnchor)
    return () => document.removeEventListener('click', smoothAnchor)
  }, [setMenu])

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  const next = theme === 'dark' ? 'light' : 'dark'
  const link = (id, label) => <a key={id} href={'#' + id} className={active === id ? 'on' : ''}>{label}</a>

  return (
    <>
      <Cursor />
      <div className="bg" aria-hidden="true" ref={backdropRef}>
        <i className="orb o1" /><i className="orb o2" /><i className="orb o3" />
        <i className="grid" /><Constellation /><i className="grain" />
      </div>
      <div className="progress" ref={progressRef} />

      <header className="top">
        <div className="nav wrap">
          <a className="brand" href="#top"><b>K</b><span>Kelvin</span></a>
          <nav className="links" aria-label="Main">
            {['work', 'skills', 'experience', 'education'].map((id) => link(id, NAV.find((n) => n[0] === id)[1]))}
          </nav>
          <a className="mobile-cv" href="/document-viewer.html?file=My_CV.pdf&title=Curriculum%20Vitae&back=%23top">View CV</a>
          <div className="right">
            <a className="pill" href="/document-viewer.html?file=My_CV.pdf&title=Curriculum%20Vitae&back=%23top">View CV</a>
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
                    <span className="ch" key={ci} style={{ animationDelay: 160 + (li * 9 + ci) * 38 + 'ms' }}>{c}</span>
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
              <a className="btn primary" href="#work">See my work</a>
              <a className="btn" href={'mailto:' + me.email}>Email me</a>
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
          <div className="education-grid">
            {education.map((e, i) => (
              <article className="education-card" key={e.school} data-reveal>
                <span className="education-index" aria-hidden="true">0{i + 1}</span>
                <div className="education-copy">
                  <p className="education-label">Academic qualification</p>
                  <h3>{e.course}</h3>
                  <p className="education-school">{e.school}</p>
                  <p className="education-detail">{e.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Contact me={me} />
        <div className="marquee" aria-label="Tools and technologies">
          <ul>{[...tools, ...tools].map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      </main>

      <footer className="wrap foot"><span>© {new Date().getFullYear()} {me.name}</span><a href="#top">Back to top</a></footer>
    </>
  )
}
