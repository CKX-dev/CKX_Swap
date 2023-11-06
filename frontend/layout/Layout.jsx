import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';

import styles from './index.module.css';

function Layout() {
  return (
    <div>
      <Header />

      <div className={styles.Outlet}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
