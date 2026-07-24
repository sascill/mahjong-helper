import type { PropsWithChildren } from 'react'
import { Link, NavLink, useMatch } from 'react-router'

import styles from "./AppShell.module.css";

function getNavigationClassName(isActive: boolean) {
  return [styles.navigationLink, isActive ? styles.navigationLinkActive : ""]
    .filter(Boolean)
    .join(" ");
}

function AppShell({ children }: PropsWithChildren) {
  const isYakuDetail = useMatch('/yaku/:yakuId') !== null

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
              to="/yaku"
              aria-label="역 목록으로"
            >
              <span aria-hidden="true">←</span>
              <span>역 목록</span>
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
            to="/hand"
          >
            <span className={styles.navigationIcon} aria-hidden="true">
              ▦
            </span>
            손패
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
  );
}

export default AppShell;
