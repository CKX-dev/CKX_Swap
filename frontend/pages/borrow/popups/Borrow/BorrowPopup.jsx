import React, { useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';

import { useAuth } from '../../../../hooks/use-auth-client';
import { getActor } from '../../../../utils';

// import * as borrow from '../../../../../src/declarations/borrow';
// import * as token0 from '../../../../../src/declarations/token0';
// import * as token1 from '../../../../../src/declarations/token1';

// import ckBTC from '../../../../assets/ckBTC.png';
// import ckETH from '../../../../assets/ckETH.png';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '444px',
    height: '522px',
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

const durations = [
  '1 day', // 1 day
  '3 days', // 3 days
  '7 days', // 7 days
  '14 days', // 14 days
  '1 month', // 1 month
  '3 months', // 3 months
  '6 months', // 6 months
  '9 months', // 9 months
  '12 months', // 12 months
  '15 months', // 15 months
  '18 months', // 18 months
];

function BorrowPopup({
  isBorrowModalOpen,
  closeBorrowModal,
  // decimals,
  // tokenBalance,
  isActive,
  avaiBorrow,
  setUpdateUI,
  pairMapping,
}) {
  const { identity } = useAuth();

  const [amountInput, setAmountInput] = useState();
  const [loading, setLoading] = useState(false);
  const [selectToken, setSelectToken] = useState(0);
  const [showSelectToken, setShowSelectToken] = useState(false);
  const [dropDownDuration, setDropDownDuration] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [quickInputAmountIn, setQuickInputAmountIn] = useState(0);

  const {
    token0CanisterId, token1CanisterId, borrowCanisterId,
    token0Image, token1Image, token0Label, token1Label,
  } = pairMapping;

  const handleSelect = (value) => {
    setSelectedOption(value);
    setDropDownDuration(false);
  };

  const changeAmountIn = (percentage) => {
    if (avaiBorrow && !isActive) {
      let newAmountIn;

      if (!selectToken) {
        newAmountIn = (percentage * (avaiBorrow[0])) / 100;
      } else {
        newAmountIn = (percentage * (avaiBorrow[1])) / 100;
      }

      setAmountInput(newAmountIn);
      setQuickInputAmountIn(percentage);
    } else {
      setAmountInput(0);
    }
    if (percentage === quickInputAmountIn) {
      setQuickInputAmountIn(0);
    }
  };

  const closeModal = () => {
    closeBorrowModal();
    setLoading(false);
    setAmountInput();
    setSelectedOption();
  };

  const submitBorrow = async () => {
    if ((!amountInput || !selectedOption) && isActive) {
      alert('Missing input');
    } else {
      try {
        setLoading(true);
        let tokenCanister = token0CanisterId;
        if (selectToken) {
          tokenCanister = token1CanisterId;
        }
        const borrowActor = getActor(borrowCanisterId, identity);

        const tx = await borrowActor.borrow(
          amountInput - 10000, // prevent bigInt
          Principal.fromText(tokenCanister),
          Number(selectedOption),
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

      {/* <div className={styles.LabelContainer}>
        <div className={styles.Label1}>
          Value of collaterial
          &nbsp;
          <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.00008 5.1665V5.74984M7.00008 7.20817V9.83317M7.00008
            13.3332C10.2217 13.3332 12.8334 10.7215 12.8334 7.49984C12.8334
            4.27818 10.2217 1.6665 7.00008 1.6665C3.77842 1.6665 1.16675
            4.27818 1.16675 7.49984C1.16675 10.7215 3.77842 13.3332 7.00008
            13.3332Z" stroke="#CCCCCC" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={styles.Label}>
        <span className={styles.Label1}>
          NaN
        </span>
        &nbsp;
        {selectToken ? 'ckETH LP token' : 'ckBTC LP token'}
      </div>

      <div className={styles.Label}>
        $ NaN
      </div>

      <div className={styles.Label}>
        Borrowing Limit is NaN
        {' '}
        {selectToken ? 'ckETH' : 'ckBTC'}
      </div> */}

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
                  {!selectToken ? <img width={20} height={20} src={token0Image} alt="" />
                    : <img width={20} height={20} src={token1Image} alt="" />}
                  <svg onClick={() => setShowSelectToken(!showSelectToken)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                  </svg>
                </div>
                {showSelectToken && (
                <div className={styles.selectTable}>
                  {(token0Label === 'ckETH' || token0Label === 'ckBTC')
                  && (
                  <div
                    className={styles.hoverSelect}
                    aria-hidden="true"
                    onClick={() => { setSelectToken(0); setShowSelectToken(false); }}
                  >
                    {token0Label}
                  </div>
                  )}

                  {(token1Label === 'ckETH' || token1Label === 'ckBTC')
                  && (
                  <div
                    className={styles.hoverSelect}
                    aria-hidden="true"
                    onClick={() => { setSelectToken(1); setShowSelectToken(false); }}
                  >
                    {token1Label}
                  </div>
                  )}
                </div>
                )}
              </span>
            </div>
            <input
              type="number"
              className={styles.InputField}
              placeholder="0.0"
              onChange={(e) => setAmountInput(e.target.value * 10 ** 18)}
              value={amountInput / 10 ** 18}
            />
            <button
              type="button"
              className={styles.MaxButton}
              onClick={() => {
                if (!selectToken && !isActive) {
                  setAmountInput((avaiBorrow[0]));
                } else if (selectToken && !isActive) {
                  setAmountInput((avaiBorrow[1]));
                } else {
                  setAmountInput(0);
                }
              }}
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

      <div>
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Borrow Duration (1 to 36 months)
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.00008 5.1665V5.74984M7.00008 7.20817V9.83317M7.00008 13.3332C10.2217 13.3332 12.8334 10.7215 12.8334 7.49984C12.8334 4.27818 10.2217 1.6665 7.00008 1.6665C3.77842 1.6665 1.16675 4.27818 1.16675 7.49984C1.16675 10.7215 3.77842 13.3332 7.00008 13.3332Z" stroke="#858697" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className={styles.InputContainerDuration}>
          <div className={styles.InputGroupDuration}>
            <button
              type="button"
              className={styles.InputFieldDuration}
              onClick={() => setDropDownDuration(!dropDownDuration)}
            >
              <div style={{ position: 'absolute', left: '48px' }}>
                {durations[selectedOption]}
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
                  handleSelect(10);
                }}
              >
                Max
              </button>
            </button>
          </div>

          {dropDownDuration
            && (
              <div className={styles.DropDownElements}>
                <button onClick={() => handleSelect(0)} type="button"><p>1 day</p></button>
                <button onClick={() => handleSelect(1)} type="button"><p>3 days</p></button>
                <button onClick={() => handleSelect(2)} type="button"><p>7 days</p></button>
                <button onClick={() => handleSelect(3)} type="button"><p>14 days</p></button>
                <button onClick={() => handleSelect(4)} type="button"><p>1 month</p></button>
                <button onClick={() => handleSelect(5)} type="button"><p>3 months</p></button>
                <button onClick={() => handleSelect(6)} type="button"><p>6 months</p></button>
                <button onClick={() => handleSelect(7)} type="button"><p>9 months</p></button>
                <button onClick={() => handleSelect(8)} type="button"><p>12 months</p></button>
                <button onClick={() => handleSelect(9)} type="button"><p>15 months</p></button>
                <button onClick={() => handleSelect(10)} type="button"><p>18 months</p></button>
              </div>
            )}
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
  isActive: PropTypes.bool,
  avaiBorrow: PropTypes.arrayOf(PropTypes.any).isRequired,
  setUpdateUI: PropTypes.func.isRequired,
  pairMapping: PropTypes.object.isRequired,
};

BorrowPopup.defaultProps = {
  // tokenBalance: [0, 0, 0],
  // decimals: 0,
  isActive: false,
};

export default BorrowPopup;
