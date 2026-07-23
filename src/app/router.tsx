import { Navigate, Route, Routes } from 'react-router'
import HandSelectPage from '../pages/hand-select/HandSelectPage'
import HomePage from '../pages/home/HomePage'
import RecommendationsPage from '../pages/recommendations/RecommendationsPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hand" element={<HandSelectPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
