import './Character.css'

const MOOD_COLORS = {
  happy:     { body: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)' },
  content:   { body: '#06d6a0', glow: 'rgba(6, 214, 160, 0.5)'  },
  neutral:   { body: '#7c6ded', glow: 'rgba(124, 109, 237, 0.4)' },
  sad:       { body: '#6b7280', glow: 'rgba(107, 114, 128, 0.4)' },
  hungry:    { body: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)'  },
  exhausted: { body: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)'  },
}

const ANIMATION = {
  happy:     'happy-bounce',
  content:   'idle-bounce',
  neutral:   'idle-bounce',
  sad:       'sad-sway',
  hungry:    'shake',
  exhausted: 'float',
}

function Eyes({ mood }) {
  switch (mood) {
    case 'happy':
      return (
        <g>
          {/* Arch eyes — ^_^ */}
          <path d="M 26 46 Q 33 38 40 46" stroke="#1a1a2e" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M 60 46 Q 67 38 74 46" stroke="#1a1a2e" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        </g>
      )
    case 'sad':
      return (
        <g>
          <ellipse cx="33" cy="47" rx="7" ry="6" fill="#1a1a2e"/>
          <ellipse cx="67" cy="47" rx="7" ry="6" fill="#1a1a2e"/>
          {/* sad highlight */}
          <circle cx="35" cy="45" r="2" fill="white" opacity="0.6"/>
          <circle cx="69" cy="45" r="2" fill="white" opacity="0.6"/>
          {/* teardrop */}
          <ellipse cx="28" cy="57" rx="3" ry="4.5" fill="#93c5fd" opacity="0.9"/>
        </g>
      )
    case 'hungry':
      return (
        <g>
          <circle cx="33" cy="44" r="8" fill="#1a1a2e"/>
          <circle cx="67" cy="44" r="8" fill="#1a1a2e"/>
          <circle cx="35" cy="42" r="3" fill="white"/>
          <circle cx="69" cy="42" r="3" fill="white"/>
        </g>
      )
    case 'exhausted':
      return (
        <g>
          {/* half-closed drooping eyes */}
          <ellipse cx="33" cy="46" rx="8" ry="6" fill="#1a1a2e"/>
          <ellipse cx="67" cy="46" rx="8" ry="6" fill="#1a1a2e"/>
          {/* eyelid covering top half */}
          <rect x="24" y="38" width="19" height="9" rx="3" fill="url(#bodyGrad)" opacity="0.9"/>
          <rect x="58" y="38" width="19" height="9" rx="3" fill="url(#bodyGrad)" opacity="0.9"/>
        </g>
      )
    default: // neutral, content
      return (
        <g>
          <ellipse cx="33" cy="45" rx="7.5" ry="7.5" fill="#1a1a2e"/>
          <ellipse cx="67" cy="45" rx="7.5" ry="7.5" fill="#1a1a2e"/>
          <circle cx="35" cy="43" r="2.5" fill="white"/>
          <circle cx="69" cy="43" r="2.5" fill="white"/>
        </g>
      )
  }
}

function Mouth({ mood }) {
  switch (mood) {
    case 'happy':
      return (
        <g>
          <path d="M 33 62 Q 50 74 67 62" stroke="#1a1a2e" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        </g>
      )
    case 'sad':
      return (
        <path d="M 36 68 Q 50 60 64 68" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      )
    case 'hungry':
      return (
        <g>
          <path d="M 36 62 Q 50 71 64 62" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <text x="50" y="82" fontSize="11" fill="#1a1a2e" textAnchor="middle" opacity="0.7">~gut~</text>
        </g>
      )
    case 'exhausted':
      return (
        <line x1="40" y1="66" x2="60" y2="66" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round"/>
      )
    default:
      return (
        <path d="M 38 63 Q 50 70 62 63" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      )
  }
}

export default function Character({ mood = 'neutral', name }) {
  const colors = MOOD_COLORS[mood] || MOOD_COLORS.neutral
  const anim = ANIMATION[mood] || 'idle-bounce'

  return (
    <div className="character-wrapper">
      <div className={`character-glow`} style={{ background: colors.glow }} />
      <div className={`character-svg-wrap anim-${anim}`}>
        <svg
          width="130"
          height="130"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`${name}, ${mood}`}
        >
          <defs>
            <radialGradient id="bodyGrad" cx="38%" cy="30%" r="70%">
              <stop offset="0%" stopColor={lighten(colors.body, 30)} />
              <stop offset="100%" stopColor={darken(colors.body, 15)} />
            </radialGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="50" cy="96" rx="28" ry="4" fill="rgba(0,0,0,0.25)"/>

          {/* Body */}
          <ellipse cx="50" cy="56" rx="40" ry="38" fill="url(#bodyGrad)"/>

          {/* Shine highlight */}
          <ellipse cx="36" cy="36" rx="13" ry="9" fill="white" opacity="0.18"/>

          {/* Eyes */}
          <Eyes mood={mood} />

          {/* Mouth */}
          <Mouth mood={mood} />

          {/* Cheeks (happy) */}
          {mood === 'happy' && (
            <>
              <ellipse cx="20" cy="57" rx="8" ry="5" fill="#fca5a5" opacity="0.55"/>
              <ellipse cx="80" cy="57" rx="8" ry="5" fill="#fca5a5" opacity="0.55"/>
            </>
          )}

          {/* Zzz (exhausted) */}
          {mood === 'exhausted' && (
            <>
              <text x="76" y="30" fontSize="11" fill={colors.body} fontWeight="700" opacity="0.9">Z</text>
              <text x="83" y="21" fontSize="9" fill={colors.body} fontWeight="700" opacity="0.65">z</text>
              <text x="88" y="14" fontSize="7" fill={colors.body} fontWeight="700" opacity="0.4">z</text>
            </>
          )}

          {/* Stars (hungry) */}
          {mood === 'hungry' && (
            <text x="80" y="28" fontSize="14" textAnchor="middle" opacity="0.8">✦</text>
          )}
        </svg>
      </div>
    </div>
  )
}

// Minimal color helpers
function lighten(hex, pct) {
  return shiftColor(hex, pct)
}
function darken(hex, pct) {
  return shiftColor(hex, -pct)
}
function shiftColor(hex, pct) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + pct * 2.55))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + pct * 2.55))
  const b = Math.min(255, Math.max(0, (num & 0xff) + pct * 2.55))
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
}
