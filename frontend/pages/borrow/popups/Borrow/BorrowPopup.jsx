import React, { useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

import { useAuth } from '../../../../hooks/use-auth-client';

// import * as borrow from '../../../../../src/declarations/borrow';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '444px',
    height: '472px',
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

function BorrowPopup({
  isBorrowModalOpen,
  closeBorrowModal,
  // decimals,
  // tokenBalance,
  setUpdateUI,
}) {
  const { borrowActor } = useAuth();

  const [amountInput, setAmountInput] = useState();
  const [loading, setLoading] = useState(false);
  const [selectToken, setSelectToken] = useState(0);
  const [showSelectToken, setShowSelectToken] = useState(false);

  const closeModal = () => {
    closeBorrowModal();
    setLoading(false);
    setAmountInput();
  };

  const submitBorrow = async () => {
    if (!amountInput) {
      alert('Missing input');
    } else {
      try {
        setLoading(true);
        let tokenCanister = token1.canisterId;
        if (!selectToken) {
          tokenCanister = token0.canisterId;
        }
        const tx = await borrowActor.borrow(
          Number(amountInput) * 10 ** 18,
          Principal.fromText(tokenCanister),
        );
        console.log(tx);

        if (tx.includes('Success') || tx.includes('Successful')) {
          toast.success('Borrow successfull');
          closeModal();
          setLoading(false);
          setUpdateUI((prev) => !prev);
        } else {
          console.log('Tx: ', tx);
          toast.error(tx);
          closeModal();
          setLoading(false);
        }
      } catch (error) {
        console.log('Error in Borrow: ', error);
        toast.error('Borrow error');
        closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isBorrowModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <svg onClick={closeModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Borrow</h2>
      </div>

      <div className={styles.LabelContainer}>
        <div className={styles.Label1}>
          Value of collaterial
          &nbsp;
          <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.00008 5.1665V5.74984M7.00008 7.20817V9.83317M7.00008 13.3332C10.2217 13.3332 12.8334 10.7215 12.8334 7.49984C12.8334 4.27818 10.2217 1.6665 7.00008 1.6665C3.77842 1.6665 1.16675 4.27818 1.16675 7.49984C1.16675 10.7215 3.77842 13.3332 7.00008 13.3332Z" stroke="#CCCCCC" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={styles.Label}>
        <span className={styles.Label1}>
          0.02
        </span>
        &nbsp;
        {selectToken ? 'ckETH LP token' : 'ckBTC LP token'}
      </div>

      <div className={styles.Label}>
        $ 5,000
      </div>

      <div className={styles.Label}>
        Borrowing Limit is 0.2
        {' '}
        {selectToken ? 'ckETH' : 'ckBTC'}
      </div>

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Select amount
          </div>
        </div>

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <div className={styles.IconContainer}>
              <span className={styles.Icon}>
                <div>
                  {!selectToken ? <img width={20} height={20} src="/frontend/assets/ckBTC.png" alt="" />
                    : <img width={20} height={20} src="/frontend/assets/ckETH.png" alt="" />}
                  <svg onClick={() => setShowSelectToken(!showSelectToken)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                  </svg>
                </div>
                {showSelectToken && (
                <div className={styles.selectTable}>
                  <div
                    className={styles.hoverSelect}
                    aria-hidden="true"
                    onClick={() => { setSelectToken(0); setShowSelectToken(false); }}
                  >
                    ckBTC
                  </div>
                  <div
                    className={styles.hoverSelect}
                    aria-hidden="true"
                    onClick={() => { setSelectToken(1); setShowSelectToken(false); }}
                  >
                    ckETH
                  </div>
                </div>
                )}
              </span>
            </div>
            <input
              type="number"
              className={styles.InputField}
              placeholder="0.0"
              onChange={(e) => setAmountInput(e.target.value)}
              value={amountInput}
            />
            <button type="button" className={styles.MaxButton}>
              Max
            </button>
          </div>
        </div>

        <div className={styles.SelectContainer}>
          <button type="button" className={styles.SelectOption}>25%</button>
          <button type="button" className={styles.SelectOption}>50%</button>
          <button type="button" className={styles.SelectOption}>75%</button>
          <button type="button" className={styles.SelectOption}>100%</button>
        </div>
      </div>

      <button type="button" className={styles.ButtonContainer} onClick={submitBorrow}>
        {loading ? 'Loading...' : 'Borrow'}
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

BorrowPopup.propTypes = {
  isBorrowModalOpen: PropTypes.bool.isRequired,
  closeBorrowModal: PropTypes.func.isRequired,
  // tokenBalance: PropTypes.arrayOf(PropTypes.number),
  // decimals: PropTypes.number,
  setUpdateUI: PropTypes.func.isRequired,
};

BorrowPopup.defaultProps = {
  // tokenBalance: [0, 0, 0],
  // decimals: 0,
};

export default BorrowPopup;
