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
    height: '556px',
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

function DepositPopup({
  isDepositModalOpen,
  closeDepositModal,
}) {
  return (
    <Modal
      isOpen={isDepositModalOpen}
      onRequestClose={closeDepositModal}
      style={customStyles}
    >
      <svg onClick={closeDepositModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Deposit</h2>
      </div>

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            <div>Select amount</div>
            <div>Balance: 1.17</div>
          </div>
        </div>

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <div className={styles.IconContainer}>
              <span className={styles.Icon}><img width={18} height={18} src="frontend/assets/ckETH.png" alt="" /></span>
              <span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke="#646574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <input
              type="number"
              className={styles.InputFieldDeposit}
              placeholder="0.0"
            />
            <button type="button" className={styles.MaxButton}>
              Max
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Stake Duration (1 to 36 months)
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.00008 5.1665V5.74984M7.00008 7.20817V9.83317M7.00008 13.3332C10.2217 13.3332 12.8334 10.7215 12.8334 7.49984C12.8334 4.27818 10.2217 1.6665 7.00008 1.6665C3.77842 1.6665 1.16675 4.27818 1.16675 7.49984C1.16675 10.7215 3.77842 13.3332 7.00008 13.3332Z" stroke="#858697" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <input
              type="number"
              className={styles.InputField}
              placeholder="0.0"
            />
            <button type="button" className={styles.MaxButton}>
              Max
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ color: 'rgba(133, 134, 151, 1)', fontWeight: 400 }}>Lock until</div>
        <div>09/24/2026</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{ color: 'rgba(133, 134, 151, 1)', fontWeight: 400 }}>Amount of d.ckbtc recieved</div>
        <div style={{ display: 'flex' }}>
          <img width={18} height={18} src="frontend/assets/ckETH.png" alt="" />
          <div style={{ marginLeft: '8px' }}>1.006</div>
        </div>
      </div>
      <div style={{
        marginTop: '20px', color: 'rgba(133, 134, 151, 1)', fontWeight: 400, fontSize: '14px',
      }}
      >
        d.ckBTC will decay to 1:1 of ckBTC deposited at end of lock period for withdrawal
      </div>

      <button type="button" className={styles.ButtonContainer} disabled>
        Deposit
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

DepositPopup.propTypes = {
  isDepositModalOpen: PropTypes.bool.isRequired,
  closeDepositModal: PropTypes.func.isRequired,
};

export default DepositPopup;
