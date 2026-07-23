import { HandAnalysisProvider } from '../features/hand-analysis'
import AppShell from './AppShell'
import AppRouter from './router'

function App() {
  return (
    <HandAnalysisProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </HandAnalysisProvider>
  )
}

export default App
