import React, { useState, useEffect } from 'react';
import DepositPopup from './popups/Deposit/DepositPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import ClaimPopup from './popups/Claim/ClaimPopup';
import styles from './index.module.css';
import BottomLend from './BottomLend';

import { useAuth } from '../../hooks/use-auth-client';

function LendPage() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [switchPage, setSwitchPage] = useState('ckETH');
  const [lockedckETH, setLockedckETH] = useState(0);

  const { depositActor, principal } = useAuth();

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
  console.log('rerender');
  const [wrapBalance, setWrapBalance] = useState();
  const [depositedValue, setDepositedValue] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [interest, setInterest] = useState();
  const [decimals, setDecimals] = useState();

  const [updateUI, setUpdateUI] = useState(false);

  useEffect(() => {
    const getBalanceUI = async () => {
      if (principal) {
        try {
          const tx = await depositActor.getTokenBalance(principal);
          setTokenBalance(Number(tx));
          const tx2 = await depositActor.getWrapBalance(principal);
          setWrapBalance(Number(tx2));
          const tx3 = await depositActor.getInterestUI(principal);
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
            < Number(item.duration) * 60 * 1000000000)) {
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
      />
      <WithdrawPopup
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
        decimals={decimals}
        wrapBalance={wrapBalance}
        setUpdateUI={setUpdateUI}
      />
      <ClaimPopup
        isClaimOpen={isClaimOpen}
        closeClaim={closeClaim}
        decimals={decimals}
        value={(interest / 10 ** decimals).toFixed(6)}
        setUpdateUI={setUpdateUI}
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
              <img width={24} height={24} src="/frontend/assets/ckBTC.png" alt="" />
              <div>ckBTC</div>
            </button>
            <button
              type="button"
              className={switchPage === 'ckETH' ? styles.HeaderSwitchItemOn : styles.HeaderSwitchItemOff}
              onClick={() => setSwitchPage('ckETH')}
            >
              <img width={24} height={24} src="/frontend/assets/ckETH.png" alt="" />
              <div>ckETH</div>
            </button>
          </div>
        </div>
        <div className={styles.firstTable}>
          <div className={styles.Deposit}>
            <div className={styles.DepositUpper}>
              <div className={styles.TokenDiv}>
                {switchPage === 'ckETH'
                  ? <img width={24} height={24} src="/frontend/assets/ckETH.png" alt="" />
                  : <img width={24} height={24} src="/frontend/assets/ckBTC.png" alt="" />}
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
                  ? <img width={24} height={24} src="/frontend/assets/d.ckETH.png" alt="" />
                  : <img width={24} height={24} src="/frontend/assets/d.ckBTC.png" alt="" />}
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
                  ? <img width={24} height={24} src="/frontend/assets/ckETH.png" alt="" />
                  : <img width={24} height={24} src="/frontend/assets/ckBTC.png" alt="" />}
                <div>
                  {' '}
                  {switchPage === 'ckETH' ? 'ckETH' : 'ckBTC'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>$0.29</div>
                {interest ? <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>{(interest / 10 ** decimals).toFixed(6)}</div>
                  : <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>0</div>}
              </div>
            </div>
            <div className={styles.ClaimBottom}>
              <div className={styles.TextTitle}>INTEREST APY (24HRS)</div>
              <div className={styles.TextTContent}>1.7%</div>
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
