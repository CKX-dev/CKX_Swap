import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth-client';

import PairContainer from './pairContainer/PairContainer';

import styles from './index.module.css';
import AddTokenPopup from './popups/Transfer/TransferPopup';
import DepositTokenPopup from './popups/Deposit/DepositTokenPopup';

function LiquidityPage() {
  const { swapActor, principal } = useAuth();

  const [userPositions, setUserPositions] = useState([]);
  const [positionSymbols, setPositionSymbols] = useState([]);
  const [isAddTokenModalOpen, setAddTokenModalOpen] = useState(false);
  const [isDepositTokenModalOpen, setDepositTokenModalOpen] = useState(false);

  const openAddTokenModal = () => {
    setAddTokenModalOpen(true);
  };

  const closeAddTokenModal = () => {
    setAddTokenModalOpen(false);
  };

  const openDepositTokenModal = () => {
    setDepositTokenModalOpen(true);
  };

  const closeDepositTokenModal = () => {
    setDepositTokenModalOpen(false);
  };

  const handleShowInfoClick = () => {

  };

  const handleToSymbol = async (id) => {
    const tokens = id.split(':');
    const token0res = await swapActor.symbol(tokens[0]);
    const token1res = await swapActor.symbol(tokens[1]);

    return `${token0res}/${token1res}`;
  };

  const calculateTotalValue = () => {
    if (userPositions.length > 0) {
      const totalValue = userPositions.reduce((total, position) => total + Number(position[1]), 0);

      return totalValue;
    }

    return 0;
  };

  useEffect(() => {
    const handleGetUserLPBalances = async (user) => {
      const res = await swapActor.getUserLPBalances(user);
      setUserPositions(res);
    };

    const fetchPositionSymbols = async () => {
      if (userPositions.length > 0) {
        const symbols = await Promise.all(userPositions.map((pos) => handleToSymbol(pos[0])));
        setPositionSymbols(symbols);
      }
    };

    if (swapActor && principal) {
      handleGetUserLPBalances(principal);
    }

    fetchPositionSymbols();
  }, [swapActor, principal, userPositions]);

  return (
    <div className={styles.PageContainer}>

      <div className={styles.LiquidityOuterContainer}>
        <PairContainer />

        <div className={styles.LiquidityContainer}>
          <div className={styles.CardContainer}>
            <div className={styles.Title}>
              Liquidity Pool
            </div>

            <Link to="/swap/liquidity/add">
              Add Liquidity
            </Link>

            <button type="button" onClick={openAddTokenModal} className={styles.Btn}>
              Transfer Token
            </button>

            <button type="button" onClick={openDepositTokenModal} className={styles.Btn}>
              Deposit Token
            </button>
          </div>

          <div className={styles.PositionOuterContainer}>
            <div className={styles.TopContainer}>
              <div className={styles.LeftContainer}>
                <div className={styles.Title}>
                  Your Positions
                </div>

                <div className={styles.Subtitle}>
                  Total Value:
                  {' '}
                  {positionSymbols.length > 0 ? calculateTotalValue() : '--'}
                </div>
              </div>

              <div className={styles.RightContainer}>
                <label htmlFor="checkbox">
                  Show closed positions
                  <input id="checkbox" type="checkbox" />
                </label>
              </div>
            </div>

            <div className={styles.PositionContainer}>
              {positionSymbols.length > 0 ? positionSymbols.map((symbol) => (
                <button type="button" onClick={handleShowInfoClick} key={symbol} className={styles.PositionInfo}>
                  <div>
                    {symbol}
                  </div>

                  <div>
                    {/* {Number(userPositions[index][1])} */}
                    &uarr;
                  </div>
                </button>
              )) : ''}
            </div>
          </div>
        </div>
      </div>

      <AddTokenPopup
        isOpen={isAddTokenModalOpen}
        onClose={closeAddTokenModal}
      />

      <DepositTokenPopup
        isOpen={isDepositTokenModalOpen}
        onClose={closeDepositTokenModal}
      />
    </div>
  );
}

export default LiquidityPage;
