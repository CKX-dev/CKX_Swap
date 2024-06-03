import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import propTypes from 'prop-types';
import BorrowPopup from './popups/Borrow/BorrowPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import SupplyPopup from './popups/Supply/SupplyPopup';
import RepayPopup from './popups/Repay/RepayPopup';
import styles from './index.module.css';
import Borrow from '../../components/BorrowDiv/Borrow';

import * as token0 from '../../../src/declarations/token0';
import * as token1 from '../../../src/declarations/token1';
import * as deposit0 from '../../../src/declarations/deposit0';
import * as deposit1 from '../../../src/declarations/deposit1';
import * as aggregator from '../../../src/declarations/aggregator';
import * as aggregator0 from '../../../src/declarations/aggregator0';
import * as aggregator1 from '../../../src/declarations/aggregator1';
import * as borrow from '../../../src/declarations/borrow';
import * as borrow0 from '../../../src/declarations/borrow0';
import * as borrow1 from '../../../src/declarations/borrow1';

import { useAuth } from '../../hooks/use-auth-client';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';
import dckBTC from '../../assets/d.ckBTC.png';
import dckETH from '../../assets/d.cketh.png';
import { getActor } from '../../utils';

const pairMapping = {
  'ckBTC<>ckETH': {
    token0Label: 'ckETH',
    token1Label: 'ckBTC',
    token0Image: ckETH,
    token1Image: ckBTC,
    token0CanisterId: token1.canisterId,
    token1CanisterId: token0.canisterId,
    aggregatorCanisterId: aggregator.canisterId,
    borrowCanisterId: borrow.canisterId,
  },
  'ckETH<>d.ckETH': {
    token0Label: 'ckETH',
    token1Label: 'd.ckETH',
    token0Image: ckETH,
    token1Image: dckETH,
    token0CanisterId: token1.canisterId,
    token1CanisterId: deposit1.canisterId,
    aggregatorCanisterId: aggregator1.canisterId,
    borrowCanisterId: borrow1.canisterId,
  },
  'ckBTC<>d.ckBTC': {
    token0Label: 'ckBTC',
    token1Label: 'd.ckBTC',
    token0Image: ckBTC,
    token1Image: dckBTC,
    token0CanisterId: token0.canisterId,
    token1CanisterId: deposit0.canisterId,
    aggregatorCanisterId: aggregator0.canisterId,
    borrowCanisterId: borrow0.canisterId,
  },
};

function BorrowContainer({ pairName }) {
  const { principal, getMappingFromPair, identity } = useAuth();

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [currentPairMapping, setCurrentPairMapping] = useState(pairMapping);
  const {
    token0Label, token1Label, token0Image, token1Image,
    token0CanisterId, token1CanisterId, aggregatorCanisterId, borrowCanisterId,
  } = currentPairMapping[pairName];

  const [balanceToken0, setBalanceToken0] = useState(0);
  const [balanceToken1, setBalanceToken1] = useState(0);
  const [balanceLpToken, setBalanceLpToken] = useState(0);
  const [balanceDeposit, setBalanceDeposit] = useState(0);
  const [balanceBorrowBTC, setBalanceBorrowBTC] = useState(0);
  const [balanceBorrowETH, setBalanceBorrowETH] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [borrowInfo, setBorrowInfo] = useState();

  const [healthRatio, setHealthRatio] = useState(0);
  const [avaiBorrow, setAvaiBorrow] = useState([0, 0]);
  const [avaiBorrowTotal, setAvaiBorrowTotal] = useState([0, 0]);

  const [updateUI, setUpdateUI] = useState(false);

  useEffect(() => {
    async function fetchMapping() {
      const mapping = await getMappingFromPair(pairMapping);
      setCurrentPairMapping(mapping);
    }

    fetchMapping();
  }, []);

  useEffect(() => {
    const balanceToken = async () => {
      if (principal) {
        try {
          const borrowActor = getActor(borrowCanisterId, identity);

          const [
            tx,
            tx2,
            tx3,
            tx4,
            tx5,
          ] = await Promise.all([
            borrowActor.getTokenBalance(Principal.fromText(token0CanisterId), principal),
            borrowActor.getTokenBalance(Principal.fromText(token1CanisterId), principal),
            borrowActor.getTokenBalance(Principal.fromText(aggregatorCanisterId), principal),
            borrowActor.getDepositIdPerUser(principal),
            borrowActor.getHealthRatio(principal),
          ]);

          setBalanceToken0(parseFloat(tx));
          setBalanceToken1(parseFloat(tx2));
          setBalanceLpToken(parseFloat(tx3));
          setBalanceDeposit(parseFloat(tx4[0].amount));

          setBorrowInfo(tx4[0]);
          setHealthRatio((Number(tx5) * 100));
        } catch (error) {
          console.log(error);
        }
      }
    };
    balanceToken();
  }, [token0CanisterId, token1CanisterId, aggregatorCanisterId,
    principal, updateUI, borrowCanisterId]);

  useEffect(() => {
    const func = async () => {
      if (balanceLpToken) {
        const borrowActor = getActor(borrowCanisterId, identity);
        const tx1 = await
        borrowActor.getPairInfo(balanceLpToken + balanceDeposit);
        setAvaiBorrowTotal([parseFloat((tx1[1] * BigInt(60)) / BigInt(100)),
          parseFloat((tx1[0] * BigInt(60)) / BigInt(100))]);
      }
    };
    func();
  }, [balanceDeposit, balanceLpToken, principal, updateUI, borrowCanisterId]);

  useEffect(() => {
    const getBorrowInfo = async () => {
      const borrowActor = getActor(borrowCanisterId, identity);
      const tx = await
      borrowActor.getPairInfo(balanceDeposit);
      if (token0CanisterId === token0.canisterId || token0CanisterId === token1.canisterId) {
        setAvaiBorrow([
          Math.min(
            parseFloat((tx[0] * BigInt(60)) / BigInt(100)),
            parseFloat(balanceBorrowBTC),
          ),
          Math.min(
            parseFloat((tx[1] * BigInt(60)) / BigInt(100)),
            parseFloat(balanceBorrowETH),
          ),
        ]);
      } else {
        setAvaiBorrow([
          Math.min(
            parseFloat((tx[1] * BigInt(60)) / BigInt(100)),
            parseFloat(balanceBorrowETH),
          ),
          Math.min(
            parseFloat((tx[0] * BigInt(60)) / BigInt(100)),
            parseFloat(balanceBorrowBTC),
          ),
        ]);
      }
    };

    if (borrowCanisterId) {
      getBorrowInfo();
    }
  }, [borrowCanisterId, balanceDeposit, balanceBorrowETH, balanceBorrowBTC]);

  useEffect(() => {
    const getBorrowBal = async () => {
      const borrowActor = getActor(borrowCanisterId, identity);
      const token0Actor = getActor(token0CanisterId, identity);
      const token1Actor = getActor(token1CanisterId, identity);
      const tx1 = await borrowActor.getCurrentTotalBorrowed();
      setTotalBorrowed(tx1);

      const tx2 = await token0Actor.icrc1_balance_of({
        owner: Principal.fromText(borrowCanisterId),
        subaccount: [],
      });
      const tx3 = await token1Actor.icrc1_balance_of({
        owner: Principal.fromText(borrowCanisterId),
        subaccount: [],
      });

      setBalanceBorrowBTC(tx2);
      setBalanceBorrowETH(tx3);
    };

    if (token0CanisterId && token1CanisterId && borrowCanisterId) {
      getBorrowBal();
    }
  }, [token0CanisterId, token1CanisterId, borrowCanisterId, borrowInfo]);

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
            <div className={styles.HeaderTitle}>TOTAL BORROWED</div>
            <div className={styles.Headerdiv}>
              <img src={token0Image} width={24} height={24} alt="" />
              <div className={styles.MTop}>
                {(totalBorrowed && Number(totalBorrowed.token1) / 10 ** 18).toFixed(6) || 0}
                {' '}
                {token0Label}
              </div>
            </div>
            <div className={styles.Headerdiv}>
              <img src={token1Image} width={24} height={24} alt="" />
              <div className={styles.MTop}>
                {(totalBorrowed && Number(totalBorrowed.token0) / 10 ** 18).toFixed(6) || 0}
                {' '}
                {token1Label}
              </div>
            </div>
          </div>
          <div className={styles.HeaderMiddle}>
            <div className={styles.HeaderTitle}>AVAILABLE FOR BORROWING</div>
            <div className={styles.Headerdiv}>
              <img src={token0Image} width={24} height={24} alt="" />
              <div className={styles.MTop}>
                {(parseFloat(balanceBorrowBTC) / 10 ** 18).toFixed(6) || 0}
                {' '}
                {token0Label}
              </div>
            </div>
            <div className={styles.Headerdiv}>
              <img src={token1Image} width={24} height={24} alt="" />
              <div className={styles.MTop}>
                {(parseFloat(balanceBorrowETH) / 10 ** 18).toFixed(6) || 0}
                {' '}
                {token1Label}
              </div>
            </div>
          </div>
          <div className={styles.HeaderRight}>
            <div className={styles.HeaderTitle}>AVERAGE BORROWING RATE (24HRS)</div>
            <div style={{ marginTop: '6px' }}>NaN%</div>
          </div>
        </div>
        <div className={styles.BorrowDiv}>
          {/* <div>Borrow against your Liquidity Pools</div> */}
          <Borrow
            pairName={pairName}
            pairMapping={pairMapping[pairName]}
            openBorrowModal={openBorrowModal}
            openRepayModal={openRepayModal}
            openWithdrawModal={openWithdrawModal}
            openSupplyModal={openSupplyModal}
            tokenBalance={balanceDeposit}
            borrowInfo={borrowInfo}
            balanceLpToken={balanceLpToken}
            balanceDeposit={balanceDeposit}
            healthRatio={healthRatio}
            avaiBorrow={avaiBorrow}
            avaiBorrowTotal={avaiBorrowTotal}
            isActive={borrowInfo && borrowInfo.isUsing}
          />
          {/* <Borrow />
          <Borrow />
          <Borrow />
          <Borrow /> */}
        </div>
      </div>
      <BorrowPopup
        pairMapping={pairMapping[pairName]}
        isBorrowModalOpen={isBorrowModalOpen}
        closeBorrowModal={closeBorrowModal}
        decimals={18}
        tokenBalance={[balanceToken0, balanceToken1, balanceLpToken]}
        avaiBorrow={avaiBorrow}
        isActive={borrowInfo && borrowInfo.isUsing}
        setUpdateUI={setUpdateUI}
      />
      <WithdrawPopup
        pairMapping={pairMapping[pairName]}
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
        decimals={18}
        tokenBalance={balanceDeposit}
        isActive={borrowInfo && borrowInfo.isUsing}
        setUpdateUI={setUpdateUI}
      />
      <SupplyPopup
        pairMapping={pairMapping[pairName]}
        isSupplyModalOpen={isSupplyModalOpen}
        closeSupplyModal={closeSupplyModal}
        decimals={18}
        tokenBalance={[balanceToken0, balanceToken1, balanceLpToken]}
        isActive={borrowInfo && borrowInfo.isUsing}
        setUpdateUI={setUpdateUI}
      />
      <RepayPopup
        pairMapping={pairMapping[pairName]}
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

BorrowContainer.propTypes = {
  pairName: propTypes.string.isRequired,
};

export default BorrowContainer;
