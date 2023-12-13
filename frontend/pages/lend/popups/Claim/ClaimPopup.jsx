import React from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import styles from './index.module.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '324px',
    height: '182px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #2C2D3B',
    borderRadius: '16px',
    padding: '32px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
};

function SupplyPopup({
  isClaimOpen,
  closeClaim,
}) {
  return (
    <Modal
      isOpen={isClaimOpen}
      onRequestClose={closeClaim}
      style={customStyles}
    >

      <div>
        <div style={{ textAlign: 'center', fontWeight: 500 }}>I confirm claiming of 0.29 ckBTC</div>
      </div>

      <button type="button" className={styles.ButtonContainer} style={{ marginBottom: '8px', marginTop: '44px' }} disabled>
        Claim
        <div className={styles.Ellipse} />
      </button>
      <div
        type="button"
        style={{
          color: 'rgba(133, 134, 151, 1)',
          fontSize: '14px',
          backgroundColor: 'rgba(28, 29, 38, 1)',
          margin: '0px',
          textAlign: 'center',
          width: '100%',
          padding: '0',
        }}
        disabled
      >
        Cancel
      </div>
    </Modal>
  );
}

SupplyPopup.propTypes = {
  isClaimOpen: PropTypes.bool.isRequired,
  closeClaim: PropTypes.func.isRequired,
};

export default SupplyPopup;
