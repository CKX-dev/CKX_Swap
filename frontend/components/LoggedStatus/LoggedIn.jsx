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
    <div className={styles.Container}>
      <button type="button" onClick={toggleDropdown} className={`button ${showDropdown ? 'show' : ''}`}>
        {accountId ? `${accountId.slice(0, 4)}...${accountId.slice(-4)}` : 'Loading...'}
      </button>
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
