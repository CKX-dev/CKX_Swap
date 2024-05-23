import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Principal } from '@dfinity/principal';

import { useAuth } from '../../hooks/use-auth-client';
import * as token0 from '../../../src/declarations/token0';
import * as token1 from '../../../src/declarations/token1';

import SelectTokenModal from './SelectTokenModal/SelectTokenModal';

import { calculateAmount0Desired, calculateAmount1Desired, getPriceFromPair } from '../../utils';

import styles from './index.module.css';
import AddLiquidityModal from './AddLiquidityModal/AddLiquidityModal';

function AddLiquidityPage() {
  const {
    swapActor, principal, token0Actor, token1Actor, identity,
  } = useAuth();
  const navigation = useNavigate();
  const validation = useFormik({
    initialValues: {
      token0: '',
      token1: '',
      amount0Desired: 0,
      amount1Desired: 0,
    },

    validationSchema: Yup.object().shape({
      token0: Yup.string().required('Token0 is required'),
      token1: Yup.string().required('Token1 is required'),
      amount0Desired: Yup.string().required('Amount0 Desired is required'),
      amount1Desired: Yup.string().required('Amount1 Desired is required'),
    }),

    onSubmit: async (values) => {
      setFormValues(values);

      openAddLiquidityModal();
    },
  });

  const [userBalances, setUserBalances] = useState([]);
  const [price, setPrice] = useState();
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [selectedToken0Name, setSelectedToken0Name] = useState('');
  const [selectedToken1Name, setSelectedToken1Name] = useState('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [selectedTokenIdentifier, setSelectedTokenIdentifier] = useState('');
  const [formValues, setFormValues] = useState(validation.values);
  const [amount1Desired, setAmount1Desired] = useState(validation.values.amount1Desired);
  const [amount0Desired, setAmount0Desired] = useState(validation.values.amount0Desired);
  const [bothTokensSelected, setBothTokensSelected] = useState(false);

  const openTokenModal = (token) => {
    setSelectedTokenIdentifier(token);
    setIsTokenModalOpen(true);
  };

  const closeTokenModal = () => {
    setIsTokenModalOpen(false);
  };

  const openAddLiquidityModal = () => {
    setIsAddLiquidityModalOpen(true);
  };

  const closeAddLiquidityModal = () => {
    setIsAddLiquidityModalOpen(false);
  };

  const handleGoBack = () => {
    navigation('/swap/liquidity');
  };

  const handleClearForm = () => {
    validation.resetForm();
    setPriceMin('');
    setPriceMax('');
  };

  const handleSelectFullRange = () => {
    setPriceMin(0);
    setPriceMax(Infinity);
  };

  const handleToken0Change = (o) => {
    setSelectedToken0Name(o.symbol);
    validation.setFieldValue('token0', o.id);

    if (o.symbol === selectedToken1Name) {
      setSelectedToken0Name(o.symbol);
      setSelectedToken1Name('');
      validation.setFieldValue('token0', o.id);
      setBothTokensSelected(false);
    } else {
      setBothTokensSelected(!!selectedToken1Name);
    }
  };

  const handleToken1Change = (o) => {
    setSelectedToken1Name(o.symbol);
    validation.setFieldValue('token1', o.id);

    if (o.symbol === selectedToken0Name) {
      setSelectedToken0Name(o.symbol);
      setSelectedToken1Name('');
      validation.setFieldValue('token1', o.id);
      setBothTokensSelected(false);
    } else {
      setBothTokensSelected(!!selectedToken0Name);
    }
  };

  useEffect(() => {
    if (
      !Number.isNaN(validation.values.amount0Desired)
      && !Number.isNaN(price)
      && !Number.isNaN(priceMin)
      && !Number.isNaN(priceMax)
    ) {
      const newAmount1Desired = calculateAmount1Desired(
        validation.values.amount0Desired,
        price,
        priceMin,
        priceMax,
      );

      if (newAmount1Desired !== amount1Desired) {
        setAmount1Desired(newAmount1Desired);
        validation.setFieldValue('amount1Desired', newAmount1Desired);
      }
    }
  }, [validation.values.amount0Desired, price, priceMin, priceMax]);

  useEffect(() => {
    if (
      !Number.isNaN(validation.values.amount1Desired)
      && !Number.isNaN(price)
      && !Number.isNaN(priceMin)
      && !Number.isNaN(priceMax)
    ) {
      const newAmount0Desired = calculateAmount0Desired(
        validation.values.amount1Desired,
        price,
        priceMin,
        priceMax,
      );

      if (newAmount0Desired !== amount0Desired) {
        setAmount0Desired(newAmount0Desired);
        validation.setFieldValue('amount0Desired', newAmount0Desired);
      }
    }
  }, [validation.values.amount1Desired, price, priceMin, priceMax]);

  useEffect(() => {
    const handleGetPriceFromPair = async () => {
      if (validation.values.token0 && validation.values.token1
        && (validation.values.token0 !== validation.values.token1)) {
        const res = await getPriceFromPair(
          swapActor,
          Principal.fromText(validation.values.token0),
          Principal.fromText(validation.values.token1),
        );

        setPrice(res);
      } else {
        setPrice(null);
      }
    };

    if (swapActor) {
      handleGetPriceFromPair();
    }
  }, [validation.values.token0, validation.values.token1]);

  useEffect(() => {
    setPriceMin(price - price / 2);
    setPriceMax(price * 2);
  }, [price]);

  useEffect(() => {
    const handleGetUserBalances = async () => {
      const token0ActorForSelectedToken = token0.createActor(validation.values.token0, {
        agentOptions: {
          identity,
        },
      });

      const token1ActorForSelectedToken = token1.createActor(validation.values.token1, {
        agentOptions: {
          identity,
        },
      });

      const token0Balance = await token0ActorForSelectedToken.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      const token1Balance = await token1ActorForSelectedToken.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });

      setUserBalances([token0Balance, token1Balance]);
    };

    if (swapActor && principal && validation.values.token0
      && validation.values.token1 && token0Actor && token1Actor) {
      handleGetUserBalances();
    }
  }, [swapActor, principal, validation.values.token0, validation.values.token1,
    token0Actor, token1Actor]);

  return (
    <div className={styles.PageContainer}>

      <div className={styles.CardContainer}>
        <div className={styles.TitleContainer}>
          <button type="button" onClick={() => handleGoBack()}>&lt;</button>
          <h1>Add Liquidity</h1>
          <button type="button" onClick={() => handleClearForm()}>Clear All</button>
        </div>

        <form onSubmit={validation.handleSubmit}>
          <div className={styles.LeftContainer}>
            <div className={styles.PairSelection}>
              <h2>Select Pair</h2>
              <div className={styles.TokenContainer}>
                <button type="button" onClick={() => openTokenModal('0')}>
                  {selectedToken0Name || 'Select Token 0'}
                </button>

                <button type="button" onClick={() => openTokenModal('1')}>
                  {selectedToken1Name || 'Select Token 1'}
                </button>
              </div>
            </div>

            <div className={styles.DepositAmounts}>
              <h2>Deposit Amounts</h2>

              <div>
                <label htmlFor="amount0Desired">
                  {selectedToken0Name}
                </label>

                <input
                  type="number"
                  id="amount0Desired"
                  name="amount0Desired"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.amount0Desired || 0}
                />
                {validation.touched.amount0Desired && validation.errors.amount0Desired && (
                <div>{validation.errors.amount0Desired}</div>
                )}
                <p>
                  Balance:
                  {' '}
                  {userBalances[0]
                    ? Math.round((Number(userBalances[0]) / 10 ** 18) * 1000) / 1000 : 0}
                </p>
              </div>

              <div>
                <label htmlFor="amount1Desired">
                  {selectedToken1Name}
                </label>

                <input
                  type="number"
                  id="amount1Desired"
                  name="amount1Desired"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.amount1Desired || 0}
                  disabled={!bothTokensSelected}
                />
                {validation.touched.amount1Desired && validation.errors.amount1Desired && (
                <div>{validation.errors.amount1Desired}</div>
                )}
                <p>
                  Balance:
                  {' '}
                  {userBalances[1]
                    ? Math.round((Number(userBalances[1]) / 10 ** 18) * 1000) / 1000 : 0}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.RightContainer}>
            <div className={styles.PriceRange}>
              <h2>Set Price Range</h2>
              <p>
                Current Price:
                {' '}
                {(price || 0).toFixed(6)}
                {' '}
                <span>
                  {selectedToken1Name || '--'}
                  {' '}
                  per
                  {' '}
                  {selectedToken0Name}
                </span>
              </p>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={(priceMin || 0).toFixed(6)}
                onChange={(e) => setPriceMin(parseFloat(e.target.value))}
                disabled={!bothTokensSelected}
              />

              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={(priceMax || 0).toFixed(6)}
                onChange={(e) => setPriceMax(parseFloat(e.target.value))}
                disabled={!bothTokensSelected}
              />

              <button type="button" onClick={() => handleSelectFullRange()} disabled={!bothTokensSelected}>Full Range</button>
            </div>

            <button type="submit" disabled={!bothTokensSelected}>Submit</button>
          </div>
        </form>
      </div>

      <SelectTokenModal
        isTokenModalOpen={isTokenModalOpen}
        closeTokenModal={closeTokenModal}
        handleToken0Change={handleToken0Change}
        handleToken1Change={handleToken1Change}
        selectedTokenIdentifier={selectedTokenIdentifier}
      />

      <AddLiquidityModal
        isAddLiquidityModalOpen={isAddLiquidityModalOpen}
        closeAddLiquidityModal={closeAddLiquidityModal}
        formValues={formValues}
        price={price}
        priceMin={priceMin}
        priceMax={priceMax}
      />
    </div>
  );
}

export default AddLiquidityPage;
