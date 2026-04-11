import './Stats.css'

const STAT_CONFIG = [
  { key: 'hunger',    icon: '🍔', label: 'Fome',      color: '#f59e0b' },
  { key: 'energy',    icon: '⚡', label: 'Energia',   color: '#06d6a0' },
  { key: 'happiness', icon: '✨', label: 'Alegria',   color: '#8b5cf6' },
]

function getBarClass(value) {
  if (value < 20) return 'critical'
  if (value < 40) return 'low'
  if (value < 70) return 'mid'
  return 'high'
}

export default function Stats({ stats }) {
  if (!stats) return null
  return (
    <div className="stats-panel">
      {STAT_CONFIG.map(({ key, icon, label, color }) => {
        const value = Math.round(stats[key] ?? 0)
        const cls = getBarClass(value)
        return (
          <div key={key} className="stat-row">
            <span className="stat-icon">{icon}</span>
            <div className="stat-bar-wrap">
              <div
                className={`stat-bar ${cls}`}
                style={{ '--fill': value + '%', '--color': color }}
              />
            </div>
            <span className="stat-value">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
