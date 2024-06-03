import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';
import dckBTC from '../../assets/d.ckBTC.png';
import dckETH from '../../assets/d.cketh.png';
import { useAuth } from '../../hooks/use-auth-client';
import * as deposit0 from '../../../src/declarations/deposit0';
import * as deposit1 from '../../../src/declarations/deposit1';

function BottomLend(
  {
    switchPage, depositActor, updateUI, lockedckETH, unlockedckETH,
  },
) {
  const { principal } = useAuth();

  const [shareOfInterest, setShareOfInterest] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);
  const [averageLock, setAverageLock] = useState(0);
  const [globalAverageLockTime, setGlobalAverageLockTime] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalInterestPaidOut, setTotalInterestPaidOut] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tx1,
          tx2,
          tx3,
          tx4,
          tx5,
          tx6,
          tx7,
        ] = await Promise.all([
          depositActor.getShareOfInterest(),
          depositActor.getCirculatingSupply(),
          depositActor.getAverageLock(principal),
          depositActor.getGlobalAverageLockTime(),
          depositActor.icrc1_balance_of({ owner: principal, subaccount: [] }),
          depositActor.getTotalInterestPaidOut(7),
          depositActor.icrc1_balance_of({ owner: switchPage === 'ckETH' ? Principal.fromText(deposit1.canisterId) : Principal.fromText(deposit0.canisterId), subaccount: [] }),
        ]);

        setShareOfInterest(tx1[0]);
        setCirculatingSupply(tx2 + tx7);
        setAverageLock(tx3);
        setGlobalAverageLockTime(tx4);
        setBalance(tx5);
        setTotalInterestPaidOut(tx6);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (depositActor) {
      fetchData();
    }
  }, [depositActor, switchPage, principal, updateUI]);

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
                {shareOfInterest ? shareOfInterest.toFixed(6) : 0}
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
                <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>{(Number(totalInterestPaidOut) / 10 ** 18).toFixed(6)}</div>
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
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '24px' }}>{(Number(circulatingSupply) / 10 ** 18).toFixed(6)}</div>
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
                <div style={{ marginTop: '4px', fontWeight: 500 }}>{(parseFloat(balance) / 10 ** 18 + parseFloat(lockedckETH) + parseFloat(unlockedckETH)).toFixed(6)}</div>
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
                  {Number(averageLock) || 0}
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
              {Number(globalAverageLockTime) || 0}
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
    getTotalInterestPaidOut: PropTypes.func.isRequired,
  }).isRequired,
  updateUI: PropTypes.bool.isRequired,
};

export default BottomLend;
