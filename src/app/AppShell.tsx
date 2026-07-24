import type { PropsWithChildren } from 'react'
import { Link, NavLink, useLocation, useMatch } from 'react-router'

import styles from './AppShell.module.css'

function getNavigationClassName(isActive: boolean) {
  return [styles.navigationLink, isActive ? styles.navigationLinkActive : '']
    .filter(Boolean)
    .join(' ')
}

function AppShell({ children }: PropsWithChildren) {
  const isYakuDetail = useMatch('/yaku/:yakuId') !== null
  const location = useLocation()
  const isRecommendationDetail =
    isYakuDetail &&
    typeof location.state === 'object' &&
    location.state !== null &&
    'yakuDetailSource' in location.state &&
    location.state.yakuDetailSource === 'recommendations'
  const detailBackLink = isRecommendationDetail
    ? {
        to: '/recommendations',
        label: '추천 결과',
        ariaLabel: '추천 결과로',
      }
    : {
        to: '/yaku',
        label: '역 목록',
        ariaLabel: '역 목록으로',
      }

  return (
    <div className={styles.shell}>
      <header
        className={styles.header}
        aria-label="애플리케이션 헤더"
      >
        <div className={styles.headerInner}>
          {isYakuDetail && (
            <Link
              className={styles.headerBackLink}
              to={detailBackLink.to}
              aria-label={detailBackLink.ariaLabel}
            >
              <span aria-hidden="true">←</span>
              <span>{detailBackLink.label}</span>
            </Link>
          )}
          <Link
            className={styles.brand}
            to="/"
            aria-label="Mahjong Helper 홈"
          >
            Mahjong Helper
          </Link>
        </div>
      </header>

      <div className={styles.content}>{children}</div>

      <nav className={styles.navigation} aria-label="주요 메뉴">
        <div className={styles.navigationInner}>
          <NavLink
            className={({ isActive }) => getNavigationClassName(isActive)}
            end
            to="/"
          >
            <span className={styles.navigationIcon} aria-hidden="true">
              ⌂
            </span>
            홈
          </NavLink>
          <NavLink
            className={({ isActive }) => getNavigationClassName(isActive)}
            to="/yaku"
          >
            <span className={styles.navigationIcon} aria-hidden="true">
              ▤
            </span>
            역 도감
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

export default AppShell
