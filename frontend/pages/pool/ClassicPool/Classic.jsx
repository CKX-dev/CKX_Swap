import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BackButtonIcon, DepositIcon,
  MyPositionIcon, OverviewIcon, WithdrawIcon,
} from './Utils';
import styles from './index.module.css';
import Overview from './Overview/Overview';
import MyPosition from './MyPosition/MyPosition';
import Deposit from './Deposit/Deposit';
import Withdraw from './Withdraw/Withdraw';

function Classic() {
  const [menu, setMenu] = useState('Overview');
  return (
    <div>
      <div style={{ display: 'flex', color: 'white' }}>
        <div style={{ width: '15%', padding: '12px', marginRight: '12px' }}>
          <Link to="/pool" className={styles.buttonMenu} style={{ marginBottom: '4px', marginTop: '4px', color: 'rgba(217, 218, 232, 1)' }}>
            <BackButtonIcon />
            <div>POOL</div>
          </Link>
          <div
            className={`${styles.buttonMenu} ${menu === 'Overview' && styles.selectedButton}`}
            onClick={() => setMenu('Overview')}
          >
            <OverviewIcon />
            <div>Overview</div>
          </div>
          <div className={`${styles.buttonMenu} ${menu === 'MyPosition' && styles.selectedButton}`} onClick={() => setMenu('MyPosition')}>
            <MyPositionIcon />
            <div>My Position</div>
          </div>
          <div className={`${styles.buttonMenu} ${menu === 'Deposit' && styles.selectedButton}`} onClick={() => setMenu('Deposit')}>
            <DepositIcon />
            <div>Deposit</div>
          </div>
          <div className={`${styles.buttonMenu} ${menu === 'Withdraw' && styles.selectedButton}`} onClick={() => setMenu('Withdraw')}>
            <WithdrawIcon />
            <div>Withdraw</div>
          </div>
        </div>
        <div className={styles.RightContent}>
          {menu === 'Overview' && <Overview />}
          {menu === 'MyPosition' && <MyPosition />}
          {menu === 'Deposit' && <Deposit />}
          {menu === 'Withdraw' && <Withdraw />}
        </div>
      </div>
    </div>
  );
}

export default Classic;
