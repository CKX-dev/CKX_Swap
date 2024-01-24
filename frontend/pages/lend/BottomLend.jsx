import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

function BottomLend(
  { switchPage },
) {
  return (
    <div style={{ color: 'rgba(204, 204, 204, 1)' }}>
      <div style={{
        display: 'flex', gap: '20px', marginTop: '36px', marginBottom: '36px',
      }}
      >
        <div style={{ width: '50%' }} className={styles.BottomRight}>
          <div>
            <div>
              <span style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '20px' }}>
                Share of
                {' '}
                {switchPage === 'ckETH' ? 'ckETH' : 'ckBTC'}
                {' '}
                interest:
              </span>
              {' '}
              <span style={{ color: 'rgba(126, 135, 255, 1)', fontSize: '24px' }}>0.0001673%</span>
            </div>
            <div style={{ display: 'flex', marginTop: '4px' }}>
              <span style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>Learn more</span>
              {' '}
              <svg style={{ marginTop: '4px' }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 5L10 8L6 11" stroke="#858697" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>
              COUNT OF
              {switchPage === 'ckETH' ? ' D.CKETH' : ' D.CKBTC'}
              {' '}
              IN CIRCULATION

            </div>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
              {switchPage === 'ckETH' ? <img width={32} height={32} src="/frontend/assets/d.ckETH.png" alt="" />
                : <img width={32} height={32} src="/frontend/assets/d.ckBTC.png" alt="" />}
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>17,973,373.37</div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '50%', display: 'flex', flexDirection: 'column', gap: '20px',
          }}
          className={styles.BottomLeft}
        >
          <div style={{ height: '116px', display: 'flex', gap: '20px' }}>
            <div style={{
              borderRadius: '12px',
              width: '50%',
              backgroundColor: 'rgba(28, 29, 38, 1)',
              gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
            >
              <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>
                {' '}
                {switchPage === 'ckETH' ? 'D.CKETH' : 'D.CKBTC'}
                {' '}
                BALANCE
              </div>
              <div style={{
                color: 'rgba(204, 204, 204, 1)', fontSize: '24px', display: 'flex', gap: '10px', justifyContent: 'end',
              }}
              >
                {switchPage === 'ckETH' ? <img width={32} height={32} src="/frontend/assets/d.ckETH.png" alt="" />
                  : <img width={32} height={32} src="/frontend/assets/d.ckBTC.png" alt="" />}
                <div style={{ marginTop: '4px', fontWeight: 500 }}>96.72</div>
              </div>
            </div>
            <div style={{
              borderRadius: '12px',
              width: '50%',
              backgroundColor: 'rgba(28, 29, 38, 1)',
              gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
            >
              <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>AVERAGE LOCK</div>
              <div style={{
                color: 'rgba(204, 204, 204, 1)', fontSize: '24px', display: 'flex', gap: '10px', justifyContent: 'end',
              }}
              >
                {switchPage === 'ckETH' ? <img width={32} height={32} src="/frontend/assets/d.ckETH.png" alt="" />
                  : <img width={32} height={32} src="/frontend/assets/d.ckBTC.png" alt="" />}
                <div style={{ marginTop: '4px', fontWeight: 500 }}>96.72</div>
              </div>
            </div>
          </div>
          <div style={{
            height: '108px',
            borderRadius: '12px',
            padding: '20px',
            gap: '20px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(28, 29, 38, 1)',
          }}
          >
            <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>GLOBAL AVERAGE LOCK TIME</div>
            <div style={{ textAlign: 'right', color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>433 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

BottomLend.propTypes = {
  switchPage: PropTypes.string.isRequired,
};

export default BottomLend;
