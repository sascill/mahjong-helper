import { Navigate, Route, Routes } from 'react-router'
import HandSelectPage from '../pages/hand-select/HandSelectPage'
import HomePage from '../pages/home/HomePage'
import RecommendationsPage from '../pages/recommendations/RecommendationsPage'
import YakuDetailPage from '../pages/yaku-detail/YakuDetailPage'
import YakuListPage from '../pages/yaku-list/YakuListPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hand" element={<HandSelectPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/yaku" element={<YakuListPage />} />
      <Route path="/yaku/:yakuId" element={<YakuDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
