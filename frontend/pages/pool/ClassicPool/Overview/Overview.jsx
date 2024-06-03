/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useParams } from 'react-router-dom';
import {
  ClassicPool1, ClassicPool2, CopyButton,
  FiftyPercent,
} from '../Utils';
import styles from './index.module.css';

import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';
import dckBTC from '../../../../assets/d.ckBTC.png';
import dckETH from '../../../../assets/d.cketh.png';
import { useAuth } from '../../../../hooks/use-auth-client';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';
import * as deposit0 from '../../../../../src/declarations/deposit0';
import * as deposit1 from '../../../../../src/declarations/deposit1';

const pairMapping = {
  'eth-btc': {
    token0Label: 'ETH',
    token1Label: 'BTC',
    token0Image: ckETH,
    token1Image: ckBTC,
    token0CanisterId: token1.canisterId,
    token1CanisterId: token0.canisterId,
  },
  'eth-deth': {
    token0Label: 'ETH',
    token1Label: 'd.ETH',
    token0Image: ckETH,
    token1Image: dckETH,
    token0CanisterId: token1.canisterId,
    token1CanisterId: deposit1.canisterId,
  },
  'btc-dbtc': {
    token0Label: 'BTC',
    token1Label: 'd.BTC',
    token0Image: ckBTC,
    token1Image: dckBTC,
    token0CanisterId: token0.canisterId,
    token1CanisterId: deposit0.canisterId,
  },
};

function Overview() {
  const { swapActor, getMappingFromPair } = useAuth();
  const { pair } = useParams();
  const [pairInfo, setPairInfo] = useState(null);
  const [currentPairMapping, setCurrentPairMapping] = useState(pairMapping);

  const {
    token0Label, token1Label, token0Image, token1Image,
  } = currentPairMapping[pair];

  useEffect(() => {
    async function fetchMapping() {
      const mapping = await getMappingFromPair(pairMapping);
      setCurrentPairMapping(mapping);
    }

    fetchMapping();
  }, []);

  useEffect(() => {
    const fetchPairInfo = async () => {
      try {
        let t0;
        let t1;

        switch (pair) {
          case 'eth-btc':
            t0 = token0;
            t1 = token1;
            break;
          case 'eth-deth':
            t0 = token1;
            t1 = deposit1;
            break;
          case 'btc-dbtc':
            t0 = token0;
            t1 = deposit0;
            break;
          default:
            console.error('Unknown pair:', pair);
            return;
        }

        const p = await swapActor
          .getPair(Principal.fromText(t0.canisterId), Principal.fromText(t1.canisterId));
        setPairInfo(p[0]);
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
          <div className={styles.RightFirstRowElement}>
            <div className={styles.RightTitle}>Current Exchange Rate</div>
            {pairInfo && pairInfo.reserve0 > 0 && pairInfo.reserve1 > 0 ? (
              pairInfo.reserve1 > pairInfo.reserve0 ? (
                <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                  <img src={token0Image} width={32} alt={token0Label} />
                  <div style={{ marginTop: '8px' }}>
                    1
                    {' '}
                    {token0Label}
                    {' '}
                    =
                  </div>
                  <img src={token1Image} width={32} alt={token1Label} />
                  <div style={{ marginTop: '8px' }}>
                    {(parseFloat(pairInfo.reserve1) / parseFloat(pairInfo.reserve0)).toFixed(5)}
                    {' '}
                    {token1Label}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                  <img src={token0Image} width={32} alt={token0Label} />
                  <div style={{ marginTop: '8px' }}>
                    {(parseFloat(pairInfo.reserve0) / parseFloat(pairInfo.reserve1)).toFixed(5)}
                    {' '}
                    {token0Label}
                    {' '}
                    =
                  </div>
                  <img src={token1Image} width={32} alt={token1Label} />
                  <div style={{ marginTop: '8px' }}>
                    1
                    {' '}
                    {token1Label}
                  </div>
                </div>
              )
            ) : (
              <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                <img src={token0Image} width={32} alt={token0Label} />
                <div style={{ marginTop: '8px' }}>
                  0
                  {' '}
                  {token0Label}
                  {' '}
                  =
                </div>
                <img src={token1Image} width={32} alt={token1Label} />
                <div style={{ marginTop: '8px' }}>
                  0
                  {' '}
                  {token1Label}
                </div>
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
                  <img src={token0Image} width={24} height={24} alt={token0Label} />
                  <div style={{ alignSelf: 'center' }}>
                    {pairInfo ? parseFloat(Number(pairInfo.reserve0) / 10 ** 18).toFixed(2) : '-'}
                    {' '}
                    {token0Label}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <FiftyPercent percentage={pairInfo && pairInfo.reserve0 && pairInfo.reserve1
                    ? ((Number(pairInfo.reserve1)
                    / (Number(pairInfo.reserve0) + Number(pairInfo.reserve1))) * 100).toFixed(2)
                    : 0}
                  />
                  <img src={token1Image} width={24} height={24} alt={token1Label} />
                  <div style={{ alignSelf: 'center' }}>
                    {pairInfo ? parseFloat(Number(pairInfo.reserve1) / 10 ** 18).toFixed(2) : '-'}
                    {' '}
                    {token1Label}
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
