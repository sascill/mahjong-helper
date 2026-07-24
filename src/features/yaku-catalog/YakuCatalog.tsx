import { useLayoutEffect } from 'react'

import type { Yaku } from '../../domain/mahjong/yaku'
import { YAKUS } from '../../domain/mahjong/yaku'
import styles from './YakuCatalog.module.css'
import { YakuDetail } from './ui/YakuDetail'
import { YakuList } from './ui/YakuList'

export type YakuCatalogProps = {
  selectedYaku?: Yaku
}

export function YakuCatalog({
  selectedYaku,
}: YakuCatalogProps) {
  const selectedYakuId = selectedYaku?.id

  useLayoutEffect(() => {
    if (!selectedYakuId) {
      return
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [selectedYakuId])

  return (
    <div className={styles.catalog}>
      {selectedYaku ? (
        <YakuDetail yaku={selectedYaku} />
      ) : (
        <YakuList yakus={YAKUS} />
      )}
    </div>
  )
}
