/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  DepositIcon,
} from '../Utils';
import styles from './index.module.css';
import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';
import * as deposit0 from '../../../../../src/declarations/deposit0';
import * as deposit1 from '../../../../../src/declarations/deposit1';
import * as swap from '../../../../../src/declarations/swap';
import { useAuth } from '../../../../hooks/use-auth-client';

// import DepositImg from '../../../../assets/deposit.png';
import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';
import dckBTC from '../../../../assets/d.ckBTC.png';
import dckETH from '../../../../assets/d.cketh.png';

const pairMapping = {
  'eth-btc': {
    token0Label: 'ETH',
    token1Label: 'BTC',
    token0Image: ckETH,
    token1Image: ckBTC,
    token0Actor: null,
    token1Actor: null,
    token0CanisterId: token1.canisterId,
    token1CanisterId: token0.canisterId,
  },
  'eth-deth': {
    token0Label: 'ETH',
    token1Label: 'd.ETH',
    token0Image: ckETH,
    token1Image: dckETH,
    token0Actor: null,
    token1Actor: null,
    token0CanisterId: token1.canisterId,
    token1CanisterId: deposit1.canisterId,
  },
  'btc-dbtc': {
    token0Label: 'BTC',
    token1Label: 'd.BTC',
    token0Image: ckBTC,
    token1Image: dckBTC,
    token0Actor: null,
    token1Actor: null,
    token0CanisterId: token0.canisterId,
    token1CanisterId: deposit0.canisterId,
  },
};

function Deposit() {
  const { pair } = useParams();
  const {
    swapActor, token0Actor, token1Actor, deposit0Actor, deposit1Actor, principal,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [tokenBalance0, setTokenBalance0] = useState(0);
  const [decimals0, setDecimals0] = useState(0);
  const [tokenBalance1, setTokenBalance1] = useState(0);
  const [decimals1, setDecimals1] = useState(0);
  const [amountInput0, setAmountInput0] = useState('');
  const [amountInput1, setAmountInput1] = useState('');
  const [isTokenApproved0, setIsTokenApproved0] = useState(true);
  const [isTokenApproved1, setIsTokenApproved1] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [token0ActorInstance, setToken0ActorInstance] = useState(null);
  const [token1ActorInstance, setToken1ActorInstance] = useState(null);

  const {
    token0Label, token1Label, token0Image, token1Image, token0CanisterId, token1CanisterId,
  } = pairMapping[pair];

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  const checkAllowance = async () => {
    try {
      // Check allowance for token0
      if (amountInput0) {
        const allowance0 = await token0Actor.icrc2_allowance({
          account: { owner: principal, subaccount: [] },
          spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
        });
        setIsTokenApproved0(allowance0.allowance >= amountInput0 * 10 ** 18);
      }

      // Check allowance for token1
      if (amountInput1) {
        const allowance1 = await token1Actor.icrc2_allowance({
          account: { owner: principal, subaccount: [] },
          spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
        });
        setIsTokenApproved1(allowance1.allowance >= amountInput1 * 10 ** 18);
      }
    } catch (error) {
      console.error('Error checking token allowance:', error);
      // Handle error
    }
  };

  const handleAllowance = async () => {
    try {
      setLoading(true);

      const record0 = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: amountInput0 * 10 ** 18,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(swap.canisterId),
      };

      const record1 = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: amountInput1 * 10 ** 18,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(swap.canisterId),
      };

      if (!isTokenApproved0) {
        await token0Actor.icrc2_approve(record0);

        const allowance0 = await token0Actor.icrc2_allowance({
          account: { owner: principal, subaccount: [] },
          spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
        });

        setIsTokenApproved0(allowance0.allowance >= amountInput0 * 10 ** 18);
      }

      if (!isTokenApproved1) {
        await token1Actor.icrc2_approve(record1);

        const allowance1 = await token1Actor.icrc2_allowance({
          account: { owner: principal, subaccount: [] },
          spender: { owner: Principal.fromText(swap.canisterId), subaccount: [] },
        });

        setIsTokenApproved1(allowance1.allowance >= amountInput1 * 10 ** 18);
      }

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
      if (amountInput0) {
        await swapActor.deposit(
          Principal.fromText(token0.canisterId),
          amountInput0 * 10 ** 18,
        );
      }

      if (amountInput1) {
        await swapActor.deposit(
          Principal.fromText(token1.canisterId),
          amountInput1 * 10 ** 18,
        );
      }

      setLoading(false);

      // Check results
      toast.success('Deposit successfully');
      setAmountInput0(0);
      setAmountInput1(0);
      getBalanceAndDecimals();
    } catch (e) {
      console.log(e);
      toast.error('Deposit error');
      setLoading(false);
    }
  };

  const setMaxInput0 = () => {
    if (decimals0 && tokenBalance0) {
      setAmountInput0(tokenBalance0 / 10 ** decimals0);
    }
  };

  const setMaxInput1 = () => {
    if (decimals1 && tokenBalance1) {
      setAmountInput1(tokenBalance1 / 10 ** decimals1);
    }
  };

  const getBalanceAndDecimals = async () => {
    if (tokenList.length > 0 && principal) {
      try {
        const balance0 = await token0Actor.icrc1_balance_of({
          owner: principal,
          subaccount: [],
        });
        const dec0 = await token0Actor.icrc1_decimals();

        const balance1 = await token1Actor.icrc1_balance_of({
          owner: principal,
          subaccount: [],
        });
        const dec1 = await token1Actor.icrc1_decimals();

        setTokenBalance0(Number(balance0));
        setDecimals0(Number(dec0));
        setTokenBalance1(Number(balance1));
        setDecimals1(Number(dec1));
      } catch (error) {
        console.error('Error fetching balance and decimals:', error);
      }
    }
  };

  useEffect(() => {
    // Set the actors based on the pair
    if (pair === 'eth-btc') {
      setToken0ActorInstance(token1Actor);
      setToken1ActorInstance(token0Actor);
    } else if (pair === 'eth-deth') {
      setToken0ActorInstance(token1Actor);
      setToken1ActorInstance(deposit1Actor);
    } else if (pair === 'btc-dbtc') {
      setToken0ActorInstance(token0Actor);
      setToken1ActorInstance(deposit0Actor);
    }
  }, [pair, token0Actor, token1Actor, deposit0Actor, deposit1Actor]);

  useEffect(() => {
    const handleGetSupportedTokenList = async () => {
      const res = await swapActor.getSupportedTokenList();
      setTokenList(res);
    };

    if (swapActor) {
      handleGetSupportedTokenList();
    }
  }, [swapActor]);

  useEffect(() => {
    getBalanceAndDecimals();
  }, [tokenList, token0Actor, token1Actor]);

  useEffect(() => {
    if (amountInput0 && amountInput1) {
      checkAllowance();
    }
  }, [amountInput0, amountInput1]);

  return (
    <div>
      <div className={styles.RightHeader}>
        <DepositIcon />
        Deposit
      </div>
      <div>
        Deposit tokens to start earning trading fees and more rewards.
      </div>

      <div className={styles.Deposit}>
        <div className={styles.TitleContainer}>
          <h2 className={styles.Title}>TOKEN TO DEPOSIT</h2>
        </div>

        <div>
          <div className={styles.LabelContainer}>
            <div className={styles.Label}>
              <div>
                <span className={styles.Icon} style={{ display: 'flex', alignItems: 'center' }}>
                  {tokenList && tokenList.length > 0 && tokenList[0].symbol
                  && (
                  <>
                    <img width={18} height={18} src={tokenList[0].symbol === 'ckBTC' ? ckBTC : ckETH} alt="" style={{ marginRight: '10px' }} />
                    {' '}
                    {tokenList[0].symbol}
                  </>
                  )}
                </span>
              </div>
              <div>
                Balance:
                {' '}
                {tokenBalance0 && decimals0 && <span>{tokenBalance0 / 10 ** decimals0}</span>}
              </div>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputGroup}>
              <input
                type="number"
                className={styles.InputFieldDeposit}
                placeholder="0.0"
                onChange={(e) => setAmountInput0(e.target.value)}
                value={amountInput0}
              />
              <button type="button" className={styles.MaxButton} onClick={setMaxInput0}>
                Max
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.LabelContainer}>
            <div className={styles.Label}>
              <div>
                <span className={styles.Icon} style={{ display: 'flex', alignItems: 'center' }}>
                  {tokenList && tokenList.length > 1 && tokenList[1].symbol && (
                  <>
                    <img width={18} height={18} src={tokenList[1].symbol === 'ckBTC' ? ckBTC : ckETH} alt="" style={{ marginRight: '10px' }} />
                    <span>{tokenList[1].symbol}</span>
                  </>
                  )}
                </span>
              </div>
              <div>
                Balance:
                {' '}
                {tokenBalance1 && decimals1 && <span>{tokenBalance1 / 10 ** decimals1}</span>}
              </div>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputGroup}>
              <input
                type="number"
                className={styles.InputFieldDeposit}
                placeholder="0.0"
                onChange={(e) => setAmountInput1(e.target.value)}
                value={amountInput1}
              />
              <button type="button" className={styles.MaxButton} onClick={setMaxInput1}>
                Max
              </button>
            </div>
          </div>
        </div>

        <div className={styles.ToggleText}>
          <label className={styles.ToggleSwitch}>
            <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
            <span className={styles.Slider} />
          </label>
          Add tokens in balanced proportion
        </div>
      </div>

      {/* Buttons */}
      <button
        type="button"
        onClick={() => {
          if (amountInput0 && !amountInput1) {
            if (isTokenApproved0) {
              handleDeposit();
            } else {
              handleAllowance();
            }
          } else if (!amountInput0 && amountInput1) {
            if (isTokenApproved1) {
              handleDeposit();
            } else {
              handleAllowance();
            }
          } else if (amountInput0 && amountInput1) {
            if (isTokenApproved0 && isTokenApproved1) {
              handleDeposit();
            } else {
              handleAllowance();
            }
          }
        }}
        disabled={loading || (!amountInput0 && !amountInput1)}
        className={styles.TransferButton}
      >
        {loading ? 'Waiting...' : ((isTokenApproved0 && isTokenApproved1) ? 'Deposit' : 'Approve Tokens')}
      </button>
    </div>
  );
}

export default Deposit;
