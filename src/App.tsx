import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HippoProvider, useHippo } from './context/HippoContext'
import GamesPage from './pages/GamesPage'
import HomePage from './pages/HomePage'
import OnboardingPage from './pages/OnboardingPage'
import ShopPage from './pages/ShopPage'
import StatsPage from './pages/StatsPage'
import TabsLayout from './pages/TabsLayout'

function RootRedirect() {
  const { hasCompletedOnboarding } = useHippo()
  
  if (hasCompletedOnboarding) {
    return <Navigate to="/tabs" replace />
  }
  return <Navigate to="/onboarding" replace />
}

function App() {
  return (
    <BrowserRouter basename="/react-tamagochi">
      <HippoProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/onboarding/*" element={<OnboardingPage />} />
          <Route path="/tabs" element={<TabsLayout />}>
            <Route index element={<HomePage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </HippoProvider>
    </BrowserRouter>
  )
}

export default App
