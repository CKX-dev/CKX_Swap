/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

import { useAuth } from '../../../../hooks/use-auth-client';

import * as borrow from '../../../../../src/declarations/borrow';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '444px',
    height: '218px',
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

function RepayPopup({
  isRepayModalOpen,
  closeRepayModal,
  // decimals,
  // tokenBalance,
  borrowInfo,
  setUpdateUI,
}) {
  const { borrowActor, token0Actor, token1Actor } = useAuth();

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    closeRepayModal();
    setLoading(false);
  };

  // console.log(Number(borrowInfo.borrow));
  // console.log(Principal.fromUint8Array(borrowInfo.tokenIdBorrow.));
  // console.log(Principal.toString(borrowInfo.tokenIdBorrow?._arr));

  const submitRepay = async () => {
    if (!Number(borrowInfo.borrow)) {
      alert('wait...');
    } else {
      const record = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: Number(borrowInfo.borrow) * 1.5,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(borrow.canisterId),
      };

      try {
        setLoading(true);
        let tokenIdPay = token0Actor;
        if (borrowInfo.tokenIdBorrow.toText() === token0.canisterId) {
          tokenIdPay = token0Actor;
        } else {
          tokenIdPay = token1Actor;
        }
        const tx0 = await tokenIdPay.icrc2_approve(record);
        console.log('Approve: ', tx0);
        const tx = await borrowActor.rePay();
        console.log(tx);

        if (tx.includes('Ok') || tx.includes('Ok')) {
          toast.success(tx);
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
        console.log('Error in deposit: ', error);
        toast.error('Repay error');
        closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isRepayModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <svg onClick={closeModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#9FA6FB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.2982 15.3586C14.5911 15.6515 15.0659 15.6515 15.3588 15.3586C15.6517 15.0657 15.6517 14.5908 15.3588 14.2979L13.0608 11.9999L15.3588 9.70185C15.6517 9.40895 15.6517 8.93408 15.3588 8.64119C15.0659 8.34829 14.591 8.34829 14.2982 8.64119L12.0001 10.9392L9.70198 8.64106C9.40908 8.34816 8.93421 8.34816 8.64132 8.64106C8.34842 8.93395 8.34842 9.40882 8.64132 9.70172L10.9395 11.9999L8.6413 14.298C8.34841 14.5909 8.34841 15.0658 8.6413 15.3587C8.93419 15.6516 9.40907 15.6516 9.70196 15.3587L12.0001 13.0605L14.2982 15.3586Z" fill="#9FA6FB" />
      </svg>

      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Repay</h2>
      </div>

      <div className={styles.LabelContainer}>
        <div className={styles.Label1}>
          Outstanding loan
        </div>

        <div className={styles.DropdownIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke="#D9DAE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={styles.Label}>
        <span className={styles.Label1}>
          {!borrowInfo.isAllowWithdraw && borrowInfo.isActive
          && ((Number(borrowInfo.borrow) / 10 ** 18))}
        </span>
        &nbsp;
        {borrowInfo
            && borrowInfo.tokenIdBorrow
            && borrowInfo.tokenIdBorrow.toText() === token0.canisterId
          ? 'ckBTC' : borrowInfo
              && borrowInfo.tokenIdBorrow
              && borrowInfo.tokenIdBorrow.toText() === token1.canisterId
            ? 'ckETH' : '-'}
      </div>

      <button type="button" className={styles.ButtonContainer} onClick={submitRepay}>
        {loading ? 'Loading...' : 'Repay'}
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

RepayPopup.propTypes = {
  isRepayModalOpen: PropTypes.bool.isRequired,
  closeRepayModal: PropTypes.func.isRequired,
  // decimals: PropTypes.number,
  // tokenBalance: PropTypes.number,
  borrowInfo: PropTypes.object,
  setUpdateUI: PropTypes.func.isRequired,
};

RepayPopup.defaultProps = {
  // decimals: 0,
  // tokenBalance: 0,
  borrowInfo: {},
};

export default RepayPopup;
