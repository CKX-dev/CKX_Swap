import React, { useEffect, useState } from 'react';
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
  },
};

function SelectTokenModal({
  isTokenModalOpen,
  closeTokenModal,
  handleToken0Change,
  handleToken1Change,
  selectedTokenIdentifier,
}) {
  const { swapActor } = useAuth();

  const [tokenList, setTokenList] = useState([]);

  const handleTokenSelection = (o) => () => {
    if (selectedTokenIdentifier === '0') {
      handleToken0Change(o);
      closeTokenModal();
    } else {
      handleToken1Change(o);
      closeTokenModal();
    }
  };

  useEffect(() => {
    const handleGetSupportedTokenList = async () => {
      const res = await swapActor.getSupportedTokenList();
      setTokenList(res);
    };

    if (swapActor) {
      handleGetSupportedTokenList();
    }
  }, [swapActor]);

  return (
    <Modal
      isOpen={isTokenModalOpen}
      onRequestClose={closeTokenModal}
      style={customStyles}
    >
      <h2>Select A Token</h2>

      <div className={styles.TokenListContainer}>
        {tokenList.map((tokenInfo) => (
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
};

export default SelectTokenModal;
