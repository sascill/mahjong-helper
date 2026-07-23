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
