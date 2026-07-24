import type {
  Yaku,
  YakuId,
} from '../../../domain/mahjong/yaku'

export const YAKU_GROUP_LABELS = [
  '1판',
  '2판',
  '3판',
  '6판',
  '역만',
] as const

export type YakuGroupLabel = (typeof YAKU_GROUP_LABELS)[number]

export type YakuGroup = {
  label: YakuGroupLabel
  yakus: Yaku[]
}

const YAKU_GROUP_ANCHOR_IDS: Record<YakuGroupLabel, string> = {
  '1판': 'yaku-1',
  '2판': 'yaku-2',
  '3판': 'yaku-3',
  '6판': 'yaku-6',
  '역만': 'yaku-yakuman',
}

const YAKU_COMPACT_SUMMARIES: Record<YakuId, string> = {
  riichi: '리치 선언 후 화료',
  ippatsu: '리치 후 한 바퀴 화료',
  'menzen-tsumo': '멘젠 쯔모 화료',
  pinfu: '슌쯔 네 몸통 양면대기',
  iipeikou: '같은 슌쯔 두 개',
  tanyao: '2~8 숫자패만',
  yakuhai: '삼원패·자풍·장풍 커쯔',
  chankan: '가깡 패로 론',
  'rinshan-kaihou': '영상패 쯔모 화료',
  haitei: '마지막 쯔모 화료',
  houtei: '마지막 버림패 론',
  'double-riichi': '첫 버림 리치',
  chiitoitsu: '또이쯔 일곱 개',
  ittsuu: '한 무늬 123·456·789',
  'sanshoku-doujun': '세 무늬 같은 슌쯔',
  'sanshoku-doukou': '세 무늬 같은 커쯔',
  toitoi: '네 몸통 모두 커쯔',
  sanankou: '안커 세 개',
  sankantsu: '깡쯔 세 개',
  chanta: '모든 묶음에 1·9·자패',
  honroutou: '1·9·자패만',
  shousangen: '삼원패 두 몸통과 머리',
  ryanpeikou: '이페코 두 쌍',
  honitsu: '한 무늬와 자패',
  junchan: '모든 묶음에 1·9',
  chinitsu: '한 무늬 숫자패만',
  tenhou: '친 첫 손패 화료',
  chiihou: '자 첫 쯔모 화료',
  'kokushi-musou': '13종 1·9·자패',
  'chuuren-poutou': '한 무늬 구련 형태',
  ryuuiisou: '녹색 패만',
  suuankou: '안커 네 개',
  suukantsu: '깡쯔 네 개',
  chinroutou: '1·9 숫자패만',
  tsuuiisou: '자패만',
  daisangen: '백·발·중 몸통',
  shousuushii: '풍패 세 몸통과 머리',
  daisuushii: '사풍패 모두 몸통',
}

const getYakuGroupLabel = (yaku: Yaku): YakuGroupLabel => {
  if (yaku.value.type === 'yakuman') {
    return '역만'
  }

  const label = `${yaku.value.closed}판`

  if (
    label === '1판' ||
    label === '2판' ||
    label === '3판' ||
    label === '6판'
  ) {
    return label
  }

  throw new Error(`표시 그룹이 정의되지 않은 역입니다: ${yaku.id}`)
}

export const groupYakus = (yakus: readonly Yaku[]): YakuGroup[] =>
  YAKU_GROUP_LABELS.map((label) => ({
    label,
    yakus: yakus.filter((yaku) => getYakuGroupLabel(yaku) === label),
  }))

export const getYakuGroupAnchorId = (label: YakuGroupLabel): string =>
  YAKU_GROUP_ANCHOR_IDS[label]

export const getCompactYakuSummary = (yaku: Yaku): string =>
  YAKU_COMPACT_SUMMARIES[yaku.id]

export const getPrimaryValueLabel = (yaku: Yaku): string =>
  yaku.value.type === 'yakuman'
    ? '역만'
    : `멘젠 ${yaku.value.closed}판`

export const getListConditionLabel = (yaku: Yaku): string => {
  if (yaku.value.type === 'yakuman') {
    return yaku.value.open ? '울기 가능' : '멘젠'
  }

  if (yaku.value.open === null) {
    return '멘젠'
  }

  return yaku.value.open === yaku.value.closed
    ? '울기 가능'
    : `울면 ${yaku.value.open}판`
}

export const getDetailOpenValueLabel = (yaku: Yaku): string => {
  if (yaku.value.type === 'yakuman') {
    return yaku.value.open ? '울기 가능' : '울기 불가'
  }

  return yaku.value.open === null
    ? '울기 불가'
    : `울기 ${yaku.value.open}판`
}

export const canOpenYaku = (yaku: Yaku): boolean =>
  yaku.value.type === 'yakuman'
    ? yaku.value.open
    : yaku.value.open !== null
