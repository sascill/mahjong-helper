import type { Yaku } from '../../../domain/mahjong/yaku'

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

export const getPrimaryValueLabel = (yaku: Yaku): string =>
  yaku.value.type === 'yakuman'
    ? '역만'
    : `멘젠 ${yaku.value.closed}판`

export const getOpenValueLabel = (yaku: Yaku): string => {
  if (yaku.value.type === 'yakuman') {
    return yaku.value.open ? '울기 가능' : '멘젠 전용'
  }

  return yaku.value.open === null
    ? '멘젠 전용'
    : `울기 ${yaku.value.open}판`
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
