import React, { useEffect, useState } from 'react';

import { useAuth } from '../../hooks/use-auth-client';

import styles from './index.module.css';

function LoggedIn() {
  const {
    principal, logout, swapActor,
  } = useAuth();

  const [accountId, setAccountId] = useState();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleGetUserICRC1SubAccount = async (user) => {
      const res = await swapActor.getUserICRC1SubAccount(user);
      setAccountId(res);
    };

    handleGetUserICRC1SubAccount(principal);
  }, [principal]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: 103,
          height: 28,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 7,
          paddingBottom: 7,
          background: '#20212D',
          borderRadius: 6,
          overflow: 'hidden',
          border: '0.50px #393B4C solid',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          display: 'inline-flex',
          position: 'relative',
          alignSelf: 'center',
          cursor: 'pointer',
        }}
        onClick={toggleDropdown}
        aria-hidden="true"
        className={`button ${showDropdown ? 'show' : ''}`}
      >
        <div style={{
          color: '#A6ADFA',
          fontSize: 15,
          fontFamily: 'Inter',
          fontWeight: '600',
          lineHeight: 20,
          wordWrap: 'break-word',
        }}
        >
          {accountId ? `${accountId.slice(0, 4)}...${accountId.slice(-4)}` : 'Loading...'}
        </div>
        <div style={{
          width: 94,
          height: 44,
          left: 0,
          top: 13,
          position: 'absolute',
          background: 'rgba(126.44, 135.01, 255, 0.80)',
          boxShadow: '50px 50px 50px ',
          borderRadius: 9999,
          filter: 'blur(50px)',
        }}
        />
      </div>

      <div className={`${styles.Dropdown} ${showDropdown ? styles.Show : ''}`}>
        <div className={styles.TextConainer}>
          <strong>Account ID:</strong>
          <span className={styles.AccountID}>{accountId}</span>
        </div>

        <div className={styles.TextConainer}>
          <strong>Principal:</strong>
          {principal.toText()}
        </div>
        <button type="button" id="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default LoggedIn;
