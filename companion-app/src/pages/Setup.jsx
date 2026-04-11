import { useState } from 'react'
import { useCompanion } from '../context/CompanionContext'
import './Setup.css'

const EXAMPLE_NAMES = ['Pixel', 'Luna', 'Cosmo', 'Nova', 'Mochi', 'Byte', 'Echo', 'Orion']

export default function Setup() {
  const { actions } = useCompanion()
  const [step, setStep] = useState(0)
  const [companionName, setCompanionName] = useState('')
  const [userName, setUserName] = useState('')
  const [serverUrl, setServerUrl] = useState('')

  const suggestedName = EXAMPLE_NAMES[Math.floor(Math.random() * EXAMPLE_NAMES.length)]

  const handleCreate = () => {
    if (!companionName.trim()) return
    actions.setup({
      companionName: companionName.trim(),
      userName: userName.trim(),
      serverUrl: serverUrl.trim(),
    })
  }

  return (
    <div className="setup">
      {step === 0 && (
        <div className="setup-screen" key="intro">
          <div className="setup-icon wiggle">🥚</div>
          <h1>Um novo companheiro<br />está chegando...</h1>
          <p>Seu amigo virtual com IA — como um<br />Tamagotchi, mas de verdade.</p>
          <button className="btn-primary" onClick={() => setStep(1)}>
            Começar ✨
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="setup-screen" key="name">
          <div className="setup-icon pop">🐣</div>
          <h2>Como você vai<br />chamar ele?</h2>
          <input
            className="setup-input"
            type="text"
            placeholder={`ex: ${suggestedName}`}
            value={companionName}
            onChange={(e) => setCompanionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && companionName.trim() && setStep(2)}
            autoFocus
            maxLength={20}
          />
          <div className="name-chips">
            {EXAMPLE_NAMES.slice(0, 4).map((n) => (
              <button key={n} className="chip" onClick={() => setCompanionName(n)}>
                {n}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={() => setStep(2)}
            disabled={!companionName.trim()}
          >
            Próximo →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="setup-screen" key="user">
          <div className="setup-icon">💫</div>
          <h2>E o seu nome?</h2>
          <p className="setup-sub">{companionName} quer te conhecer!</p>
          <input
            className="setup-input"
            type="text"
            placeholder="Seu nome (opcional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setStep(3)}
            autoFocus
            maxLength={30}
          />
          <button className="btn-primary" onClick={() => setStep(3)}>
            {userName.trim() ? 'Próximo →' : 'Pular →'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="setup-screen" key="server">
          <div className="setup-icon">🔌</div>
          <h2>Servidor de IA</h2>
          <p className="setup-sub">
            URL do seu servidor com<br />a API do Claude
          </p>
          <input
            className="setup-input"
            type="url"
            placeholder="https://seu-servidor.com"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <p className="setup-hint">
            💡 Pode configurar depois nas configurações
          </p>
          <button className="btn-primary" onClick={handleCreate}>
            Conhecer {companionName}! 🎉
          </button>
        </div>
      )}

      <div className="setup-steps">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
