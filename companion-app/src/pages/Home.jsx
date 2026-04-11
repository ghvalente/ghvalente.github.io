import { useState } from 'react'
import { useCompanion } from '../context/CompanionContext'
import Character from '../components/Character'
import Stats from '../components/Stats'
import Actions from '../components/Actions'
import Chat from '../components/Chat'
import './Home.css'

const MOOD_LABEL = {
  happy:     '😄 feliz',
  content:   '😌 tranquilo',
  neutral:   '😐 neutro',
  sad:       '😢 triste',
  hungry:    '😋 com fome',
  exhausted: '😴 exausto',
}

function SettingsPanel({ onClose }) {
  const { state, actions } = useCompanion()
  const [url, setUrl] = useState(state.serverUrl || '')

  const save = () => {
    actions.setServerUrl(url.trim())
    onClose()
  }

  const reset = () => {
    if (confirm('Resetar tudo? Seu companheiro será perdido.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Configurações</h3>

        <label className="settings-label">
          URL do Servidor
          <input
            className="settings-input"
            type="url"
            placeholder="https://seu-servidor.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <span className="settings-hint">
            Seu servidor Node.js com a API do Claude
          </span>
        </label>

        <div className="settings-info">
          <p>Companheiro: <strong>{state.companion?.name}</strong></p>
          <p>Personalidade: <em>{state.companion?.personality?.traits?.join(', ')}</em></p>
          <p>Dias de vida: <strong>
            {Math.floor((Date.now() - (state.companion?.birthDate ?? Date.now())) / 86400000)}
          </strong></p>
        </div>

        <button className="btn-primary" onClick={save}>Salvar</button>
        <button className="btn-danger" onClick={reset}>Resetar companheiro</button>
      </div>
    </div>
  )
}

export default function Home() {
  const { state, mood } = useCompanion()
  const { companion } = state
  const [showSettings, setShowSettings] = useState(false)

  if (!companion) return null

  const age = Math.floor((Date.now() - companion.birthDate) / 86400000)

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <h1 className="companion-name">{companion.name}</h1>
          <span className="mood-badge">{MOOD_LABEL[mood] ?? mood}</span>
        </div>
        <div className="header-right">
          <span className="age-tag">dia {age}</span>
          <button className="icon-btn" onClick={() => setShowSettings(true)}>⚙️</button>
        </div>
      </header>

      {/* Character */}
      <div className="character-section">
        <Character mood={mood} name={companion.name} />
      </div>

      {/* Stats */}
      <Stats stats={companion.stats} />

      {/* Action buttons */}
      <div className="actions-wrap">
        <Actions />
      </div>

      {/* Chat */}
      <Chat />

      {/* Settings overlay */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
