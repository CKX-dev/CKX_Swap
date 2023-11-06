import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import { useAuth } from '../../hooks/use-auth-client';

function PairCard({ pair }) {
  const { swapActor } = useAuth();
  const [tokenList, setTokenList] = useState([]);
  const [tvl, setTvl] = useState();

  const renderBigIntAsString = (bigIntValue) => bigIntValue.toString();

  const calculateTVL = (token0Id, token1Id) => {
    if (tokenList.length > 0) {
      const token0 = tokenList.find((token) => token.id === token0Id);
      const token1 = tokenList.find((token) => token.id === token1Id);

      if (token0 && token1) {
        const TVL = token0.totalSupply + token1.totalSupply;
        return Number(TVL);
      }
    }

    return undefined;
  };

  const principalToSymbol = (principal) => {
    if (tokenList.length > 0) {
      const token = tokenList.find((t) => t.id === principal);
      return token.symbol;
    }

    return undefined;
  };

  useEffect(() => {
    const handleGetTokenList = async () => {
      const res = await swapActor.getSupportedTokenList();
      setTokenList(res);
    };

    if (swapActor) {
      handleGetTokenList();
    }
  }, [swapActor]);

  useEffect(() => {
    setTvl(calculateTVL(pair.token0, pair.token1));
  }, [tokenList]);

  return (
    <div className={styles.PairCard}>
      <div className={styles.InfoContainer}>
        {principalToSymbol(pair.token0)}
        /
        {principalToSymbol(pair.token1)}
      </div>

      <div className={styles.VolumeContainer}>
        <div className={styles.VolumeInnerContainer}>
          <div>TVL</div>

          <span>
            {renderBigIntAsString(pair.totalSupply)}
          </span>
        </div>

        <div className={styles.VolumeInnerContainer}>
          <div>Total Volume</div>

          <span>
            {tvl}
          </span>
        </div>
      </div>
    </div>
  );
}

PairCard.propTypes = {
  pair: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token0: PropTypes.string.isRequired,
    token1: PropTypes.string.isRequired,
    creator: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _arr: PropTypes.instanceOf(Uint8Array).isRequired,
        _isPrincipal: PropTypes.bool.isRequired,
      }),
    ]).isRequired,
    reserve0: PropTypes.any.isRequired,
    reserve1: PropTypes.any.isRequired,
    price0CumulativeLast: PropTypes.any.isRequired,
    price1CumulativeLast: PropTypes.any.isRequired,
    kLast: PropTypes.any.isRequired,
    blockTimestampLast: PropTypes.any.isRequired,
    totalSupply: PropTypes.any.isRequired,
    lptoken: PropTypes.string.isRequired,
  }).isRequired,
};

export default PairCard;
