import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/use-auth-client';
import styles from './index.module.css';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';
import dckBTC from '../../assets/d.ckBTC.png';
import dckETH from '../../assets/d.cketh.png';

const initialState = {
  shareOfInterest: 0,
  circulatingSupply: 0,
  averageLock: 0,
  globalAverageLockTime: 0,
  balance: 0,
  totalInterestPaidOut: 0,
};

function BottomLend(
  {
    switchPage, depositActor, updateUI, lockedckETH, unlockedckETH,
  },
) {
  const { principal } = useAuth();

  const [data, setData] = useState(initialState);

  const fetchData = useCallback(async () => {
    try {
      const [
        shareOfInterest,
        circulatingSupply,
        averageLock,
        globalAverageLockTime,
        balance,
        totalInterestPaidOut,
        totalSupply,
      ] = await Promise.all([
        depositActor.getShareOfInterest(),
        depositActor.getCirculatingSupply(),
        depositActor.getAverageLock(principal),
        depositActor.getGlobalAverageLockTime(),
        depositActor.icrc1_balance_of({ owner: principal, subaccount: [] }),
        depositActor.getTotalInterestPaidOut(7),
        depositActor.icrc1_total_supply(),
      ]);

      setData({
        shareOfInterest: shareOfInterest[0],
        circulatingSupply: circulatingSupply + totalSupply,
        averageLock,
        globalAverageLockTime,
        balance,
        totalInterestPaidOut,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [depositActor, principal]);

  useEffect(() => {
    if (depositActor) {
      fetchData();
    }
  }, [depositActor, fetchData, updateUI, switchPage]);

  useEffect(() => {
    setData(initialState);
  }, [switchPage]);

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
              <span style={{ color: 'rgba(126, 135, 255, 1)', fontSize: '24px' }}>
                {data.shareOfInterest ? data.shareOfInterest.toFixed(6) : 0}
                %
              </span>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '4px',
            }}
            >
              <span style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>
                TOTAL
                {' '}
                {switchPage === 'ckETH' ? ' CKETH' : ' CKBTC'}
                {' '}
                INTEREST PAID OUT (7DAYS)
              </span>

              <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                {switchPage === 'ckETH' ? <img width={32} height={32} src={ckETH} alt="" />
                  : <img width={32} height={32} src={ckBTC} alt="" />}
                <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>{(Number(data.totalInterestPaidOut) / 10 ** 18).toFixed(6)}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>
              TOTAL COUNT OF
              {' '}
              {switchPage === 'ckETH' ? ' D.CKETH' : ' D.CKBTC'}
              <br />
              {/* (Locked + Balance) */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
              {switchPage === 'ckETH' ? <img width={32} height={32} src={dckETH} alt="" />
                : <img width={32} height={32} src={dckBTC} alt="" />}
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>{(Number(data.circulatingSupply) / 10 ** 18).toFixed(6)}</div>
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
              // gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '20px',
            }}
            >
              <div style={{ color: 'rgba(133, 134, 151, 1)', fontSize: '14px' }}>
                {' '}
                {switchPage === 'ckETH' ? 'D.CKETH' : 'D.CKBTC'}
                {' '}
                HOLDING
                <br />
                {/* (Locked + Balance) */}
              </div>
              <div style={{
                color: 'rgba(204, 204, 204, 1)', fontSize: '24px', display: 'flex', gap: '10px', justifyContent: 'end', marginTop: '4px',
              }}
              >
                {switchPage === 'ckETH' ? <img width={32} height={32} src={dckETH} alt="" />
                  : <img width={32} height={32} src={dckBTC} alt="" />}
                <div style={{ marginTop: '4px', fontWeight: 500 }}>{(parseFloat(data.balance) / 10 ** 18 + parseFloat(lockedckETH) + parseFloat(unlockedckETH)).toFixed(6)}</div>
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
                {switchPage === 'ckETH' ? <img width={32} height={32} src={dckETH} alt="" />
                  : <img width={32} height={32} src={dckBTC} alt="" />}
                <div style={{ marginTop: '4px', fontWeight: 500 }}>
                  {Number(data.averageLock) || 0}
                  {' '}
                  days
                </div>
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
            <div style={{ textAlign: 'right', color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>
              {Number(data.globalAverageLockTime) || 0}
              {' '}
              days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BottomLend.propTypes = {
  switchPage: PropTypes.string.isRequired,
  depositActor: PropTypes.shape({
    getShareOfInterest: PropTypes.func.isRequired,
    getCirculatingSupply: PropTypes.func.isRequired,
    getAverageLock: PropTypes.func.isRequired,
    getGlobalAverageLockTime: PropTypes.func.isRequired,
    getInterestInfo: PropTypes.func.isRequired,
    icrc1_balance_of: PropTypes.func.isRequired,
    icrc1_total_supply: PropTypes.func.isRequired,
    getTotalInterestPaidOut: PropTypes.func.isRequired,
  }).isRequired,
  updateUI: PropTypes.bool.isRequired,
  lockedckETH: PropTypes.number.isRequired,
  unlockedckETH: PropTypes.number.isRequired,
};

export default BottomLend;
