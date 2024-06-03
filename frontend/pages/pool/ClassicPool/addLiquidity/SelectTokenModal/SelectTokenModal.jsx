import React from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

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
  token0Label,
  token1Label,
  token0Image,
  token1Image,
  token0Name,
  token1Name,
}) {
  return (
    <Modal
      isOpen={isTokenModalOpen}
      onRequestClose={closeTokenModal}
      style={customStyles}
    >
      <h2>Select A Token</h2>

      <div className={styles.TokenListContainer}>
        <div>
          <img width={18} height={18} src={token0Image} alt={token0Label} />
          {token0Label}
          {' '}
          -
          {token0Name}
        </div>
        <div>
          <img width={18} height={18} src={token1Image} alt={token1Label} />
          {token1Label}
          {' '}
          -
          {token1Name}
        </div>
      </div>
    </Modal>
  );
}

SelectTokenModal.propTypes = {
  isTokenModalOpen: PropTypes.bool.isRequired,
  closeTokenModal: PropTypes.func.isRequired,
  token0Label: PropTypes.string.isRequired,
  token1Label: PropTypes.string.isRequired,
  token0Image: PropTypes.string.isRequired,
  token1Image: PropTypes.string.isRequired,
  token0Name: PropTypes.string.isRequired,
  token1Name: PropTypes.string.isRequired,
};

export default SelectTokenModal;
