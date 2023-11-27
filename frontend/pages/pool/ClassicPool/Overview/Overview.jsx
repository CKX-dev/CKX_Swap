import React from 'react';
import {
  ClassicPool1, ClassicPool2, CopyButton,
  FiftyPercent, FeeAPR, RewardAPR,
  Lightning,
  PlusIcon,
} from '../Utils';
import styles from './index.module.css';

function Overview() {
  return (
    <div>
      <div className={styles.RightHeader}>
        <ClassicPool1 />
        Classic Pool
        <ClassicPool2 />
      </div>
      <div className={styles.RightContract}>
        <div className={styles.RightTitle}>CONTRACT</div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <div style={{ marginTop: '4px' }}>0x80115с...47c05c</div>
          {' '}
          <div>
            <CopyButton />
          </div>
        </div>
      </div>
      <div className={styles.RightRow}>
        <div className={styles.RightFirstRow}>
          <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Current Exchange Rate</div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
              <img src="/frontend/assets/ckBTC.png" width={32} alt="" />
              <div style={{ marginTop: '8px' }}>1 ckBTC =</div>
              <img src="/frontend/assets/ckETH.png" width={32} alt="" />
              <div style={{ marginTop: '8px' }}>18 ckETH</div>
            </div>
          </div>
          <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Assets in Pool</div>
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <FiftyPercent />
                <img src="/frontend/assets/ckBTC.png" width={24} height={24} alt="" />
                <div style={{ alignSelf: 'center' }}>17,003,450.69 USDC</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <FiftyPercent />
                <img src="/frontend/assets/ckETH.png" width={24} height={24} alt="" />
                <div style={{ alignSelf: 'center' }}>17,003,450.69 USDC</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.RightSecondRow}>
          <div>
            <div className={styles.RightTitle}>TVL</div>
            <div style={{ marginTop: '8px', fontSize: '18px' }}>$34,006,901.38</div>
          </div>
          <div>
            <div className={styles.RightTitle}>TOTAL APR</div>
            <div style={{ marginTop: '8px', fontSize: '18px' }}>7.36%</div>
          </div>
          <div>
            <div className={styles.RightTitle}>VOLUME (24h)</div>
            <div style={{ marginTop: '8px', fontSize: '18px' }}>7.36%</div>
          </div>
          <div>
            <div className={styles.RightTitle}>FEE (24H)</div>
            <div style={{ marginTop: '8px', fontSize: '18px' }}>$9,814.5</div>
          </div>
        </div>
      </div>
      <div className={styles.LpReward}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div><Lightning /></div>
          <div>LP REWARDS</div>
          <div><PlusIcon /></div>
        </div>
        <div style={{ display: 'flex', gap: '68px', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FeeAPR />
            <div>
              <div className={styles.RightTitle}>FEE APR (24H)</div>
              <div style={{ marginTop: '8px' }}>7.36%</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <RewardAPR />
            <div>
              <div className={styles.RightTitle}>REWARDS APR</div>
              <div style={{ marginTop: '8px' }}>-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
