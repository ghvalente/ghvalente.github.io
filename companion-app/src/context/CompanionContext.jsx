import { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const CompanionContext = createContext(null)

// ─── Personality generation ────────────────────────────────────────────────
const TRAITS = [
  'curioso', 'brincalhão', 'tímido', 'aventureiro', 'filosófico',
  'sarcástico', 'doce', 'energético', 'calmo', 'criativo',
  'dramático', 'espirituoso', 'carinhoso', 'travesso', 'sonhador',
  'entusiasmado', 'reflexivo', 'esquisito', 'leal', 'espontâneo',
  'otimista', 'introvertido', 'divertido', 'gentil', 'corajoso',
]

const SPEECH_STYLES = [
  'descontraído e amigável, às vezes usa girias',
  'caloroso e entusiasmado, ama pontos de exclamação',
  'pensativo e filosófico, faz perguntas profundas',
  'brincalhão e adora trocadilhos',
  'suave e gentil, muito empático',
  'direto e honesto, mas sempre gentil',
  'sonhador e poético, fala de forma levemente whimsical',
]

const BACKSTORIES = [
  'Você nasceu da curiosidade pura, sempre querendo entender tudo ao redor.',
  'Um sonhador nascido do espaço entre pensamentos, que ama imaginar o que poderia ser.',
  'Você acordou uma manhã tranquila cheio de perguntas e um desejo profundo de se conectar.',
  'Criado dos ecos de músicas esquecidas e sonhos meio lembrados, você vê o mundo como mágico.',
  'Nascido numa tarde chuvosa, você ama momentos aconchegantes e conversas calorosas.',
]

function generatePersonality() {
  const shuffled = [...TRAITS].sort(() => Math.random() - 0.5)
  const traits = shuffled.slice(0, 3 + Math.floor(Math.random() * 2))
  return {
    traits,
    speechStyle: SPEECH_STYLES[Math.floor(Math.random() * SPEECH_STYLES.length)],
    backstory: BACKSTORIES[Math.floor(Math.random() * BACKSTORIES.length)],
  }
}

// ─── State ─────────────────────────────────────────────────────────────────
const initialState = {
  initialized: false,
  companion: null,
  userName: '',
  serverUrl: '',
  messages: [],
  loading: false,
}

// ─── Reducer ───────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, loading: false }

    case 'SETUP': {
      const { companionName, userName, serverUrl } = action.payload
      const companion = {
        name: companionName,
        personality: generatePersonality(),
        stats: { hunger: 90, energy: 85, happiness: 80 },
        birthDate: Date.now(),
      }
      return { ...state, initialized: true, companion, userName, serverUrl, messages: [] }
    }

    case 'FEED':
      return {
        ...state,
        companion: {
          ...state.companion,
          stats: {
            ...state.companion.stats,
            hunger: Math.min(100, state.companion.stats.hunger + 30),
            happiness: Math.min(100, state.companion.stats.happiness + 5),
          },
        },
      }

    case 'SLEEP':
      return {
        ...state,
        companion: {
          ...state.companion,
          stats: {
            ...state.companion.stats,
            energy: Math.min(100, state.companion.stats.energy + 40),
            happiness: Math.min(100, state.companion.stats.happiness + 3),
          },
        },
      }

    case 'PLAY':
      return {
        ...state,
        companion: {
          ...state.companion,
          stats: {
            ...state.companion.stats,
            happiness: Math.min(100, state.companion.stats.happiness + 25),
            energy: Math.max(0, state.companion.stats.energy - 10),
            hunger: Math.max(0, state.companion.stats.hunger - 5),
          },
        },
      }

    case 'ADD_MESSAGE': {
      const isUser = action.payload.role === 'user'
      return {
        ...state,
        messages: [...state.messages, action.payload],
        companion: isUser
          ? {
              ...state.companion,
              stats: {
                ...state.companion.stats,
                happiness: Math.min(100, state.companion.stats.happiness + 2),
              },
            }
          : state.companion,
      }
    }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'DECAY':
      if (!state.companion) return state
      return {
        ...state,
        companion: {
          ...state.companion,
          stats: {
            hunger: Math.max(0, state.companion.stats.hunger - 0.5),
            energy: Math.max(0, state.companion.stats.energy - 0.3),
            happiness: Math.max(0, state.companion.stats.happiness - 0.4),
          },
        },
      }

    case 'UPDATE_SERVER_URL':
      return { ...state, serverUrl: action.payload }

    default:
      return state
  }
}

// ─── Mood helper ───────────────────────────────────────────────────────────
export function getMood(stats) {
  if (!stats) return 'neutral'
  const { hunger, energy, happiness } = stats
  if (hunger < 20) return 'hungry'
  if (energy < 20) return 'exhausted'
  if (happiness < 20) return 'sad'
  if (hunger > 75 && energy > 75 && happiness > 75) return 'happy'
  if (happiness > 60) return 'content'
  return 'neutral'
}

const STORAGE_KEY = 'companion-v1'

// ─── Provider ──────────────────────────────────────────────────────────────
export function CompanionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const decayRef = useRef(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        dispatch({ type: 'LOAD', payload: { ...data, initialized: true } })
      }
    } catch {
      // ignore
    }
  }, [])

  // Save to localStorage on every state change
  useEffect(() => {
    if (!state.initialized || !state.companion) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          initialized: state.initialized,
          companion: state.companion,
          userName: state.userName,
          serverUrl: state.serverUrl,
          messages: state.messages.slice(-60),
        })
      )
    } catch {
      // ignore
    }
  }, [state])

  // Stats decay: every 60s stats go down slightly
  useEffect(() => {
    if (!state.initialized) return
    decayRef.current = setInterval(() => dispatch({ type: 'DECAY' }), 60_000)
    return () => clearInterval(decayRef.current)
  }, [state.initialized])

  const mood = state.companion ? getMood(state.companion.stats) : 'neutral'

  const actions = {
    setup: (payload) => dispatch({ type: 'SETUP', payload }),
    feed: () => dispatch({ type: 'FEED' }),
    sleep: () => dispatch({ type: 'SLEEP' }),
    play: () => dispatch({ type: 'PLAY' }),
    addMessage: (msg) => dispatch({ type: 'ADD_MESSAGE', payload: msg }),
    setLoading: (val) => dispatch({ type: 'SET_LOADING', payload: val }),
    setServerUrl: (url) => dispatch({ type: 'UPDATE_SERVER_URL', payload: url }),
  }

  return (
    <CompanionContext.Provider value={{ state, mood, actions }}>
      {children}
    </CompanionContext.Provider>
  )
}

export function useCompanion() {
  const ctx = useContext(CompanionContext)
  if (!ctx) throw new Error('useCompanion must be inside CompanionProvider')
  return ctx
}
