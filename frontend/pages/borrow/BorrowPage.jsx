import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import BorrowPopup from './popups/Borrow/BorrowPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import SupplyPopup from './popups/Supply/SupplyPopup';
import RepayPopup from './popups/Repay/RepayPopup';
import styles from './index.module.css';
import Borrow from '../../components/BorrowDiv/Borrow';

// import * as borrow from '../../../src/declarations/borrow';
import * as token0 from '../../../src/declarations/token0';
import * as token1 from '../../../src/declarations/token1';
import * as aggregator from '../../../src/declarations/aggregator';

import { useAuth } from '../../hooks/use-auth-client';

function BorrowPage() {
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  const [balanceToken0, setBalanceToken0] = useState(0);
  const [balanceToken1, setBalanceToken1] = useState(0);
  const [balanceLpToken, setBalanceLpToken] = useState(0);
  const [balanceDeposit, setBalanceDeposit] = useState(0);
  const [borrowInfo, setBorrowInfo] = useState();

  const [updateUI, setUpdateUI] = useState(false);

  const { principal, borrowActor } = useAuth();

  useEffect(() => {
    const balanceToken = async () => {
      if (principal) {
        try {
          const tx = await
          borrowActor.getTokenBalance(Principal.fromText(token0.canisterId), principal);
          setBalanceToken0(Number(tx));
          const tx2 = await
          borrowActor.getTokenBalance(Principal.fromText(token1.canisterId), principal);
          setBalanceToken1(Number(tx2));
          const tx3 = await
          borrowActor.getTokenBalance(Principal.fromText(aggregator.canisterId), principal);
          setBalanceLpToken(Number(tx3));
          const tx4 = await
          borrowActor.getDepositIdPerUser(principal);
          setBalanceDeposit(Number(tx4[0].amount));
          setBorrowInfo(tx4[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    balanceToken();
  }, [principal, updateUI]);

  const openRepayModal = () => {
    setIsRepayModalOpen(true);
  };

  const closeRepayModal = () => {
    setIsRepayModalOpen(false);
  };

  const openBorrowModal = () => {
    setIsBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setIsBorrowModalOpen(false);
  };

  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const openSupplyModal = () => {
    setIsSupplyModalOpen(true);
  };

  const closeSupplyModal = () => {
    setIsSupplyModalOpen(false);
  };

  return (
    <div>

      {/* <button type="button" onClick={openBorrowModal}>Open Borrow Modal</button>
      <button type="button" onClick={openWithdrawModal}>Open Withdraw Modal</button>
      <button type="button" onClick={openSupplyModal}>Open Supply Modal</button>
      <button type="button" onClick={openRepayModal}>Open Repay Modal</button> */}
      <div className={styles.Container}>
        <div className={styles.Header}>
          <div className={styles.HeaderLeft}>
            <div className={styles.HeaderTitle}>TOTAL SUPPLIED</div>
            <div className={styles.Headerdiv}>
              <img src="/frontend/assets/ckBTC.png" width={24} height={24} alt="" />
              <div className={styles.MTop}>50.2 ckBTC</div>
            </div>
            <div className={styles.Headerdiv}>
              <img src="/frontend/assets/ckETH.png" width={24} height={24} alt="" />
              <div className={styles.MTop}>24 ckETH</div>
            </div>
          </div>
          <div className={styles.HeaderMiddle}>
            <div className={styles.HeaderTitle}>AVAILABLE FOR BORROWING</div>
            <div className={styles.Headerdiv}>
              <img src="/frontend/assets/ckBTC.png" width={24} height={24} alt="" />
              <div className={styles.MTop}>50.2 ckBTC</div>
            </div>
            <div className={styles.Headerdiv}>
              <img src="/frontend/assets/ckETH.png" width={24} height={24} alt="" />
              <div className={styles.MTop}>24 ckETH</div>
            </div>
          </div>
          <div className={styles.HeaderRight}>
            <div className={styles.HeaderTitle}>AVERAGE BORROWING RATE (24HRS)</div>
            <div style={{ marginTop: '6px' }}>4.5%</div>
          </div>
        </div>
        <div className={styles.BorrowDiv}>
          <div>Borrow against your Liquidity Pools</div>
          <Borrow
            openBorrowModal={openBorrowModal}
            openRepayModal={openRepayModal}
            openWithdrawModal={openWithdrawModal}
            openSupplyModal={openSupplyModal}
            tokenBalance={balanceDeposit}
            borrowInfo={borrowInfo}
            balanceLpToken={balanceLpToken}
            balanceDeposit={balanceDeposit}
          />
          {/* <Borrow />
          <Borrow />
          <Borrow />
          <Borrow /> */}
        </div>
      </div>
      <BorrowPopup
        isBorrowModalOpen={isBorrowModalOpen}
        closeBorrowModal={closeBorrowModal}
        decimals={18}
        tokenBalance={[balanceToken0, balanceToken1, balanceLpToken]}
        setUpdateUI={setUpdateUI}
      />
      <WithdrawPopup
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
        decimals={18}
        tokenBalance={balanceDeposit}
        setUpdateUI={setUpdateUI}
      />
      <SupplyPopup
        isSupplyModalOpen={isSupplyModalOpen}
        closeSupplyModal={closeSupplyModal}
        decimals={18}
        tokenBalance={[balanceToken0, balanceToken1, balanceLpToken]}
        setUpdateUI={setUpdateUI}
      />
      <RepayPopup
        isRepayModalOpen={isRepayModalOpen}
        closeRepayModal={closeRepayModal}
        decimals={18}
        tokenBalance={[balanceToken0, balanceToken1, balanceLpToken]}
        borrowInfo={borrowInfo}
        setUpdateUI={setUpdateUI}
      />
    </div>
  );
}

export default BorrowPage;
