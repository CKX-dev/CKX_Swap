import React, { useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

// import { useAuth } from '../../../../hooks/use-auth-client';

import * as deposit0 from '../../../../../src/declarations/deposit0';
import * as deposit1 from '../../../../../src/declarations/deposit1';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';

import ckETH from '../../../../assets/ckETH.png';
import dckETH from '../../../../assets/d.cketh.png';
import ckBTC from '../../../../assets/ckBTC.png';
import dckBTC from '../../../../assets/d.ckBTC.png';

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
  decimals,
  tokenBalance,
  setUpdateUI,
  depositActor,
  tokenActor,
  btcOrEth,
}) {
  const [amountInput, setAmountInput] = useState();
  const [dropDownDuration, setDropDownDuration] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    setSelectedOption(value);
    setDropDownDuration(false);
  };

  const closeModal = () => {
    closeDepositModal();
    setSelectedOption();
    setDropDownDuration();
    setAmountInput();
    setLoading(false);
  };

  const submitDeposit = async () => {
    if (!amountInput || !selectedOption) {
      alert('Missing input');
    } else {
      const record = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: Number(amountInput * 10 ** decimals),
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(btcOrEth === 'ckETH' ? deposit1.canisterId : deposit0.canisterId),
      };

      try {
        setLoading(true);
        const tx0 = await tokenActor.icrc2_approve(record);
        console.log('Approve: ', tx0);
        const tx = await depositActor.deposit(
          Principal.fromText(btcOrEth === 'ckETH' ? token1.canisterId : token0.canisterId),
          Number(amountInput * 10 ** decimals),
          Number(selectedOption),
        );
        console.log(tx);

        if ('ok' in tx) {
          toast.success('Deposit successfull');
          closeModal();
          setLoading(false);
          setUpdateUI((prev) => !prev);
        } else {
          console.log('Tx: ', tx);
          toast.error('Deposit failed');
          closeModal();
          setLoading(false);
        }
      } catch (error) {
        console.log('Error in deposit: ', error);
        toast.error('Deposit error');
        closeModal();
        setLoading(false);
      }
    }
  };

  function calculateNextXDays(numDays) {
    const currentDate = new Date();

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + numDays);

    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const year = nextDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const amountReceived = (period) => {
    switch (period) {
      case (1): { return 1.0006; }
      case (3): { return 1.0518; }
      case (7): { return 1.1068; }
      case (14): { return 1.1666; }
      case (30): { return 1.2358; }
      case (90): { return 1.3401; }
      case (180): { return 1.4741; }
      case (270): { return 1.6182; }
      case (360): { return 1.7729; }
      case (450): { return 1.9392; }
      case (540): { return 2.1176; }
      default: { return 1; }
    }
  };

  const setMaxInput = () => {
    if (decimals && tokenBalance) {
      setAmountInput(tokenBalance / 10 ** decimals);
    }
  };

  return (
    <Modal
      isOpen={isDepositModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <svg onClick={closeModal} className={styles.CloseButton} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div>
              Balance:
              {' '}
              {tokenBalance && decimals && <span>{tokenBalance / 10 ** decimals}</span>}
            </div>
          </div>
        </div>

        <div className={styles.InputContainer}>
          <div className={styles.InputGroup}>
            <div className={styles.IconContainer}>
              <span className={styles.Icon}>
                {btcOrEth === 'ckETH' ? <img width={18} height={18} src={ckETH} alt="" />
                  : <img width={18} height={18} src={ckBTC} alt="" />}
              </span>
            </div>
            <input
              type="number"
              className={styles.InputFieldDeposit}
              placeholder="0.0"
              onChange={(e) => setAmountInput(e.target.value)}
              value={amountInput}
            />
            <button type="button" className={styles.MaxButton} onClick={setMaxInput}>
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
            <button
              type="button"
              className={styles.InputField}
              onClick={() => setDropDownDuration(!dropDownDuration)}
            >
              <div style={{ position: 'absolute', left: '48px' }}>
                {selectedOption && (selectedOption <= 30 ? `${selectedOption} days` : `${selectedOption / 30} months`)}
                {!selectedOption && ''}
              </div>
              <div>
                <svg
                  onClick={() => setDropDownDuration(!dropDownDuration)}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke="#646574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <button
                type="button"
                className={styles.MaxButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(540);
                }}
              >
                Max
              </button>
            </button>
          </div>

          {dropDownDuration
            && (
              <div className={styles.DropDownElements}>
                <button onClick={() => handleSelect(1)} type="button"><p>1 day</p></button>
                <button onClick={() => handleSelect(3)} type="button"><p>3 days</p></button>
                <button onClick={() => handleSelect(7)} type="button"><p>7 days</p></button>
                <button onClick={() => handleSelect(14)} type="button"><p>14 days</p></button>
                <button onClick={() => handleSelect(30)} type="button"><p>1 month</p></button>
                <button onClick={() => handleSelect(90)} type="button"><p>3 months</p></button>
                <button onClick={() => handleSelect(180)} type="button"><p>6 months</p></button>
                <button onClick={() => handleSelect(270)} type="button"><p>9 months</p></button>
                <button onClick={() => handleSelect(360)} type="button"><p>12 months</p></button>
                <button onClick={() => handleSelect(450)} type="button"><p>15 months</p></button>
                <button onClick={() => handleSelect(540)} type="button"><p>18 months</p></button>
              </div>
            )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ color: 'rgba(133, 134, 151, 1)', fontWeight: 400 }}>Lock until</div>
        {calculateNextXDays(selectedOption) !== 'NaN/NaN/NaN' && (
        <div>
          {calculateNextXDays(selectedOption)}
        </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{ color: 'rgba(133, 134, 151, 1)', fontWeight: 400 }}>
          Amount of
          {' '}
          {btcOrEth === 'ckETH' ? 'd.ckETH' : 'd.ckBTC'}
          {' '}
          recieved
        </div>
        <div style={{ display: 'flex' }}>
          {btcOrEth === 'ckETH' ? <img width={18} height={18} src={dckETH} alt="" />
            : <img width={18} height={18} src={dckBTC} alt="" />}
          {amountInput && amountReceived(selectedOption) && <div style={{ marginLeft: '8px' }}>{Math.round(amountInput * (amountReceived(selectedOption)) * 1000) / 1000}</div>}
        </div>
      </div>
      <div style={{
        marginTop: '20px', color: 'rgba(133, 134, 151, 1)', fontWeight: 400, fontSize: '14px',
      }}
      >
        {btcOrEth === 'ckETH' ? 'd.ckETH' : 'd.ckBTC'}
        {' '}
        will decay to 1:1 of
        {' '}
        {btcOrEth === 'ckETH' ? 'ckETH' : 'ckBTC'}
        {' '}
        deposited at end of lock period for withdrawal
      </div>

      <button type="button" className={styles.ButtonContainer} onClick={submitDeposit} disabled={loading}>
        {loading ? 'Loading...' : 'Deposit'}
        <div className={styles.Ellipse} />
      </button>
    </Modal>
  );
}

DepositPopup.propTypes = {
  isDepositModalOpen: PropTypes.bool.isRequired,
  closeDepositModal: PropTypes.func.isRequired,
  decimals: PropTypes.number,
  tokenBalance: PropTypes.number,
  setUpdateUI: PropTypes.func.isRequired,
  depositActor: PropTypes.shape({
    withdrawDepositAndInterestArray: PropTypes.func.isRequired,
    getTokenBalance: PropTypes.func.isRequired,
    getWrapBalance: PropTypes.func.isRequired,
    getInterestInfo: PropTypes.func.isRequired,
    getDepositId: PropTypes.func.isRequired,
    getCurrentMultiplier: PropTypes.func.isRequired,
    unWrapToken: PropTypes.func.isRequired,
    icrc2_approve: PropTypes.func.isRequired,
    withdrawInterestAll: PropTypes.func.isRequired,
    deposit: PropTypes.func.isRequired,
  }).isRequired,
  tokenActor: PropTypes.shape({
    icrc2_approve: PropTypes.func.isRequired,
  }).isRequired,
  btcOrEth: PropTypes.string.isRequired,
};

DepositPopup.defaultProps = {
  decimals: 0,
  tokenBalance: 0,
};

export default DepositPopup;
