import { useCompanion } from '../context/CompanionContext'
import './Actions.css'

const BUTTONS = [
  { action: 'feed',  icon: '🍔', label: 'Alimentar', color: '#f59e0b' },
  { action: 'play',  icon: '🎮', label: 'Brincar',   color: '#8b5cf6' },
  { action: 'sleep', icon: '😴', label: 'Dormir',    color: '#06d6a0' },
]

export default function Actions() {
  const { actions } = useCompanion()

  const handlers = {
    feed:  actions.feed,
    play:  actions.play,
    sleep: actions.sleep,
  }

  return (
    <div className="actions-panel">
      {BUTTONS.map(({ action, icon, label, color }) => (
        <button
          key={action}
          className="action-btn"
          style={{ '--btn-color': color }}
          onClick={handlers[action]}
        >
          <span className="action-icon">{icon}</span>
          <span className="action-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
