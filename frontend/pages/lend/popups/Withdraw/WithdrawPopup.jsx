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
    height: '631px',
    top: '55%',
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

function WithdrawPopup({
  isWithdrawModalOpen,
  closeWithdrawModal,
}) {
  return (
    <Modal
      isOpen={isWithdrawModalOpen}
      onRequestClose={closeWithdrawModal}
      style={customStyles}
    >
      <svg onClick={closeWithdrawModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Withdraw</h2>
      </div>

      <div style={{
        marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px',
      }}
      >
        <div style={{
          display: 'flex', padding: '20px 0px', borderTop: '1px solid rgba(44, 45, 59, 1)', borderBottom: '1px solid rgba(44, 45, 59, 1)',
        }}
        >
          <div style={{
            width: '50%', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid rgba(44, 45, 59, 1)',
          }}
          >
            <div style={{ display: 'flex' }}>
              <svg style={{ marginRight: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="#858697" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ color: 'rgba(133, 134, 151, 1)' }}>UNLOCKED</div>
            </div>
            <div style={{ display: 'flex' }}>
              <img style={{ marginRight: '4px' }} src="frontend/assets/ckBTC.png" width={18} height={18} alt="" />
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '18px', fontWeight: 500 }}>
                96.72
              </div>
            </div>
          </div>
          <div style={{
            width: '50%', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '16px',
          }}
          >
            <div style={{ display: 'flex' }}>
              <svg style={{ marginRight: '4px' }} width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 6H6.5M12.5 6C14.1569 6 15.5 7.34315 15.5 9V13.5C15.5 15.1569 14.1569 16.5 12.5 16.5H6.5C4.84315 16.5 3.5 15.1569 3.5 13.5V9C3.5 7.34315 4.84315 6 6.5 6M12.5 6V4.5C12.5 2.84315 11.1569 1.5 9.5 1.5C7.84315 1.5 6.5 2.84315 6.5 4.5V6M9.5 12V10.5" stroke="#858697" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <div style={{ color: 'rgba(133, 134, 151, 1)' }}>LOCKED</div>
            </div>
            <div style={{ display: 'flex' }}>
              <img style={{ marginRight: '4px' }} src="frontend/assets/ckBTC.png" width={18} height={18} alt="" />
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '18px', fontWeight: 500 }}>
                96.72
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(133, 134, 151, 1)' }}>Locked d.ckBTC will be withdrawn at 5% fee.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Locked d.ckBTC schedule</div>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke="#D9DAE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <div className={styles.IconContainer}>
              <span className={styles.Icon}>
                <img src="frontend/assets/ckETH.png" width={18} height={18} style={{ marginTop: '4px' }} alt="" />
              </span>
            </div>
            <input
              type="number"
              className={styles.InputField}
              placeholder="0.0"
            />
          </div>
        </div>

        <div className={styles.SelectContainer}>
          <button type="button" className={styles.SelectOption}>25%</button>
          <button type="button" className={styles.SelectOption}>50%</button>
          <button type="button" className={styles.SelectOption}>75%</button>
          <button type="button" className={styles.SelectOption}>100%</button>
        </div>
      </div>

      <div style={{
        color: 'rgba(133, 134, 151, 1)', fontSize: '14px', marginTop: '20px', marginBottom: '32px',
      }}
      >
        d.ckBTC will be withdrawn as ckBTC 1:1 in your wallet. ckBTC does not earn yield
      </div>

      <button type="button" className={styles.ButtonContainer} disabled>
        Withdraw
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

WithdrawPopup.propTypes = {
  isWithdrawModalOpen: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
};

export default WithdrawPopup;
