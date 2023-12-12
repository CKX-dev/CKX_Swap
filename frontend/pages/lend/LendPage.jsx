import React, { useState } from 'react';
import DepositPopup from './popups/Deposit/DepositPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import ClaimPopup from './popups/Claim/ClaimPopup';
import styles from './index.module.css';
import BottomLend from './BottomLend';

function LendPage() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [switchPage, setSwitchPage] = useState('ckETH');

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

  return (
    <div>
      <DepositPopup
        isDepositModalOpen={isDepositModalOpen}
        closeDepositModal={closeDepositModal}
      />
      <WithdrawPopup
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
      />
      <ClaimPopup
        isClaimOpen={isClaimOpen}
        closeClaim={closeClaim}
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
                <img width={24} height={24} src="/frontend/assets/ckETH.png" alt="" />
                <div>ckETH</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>AVAILABLE</div>
                <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>0.39</div>
              </div>
            </div>
            <div className={styles.DepositBottom}>
              <div className={styles.TextTitle}>AVAILABLE FOR DEPOSIT</div>
              <div className={styles.TextTContent}>0.29 d.ckETH</div>
            </div>
            <button type="button" className={styles.ButtonContainer} onClick={openDepositModal}>
              Deposit
              <div className={styles.Ellipse} />
            </button>
          </div>
          <div className={styles.Withdraw}>
            <div className={styles.WithdrawUpper}>
              <div className={styles.TokenDiv}>
                <img width={24} height={24} src="/frontend/assets/d.ckETH.png" alt="" />
                <div>d.ckETH</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>AVAILABLE</div>
                <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>0.29</div>
              </div>
            </div>
            <div className={styles.WithdrawBottom}>
              <div className={styles.TextTitle}>LOCKED</div>
              <div className={styles.TextTContent}>0.48 d.ckETH</div>
            </div>
            <button type="button" className={styles.ButtonContainer} onClick={openWithdrawModal}>
              Withdraw
              <div className={styles.Ellipse} />
            </button>
          </div>
          <div className={styles.Claim}>
            <div className={styles.ClaimUpper}>
              <div className={styles.TokenDiv}>
                <img width={24} height={24} src="/frontend/assets/ckETH.png" alt="" />
                <div>ckETH</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ lineHeight: '24px', fontSize: '14px' }}>$0.29</div>
                <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>0.29</div>
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
        <BottomLend />
      </div>
    </div>
  );
}

export default LendPage;
