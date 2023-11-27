import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

function PoolPage() {
  return (
    <div className={styles.PageContainer}>
      <div className={styles.Heading}>Pools</div>
      <div>
        <div className={styles.GridContainer}>
          <div className={styles.GridPools}>Pools</div>
          <div className={styles.GridType}>Type</div>
          <div className={styles.GridLiquidity}>Liquidity</div>
          <div className={styles.GridAPR}>APR</div>
        </div>
        <div className={styles.PoolCards}>
          <div className={styles.GridPools}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckETH.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>ckETH</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckBTC.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>d.ckETH</div>
            </div>
          </div>
          <div className={styles.GridType}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Classic />
              <div style={{ color: 'rgba(172, 179, 249, 1)', alignSelf: 'center' }}>Classic</div>
            </div>
          </div>
          <div className={styles.GridLiquidity}>
            <div style={{ marginTop: '4px' }}>$17,003,450.69</div>
          </div>
          <div className={styles.GridAPR}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ marginTop: '4px' }}>9.2%</div>
              <Link to="/pool/classic">
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.PoolCards}>
          <div className={styles.GridPools}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckETH.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>ckETH</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckBTC.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>ckBTC</div>
            </div>
          </div>
          <div className={styles.GridType}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Stable />
              <div style={{ color: 'rgba(172, 179, 249, 1)', alignSelf: 'center' }}>Stable</div>
            </div>
          </div>
          <div className={styles.GridLiquidity}>
            <div style={{ marginTop: '4px' }}>$17,003,450.69</div>
          </div>
          <div className={styles.GridAPR}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ marginTop: '4px' }}>9.2%</div>
              <Link to="/pool/classic">
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.PoolCards}>
          <div className={styles.GridPools}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckETH.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>ckETH</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ICP.png" width={36} alt="" />
              <div style={{ alignSelf: 'center' }}>ICP</div>
            </div>
          </div>
          <div className={styles.GridType}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Stable />
              <div style={{ color: 'rgba(172, 179, 249, 1)', alignSelf: 'center' }}>Stable</div>
            </div>
          </div>
          <div className={styles.GridLiquidity}>
            <div style={{ marginTop: '4px' }}>$17,003,450.69</div>
          </div>
          <div className={styles.GridAPR}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ marginTop: '4px' }}>9.2%</div>
              <Link to="/pool/classic">
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Classic() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L18 22C20.2091 22 22 20.2091 22 18L22 16L2 16L2 18C2 20.2091 3.79086 22 6 22Z" fill="#ACB3F9" />
      <g opacity="0.4">
        <path d="M18 2L6 2C3.79086 2 2 3.79086 2 6L2 16L22 16L22 6C22 3.79086 20.2091 2 18 2Z" fill="#ACB3F9" />
      </g>
    </svg>
  );
}

function Stable() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21.5936 16.4999L14.6485 4.51551C13.4774 2.49483 10.5226 2.49483 9.35154 4.51551L2.40641 16.4999C1.24439 18.5051 2.71273 21 5.05487 21H18.9451C21.2873 21 22.7556 18.5051 21.5936 16.4999Z" fill="#ACB3F9" />
      <path d="M20.7244 15L17.2473 9H6.75272L3.27563 15H20.7244Z" fill="#ACB3F9" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M7.99996 2.66675H24C26.9455 2.66675 29.3333 5.05456 29.3333 8.00008V24.0001C29.3333 26.9456 26.9455 29.3334 24 29.3334H7.99996C5.05444 29.3334 2.66663 26.9456 2.66663 24.0001V8.00008C2.66663 5.05456 5.05444 2.66675 7.99996 2.66675Z" fill="#ACB3F9" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.0404 16.7071C22.4309 16.3166 22.4309 15.6834 22.0404 15.2929L18.0404 11.2929C17.6498 10.9024 17.0167 10.9024 16.6261 11.2929C16.2356 11.6834 16.2356 12.3166 16.6261 12.7071L18.919 15L10.6666 15C10.1143 15 9.66658 15.4477 9.66658 16C9.66658 16.5523 10.1143 17 10.6666 17L18.919 17L16.6261 19.2929C16.2356 19.6834 16.2356 20.3166 16.6261 20.7071C17.0167 21.0976 17.6498 21.0976 18.0404 20.7071L22.0404 16.7071Z" fill="#ACB3F9" />
    </svg>

  );
}

export default PoolPage;
