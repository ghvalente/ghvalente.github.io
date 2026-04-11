import { CompanionProvider, useCompanion } from './context/CompanionContext'
import Setup from './pages/Setup'
import Home from './pages/Home'

function AppContent() {
  const { state } = useCompanion()
  return state.initialized ? <Home /> : <Setup />
}

export default function App() {
  return (
    <CompanionProvider>
      <AppContent />
    </CompanionProvider>
  )
}
