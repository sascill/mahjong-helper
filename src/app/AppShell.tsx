import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router'

import styles from './AppShell.module.css'

function getNavigationClassName(isActive: boolean) {
  return [
    styles.navigationLink,
    isActive ? styles.navigationLinkActive : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function AppShell({ children }: PropsWithChildren) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link
            className={styles.brand}
            to="/"
            aria-label="Mahjong Helper 홈"
          >
            <span className={styles.brandMark} aria-hidden="true">
              🀄
            </span>
            Mahjong Helper
          </Link>
        </div>
      </header>

      <div className={styles.content}>{children}</div>

      <nav className={styles.navigation} aria-label="주요 메뉴">
        <div className={styles.navigationInner}>
          <NavLink
            className={({ isActive }) =>
              getNavigationClassName(isActive)
            }
            end
            to="/"
          >
            <span className={styles.navigationIcon} aria-hidden="true">
              ⌂
            </span>
            홈
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              getNavigationClassName(isActive)
            }
            to="/hand"
          >
            <span className={styles.navigationIcon} aria-hidden="true">
              ▦
            </span>
            손패
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              getNavigationClassName(isActive)
            }
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
