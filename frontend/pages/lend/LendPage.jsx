import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import DepositPopup from './popups/Deposit/DepositPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import ClaimPopup from './popups/Claim/ClaimPopup';
import styles from './index.module.css';
import BottomLend from './BottomLend';

import { useAuth } from '../../hooks/use-auth-client';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';
import dckBTC from '../../assets/d.ckBTC.png';
import dckETH from '../../assets/d.cketh.png';
import * as deposit0 from '../../../src/declarations/deposit0';
import * as deposit1 from '../../../src/declarations/deposit1';
import * as token0 from '../../../src/declarations/token0';
import * as token1 from '../../../src/declarations/token1';

function LendPage() {
  const {
    deposit0Actor, deposit1Actor, principal, token0Actor, token1Actor,
  } = useAuth();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [switchPage, setSwitchPage] = useState('ckETH');
  const [lockedckETH, setLockedckETH] = useState(0);
  const [depositActor, setDepositActor] = useState(deposit1Actor);
  const [tokenActor, setToken0Actor] = useState(token1Actor);

  const openDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const openClaim = () => {
    setIsClaimOpen(true);
  };

  const closeClaim = () => {
    setIsClaimOpen(false);
  };
  const [wrapBalance, setWrapBalance] = useState();
  const [depositedValue, setDepositedValue] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [interest, setInterest] = useState();
  const [decimals, setDecimals] = useState();

  const [updateUI, setUpdateUI] = useState(false);

  useEffect(() => {
    setDepositActor(switchPage === 'ckETH' ? deposit1Actor : deposit0Actor);
    setToken0Actor(switchPage === 'ckETH' ? token1Actor : token0Actor);
  }, [switchPage, deposit0Actor, deposit1Actor, token0Actor, token1Actor]);

  useEffect(() => {
    const getBalanceUI = async () => {
      if (principal) {
        try {
          const tx = await depositActor.getTokenBalance(principal);
          setTokenBalance(Number(tx));
          const tx2 = await depositActor.getWrapBalance(principal);
          setWrapBalance(Number(tx2));
          const tx3 = await depositActor.getInterestInfo(principal);
          setInterest(Number(tx3));
        } catch (error) {
          console.log(error);
        }
      }
    };
    getBalanceUI();
  }, [principal, depositActor, updateUI]);

  useEffect(() => {
    const getDeposit = async () => {
      if (principal && decimals) {
        const tx = await depositActor.getDepositId(principal);

        const fetchCurrentWrap = async (depositType) => {
          const rt = await depositActor.getCurrentMultiplier(depositType);
          return rt;
        };
        const originalList = tx[0];

        if (originalList) {
          let totalWrap = 0;
          let totalDeposited = 0;
          const idPromises = originalList.forEach(async (item) => {
            if (item.isActive && (Number((Date.now()) * 10 ** 6 - Number(item.startTime))
            < Number(item.duration) * 24 * 60 * 60 * 1000000000)) {
              const value = await fetchCurrentWrap(item);
              const wrapValue = Number(value) / 10 ** decimals;
              totalWrap += Number(wrapValue);
              setLockedckETH(totalWrap.toFixed(6));
            }

            if (item.isActive) {
              const value = item.amount;
              const depositedVal = Number(value) / 10 ** decimals;
              totalDeposited += Number(depositedVal);
              setDepositedValue(totalDeposited);
            }
          });
          await Promise.all(idPromises);
        }
      }
    };
    getDeposit();
  }, [principal, decimals, depositActor, updateUI]);

  useEffect(() => {
    const getDecimal = async () => {
      if (depositActor) {
        try {
          const tx = await depositActor.getTokenDecimals();
          setDecimals(Number(tx));
        } catch (error) {
          console.log(error);
        }
      }
    };
    getDecimal();
  }, [depositActor, updateUI]);

  return (
    <div>
      <DepositPopup
        isDepositModalOpen={isDepositModalOpen}
        closeDepositModal={closeDepositModal}
        decimals={decimals}
        tokenBalance={tokenBalance}
        setUpdateUI={setUpdateUI}
        depositActor={depositActor}
        tokenActor={tokenActor}
        btcOrEth={switchPage}
      />
      <WithdrawPopup
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
        decimals={decimals}
        wrapBalance={wrapBalance}
        setUpdateUI={setUpdateUI}
        depositActor={depositActor}
        btcOrEth={switchPage}
      />
      <ClaimPopup
        isClaimOpen={isClaimOpen}
        closeClaim={closeClaim}
        decimals={decimals}
        value={(interest / 10 ** decimals).toFixed(6)}
        setUpdateUI={setUpdateUI}
        depositActor={depositActor}
        btcOrEth={switchPage}
      />
      <div className={styles.Container}>
        <div className={styles.Header}>
          <div>Lend</div>
          <div className={styles.HeaderSwitch}>
            <button
              type="button"
              className={switchPage === 'ckBTC' ? styles.HeaderSwitchItemOn : styles.HeaderSwitchItemOff}
              onClick={() => setSwitchPage('ckBTC')}
            >
              <img width={24} height={24} src={ckBTC} alt="" />
              <div>ckBTC</div>
            </button>
            <button
              type="button"
              className={switchPage === 'ckETH' ? styles.HeaderSwitchItemOn : styles.HeaderSwitchItemOff}
              onClick={() => setSwitchPage('ckETH')}
            >
              <img width={24} height={24} src={ckETH} alt="" />
              <div>ckETH</div>
            </button>
          </div>
        </div>
        <div className={styles.firstTable}>
          <div className={styles.Deposit}>
            <div className={styles.DepositUpper}>
              <div className={styles.TokenDiv}>
                {switchPage === 'ckETH'
                  ? <img width={24} height={24} src={ckETH} alt="" />
                  : <img width={24} height={24} src={ckBTC} alt="" />}
                <div>
                  {' '}
                  {switchPage === 'ckETH' ? 'ckETH' : 'ckBTC'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>AVAILABLE</div>
                <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>
                  {tokenBalance && decimals ? (
                    <div>
                      {Math.round((tokenBalance / (10 ** decimals)) * 10000) / 10000}
                    </div>
                  )
                    : <div>0</div>}
                </div>
              </div>
            </div>
            <div className={styles.DepositBottom}>
              <div className={styles.TextTitle}>DEPOSIT BALANCE</div>
              {tokenBalance && decimals ? (
                <div className={styles.TextTContent}>
                  {(Math.round((depositedValue) * 1000) / 1000) || 0}
                  {/* {depositedValue} */}
                </div>
              )
                : <div className={styles.TextTContent}>0</div>}
            </div>
            <button type="button" className={styles.ButtonContainer} onClick={openDepositModal}>
              Deposit
              <div className={styles.Ellipse} />
            </button>
          </div>
          <div className={styles.Withdraw}>
            <div className={styles.WithdrawUpper}>
              <div className={styles.TokenDiv}>
                {switchPage === 'ckETH'
                  ? <img width={24} height={24} src={dckETH} alt="" />
                  : <img width={24} height={24} src={dckBTC} alt="" />}
                <div>
                  {' '}
                  {switchPage === 'ckETH' ? 'd.ckETH' : 'd.ckBTC'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>AVAILABLE</div>
                <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>{(wrapBalance / 10 ** decimals) || 0}</div>
              </div>
            </div>
            <div className={styles.WithdrawBottom}>
              <div className={styles.TextTitle}>LOCKED</div>
              <div className={styles.TextTContent}>
                {lockedckETH}
                {' '}
                {' '}
                {switchPage === 'ckETH' ? 'd.ckETH' : 'd.ckBTC'}
              </div>
            </div>
            <button type="button" className={styles.ButtonContainer} onClick={openWithdrawModal}>
              Withdraw
              <div className={styles.Ellipse} />
            </button>
          </div>
          <div className={styles.Claim}>
            <div className={styles.ClaimUpper}>
              <div className={styles.TokenDiv}>
                {switchPage === 'ckETH'
                  ? <img width={24} height={24} src={ckETH} alt="" />
                  : <img width={24} height={24} src={ckBTC} alt="" />}
                <div>
                  {' '}
                  {switchPage === 'ckETH' ? 'ckETH' : 'ckBTC'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>$NaN</div>
                {interest ? <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>{(interest / 10 ** decimals).toFixed(6)}</div>
                  : <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>0</div>}
              </div>
            </div>
            <div className={styles.ClaimBottom}>
              <div className={styles.TextTitle}>INTEREST APY (24HRS)</div>
              <div className={styles.TextTContent}>NaN%</div>
            </div>
            <button type="button" className={styles.ButtonContainer} onClick={openClaim}>
              Claim
              <div className={styles.Ellipse} />
            </button>
          </div>
        </div>
        <BottomLend switchPage={switchPage} />
      </div>
    </div>
  );
}

export default LendPage;
