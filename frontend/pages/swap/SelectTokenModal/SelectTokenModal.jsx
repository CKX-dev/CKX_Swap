import React, { useEffect, useState, useMemo } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useAuth } from '../../../hooks/use-auth-client';
import styles from './index.module.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    backgroundColor: 'rgb(26, 34, 63)',
    width: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 0,
  },
};

function SelectTokenModal({
  isTokenModalOpen,
  closeTokenModal,
  handleToken0Change,
  handleToken1Change,
  selectedTokenIdentifier,
  selectedToken0Name,
  selectedToken1Name,
}) {
  const { swapActor } = useAuth();
  const [tokenList, setTokenList] = useState([]);
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    const handleGetSupportedTokenList = async () => {
      const res = await swapActor.getSupportedTokenList();
      setTokenList(res);
    };

    if (swapActor) {
      handleGetSupportedTokenList();
    }
  }, [swapActor]);

  useEffect(() => {
    const getPairs = async () => {
      const allPairs = await swapActor.getAllPairs();
      setPairs(allPairs);
    };

    if (swapActor) {
      getPairs();
    }
  }, [swapActor]);

  const filteredTokenList = useMemo(() => {
    if (selectedTokenIdentifier === '0' && selectedToken1Name) {
      return tokenList.filter((token) => (
        pairs.some((pair) => (
          (pair.token0 === token.symbol && pair.token1 === selectedToken1Name)
          || (pair.token1 === token.symbol && pair.token0 === selectedToken1Name)
        ))
      ));
    } if (selectedTokenIdentifier === '1' && selectedToken0Name) {
      return tokenList.filter((token) => (
        pairs.some((pair) => (
          (pair.token0 === token.id && pair.token1 === selectedToken0Name)
          || (pair.token1 === token.id && pair.token0 === selectedToken0Name)
        ))
      ));
    }
    return tokenList;
  }, [selectedTokenIdentifier, selectedToken0Name, selectedToken1Name, tokenList, pairs]);

  const handleTokenSelection = (o) => () => {
    if (selectedTokenIdentifier === '0') {
      handleToken0Change(o);
      closeTokenModal();
    } else {
      handleToken1Change(o);
      closeTokenModal();
    }
  };

  return (
    <Modal
      isOpen={isTokenModalOpen}
      onRequestClose={closeTokenModal}
      style={customStyles}
    >
      <h2>Select A Token</h2>

      <div className={styles.TokenListContainer}>
        {filteredTokenList.map((tokenInfo) => (
          <button
            type="button"
            onClick={handleTokenSelection({ id: tokenInfo.id, symbol: tokenInfo.symbol })}
            key={tokenInfo.id}
          >
            {tokenInfo.symbol}
            {' '}
            -
            {' '}
            {tokenInfo.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}

SelectTokenModal.propTypes = {
  isTokenModalOpen: PropTypes.bool.isRequired,
  closeTokenModal: PropTypes.func.isRequired,
  handleToken0Change: PropTypes.func.isRequired,
  handleToken1Change: PropTypes.func.isRequired,
  selectedTokenIdentifier: PropTypes.string.isRequired,
  selectedToken0Name: PropTypes.string.isRequired,
  selectedToken1Name: PropTypes.string.isRequired,
};

export default SelectTokenModal;
