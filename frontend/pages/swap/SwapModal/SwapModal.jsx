/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { Principal } from '@dfinity/principal';
import { useAuth } from '../../../hooks/use-auth-client';

import * as swap from '../../../../src/declarations/swap';
import * as token0 from '../../../../src/declarations/token0';
import * as token1 from '../../../../src/declarations/token1';
import * as deposit0 from '../../../../src/declarations/deposit0';
import * as deposit1 from '../../../../src/declarations/deposit1';
import { getAmountOutMin } from '../../../utils';
import styles from './index.module.css';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(24, 25, 33, 0.7)';

const customStyles = {
  content: {
    color: 'white',
    backgroundColor: 'rgb(26, 34, 63)',
    width: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function SwapModal({
  isSwapModalOpen,
  closeSwapModal,
  formValues,
  price,
  slippage,
  clearAll,
}) {
  const {
    principal, swapActor, identity,
  } = useAuth();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTokenApproved, setIsTokenApproved] = useState(false);

  const handleToSymbol = async (t0, t1) => {
    const tk0 = await swapActor.symbol(t0);
    const tk1 = await swapActor.symbol(t1);

    setTokens([tk0, tk1]);
  };

  const checkAllowance = async () => {
    try {
      let tokenActor;
      if (formValues.token0 === token0.canisterId) {
        tokenActor = token0.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === token1.canisterId) {
        tokenActor = token1.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === deposit0.canisterId) {
        tokenActor = deposit0.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === deposit1.canisterId) {
        tokenActor = deposit1.createActor(Principal.fromText(formValues.token0), {
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
      setIsTokenApproved(allowance.allowance >= formValues.amountIn * 10 ** 18);
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
        amount: formValues.amountIn * 10 ** 18,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(swap.canisterId),
      };
      let tokenActor;
      if (formValues.token0 === token0.canisterId) {
        tokenActor = token0.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === token1.canisterId) {
        tokenActor = token1.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === deposit0.canisterId) {
        tokenActor = deposit0.createActor(Principal.fromText(formValues.token0), {
          agentOptions: {
            identity,
          },
        });
      } else if (formValues.token0 === deposit1.canisterId) {
        tokenActor = deposit1.createActor(Principal.fromText(formValues.token0), {
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
      setIsTokenApproved(allowance.allowance >= formValues.amountIn * 10 ** 18);
      setLoading(false);
    } catch (e) {
      console.error('Error during allowance:', e);
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    try {
      setLoading(true);

      // const record = {
      //   fee: [],
      //   memo: [],
      //   from_subaccount: [],
      //   created_at_time: [],
      //   amount: formValues.amountIn * 10 ** 18,
      //   expected_allowance: [],
      //   expires_at: [],
      //   spender: Principal.fromText(swap.canisterId),
      // };
      // await token0Actor.icrc2_approve(
      //   record,
      // );
      // await swapActor.deposit(
      //   Principal.fromText(formValues.token0),
      //   Math.floor(formValues.amountIn * 10 ** 18),
      // );

      // const timestamp = Math.floor(new Date().getTime() / 1000) + 600;
      const timestamp = Math.floor(new Date().getTime() * 1000000000) + 600;

      const tempFormvalue = {
        token0: formValues.token0,
        token1: formValues.token1,
        amountIn: formValues.amountIn * 10 ** 18,
        amountOutMin: formValues.amountOutMin * 10 ** 18,
      };

      const AmountOutMin = await getAmountOutMin(tempFormvalue, swapActor, Principal);

      console.log('Output Amount: ', AmountOutMin);
      console.log('formValues.amountOutMin: ', tempFormvalue.amountOutMin);
      const PE = tempFormvalue.amountIn * price;
      const minSlippage = (PE - AmountOutMin) / PE;

      console.log('slippage: ', slippage);
      console.log('minSlippage: ', minSlippage);

      if (slippage) {
        if (slippage < minSlippage) {
          toast.error('Swap fail because of your slippage too low');
          setLoading(false);
          closeSwapModal();
          return;
        }
      }

      await swapActor.deposit(
        Principal.fromText(tempFormvalue.token0),
        tempFormvalue.amountIn,
      );

      // console.log('CHECK: ', tempFormvalue.amountIn, ' ', AmountOutMin, '', minSlippage);
      const res = await swapActor.swapExactTokensForTokens(
        Math.floor(tempFormvalue.amountIn),
        // tempFormvalue.amountOutMin,
        Math.floor(AmountOutMin - (AmountOutMin * Math.abs(minSlippage))),
        [Principal.fromText(tempFormvalue.token0).toString(),
          Principal.fromText(tempFormvalue.token1).toString()],
        principal,
        timestamp,
      );

      // await swapActor.withdraw(
      //   Principal.fromText(tempFormvalue.token1),
      //   tempFormvalue.amountOutMin,
      // );

      let balance;

      if (tempFormvalue.token1 === token0.canisterId) {
        const resUserBal = await swapActor.getUserBalances(principal);
        balance = resUserBal.find((b) => b[0] === tempFormvalue.token1);
      } else if (tempFormvalue.token1 === token1.canisterId) {
        const resUserBal = await swapActor.getUserBalances(principal);
        balance = resUserBal.find((b) => b[0] === tempFormvalue.token1);
      } else if (tempFormvalue.token1 === deposit0.canisterId) {
        const resUserBal = await swapActor.getUserBalances(principal);
        balance = resUserBal.find((b) => b[0] === tempFormvalue.token1);
      } else if (tempFormvalue.token1 === deposit1.canisterId) {
        const resUserBal = await swapActor.getUserBalances(principal);
        balance = resUserBal.find((b) => b[0] === tempFormvalue.token1);
      }

      await swapActor.withdraw(
        Principal.fromText(tempFormvalue.token1),
        balance[1],
      );

      console.log('token0: ', Principal.fromText(tempFormvalue.token0).toString());
      console.log('token1: ', Principal.fromText(tempFormvalue.token1).toString());
      // console.log('caller: ', principal.toString());

      setLoading(false);

      closeSwapModal();
      clearAll();

      if ('ok' in res) {
        toast.success('Swap successfully');
      } else {
        toast.error('Swap fail');
        console.log(res);
      }
    } catch (e) {
      toast.error('Swap fail');
      console.log('error: ', e);

      setLoading(false);

      closeSwapModal();
    }
  };

  useEffect(() => {
    if (swapActor && formValues.token0 && formValues.token1) {
      handleToSymbol(formValues.token0, formValues.token1);
    }
  }, [swapActor, formValues.token0, formValues.token1]);

  useEffect(() => {
    if (formValues.amountIn) {
      checkAllowance();
    }
  }, [formValues.amountIn]);

  return (
    <Modal
      isOpen={isSwapModalOpen}
      onRequestClose={closeSwapModal}
      style={customStyles}
    >
      <h2>Swap</h2>

      <div className={styles.TokenListContainer}>
        <div className={styles.LineContainer}>
          <div>
            Swap Amount
          </div>

          <div>
            <div>
              {formValues.amountIn}
              {' '}
              {tokens[0]}
            </div>

            <div>
              {formValues.amountOutMin}
              {' '}
              {tokens[1]}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isTokenApproved) {
              handleSwap();
            } else {
              handleAllowance();
            }
          }}
          disabled={loading}
        >
          {loading ? 'Waiting...' : (isTokenApproved ? 'Swap' : 'Approve Tokens')}
        </button>
      </div>
    </Modal>
  );
}

SwapModal.propTypes = {
  isSwapModalOpen: PropTypes.bool.isRequired,
  closeSwapModal: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  formValues: PropTypes.shape({
    token0: PropTypes.string,
    token1: PropTypes.string,
    amountIn: PropTypes.number,
    amountOutMin: PropTypes.number,
  }).isRequired,
  price: PropTypes.number,
  slippage: PropTypes.number,
};

SwapModal.defaultProps = {
  slippage: undefined,
  price: undefined,
};

export default SwapModal;
