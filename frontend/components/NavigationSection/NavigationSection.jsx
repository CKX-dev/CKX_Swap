import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './index.module.css';

function NavigationContainer() {
  const location = useLocation();

  return (
    <section className={styles.NavigationSection}>
      <section className={styles.NavigationInnerContainer}>
        <Link to="/swap" className={location.pathname === '/swap' ? styles.Active : ''}>
          Swap
        </Link>

        <Link to="/pool" className={location.pathname.includes('pool') ? styles.Active : ''}>
          Pool
        </Link>

        <Link to="/borrow" className={location.pathname === '/borrow' ? styles.Active : ''}>
          Borrow
        </Link>

        <Link to="/lend" className={location.pathname === '/lend' ? styles.Active : ''}>
          Lend
        </Link>

        <Link to="/faucet" className={location.pathname === '/faucet' ? styles.Active : ''}>
          Faucet
        </Link>

        {/* <Link to="/porfolio" className={location.pathname === '/porfolio' ? styles.Active : ''}>
          Porfolio
        </Link> */}

        {/* <Link to="/bridge" className={location.pathname.includes('bridge') ? styles.Active : ''}>
          Bridge
          <svg fill="none" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke={location.pathname.includes('bridge') ? '#ACB3F9' : '#D9DAE8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link> */}

        {/* <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? styles.Active : ''}>
          Leaderboard
        </Link> */}
      </section>
    </section>
  );
}

export default NavigationContainer;
