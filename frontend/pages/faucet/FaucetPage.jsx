/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './index.module.css';
import { useAuth } from '../../hooks/use-auth-client';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';

function Deposit() {
  const {
    swapActor, token0Actor, token1Actor, principal,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [tokenBalance0, setTokenBalance0] = useState(0);
  const [decimals0, setDecimals0] = useState(0);
  const [tokenBalance1, setTokenBalance1] = useState(0);
  const [decimals1, setDecimals1] = useState(0);

  const handleDeposit = async () => {
    try {
      setLoading(true);

      // Call icrc1_transfer with the minting account principal as the caller
      const result0 = await token0Actor.transfer_from_minting_account(10 * 10 ** 18);

      console.log(result0);

      const result1 = await token1Actor.transfer_from_minting_account(10 * 10 ** 18);

      console.log(result1);

      setLoading(false);

      // Check results
      toast.success('Test tokens claimed');
      getBalanceAndDecimals();
    } catch (e) {
      console.log(e);
      toast.error('test tokens failed');
      setLoading(false);
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

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        Faucet

        <div className={styles.HeaderSwitch}>
          Test tokens in your wallet
        </div>
      </div>
      <div>
        {/* Deposit tokens to start earning trading fees and more rewards. */}
      </div>

      <div className={styles.firstTable}>
        <div className={styles.Deposit}>
          <div className={styles.DepositUpper}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div className={styles.TokenDiv}>
                <img width={24} height={24} src={ckBTC} alt="" />
                <div>
                  {' '}
                  ckBTC
                </div>
              </div>
              <span>Test</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div className={styles.TokenDiv}>
                <img width={24} height={24} src={ckETH} alt="" />
                <div>
                  {' '}
                  ckETH
                </div>
              </div>
              <span>Test</span>
            </div>
          </div>

          <span style={{
            display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '10px',
          }}
          >
            10 ckETH & 10 ckBTC test tokens
          </span>
          <button type="button" className={styles.ButtonContainer} onClick={handleDeposit} disabled={loading}>
            {loading ? 'Waiting...' : 'Claim'}
            <div className={styles.Ellipse} />
          </button>
        </div>
        <div className={styles.Withdraw}>
          <div className={styles.WithdrawUpper} style={{ marginTop: '24px', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div className={styles.TokenDiv} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <img width={24} height={24} src={ckBTC} alt="ckETH logo" />
                <div style={{ marginLeft: '8px' }}>ckBTC</div>
              </div>
              <span>Test</span>
            </div>

            <div style={{
              flexGrow: 1, borderLeft: '1px solid rgba(44, 45, 59, 1)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            }}
            >
              <div style={{ lineHeight: '24px', fontSize: '14px' }}>Balance</div>
              <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>
                {(tokenBalance0 / 10 ** decimals0).toFixed(6)}
              </div>
            </div>
          </div>
          <div className={styles.WithdrawUpper} style={{ marginTop: '24px', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div className={styles.TokenDiv} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <img width={24} height={24} src={ckETH} alt="ckETH logo" />
                <div style={{ marginLeft: '8px' }}>ckETH</div>
              </div>
              <span>Test</span>
            </div>

            <div style={{
              flexGrow: 1, borderLeft: '1px solid rgba(44, 45, 59, 1)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            }}
            >
              <div style={{ lineHeight: '24px', fontSize: '14px' }}>Balance</div>
              <div style={{ fontSize: '24px', color: 'rgba(204, 204, 204, 1)', marginTop: '6px' }}>
                {(tokenBalance1 / 10 ** decimals1).toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
