/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { Principal } from '@dfinity/principal';
import { useAuth } from '../../../hooks/use-auth-client';

import * as aggregator from '../../../../src/declarations/aggregator';

import styles from './index.module.css';

Modal.setAppElement('#root');

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

function AddLiquidityModal({
  isAddLiquidityModalOpen,
  closeAddLiquidityModal,
  formValues,
  price,
  priceMin,
  priceMax,
}) {
  const {
    swapActor, token0Actor, token1Actor,
    aggregatorActor, principal,
  } = useAuth();

  const [tokens, setTokens] = useState([]);
  const [pair, setPair] = useState();
  const [loading, setLoading] = useState(false);

  const handleToSymbol = async (t0, t1) => {
    const tk0 = await swapActor.symbol(t0);
    const tk1 = await swapActor.symbol(t1);

    setTokens([tk0, tk1]);
  };

  // const handleAddLiquidity = async () => {
  //   try {
  //     setLoading(true);
  //     let res;
  //     const record = {
  //       fee: [],
  //       memo: [],
  //       from_subaccount: [],
  //       created_at_time: [],
  //       amount: formValues.amount0Desired,
  //       expected_allowance: [],
  //       expires_at: [],
  //       spender: Principal.fromText(swap.canisterId),
  //     };
  //     const record1 = {
  //       fee: [],
  //       memo: [],
  //       from_subaccount: [],
  //       created_at_time: [],
  //       amount: formValues.amount1Desired,
  //       expected_allowance: [],
  //       expires_at: [],
  //       spender: Principal.fromText(swap.canisterId),
  //     };

  //     if (formValues.token0 === pair[0].token0) {
  //       await token0Actor.icrc2_approve(record);
  //       await token1Actor.icrc2_approve(record1);

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token0),
  //         formValues.amount0Desired,
  //       );

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token1),
  //         formValues.amount1Desired,
  //       );

  //       const timestamp = Math.floor(new Date().getTime() * 10000000000);

  //       res = await swapActor.addLiquidity(
  //         Principal.fromText(formValues.token0),
  //         Principal.fromText(formValues.token1),
  //         formValues.amount0Desired,
  //         formValues.amount1Desired,
  //         0,
  //         0,
  //         timestamp,
  //       );
  //     } else {
  //       await token1Actor.icrc2_approve(record);
  //       await token0Actor.icrc2_approve(record1);

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token0),
  //         formValues.amount0Desired,
  //       );

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token1),
  //         formValues.amount1Desired,
  //       );

  //       const timestamp = Math.floor(new Date().getTime() * 10000000000);

  //       res = await swapActor.addLiquidity(
  //         Principal.fromText(formValues.token1),
  //         Principal.fromText(formValues.token0),
  //         formValues.amount1Desired,
  //         formValues.amount0Desired,
  //         0,
  //         0,
  //         timestamp,
  //       );
  //     }
  //     setLoading(false);

  //     closeAddLiquidityModal();

  //     if ('ok' in res) {
  //       toast.success('Liquidity added successfully');
  //     } else {
  //       console.log('RES: ', res);
  //       toast.error('Liquidity not added successfully');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error('Liquidity not added successfully');
  //     setLoading(false);

  //     closeAddLiquidityModal();
  //   }
  // };

  // const handleDeposit = async () => {
  //   try {
  //     setLoading(true);
  //     let res;
  //     let res2;
  //     const record = {
  //       fee: [],
  //       memo: [],
  //       from_subaccount: [],
  //       created_at_time: [],
  //       amount: Number(formValues.amount0Desired) * 10 ** 18,
  //       expected_allowance: [],
  //       expires_at: [],
  //       spender: Principal.fromText(swap.canisterId),
  //     };
  //     const record1 = {
  //       fee: [],
  //       memo: [],
  //       from_subaccount: [],
  //       created_at_time: [],
  //       amount: Number(formValues.amount1Desired) * 10 ** 18,
  //       expected_allowance: [],
  //       expires_at: [],
  //       spender: Principal.fromText(swap.canisterId),
  //     };

  //     if (formValues.token0 === pair[0].token0) {
  //       await token0Actor.icrc2_approve(record);
  //       await token1Actor.icrc2_approve(record1);

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token0),
  //         Number(formValues.amount0Desired) * 10 ** 18,
  //       );

  //       await swapActor.deposit(
  //         Principal.fromText(formValues.token1),
  //         Number(formValues.amount1Desired) * 10 ** 18,
  //       );

  //       // const timestamp = Math.floor(new Date().getTime() * 10000000000);

  //       // res = await swapActor.addLiquidity(
  //       //   Principal.fromText(formValues.token0),
  //       //   Principal.fromText(formValues.token1),
  //       //   formValues.amount0Desired,
  //       //   formValues.amount1Desired,
  //       //   0,
  //       //   0,
  //       //   timestamp,
  //       // );
  //     } else {
  //       await token1Actor.icrc2_approve(record);
  //       await token0Actor.icrc2_approve(record1);

  //       res = await swapActor.deposit(
  //         Principal.fromText(formValues.token0),
  //         Number(formValues.amount0Desired) * 10 ** 18,
  //       );

  //       res2 = await swapActor.deposit(
  //         Principal.fromText(formValues.token1),
  //         Number(formValues.amount1Desired) * 10 ** 18,
  //       );

  //       // const timestamp = Math.floor(new Date().getTime() * 10000000000);

  //       // res = await swapActor.addLiquidity(
  //       //   Principal.fromText(formValues.token1),
  //       //   Principal.fromText(formValues.token0),
  //       //   formValues.amount1Desired,
  //       //   formValues.amount0Desired,
  //       //   0,
  //       //   0,
  //       //   timestamp,
  //       // );
  //     }
  //     setLoading(false);

  //     closeAddLiquidityModal();

  //     if ('ok' in res && 'ok' in res2) {
  //       toast.success('Deposit successfully');
  //     } else if ('ok' in res) {
  //       console.log('RES: ', res2);
  //       toast.warn('Deposit fail in token 1 success in token 0');
  //     } else if ('ok' in res2) {
  //       console.log('RES: ', res);
  //       toast.warn('Deposit fail in token 0 success in token 1');
  //     } else {
  //       console.log('RES: ', res, ', RES2: ', res2);
  //       toast.warn('Deposit fail in both token 0 and token 1');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error('Deposit error');
  //     setLoading(false);

  //     closeAddLiquidityModal();
  //   }
  // };

  const handleAddLiquidity = async () => {
    try {
      setLoading(true);
      let res;
      const t0b = await token0Actor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      const t1b = await token0Actor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      const record = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: t0b,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(aggregator.canisterId),
      };
      const record1 = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: t1b,
        expected_allowance: [],
        expires_at: [],
        spender: Principal.fromText(aggregator.canisterId),
      };

      if (formValues.token0 === pair[0].token0) {
        await token0Actor.icrc2_approve(record);
        await token1Actor.icrc2_approve(record1);

        const timestamp = Math.floor(new Date().getTime() * 10000000000);

        res = await aggregatorActor.addLP(
          Principal.fromText(formValues.token0),
          Principal.fromText(formValues.token1),
          formValues.amount0Desired * 10 ** 18,
          formValues.amount1Desired * 10 ** 18,
          0,
          0,
          timestamp,
        );

        console.log(res);
      } else {
        await token1Actor.icrc2_approve(record);
        await token0Actor.icrc2_approve(record1);

        const timestamp = Math.floor(new Date().getTime() * 10000000000);

        res = await aggregatorActor.addLP(
          Principal.fromText(formValues.token1),
          Principal.fromText(formValues.token0),
          formValues.amount1Desired * 10 ** 18,
          formValues.amount0Desired * 10 ** 18,
          0,
          0,
          timestamp,
        );

        console.log(res);
      }
      setLoading(false);

      closeAddLiquidityModal();

      if (res.trim().toLowerCase() === 'ok') {
        toast.success('Liquidity added successfully');
      } else {
        console.log('RES: ', res);
        toast.error('Liquidity not added successfully');
      }
    } catch (e) {
      console.log(e);
      toast.error('Liquidity not added successfully');
      setLoading(false);

      closeAddLiquidityModal();
    }
  };

  useEffect(() => {
    if (swapActor && formValues.token0 && formValues.token1) {
      handleToSymbol(formValues.token0, formValues.token1);
    }
  }, [swapActor, formValues.token0, formValues.token1]);

  useEffect(() => {
    const handleGetPair = async () => {
      const res = await swapActor.getPair(
        Principal.fromText(formValues.token0),
        Principal.fromText(formValues.token1),
      );

      setPair(res);
    };

    if (swapActor && formValues.token0 && formValues.token1) {
      handleGetPair();
    }
  }, [swapActor, formValues.token0, formValues.token1]);

  return (
    <Modal
      isOpen={isAddLiquidityModalOpen}
      onRequestClose={closeAddLiquidityModal}
      style={customStyles}
    >
      <h2>Add Liquidity</h2>

      <div className={styles.TokenListContainer}>
        <div className={styles.LineContainer}>
          <div>
            Deposited Amount
          </div>

          <div>
            <div>
              {formValues.amount0Desired}
              {' '}
              {tokens[0]}
            </div>

            <div>
              {formValues.amount1Desired}
              {' '}
              {tokens[1]}
            </div>
          </div>
        </div>

        <div className={styles.LineContainer}>
          <div>
            Current Price
          </div>

          <div>
            {Math.round(price * 1000) / 1000}
            {' '}
            {tokens[0]}
            /
            {tokens[1]}
          </div>
        </div>

        <div className={styles.LineContainer}>
          <div>
            Price Range
          </div>

          <div>
            {Math.round(priceMin * 1000) / 1000}
            {' '}
            -
            {' '}
            {Math.round(priceMax * 1000) / 1000}
            {' '}
            {tokens[0]}
            /
            {tokens[1]}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddLiquidity}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </Modal>
  );
}

AddLiquidityModal.propTypes = {
  isAddLiquidityModalOpen: PropTypes.bool.isRequired,
  closeAddLiquidityModal: PropTypes.func.isRequired,
  formValues: PropTypes.shape({
    token0: PropTypes.string,
    token1: PropTypes.string,
    amount0Desired: PropTypes.number,
    amount1Desired: PropTypes.number,
  }).isRequired,
  price: PropTypes.number,
  priceMin: PropTypes.number,
  priceMax: PropTypes.number,
};

AddLiquidityModal.defaultProps = {
  price: 0,
  priceMin: 0,
  priceMax: 0,
};

export default AddLiquidityModal;
