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

        <Link to="/swap/liquidity" className={location.pathname.includes('liquidity') ? styles.Active : ''}>
          Pool
          <svg fill="none" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke={location.pathname.includes('liquidity') ? '#ACB3F9' : '#D9DAE8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </section>
  );
}

export default NavigationContainer;
