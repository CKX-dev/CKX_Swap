import React from 'react';
import {
  WithdrawIcon,
} from '../Utils';
import styles from './index.module.css';

function Withdraw() {
  return (
    <div>
      <div className={styles.RightHeader}>
        <WithdrawIcon />
        Withdraw
      </div>
      <div>
        Withdraw to receive pool tokens and earned trading fees.
      </div>
      <div style={{ marginTop: '32px' }}>
        <img src="/frontend/assets/withdraw.png" width="60%" alt="" />
      </div>
    </div>
  );
}

export default Withdraw;
