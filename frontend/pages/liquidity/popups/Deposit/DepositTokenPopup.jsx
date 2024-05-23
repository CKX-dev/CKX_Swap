/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import styles from './index.module.css';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';
import * as swap from '../../../../../src/declarations/swap';
import { useAuth } from '../../../../hooks/use-auth-client';

import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '444px',
    height: '356px',
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

function AddTokenPopup({
  isOpen,
  onClose,
}) {
  const {
    swapActor, token0Actor, token1Actor, principal, identity,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const [amountInput, setAmountInput] = useState();
  const [tokenPrincipal, setTokenPrincipal] = useState('');
  const [isTokenApproved, setIsTokenApproved] = useState(false);

  const closeModal = () => {
    onClose();
    setTokenPrincipal('');
    setLoading(false);
  };

  const checkAllowance = async () => {
    try {
      let tokenActor;
      if (tokenPrincipal === token0.canisterId) {
        tokenActor = token0.createActor(tokenPrincipal, {
          agentOptions: {
            identity,
          },
        });
      } else if (tokenPrincipal === token1.canisterId) {
        tokenActor = token1.createActor(tokenPrincipal, {
          agentOptions: {
            identity,
          },
        });
      }

      // Check allowance for token0
      const allowance = await tokenActor.icrc2_allowance({
        account: { owner: principal, subaccount: [] },
        spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
      });
      setIsTokenApproved(allowance.allowance >= amountInput * 10 ** 18);
    } catch (error) {
      console.error('Error checking token allowance:', error);
      // Handle error
    }
  };

  const handleAllowance = async () => {
    try {
      setLoading(true);

      const record = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: amountInput * 10 ** 18,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(swap.canisterId),
      };
      let tokenActor;
      if (tokenPrincipal === token0.canisterId) {
        tokenActor = token0.createActor(tokenPrincipal, {
          agentOptions: {
            identity,
          },
        });
      } else if (tokenPrincipal === token1.canisterId) {
        tokenActor = token1.createActor(tokenPrincipal, {
          agentOptions: {
            identity,
          },
        });
      }

      if (!isTokenApproved) {
        await tokenActor.icrc2_approve(record);
      }

      // Update allowance status after approval
      const allowance = await tokenActor.icrc2_allowance({
        account: { owner: principal, subaccount: [] },
        spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
      });
      setIsTokenApproved(allowance.allowance >= amountInput * 10 ** 18);
      setLoading(false);
    } catch (e) {
      console.error('Error during allowance:', e);
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);

      // Deposit tokens
      await swapActor.deposit(
        Principal.fromText(tokenPrincipal),
        amountInput * 10 ** 18,
      );

      setLoading(false);
      onClose();

      // Check results
      toast.success('Deposit successfully');
      setAmountInput(0);
    } catch (e) {
      console.log(e);
      toast.error('Deposit error');
      setLoading(false);
      onClose();
    }
  };

  const setMaxInput = () => {
    if (decimals && tokenBalance) {
      setAmountInput(tokenBalance / 10 ** decimals);
    }
  };

  useEffect(() => {
    const handleGetSupportedTokenList = async () => {
      const res = await swapActor.getSupportedTokenList();
      setTokenList(res);
      setTokenPrincipal(res[0].id);
    };

    if (swapActor) {
      handleGetSupportedTokenList();
    }
  }, [swapActor]);

  useEffect(() => {
    const getBalanceAndDecimals = async () => {
      if (tokenPrincipal && principal) {
        try {
          let balance;
          let dec;

          if (tokenPrincipal === token0.canisterId) {
            balance = await token0Actor.icrc1_balance_of({
              owner: principal,
              subaccount: [],
            });
            dec = await token0Actor.icrc1_decimals();
          } else if (tokenPrincipal === token1.canisterId) {
            balance = await token1Actor.icrc1_balance_of({
              owner: principal,
              subaccount: [],
            });
            dec = await token1Actor.icrc1_decimals();
          }

          setTokenBalance(Number(balance));
          setDecimals(Number(dec));
        } catch (error) {
          console.error('Error fetching balance and decimals:', error);
        }
      }
    };

    getBalanceAndDecimals();
  }, [tokenPrincipal, token0Actor, token1Actor]);

  useEffect(() => {
    if (amountInput) {
      checkAllowance();
    }
  }, [amountInput]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className={styles.TitleContainer}>
        <h2 className={styles.Title}>Transfer</h2>
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
              <select
                value={tokenPrincipal}
                onChange={(e) => setTokenPrincipal(e.target.value)}
                className={styles.TokenSelect}
              >
                {tokenList.map((tokenInfo) => (
                  <option
                    value={tokenInfo.id}
                    key={tokenInfo.id}
                    className={styles.TokenOption}
                  >
                    <span className={styles.Icon}>
                      {tokenInfo.symbol}
                      <img width={18} height={18} src={tokenInfo.symbol === 'ckBTC' ? ckBTC : ckETH} alt="" />
                    </span>
                  </option>
                ))}
              </select>
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

      {/* Buttons */}
      <button
        type="button"
        onClick={() => {
          if (isTokenApproved) {
            handleDeposit();
          } else {
            handleAllowance();
          }
        }}
        disabled={loading}
        className={styles.TransferButton}
      >
        {loading ? 'Waiting...' : (isTokenApproved ? 'Deposit' : 'Approve Tokens')}
      </button>

      <button type="button" onClick={closeModal} disabled={loading}>Cancel</button>
    </Modal>
  );
}

AddTokenPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTokenPopup;
