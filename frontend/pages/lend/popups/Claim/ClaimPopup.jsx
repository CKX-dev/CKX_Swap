import React from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import styles from './index.module.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '444px',
    height: '353px',
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
      <svg onClick={closeClaim} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Supply</h2>
      </div>

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Select amount
          </div>

          <div className={styles.RightLabel}>
            Balance:
            {' '}
            1.17
          </div>
        </div>

        <div className={styles.SelectContainer}>
          <button type="button" className={styles.SelectOption}>25%</button>
          <button type="button" className={styles.SelectOption}>50%</button>
          <button type="button" className={styles.SelectOption}>75%</button>
          <button type="button" className={styles.SelectOption}>100%</button>
        </div>
      </div>

      <button type="button" className={styles.ButtonContainer} disabled>
        Suppy
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

SupplyPopup.propTypes = {
  isClaimOpen: PropTypes.bool.isRequired,
  closeClaim: PropTypes.func.isRequired,
};

export default SupplyPopup;
