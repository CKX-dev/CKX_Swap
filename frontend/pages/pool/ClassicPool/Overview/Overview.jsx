/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import {
  ClassicPool1, ClassicPool2, CopyButton,
  FiftyPercent, FeeAPR, RewardAPR,
  Lightning,
  PlusIcon,
} from '../Utils';
import styles from './index.module.css';

import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';
import { useAuth } from '../../../../hooks/use-auth-client';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';

function Overview() {
  const { swapActor } = useAuth();
  const [pairInfo, setPairInfo] = useState(null);

  useEffect(() => {
    const fetchPairInfo = async () => {
      try {
        const pair = await swapActor
          .getPair(Principal.fromText(token0.canisterId), Principal.fromText(token1.canisterId));
        setPairInfo(pair[0]);
      } catch (error) {
        console.error('Error fetching pair info:', error);
      }
    };

    if (swapActor) {
      fetchPairInfo();
    }
  }, [swapActor]);

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
          {/* <div style={{ marginTop: '4px' }}>0x80115с...47c05c</div> */}
          <div style={{ marginTop: '4px' }}>{pairInfo ? pairInfo.id : '-'}</div>
          {' '}
          <div>
            <CopyButton />
          </div>
        </div>
      </div>
      <div className={styles.RightRow}>
        <div className={styles.RightFirstRow}>
          {/* <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Current Exchange Rate</div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
              <img src={ckBTC} width={32} alt="" />
              <div style={{ marginTop: '8px' }}>1 ckBTC =</div>
              <img src={ckETH} width={32} alt="" />
              <div style={{ marginTop: '8px' }}>18 ckETH</div>
            </div>
          </div> */}
          <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Current Exchange Rate</div>
            {pairInfo && pairInfo.reserve0 > 0 && pairInfo.reserve1 > 0 ? (
              pairInfo.reserve1 > pairInfo.reserve0 ? (
                <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                  <img src={ckETH} width={32} alt="" />
                  <div style={{ marginTop: '8px' }}>
                    1 ckETH =
                  </div>

                  <img src={ckBTC} width={32} alt="" />
                  <div style={{ marginTop: '8px' }}>
                    {(parseFloat(pairInfo.reserve1) / parseFloat(pairInfo.reserve0)).toFixed(5)}
                    {' '}
                    ckBTC
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                  <img src={ckETH} width={32} alt="" />
                  <div style={{ marginTop: '8px' }}>
                    {(parseFloat(pairInfo.reserve0) / parseFloat(pairInfo.reserve1)).toFixed(5)}
                    {' '}
                    ckETH =
                  </div>

                  <img src={ckBTC} width={32} alt="" />
                  <div style={{ marginTop: '8px' }}>
                    1 ckBTC
                  </div>
                </div>
              )
            ) : (
              <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                <img src={ckETH} width={32} alt="" />
                <div style={{ marginTop: '8px' }}>0 ckETH =</div>

                <img src={ckBTC} width={32} alt="" />
                <div style={{ marginTop: '8px' }}>0 ckBTC</div>
              </div>
            )}
          </div>

          <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Assets in Pool</div>
            <div style={{ display: 'flex', gap: '50px' }}>
              <div style={{ marginTop: '18px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <FiftyPercent percentage={pairInfo && pairInfo.reserve0 && pairInfo.reserve1
                    ? ((Number(pairInfo.reserve0)
                    / (Number(pairInfo.reserve0) + Number(pairInfo.reserve1))) * 100).toFixed(2)
                    : 0}
                  />
                  <img src={ckETH} width={24} height={24} alt="" />
                  <div style={{ alignSelf: 'center' }}>
                    {pairInfo ? parseFloat(Number(pairInfo.reserve0) / 10 ** 18).toFixed(2) : '-'}
                    {' '}
                    ETH
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <FiftyPercent percentage={pairInfo
                    && pairInfo.reserve0 && pairInfo.reserve1
                    ? ((Number(pairInfo.reserve1)
                    / (Number(pairInfo.reserve0) + Number(pairInfo.reserve1))) * 100).toFixed(2)
                    : 0}
                  />
                  <img src={ckBTC} width={24} height={24} alt="" />
                  <div style={{ alignSelf: 'center' }}>
                    {pairInfo ? parseFloat(Number(pairInfo.reserve1) / 10 ** 18).toFixed(2) : '-'}
                    {' '}
                    BTC
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.RightTitle}>TOTAL APR</div>
                <div style={{ marginTop: '8px', fontSize: '18px' }}>NaN%</div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.RightSecondRow}>
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
        </div> */}
      </div>
      {/* <div className={styles.LpReward}>
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
      </div> */}
    </div>
  );
}

export default Overview;
