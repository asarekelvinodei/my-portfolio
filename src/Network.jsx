import { useState } from 'react'
import { me, skills } from './data'

const C = 200
const R = 140

export default function Network() {
  const [active, setActive] = useState(0)
  const initials = me.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const pts = skills.map((s, k) => {
    const a = (k / skills.length) * Math.PI * 2 - Math.PI / 2
    return { ...s, x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
  })

  return (
    <figure className="net">
      <svg viewBox="-70 0 540 400" role="group" aria-label="Skills network">
        {pts.map((p, k) => (
          <line key={p.name} x1={C} y1={C} x2={p.x} y2={p.y}
            className={'edge' + (k === active ? ' on' : '')}
            style={{ animationDelay: k * 80 + 'ms' }} />
        ))}
        <circle cx={C} cy={C} r="28" className="hub" />
        <text x={C} y={C + 5} textAnchor="middle" className="hub-t">{initials}</text>
        {pts.map((p, k) => {
          const side = p.x < C - 10 ? 'end' : p.x > C + 10 ? 'start' : 'middle'
          const tx = side === 'end' ? p.x - 14 : side === 'start' ? p.x + 14 : p.x
          const ty = side === 'middle' ? p.y + (p.y < C ? -16 : 28) : p.y + 5
          return (
            <g key={p.name} tabIndex="0" className={'node' + (k === active ? ' on' : '')}
              onMouseEnter={() => setActive(k)} onFocus={() => setActive(k)}>
              <circle cx={p.x} cy={p.y} r={k === active ? 9 : 6} />
              <text x={tx} y={ty} textAnchor={side}>{p.name}</text>
            </g>
          )
        })}
      </svg>
      <figcaption aria-live="polite"><strong>{pts[active].name}.</strong> {pts[active].note}</figcaption>
    </figure>
  )
}
