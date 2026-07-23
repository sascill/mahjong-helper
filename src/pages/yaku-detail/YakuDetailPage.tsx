import { Navigate, useParams } from 'react-router'

import {
  YAKUS,
  type YakuId,
} from '../../domain/mahjong/yaku'
import { YakuCatalog } from '../../features/yaku-catalog'

function YakuDetailPage() {
  const { yakuId } = useParams<{ yakuId: string }>()
  const yaku = YAKUS.find(
    (candidate) => candidate.id === (yakuId as YakuId),
  )

  if (!yaku) {
    return <Navigate to="/yaku" replace />
  }

  return (
    <main>
      <YakuCatalog selectedYaku={yaku} />
    </main>
  )
}

export default YakuDetailPage
