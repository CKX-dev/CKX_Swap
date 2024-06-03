import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Principal } from '@dfinity/principal';

import { useAuth } from '../../../../hooks/use-auth-client';

import SelectTokenModal from './SelectTokenModal/SelectTokenModal';

import {
  calculateAmount0Desired, calculateAmount1Desired, getPriceFromPair, getActor,
} from '../../../../utils';

import styles from './index.module.css';
import AddLiquidityModal from './AddLiquidityModal/AddLiquidityModal';

import ckBTC from '../../../../assets/ckBTC.png';
import ckETH from '../../../../assets/ckETH.png';
import dckBTC from '../../../../assets/d.ckBTC.png';
import dckETH from '../../../../assets/d.cketh.png';

import * as token0 from '../../../../../src/declarations/token0';
import * as token1 from '../../../../../src/declarations/token1';
import * as deposit0 from '../../../../../src/declarations/deposit0';
import * as deposit1 from '../../../../../src/declarations/deposit1';

const pairMapping = {
  'eth-btc': {
    token0Label: 'ckETH',
    token1Label: 'ckBTC',
    token0Image: ckETH,
    token1Image: ckBTC,
    token0Name: 'Ethereum',
    token1Name: 'Bitcoin',
    token0CanisterId: token1.canisterId,
    token1CanisterId: token0.canisterId,
  },
  'eth-deth': {
    token0Label: 'ckETH',
    token1Label: 'd.ckETH',
    token0Image: ckETH,
    token1Image: dckETH,
    token0Name: 'Ethereum',
    token1Name: 'd.ckETH',
    token0CanisterId: token1.canisterId,
    token1CanisterId: deposit1.canisterId,
  },
  'btc-dbtc': {
    token0Label: 'd.ckBTC',
    token1Label: 'ckBTC',
    token0Image: ckETH,
    token1Image: dckBTC,
    token0Name: 'd.ckBTC',
    token1Name: 'Bitcoin',
    token0CanisterId: token0.canisterId,
    token1CanisterId: deposit0.canisterId,
  },
};

function AddLiquidityPage() {
  const {
    swapActor, principal, identity, getMappingFromPair,
  } = useAuth();
  const { pair } = useParams();
  const navigation = useNavigate();

  const [currentPairMapping, setCurrentPairMapping] = useState(pairMapping);

  const {
    token0Label, token1Label, token0Image, token1Image, token0Name, token1Name,
    token0CanisterId, token1CanisterId,
  } = currentPairMapping[pair];

  const validation = useFormik({
    initialValues: {
      token0: token0CanisterId,
      token1: token1CanisterId,
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
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(validation.values);
  const [amount1Desired, setAmount1Desired] = useState(validation.values.amount1Desired);
  const [amount0Desired, setAmount0Desired] = useState(validation.values.amount0Desired);

  const openTokenModal = () => {
    // setIsTokenModalOpen(true);
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
    navigation('/pool');
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

  const handleGetUserBalances = async () => {
    const token0ActorForSelectedToken = getActor(validation.values.token0, identity);

    const token1ActorForSelectedToken = getActor(validation.values.token1, identity);

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

  useEffect(() => {
    async function fetchMapping() {
      const mapping = await getMappingFromPair(pairMapping);
      setCurrentPairMapping(mapping);
    }

    fetchMapping();
  }, []);

  useEffect(() => {
    if (validation.values.token0 !== token0CanisterId) {
      validation.setFieldValue('token0', token0CanisterId);
    }
    if (validation.values.token1 !== token1CanisterId) {
      validation.setFieldValue('token1', token1CanisterId);
    }
  }, [token0CanisterId, token1CanisterId]);

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
    if (swapActor && principal && validation.values.token0
      && validation.values.token1) {
      handleGetUserBalances();
    }
  }, [swapActor, principal, validation.values.token0, validation.values.token1]);

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
                  {token0Label || 'Select Token 0'}
                </button>

                <button type="button" onClick={() => openTokenModal('1')}>
                  {token1Label || 'Select Token 1'}
                </button>
              </div>
            </div>

            <div className={styles.DepositAmounts}>
              <h2>Deposit Amounts</h2>

              <div>
                <label htmlFor="amount0Desired">
                  {token0Label}
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
                  {token1Label}
                </label>

                <input
                  type="number"
                  id="amount1Desired"
                  name="amount1Desired"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.amount1Desired || 0}
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
                  {token1Label || '--'}
                  {' '}
                  per
                  {' '}
                  {token0Label}
                </span>
              </p>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={(priceMin || 0).toFixed(6)}
                onChange={(e) => setPriceMin(parseFloat(e.target.value))}
              />

              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={(priceMax || 0).toFixed(6)}
                onChange={(e) => setPriceMax(parseFloat(e.target.value))}
              />

              <button type="button" onClick={() => handleSelectFullRange()}>Full Range</button>
            </div>

            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      <SelectTokenModal
        isTokenModalOpen={isTokenModalOpen}
        closeTokenModal={closeTokenModal}
        token0Label={token0Label}
        token1Label={token1Label}
        token0Image={token0Image}
        token1Image={token1Image}
        token0Name={token0Name}
        token1Name={token1Name}
      />

      <AddLiquidityModal
        isAddLiquidityModalOpen={isAddLiquidityModalOpen}
        closeAddLiquidityModal={closeAddLiquidityModal}
        formValues={formValues}
        validation={validation}
        setAmount0Desired={setAmount0Desired}
        setAmount1Desired={setAmount1Desired}
        price={price}
        priceMin={priceMin}
        priceMax={priceMax}
        handleGetUserBalances={handleGetUserBalances}
      />
    </div>
  );
}

export default AddLiquidityPage;
