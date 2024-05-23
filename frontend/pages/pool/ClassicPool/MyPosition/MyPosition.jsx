import React from 'react';
import {
  FiftyPercent, InformationIcon, LastIcon, MyPositionIcon,
} from '../Utils';
import styles from './index.module.css';

import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';

function MyPosition() {
  return (
    <div>
      <div className={styles.RightHeader}>
        <MyPositionIcon />
        My Position
      </div>
      <div className={styles.RightFirstRow}>
        <div>
          <div className={styles.RightTitle}>Total value</div>
          <div style={{ marginTop: '8px', fontSize: '18px' }}>$96.038</div>
        </div>
        <div>
          <div className={styles.RightTitle}>LP Balance</div>
          <div style={{ marginTop: '8px', fontSize: '18px' }}>$96.038</div>
        </div>
        <div>
          <div className={styles.RightTitle}>Collateral ratio</div>
          <div style={{ marginTop: '8px', fontSize: '18px' }}>134,888.0 (24hrs)</div>
        </div>
      </div>
      <div className={styles.RightSecondRow}>
        <div className={styles.RightTitle}>Assets</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FiftyPercent />
            <img src={ckBTC} width={24} height={24} alt="" />
            <div>ckBTC</div>
          </div>
          <div>17,003,450.69 USDC</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FiftyPercent />
            <img src={ckETH} width={24} height={24} alt="" />
            <div>ckETH</div>
          </div>
          <div>17,003,450.69 USDC</div>
        </div>
      </div>
      <div className={styles.Earning}>
        <div style={{ fontSize: '24px' }}>Earning</div>
        <div className={styles.SmallText}>
          You are earning fees from every trade through the pool.
          Earned fees are compounded to your position. The proccess is automatic.
        </div>
        <div className={styles.EarningBar}>
          <div className={styles.EarningBarStatus} />
        </div>
      </div>
      <div className={styles.TimeMachine}>
        <div style={{ fontSize: '24px' }}>Time machine</div>
        <div className={styles.SmallText}>
          See and compare changes of your position with each action.
        </div>
      </div>
      <div className={styles.TimeMachineBox}>
        <div className={styles.TimeMachineBoxLeft}>
          <div>
            <div style={{ color: 'rgba(172, 179, 249, 1)', fontSize: '16px' }}>Now</div>
            <div>$10.982</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '16px', display: 'flex' }}>
              <div>29/10/2023 22:34:51</div>
              <LastIcon />
            </div>
            <div>$10.99</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '16px' }}>23/04/2023 22:34:51</div>
            <div>–</div>
          </div>
          <div className={styles.TimeMachineBoxLeftSelected}>
            <div style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '16px' }}>23/04/2023 22:34:51</div>
            <div>$1,156</div>
          </div>
          <div>
            <div>29/10/2023 22:34:51</div>
            <div>$10,995.8</div>
          </div>
        </div>
        <div className={styles.TimeMachineRight}>
          <div style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '16px' }}>Position record</div>
          <div
            style={{
              display: 'flex', marginTop: '10px', justifyContent: 'space-between',
            }}
            className={styles.SmallText}
          >
            <div style={{ display: 'flex' }}>
              Asset
              {' '}
              <InformationIcon />
            </div>
            <div>-$1,156.07</div>
          </div>
          <div style={{ marginBottom: '20px', marginTop: '18px' }}>
            <div className={styles.BoxElement}>
              {/* <div>ckBTC $0.99</div> */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <img src={ckBTC} width={24} height={24} alt="" />
                <div>ckBTC</div>
                <div>$0.99</div>
              </div>
              <div>578.035</div>
            </div>
            <div className={styles.BoxElement}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <img src={ckETH} width={24} height={24} alt="" />
                <div>ckETH</div>
                <div>$1,156.07</div>
              </div>
              <div>0.308</div>
            </div>
          </div>
          <div style={{
            paddingTop: '20px', borderTop: '1px solid rgba(44, 45, 59, 1)', color: 'rgba(255, 255, 255, 1)', fontSize: '16px',
          }}
          >
            Comparison with previous
          </div>
          <div style={{ display: 'flex', marginTop: '10px' }} className={styles.SmallText}>
            Asset
            {' '}
            <InformationIcon />
          </div>
          <div style={{ marginBottom: '20px', marginTop: '18px' }}>
            <div className={styles.BoxElement}>
              {/* <div>ckBTC $0.99</div> */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <img src={ckBTC} width={24} height={24} alt="" />
                <div>ckBTC</div>
              </div>
              <div style={{ color: 'rgba(131, 189, 103, 1)' }}>+20.12</div>
            </div>
            <div className={styles.BoxElement}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <img src={ckETH} width={24} height={24} alt="" />
                <div>ckETH</div>
              </div>
              <div style={{ color: 'rgba(131, 189, 103, 1)' }}>+0.009</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPosition;
