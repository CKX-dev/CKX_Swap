import React from 'react';
import styles from './index.module.css';

function BottomBorrow() {
  return (
    <div className={styles.Container}>
      <div style={{ display: 'flex' }}>
        <div className={styles.TextCenter} style={{ paddingRight: '120px' }}>
          <div className={styles.MediumTitle}>INTEREST PAID SO FAR +</div>
          <div
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <span className={styles.LargeNum}>NaN</span>
            <span className={styles.TextToken}>ckBTC</span>
          </div>
          <div className={styles.TextXSmall}>Since 3rd Nov 2024</div>
        </div>
        <div className={styles.TextCenter} style={{ paddingLeft: '120px' }}>
          <div className={styles.MediumTitle}>LP FEE EARNED SO FAR (NET OF INTEREST)</div>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <div className={styles.TextCenter}>
              <div>
                <span className={styles.LargeNum}>NaN</span>
                <span className={styles.TextToken}>ckBTC</span>
              </div>
              <div className={styles.Value}>$ NaN</div>
            </div>
            <div className={styles.TextCenter} style={{ paddingLeft: '24px' }}>
              <div>
                <span className={styles.LargeNum}>NaN</span>
                <span className={styles.TextToken}>d.ckBTC</span>
              </div>
              <div className={styles.Value}>$ NaN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomBorrow;
