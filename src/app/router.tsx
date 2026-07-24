import { Navigate, Route, Routes } from 'react-router'
import HandSelectPage from '../pages/hand-select/HandSelectPage'
import RecommendationsPage from '../pages/recommendations/RecommendationsPage'
import TileReferencePage from '../pages/tile-reference/TileReferencePage'
import YakuDetailPage from '../pages/yaku-detail/YakuDetailPage'
import YakuListPage from '../pages/yaku-list/YakuListPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/yaku" replace />} />
      <Route path="/hand" element={<HandSelectPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/yaku" element={<YakuListPage />} />
      <Route path="/yaku/:yakuId" element={<YakuDetailPage />} />
      <Route path="/tiles" element={<TileReferencePage />} />
      <Route path="*" element={<Navigate to="/yaku" replace />} />
    </Routes>
  )
}

export default AppRouter
