import React, { useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
// import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

import { useAuth } from '../../../../hooks/use-auth-client';

// import * as borrow from '../../../../../src/declarations/borrow';
import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';

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

function WithdrawPopup({
  isWithdrawModalOpen,
  closeWithdrawModal,
  decimals,
  isActive,
  tokenBalance,
  setUpdateUI,
}) {
  const { borrowActor } = useAuth();

  const [amountInput, setAmountInput] = useState();
  const [loading, setLoading] = useState(false);
  const [quickInputAmountIn, setQuickInputAmountIn] = useState(0);

  const changeAmountIn = (percentage) => {
    if (tokenBalance && !isActive) {
      const newAmountIn0 = (percentage * (tokenBalance / 10 ** 18)) / 100;
      setAmountInput(newAmountIn0);
      setQuickInputAmountIn(percentage);
    }
    if (percentage === quickInputAmountIn) {
      setQuickInputAmountIn(0);
    }
  };

  const closeModal = () => {
    closeWithdrawModal();
    setLoading(false);
    setAmountInput();
  };

  const submitWithdraw = async () => {
    if (!amountInput) {
      alert('Missing input');
    } else {
      try {
        setLoading(true);
        const tx = await borrowActor.withdraw(
          Number(amountInput * 10 ** decimals),
        );
        console.log(tx);

        if (tx.includes('Success') || tx.includes('Successful')) {
          toast.success('Withdraw successfull');
          closeModal();
          setLoading(false);
          setUpdateUI((prev) => !prev);
        } else {
          console.log('Tx: ', tx);
          toast.error('Withdraw failed');
          closeModal();
          setLoading(false);
        }
      } catch (error) {
        console.log('Error in Withdraw: ', error);
        toast.error('Withdraw error');
        closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isWithdrawModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <svg onClick={closeModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Withdraw</h2>
      </div>

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Select amount
          </div>

          <div className={styles.RightLabel}>
            Balance:
            {' '}
            {!isActive ? Math.round((tokenBalance / 10 ** 18) * 1000) / 1000 : 0}
          </div>
        </div>

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <div className={styles.IconContainer}>
              <span className={styles.Icon}>
                {/* <img width={20} height={20} src={ckETH} alt="" /> */}
                <img width={20} height={20} src={ckBTC} alt="" />
                <div style={{ marginTop: '-3px', color: '#858697', fontWeight: 500 }}>{'<>'}</div>
                <img width={20} height={20} src={ckETH} alt="" />
              </span>
            </div>
            <input
              type="number"
              className={styles.InputField}
              placeholder="0.0"
              onChange={(e) => setAmountInput(e.target.value)}
              value={amountInput}
            />

            <button
              type="button"
              className={styles.MaxButton}
              onClick={() => setAmountInput(!isActive ? tokenBalance / 10 ** 18 : 0)}
            >
              Max
            </button>
          </div>
        </div>

        <div className={styles.SelectContainer}>
          <button className={styles.SelectOption} onClick={() => changeAmountIn(20)} style={{ backgroundColor: quickInputAmountIn === 20 && 'rgba(126, 135, 255, 1)', color: quickInputAmountIn === 20 && 'black' }} type="button">20%</button>
          <button className={styles.SelectOption} onClick={() => changeAmountIn(50)} style={{ backgroundColor: quickInputAmountIn === 50 && 'rgba(126, 135, 255, 1)', color: quickInputAmountIn === 50 && 'black' }} type="button">50%</button>
          <button className={styles.SelectOption} onClick={() => changeAmountIn(75)} style={{ backgroundColor: quickInputAmountIn === 75 && 'rgba(126, 135, 255, 1)', color: quickInputAmountIn === 75 && 'black' }} type="button">75%</button>
          <button className={styles.SelectOption} onClick={() => changeAmountIn(100)} style={{ backgroundColor: quickInputAmountIn === 100 && 'rgba(126, 135, 255, 1)', color: quickInputAmountIn === 100 && 'black' }} type="button">100%</button>
        </div>
      </div>

      <button type="button" className={styles.ButtonContainer} onClick={submitWithdraw}>
        {loading ? 'Loading...' : 'Withdraw'}
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

WithdrawPopup.propTypes = {
  isWithdrawModalOpen: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
  decimals: PropTypes.number,
  tokenBalance: PropTypes.number,
  isActive: PropTypes.bool,
  setUpdateUI: PropTypes.func.isRequired,
};

WithdrawPopup.defaultProps = {
  decimals: 0,
  tokenBalance: 0,
  isActive: false,
};

export default WithdrawPopup;
