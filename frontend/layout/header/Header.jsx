import React from 'react';

import { useAuth } from '../../hooks/use-auth-client';

import LoggedIn from '../../components/LoggedStatus/LoggedIn';
import LoggedOut from '../../components/LoggedStatus/LoogedOut';

import styles from './index.module.css';
import NavigationContainer from '../../components/NavigationSection/NavigationSection';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.AuthSection}>
      <div style={{ display: 'flex' }}>
        <img height={36} src="/frontend/assets/logo.png" alt="logo" />
        <NavigationContainer />
      </div>
      <div style={{ display: 'flex' }}>
        {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
        <button type="button" id="loginButton" style={{ marginLeft: '10px', padding: '0px 16px 0px 16px', display: 'flex' }}>
          <svg style={{ alignSelf: 'center' }} width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99998 8.66665C8.36817 8.66665 8.66665 8.36817 8.66665 7.99998C8.66665 7.63179 8.36817 7.33331 7.99998 7.33331C7.63179 7.33331 7.33331 7.63179 7.33331 7.99998C7.33331 8.36817 7.63179 8.66665 7.99998 8.66665Z" stroke="#9C9EAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.6667 8.66665C13.0349 8.66665 13.3333 8.36817 13.3333 7.99998C13.3333 7.63179 13.0349 7.33331 12.6667 7.33331C12.2985 7.33331 12 7.63179 12 7.99998C12 8.36817 12.2985 8.66665 12.6667 8.66665Z" stroke="#9C9EAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.33335 8.66665C3.70154 8.66665 4.00002 8.36817 4.00002 7.99998C4.00002 7.63179 3.70154 7.33331 3.33335 7.33331C2.96516 7.33331 2.66669 7.63179 2.66669 7.99998C2.66669 8.36817 2.96516 8.66665 3.33335 8.66665Z" stroke="#9C9EAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </button>
      </div>
    </div>
  );
}

export default Header;
