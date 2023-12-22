import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
// import { Principal } from '@dfinity/principal';

import styles from './index.module.css';

import { useAuth } from '../../../../hooks/use-auth-client';

// import * as deposit from '../../../../../src/declarations/deposit';
// import * as token0 from '../../../../../src/declarations/token0';

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
    overflow: 'scroll',
  },
};

function WithdrawPopup({
  isWithdrawModalOpen,
  closeWithdrawModal,
  decimals,
  wrapBalance,
}) {
  const { depositActor, principal } = useAuth();

  const [dropdownLock, setDropdownLock] = useState(false);
  const [totalSelected, setTotalSelected] = useState(false);
  const [inputBalance, setInputBalance] = useState();
  const [lock, setLock] = useState('locked');
  const [selectedRows, setSelectedRows] = useState([]);
  const [depositInfo, setDepositInfo] = useState([]);

  const [loading, setLoading] = useState(false);
  const [failList, setFailList] = useState([]);

  const closeModal = () => {
    closeWithdrawModal();
    setDepositInfo([]);
    setSelectedRows([]);
    setLock('locked');
    setDropdownLock(false);
    setLoading(false);
  };

  useEffect(() => {
    const getDeposit = async () => {
      if (principal) {
        const tx = await depositActor.getDepositId(principal);

        const fetchCurrentWrap = async (depositType) => {
          const rt = await depositActor.getCurrentMultiplier(depositType);
          return rt;
        };
        const originalList = tx[0];

        if (originalList) {
          const idPromises = originalList.map(async (item) => {
            const value = await fetchCurrentWrap(item);
            const wrapValue = Number(value).toFixed(2);
            return { ...item, currentWrap: wrapValue };
          });
          const updatedList = await Promise.all(idPromises);

          setDepositInfo(updatedList);
          // console.log('Deposit arr: ', tx);
        }
      }
    };
    getDeposit();
  }, [principal, isWithdrawModalOpen]);

  const handleRowClick = (key) => {
    const isSelected = selectedRows.includes(key);

    if (isSelected) {
      setSelectedRows(selectedRows.filter((selectedKey) => selectedKey !== key));
    } else {
      setSelectedRows([...selectedRows, key]);
    }
  };

  useEffect(() => {
    if (selectedRows && depositInfo && decimals && lock !== 'locked') {
      let total = 0;
      selectedRows.forEach((idx) => {
        const value = Number(depositInfo[idx].currentWrap) / (10 ** decimals);
        total += value;
      });
      setTotalSelected(Number(total).toFixed(8));
    }
    if (selectedRows && depositInfo && decimals && lock === 'locked') {
      let total = 0;
      selectedRows.forEach((idx) => {
        const value = Number(depositInfo[idx].amount) / (10 ** decimals);
        total += value;
      });
      setTotalSelected(((Number(total) * 95) / 100).toFixed(8));
    }
  }, [selectedRows]);

  const updateLock = (string) => {
    setLock(string);
    setDropdownLock(false);
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

  // const handleWithdraw = async () => {
  //   if (decimals && principal) {
  //     try {
  //       setLoading(true);
  //       const tx = await depositActor.withdrawDepositAndInterestArray(
  //         selectedRows,
  //       );
  //       if (!tx.length) {
  //         toast.success('Withdraw successfull');
  //         closeModal();
  //         setLoading(false);
  //       } else {
  //         console.log('Withdraw: ', tx);
  //         toast.error(`Withdraw failed at index ${tx.map((idx) => Number(idx))}`);
  //         closeModal();
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log('Error in Withdraw: ', error);
  //       toast.error('Withdraw error');
  //       closeModal();
  //       setLoading(false);
  //     }
  //   }
  // };
  const handleWithdraw = async () => {
    if (decimals && principal) {
      try {
        setLoading(true);
        const idPromises = selectedRows.map(async (idx) => {
          const tx = await depositActor.withdrawDepositAndInterest(
            idx,
          );
          if ('Ok' in tx) {
            setFailList((prevList) => [...prevList]);
            const newSelectedRows = selectedRows.map((number) => number - 1);
            setSelectedRows(newSelectedRows);
            return 1;
          }
          setFailList((prevList) => [...prevList, idx]);
          const newSelectedRows = selectedRows.map((number) => number - 1);
          setSelectedRows(newSelectedRows);
          return 0;
        });
        await Promise.all(idPromises).then(
          () => {
            if (!failList.length) {
              toast.success('Withdraw successfull');
              setFailList([]);
              setLoading(false);
              closeModal();
            } else {
              console.log('Withdraw failed: ');
              toast.error(`Withdraw failed at index ${failList.map((idx) => Number(idx))}`);
              setFailList([]);
              setLoading(false);
              closeModal();
            }
          },
        );
      } catch (error) {
        console.log('Error in Withdraw: ', error);
        toast.error('Withdraw error');
        closeModal();
        setLoading(false);
      }
    }
  };

  const handleConvert = async () => {
    if (decimals && principal) {
      try {
        setLoading(true);
        const tx = await depositActor.unWrapToken(
          inputBalance * 10 ** decimals,
        );
        if ('ok' in tx) {
          toast.success('Convert successfull');
          closeModal();
          setLoading(false);
        } else {
          console.log('Convert: ', tx);
          toast.error('Convert failed');
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

      <div style={{
        marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px',
      }}
      >
        <div style={{
          display: 'flex', padding: '20px 0px', borderTop: '1px solid rgba(44, 45, 59, 1)', borderBottom: '1px solid rgba(44, 45, 59, 1)', justifyContent: 'space-between',
        }}
        >
          <div style={{
            width: '30%', paddingRight: '4px', paddingLeft: '4px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid rgba(44, 45, 59, 1)',
          }}
          >
            <div style={{ display: 'flex' }}>
              <svg style={{ marginRight: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="#858697" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ color: 'rgba(133, 134, 151, 1)' }}>UNLOCKED</div>
            </div>
            <div style={{ display: 'flex' }}>
              <img style={{ marginRight: '4px' }} src="frontend/assets/ckETH.png" width={18} height={18} alt="" />
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '18px', fontWeight: 500 }}>
                96.72
              </div>
            </div>
          </div>
          <div style={{
            width: '30%', paddingLeft: '4px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid rgba(44, 45, 59, 1)',
          }}
          >
            <div style={{ display: 'flex' }}>
              <svg style={{ marginRight: '4px' }} width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 6H6.5M12.5 6C14.1569 6 15.5 7.34315 15.5 9V13.5C15.5 15.1569 14.1569 16.5 12.5 16.5H6.5C4.84315 16.5 3.5 15.1569 3.5 13.5V9C3.5 7.34315 4.84315 6 6.5 6M12.5 6V4.5C12.5 2.84315 11.1569 1.5 9.5 1.5C7.84315 1.5 6.5 2.84315 6.5 4.5V6M9.5 12V10.5" stroke="#858697" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <div style={{ color: 'rgba(133, 134, 151, 1)' }}>LOCKED</div>
            </div>
            <div style={{ display: 'flex' }}>
              <img style={{ marginRight: '4px' }} src="frontend/assets/ckETH.png" width={18} height={18} alt="" />
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '18px', fontWeight: 500 }}>
                96.72
              </div>
            </div>
          </div>
          <div style={{
            width: '30%', paddingLeft: '4px', display: 'flex', flexDirection: 'column', gap: '16px',
          }}
          >
            <div style={{ display: 'flex' }}>
              <svg style={{ marginRight: '4px', color: 'rgba(133, 134, 151, 1)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16">
                <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
              </svg>
              <div style={{ color: 'rgba(133, 134, 151, 1)' }}>BALANCE</div>
            </div>
            <div style={{ display: 'flex' }}>
              <img style={{ marginRight: '4px' }} src="frontend/assets/ckETH.png" width={18} height={18} alt="" />
              <div style={{ color: 'rgba(204, 204, 204, 1)', fontSize: '18px', fontWeight: 500 }}>
                {wrapBalance / 10 ** 18}
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(133, 134, 151, 1)' }}>Locked d.ckETH will be withdrawn at 5% fee.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {lock === 'locked' && <div>Locked d.ckETH schedule</div>}
          {lock === 'unLocked' && <div>UnLocked d.ckETH schedule</div>}
          {lock === 'balance' && <div />}
          {lock !== 'balance' && (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 7.5L9 11.25L5.25 7.5" stroke="#D9DAE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          )}
        </div>
        {lock !== 'balance' && (
        <div className={styles.TableContainer}>
          <table className={styles.LendTable}>
            <thead className={styles.HeaderTable}>
              <tr className={styles.HeaderLendTable}>
                <th>d.ckETH value</th>
                <th className={styles.tableSecondChild}>Initial ckETH amount</th>
                <th>Locked till (Days remaining)</th>
              </tr>
            </thead>
            <tbody>
              {depositInfo && decimals
                && Array.from({ length: depositInfo.length }).map((_, index) => {
                  const id = index;
                  if (lock === 'locked' && calculateNextXDays(Number(depositInfo[index].duration)) !== calculateNextXDays(0)) {
                    return (
                      <tr
                        key={id}
                        onClick={() => handleRowClick(index)}
                        className={selectedRows.includes(index) ? styles.selectedRow : ''}
                      >
                        <td>{Number(depositInfo[index].currentWrap) / (10 ** decimals)}</td>
                        <td>{Number(depositInfo[index].amount) / (10 ** decimals)}</td>
                        <td>
                          {calculateNextXDays(Number(depositInfo[index].duration)
                          - Number(depositInfo[index].lastUpdateTime))}
                          {' '}
                          (
                          {Number(depositInfo[index].duration)
                          - Number(depositInfo[index].lastUpdateTime)}
                          )
                        </td>
                      </tr>
                    );
                  } if (lock === 'unLocked' && calculateNextXDays(Number(depositInfo[index].duration)) === calculateNextXDays(0)) {
                    return (
                      <tr
                        key={id}
                        onClick={() => handleRowClick(index)}
                        className={selectedRows.includes(index) ? styles.selectedRow : ''}
                      >
                        <td>{Number(depositInfo[index].currentWrap) / (10 ** decimals)}</td>
                        <td>{Number(depositInfo[index].amount) / (10 ** decimals)}</td>
                        <td>
                          {calculateNextXDays(Number(depositInfo[index].duration)
                          - Number(depositInfo[index].lastUpdateTime))}
                        </td>
                      </tr>
                    );
                  }
                  return <div />;
                })}
            </tbody>
          </table>
        </div>
        )}
      </div>
      <div>
        {lock === 'balance' && (
        <div className={styles.LabelContainer}>
          <div className={styles.Label}>
            Select amount
          </div>

          <div className={styles.RightLabel}>
            Balance:
            {' '}
            {wrapBalance / 10 ** 18 || 0}
          </div>
        </div>
        )}

        {lock === 'unLocked' && (
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
              placeholder=""
              disabled
              value={totalSelected}
            />
            <div className={styles.LockContainer}>
              <div>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <button type="button" className={styles.relativeDropdown} onClick={() => setDropdownLock(!dropdownLock)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                  </svg>
                </button>
                {dropdownLock && (
                <div className={styles.optionDropdown}>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('locked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6H6M12 6C13.6569 6 15 7.34315 15 9V13.5C15 15.1569 13.6569 16.5 12 16.5H6C4.34315 16.5 3 15.1569 3 13.5V9C3 7.34315 4.34315 6 6 6M12 6V4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5V6M9 12V10.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <div>Locked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('unLocked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>Unlocked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('balance')}>
                    <svg style={{ marginTop: '8px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-wallet" viewBox="0 0 18 18">
                      <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                    </svg>
                    <div>Balance</div>
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {lock === 'locked' && (
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
              placeholder=""
              disabled
              value={totalSelected}
            />
            <div className={styles.LockContainer}>
              <div>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6H6M12 6C13.6569 6 15 7.34315 15 9V13.5C15 15.1569 13.6569 16.5 12 16.5H6C4.34315 16.5 3 15.1569 3 13.5V9C3 7.34315 4.34315 6 6 6M12 6V4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5V6M9 12V10.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <button type="button" className={styles.relativeDropdown} onClick={() => setDropdownLock(!dropdownLock)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                  </svg>
                </button>
                {dropdownLock && (
                <div className={styles.optionDropdown}>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('locked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6H6M12 6C13.6569 6 15 7.34315 15 9V13.5C15 15.1569 13.6569 16.5 12 16.5H6C4.34315 16.5 3 15.1569 3 13.5V9C3 7.34315 4.34315 6 6 6M12 6V4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5V6M9 12V10.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <div>Locked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('unLocked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>Unlocked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('balance')}>
                    <svg style={{ marginTop: '8px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-wallet" viewBox="0 0 18 18">
                      <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                    </svg>
                    <div>Balance</div>
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {lock === 'balance' && (
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
              value={inputBalance}
              onChange={(e) => {
                setInputBalance(e.target.value);
              }}
            />
            <div className={styles.LockContainer}>
              <div>
                <svg style={{ marginTop: '4px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-wallet" viewBox="0 0 18 18">
                  <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                </svg>
              </div>
              <div>
                <button type="button" className={styles.relativeDropdown} onClick={() => setDropdownLock(!dropdownLock)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                  </svg>
                </button>
                {dropdownLock && (
                <div className={styles.optionDropdown}>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('locked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6H6M12 6C13.6569 6 15 7.34315 15 9V13.5C15 15.1569 13.6569 16.5 12 16.5H6C4.34315 16.5 3 15.1569 3 13.5V9C3 7.34315 4.34315 6 6 6M12 6V4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5V6M9 12V10.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <div>Locked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('unLocked')}>
                    <svg style={{ marginTop: '4px' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12V10.5M12 6H6C4.34315 6 3 7.34315 3 9V13.5C3 15.1569 4.34315 16.5 6 16.5H12C13.6569 16.5 15 15.1569 15 13.5V9C15 7.34315 13.6569 6 12 6ZM12 6L12 4.5C12 2.84315 10.6569 1.5 9.00002 1.5C7.8896 1.5 6.92008 2.1033 6.40137 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>Unlocked</div>
                  </button>
                  <button type="button" className={styles.clearButtonCss} onClick={() => updateLock('balance')}>
                    <svg style={{ marginTop: '8px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-wallet" viewBox="0 0 18 18">
                      <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                    </svg>
                    <div>Balance</div>
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {lock === 'balance' && (
          <div className={styles.SelectContainer}>
            <button type="button" className={styles.SelectOption}>25%</button>
            <button type="button" className={styles.SelectOption}>50%</button>
            <button type="button" className={styles.SelectOption}>75%</button>
            <button type="button" className={styles.SelectOption}>100%</button>
          </div>
        )}
      </div>

      <div style={{
        color: 'rgba(133, 134, 151, 1)', fontSize: '14px', marginTop: '20px', marginBottom: '32px',
      }}
      >
        d.ckETH will be withdrawn as ckETH 1:1 in your wallet. ckETH does not earn yield
      </div>

      {lock !== 'balance' && (
      <button type="button" className={styles.ButtonContainer} disabled={loading} onClick={handleWithdraw}>
        {loading ? 'Loading...' : 'Withdraw'}
        <div className={styles.Ellipse} />
      </button>
      )}
      {lock === 'balance' && (
      <button type="button" className={styles.ButtonContainer} disabled={loading} onClick={handleConvert}>
        {loading ? 'Loading...' : 'Convert'}
        <div className={styles.Ellipse} />
      </button>
      )}
    </Modal>
  );
}

WithdrawPopup.propTypes = {
  isWithdrawModalOpen: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
  decimals: PropTypes.number,
  wrapBalance: PropTypes.number,
};

WithdrawPopup.defaultProps = {
  decimals: 0,
  wrapBalance: 0,
};

export default WithdrawPopup;
