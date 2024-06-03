import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Principal } from '@dfinity/principal';

import styles from './index.module.css';
import { useAuth } from '../../hooks/use-auth-client';
import SelectTokenModal from './SelectTokenModal/SelectTokenModal';
import SwapModal from './SwapModal/SwapModal';
import { getActor, getTokenFromPair } from '../../utils';
import SettingModal from './SettingModal/SettingModal';

import ckBTC from '../../assets/ckBTC.png';
import ckETH from '../../assets/ckETH.png';
import dckBTC from '../../assets/d.ckBTC.png';
import dckETH from '../../assets/d.cketh.png';

function SwapPage() {
  const validation = useFormik({
    initialValues: {
      token0: '',
      token1: '',
      amountIn: 0,
      amountOutMin: 0,
    },

    validationSchema: Yup.object().shape({
      token0: Yup.string().required('Token0 is required'),
      token1: Yup.string().required('Token1 is required'),
      amountIn: Yup.string().required('amountIn is required'),
      amountOutMin: Yup.string().required('amountOutMin is required'),
    }),

    onSubmit: (values) => {
      setFormValues(values);

      openSwapModal();
    },
  });
  const { swapActor, principal, identity } = useAuth();

  const [slippage, setSlippage] = useState('');
  const [price, setPrice] = useState();
  // const [amountIn, setAmountIn] = useState(validation.values.amountIn);
  const [amountOutMin, setAmountOutMin] = useState(validation.values.amountOutMin);
  const [selectedToken0Name, setSelectedToken0Name] = useState('');
  const [selectedToken1Name, setSelectedToken1Name] = useState('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedTokenIdentifier, setSelectedTokenIdentifier] = useState('');
  const [userBalanceToken0, setUserBalanceToken0] = useState([]);
  const [userBalanceToken1, setUserBalanceToken1] = useState([]);
  const [formValues, setFormValues] = useState(validation.values);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [bothTokensSelected, setBothTokensSelected] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [quickInputAmountIn, setQuickInputAmountIn] = useState();
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const openTokenModal = (token) => {
    setSelectedTokenIdentifier(token);
    setIsTokenModalOpen(true);
  };

  const closeTokenModal = () => {
    setIsTokenModalOpen(false);
  };

  const handleToken0Change = (o) => {
    setSelectedToken0Name(o.symbol);
    validation.setFieldValue('token0', o.id);

    if (o.symbol === selectedToken1Name) {
      setSelectedToken0Name(o.symbol);
      setSelectedToken1Name('');
      validation.setFieldValue('token0', o.id);
      setBothTokensSelected(false);
      validation.setFieldValue('amountIn', 0);
      validation.setFieldValue('amountOutMin', 0);
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
      validation.setFieldValue('amountIn', 0);
      validation.setFieldValue('amountOutMin', 0);
    } else {
      setBothTokensSelected(!!selectedToken0Name);
    }
  };

  const openSwapModal = () => {
    setIsSwapModalOpen(true);
  };

  const closeSwapModal = () => {
    setIsSwapModalOpen(false);
  };

  const openSettingModal = () => {
    setIsSettingModalOpen(true);
  };

  const closeSettingModal = () => {
    setIsSettingModalOpen(false);
  };

  const handleSlippageChange = (value) => () => {
    setSlippage(value);
  };

  useEffect(() => {
    const handleGetUserBalanceToken0 = async () => {
      const token0ActorForSelectedToken = getActor(validation.values.token0, identity);

      const token0Balance = await token0ActorForSelectedToken.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });

      setUserBalanceToken0(token0Balance);
    };

    const handleGetUserBalanceToken1 = async () => {
      const token1ActorForSelectedToken = getActor(validation.values.token1, identity);

      const token1Balance = await token1ActorForSelectedToken.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });

      setUserBalanceToken1(token1Balance);
    };

    if (swapActor && principal && validation.values.token0) {
      handleGetUserBalanceToken0();
    }
    if (swapActor && principal && validation.values.token1) {
      handleGetUserBalanceToken1();
    }
  }, [swapActor, principal, validation.values.token0, validation.values.token1]);

  useEffect(() => {
    if (
      !Number.isNaN(validation.values.amountIn)
      && !Number.isNaN(price) && validation.values.token0 && validation.values.token1
    ) {
      const amountInWithFee = validation.values.amountIn * 997;
      const numerator = amountInWithFee * reserve1;
      const denominator = reserve0 * 1000 + amountInWithFee;
      const newAmountOutMin = (numerator / denominator).toFixed(3);

      // console.log('CHECK : ', newAmountOutMin, amountOutMin);

      if ((Number(newAmountOutMin) === 0)
      && (newAmountOutMin !== amountOutMin)) {
        setAmountOutMin(0);
        validation.setFieldValue('amountOutMin', 0);
      } else if (Number(newAmountOutMin) !== amountOutMin) {
        setAmountOutMin(Number(newAmountOutMin));
        validation.setFieldValue('amountOutMin', Number(newAmountOutMin));
      }
    }
  }, [validation.values.amountIn, price]);

  useEffect(() => {
    const handleGetPriceFromPair = async () => {
      if (validation.values.token0 && validation.values.token1
        && (validation.values.token0 !== validation.values.token1)) {
        const res = await getTokenFromPair(
          swapActor,
          Principal.fromText(validation.values.token0),
          Principal.fromText(validation.values.token1),
        );

        setPrice(res[2]);
        setReserve0(res[0]);
        setReserve1(res[1]);
      } else {
        setPrice(null);
      }
    };

    if (swapActor) {
      handleGetPriceFromPair();
    }
  }, [validation.values.token0, validation.values.token1]);

  const clearAll = () => {
    validation.resetForm();
    setAmountOutMin('');
    setSelectedToken0Name('');
    setSelectedToken1Name('');
    validation.setFieldValue('token1', '');
    validation.setFieldValue('token0', '');
    setQuickInputAmountIn(0);
    setUserBalanceToken0(0);
    setUserBalanceToken1(0);
  };

  const handleSwapPlaceToken = () => {
    if (selectedToken0Name && selectedToken1Name
      && validation.values.token0 && validation.values.token1) {
      const tempName = selectedToken0Name;
      const tempTokenId = validation.values.token0;
      validation.setFieldValue('amountIn', 0);
      setSelectedToken0Name(selectedToken1Name);
      setSelectedToken1Name(tempName);
      validation.setFieldValue('token0', validation.values.token1);
      validation.setFieldValue('token1', tempTokenId);
      setQuickInputAmountIn(0);
    }
  };

  const changeAmountIn = (percentage) => {
    if (userBalanceToken0) {
      const newAmountIn = (percentage * (Number(userBalanceToken0) / 10 ** 18)) / 100;
      validation.setFieldValue('amountIn', Math.floor(newAmountIn));
      setQuickInputAmountIn(percentage);
    }
    if (percentage === quickInputAmountIn) {
      setQuickInputAmountIn(0);
    }
  };

  return (
    <div>
      <div className={styles.PageContainer}>
        <div className={styles.SwapContainer}>
          <div className={styles.CardContainer}>
            <div className={styles.HeaderContainer}>
              <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 1.5H5.5C3.29086 1.5 1.5 3.29086 1.5 5.5V12.5C1.5 14.7091 3.29086 16.5 5.5 16.5H12.5C14.7091 16.5 16.5 14.7091 16.5 12.5V5.5C16.5 3.29086 14.7091 1.5 12.5 1.5Z" stroke="#2A2B37" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 7.5L7.5 6V12" stroke="#2A2B37" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 10.5L10.5 12L10.5 6" stroke="#2A2B37" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ display: 'flex', marginTop: '-10px', position: 'relative' }}>
                <svg onClick={clearAll} style={{ cursor: 'pointer' }} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3313 3 18.2398 4.80989 19.796 7.5M19.796 7.5V3M19.796 7.5H15.375" stroke="#858697" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg onClick={openSettingModal} style={{ marginLeft: '10px', cursor: 'pointer' }} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.7439 15.7206L20.1043 15.3289V15.3289L20.7439 15.7206ZM19.7893 17.2794L20.429 17.6711V17.6711L19.7893 17.2794ZM3.25608 8.27942L2.61646 7.88775H2.61646L3.25608 8.27942ZM4.21062 6.72057L4.85023 7.11223L4.21062 6.72057ZM6.8185 6.06172L7.17708 5.403L7.17708 5.403L6.8185 6.06172ZM3.95485 10.7383L3.59627 11.397H3.59627L3.95485 10.7383ZM17.1815 17.9383L16.8229 18.597L16.8229 18.597L17.1815 17.9383ZM20.0451 13.2617L19.6865 13.9204V13.9205L20.0451 13.2617ZM4.21062 17.2794L3.57101 17.6711L3.57101 17.6711L4.21062 17.2794ZM3.25607 15.7206L3.89568 15.3289L3.89568 15.3289L3.25607 15.7206ZM19.7893 6.72058L20.429 6.32892V6.32892L19.7893 6.72058ZM20.7439 8.27943L20.1043 8.67109V8.67109L20.7439 8.27943ZM20.0451 10.7383L20.4037 11.397L20.0451 10.7383ZM17.1815 6.06174L17.5401 6.72046V6.72046L17.1815 6.06174ZM3.95485 13.2617L4.31343 13.9205H4.31343L3.95485 13.2617ZM6.8185 17.9383L6.45992 17.2795L6.45992 17.2795L6.8185 17.9383ZM17.08 6.11698L16.7214 5.45825L17.08 6.11698ZM6.91999 6.11697L6.5614 6.77569L6.5614 6.77569L6.91999 6.11697ZM17.08 17.883L17.4386 17.2243L17.4386 17.2243L17.08 17.883ZM6.91998 17.883L7.27856 18.5418L7.27857 18.5418L6.91998 17.883ZM11.0454 3.75H12.9545V2.25H11.0454V3.75ZM12.9545 20.25H11.0454V21.75H12.9545V20.25ZM11.0454 20.25C10.3631 20.25 9.88634 19.7389 9.88634 19.2H8.38634C8.38634 20.6493 9.61905 21.75 11.0454 21.75V20.25ZM14.1136 19.2C14.1136 19.7389 13.6369 20.25 12.9545 20.25V21.75C14.3809 21.75 15.6136 20.6493 15.6136 19.2H14.1136ZM12.9545 3.75C13.6369 3.75 14.1136 4.26107 14.1136 4.8H15.6136C15.6136 3.35071 14.3809 2.25 12.9545 2.25V3.75ZM11.0454 2.25C9.61905 2.25 8.38634 3.35071 8.38634 4.8H9.88634C9.88634 4.26107 10.3631 3.75 11.0454 3.75V2.25ZM20.1043 15.3289L19.1497 16.8878L20.429 17.6711L21.3835 16.1122L20.1043 15.3289ZM3.89569 8.67108L4.85023 7.11223L3.57101 6.32891L2.61646 7.88775L3.89569 8.67108ZM4.85023 7.11223C5.15887 6.6082 5.88053 6.40506 6.45992 6.72045L7.17708 5.403C5.93025 4.72428 4.31674 5.11109 3.57101 6.32891L4.85023 7.11223ZM4.31344 10.0795C3.75745 9.77688 3.60428 9.14696 3.89569 8.67108L2.61646 7.88775C1.8535 9.13373 2.32605 10.7055 3.59627 11.397L4.31344 10.0795ZM19.1497 16.8878C18.8411 17.3918 18.1194 17.5949 17.5401 17.2795L16.8229 18.597C18.0697 19.2757 19.6832 18.8889 20.429 17.6711L19.1497 16.8878ZM21.3835 16.1122C22.1465 14.8663 21.6739 13.2945 20.4037 12.603L19.6865 13.9205C20.2425 14.2231 20.3957 14.853 20.1043 15.3289L21.3835 16.1122ZM4.85023 16.8878L3.89568 15.3289L2.61646 16.1122L3.57101 17.6711L4.85023 16.8878ZM19.1497 7.11225L20.1043 8.67109L21.3835 7.88777L20.429 6.32892L19.1497 7.11225ZM20.1043 8.67109C20.3957 9.14697 20.2425 9.77689 19.6865 10.0795L20.4037 11.397C21.6739 10.7055 22.1465 9.13374 21.3835 7.88777L20.1043 8.67109ZM17.5401 6.72046C18.1194 6.40507 18.8411 6.60822 19.1497 7.11225L20.429 6.32892C19.6832 5.1111 18.0697 4.72429 16.8229 5.40301L17.5401 6.72046ZM3.89568 15.3289C3.60428 14.853 3.75745 14.2231 4.31343 13.9205L3.59627 12.603C2.32604 13.2945 1.8535 14.8663 2.61646 16.1122L3.89568 15.3289ZM3.57101 17.6711C4.31674 18.8889 5.93025 19.2757 7.17708 18.597L6.45992 17.2795C5.88053 17.5949 5.15887 17.3918 4.85023 16.8878L3.57101 17.6711ZM17.4386 6.7757L17.5401 6.72046L16.8229 5.40301L16.7214 5.45825L17.4386 6.7757ZM6.45992 6.72045L6.5614 6.77569L7.27857 5.45824L7.17708 5.403L6.45992 6.72045ZM17.5401 17.2795L17.4386 17.2243L16.7214 18.5417L16.8229 18.597L17.5401 17.2795ZM6.56141 17.2243L6.45992 17.2795L7.17708 18.597L7.27856 18.5418L6.56141 17.2243ZM3.59627 11.397C4.07402 11.6571 4.07402 12.3429 3.59627 12.603L4.31343 13.9205C5.83497 13.0922 5.83497 10.9078 4.31344 10.0795L3.59627 11.397ZM7.27857 18.5418C7.77797 18.2699 8.38634 18.6314 8.38634 19.2H9.88634C9.88634 17.4934 8.06033 16.4084 6.5614 17.2243L7.27857 18.5418ZM15.6136 19.2C15.6136 18.6314 16.222 18.2699 16.7214 18.5417L17.4386 17.2243C15.9396 16.4083 14.1136 17.4934 14.1136 19.2H15.6136ZM20.4037 12.603C19.926 12.3429 19.926 11.6571 20.4037 11.397L19.6865 10.0795C18.165 10.9078 18.165 13.0922 19.6865 13.9204L20.4037 12.603ZM6.5614 6.77569C8.06033 7.59165 9.88634 6.50663 9.88634 4.8H8.38634C8.38634 5.3686 7.77797 5.7301 7.27857 5.45824L6.5614 6.77569ZM16.7214 5.45825C16.222 5.73011 15.6136 5.36861 15.6136 4.8H14.1136C14.1136 6.50663 15.9396 7.59166 17.4386 6.7757L16.7214 5.45825ZM14.25 12C14.25 13.2426 13.2426 14.25 12 14.25V15.75C14.0711 15.75 15.75 14.0711 15.75 12H14.25ZM12 14.25C10.7574 14.25 9.74999 13.2426 9.74999 12H8.24999C8.24999 14.0711 9.92893 15.75 12 15.75V14.25ZM9.74999 12C9.74999 10.7574 10.7574 9.75 12 9.75V8.25C9.92893 8.25 8.24999 9.92893 8.24999 12H9.74999ZM12 9.75C13.2426 9.75 14.25 10.7574 14.25 12H15.75C15.75 9.92893 14.0711 8.25 12 8.25V9.75Z" fill="#858697" />
                </svg>
                {/* <div className={`${styles.Dropdown} ${showDropdown ? styles.Show : ''}`}>
                  <p>Slippage: </p>
                  <div style={{ display: 'flex' }}>
                    <input type="text" name="" id="" inputMode="numeric" placeholder="Auto"
                    value={slippage} onChange={(e) => setSlippage(e.target.value)} />
                    <div style={{ alignSelf: 'center', marginLeft: '4px' }}>%</div>
                  </div>
                </div> */}
              </div>
            </div>
            <form onSubmit={validation.handleSubmit}>
              <div className={styles.TokenContainer}>
                <div className={styles.TokenContainerSelector}>
                  <input
                    type="number"
                    inputMode="decimal"
                    name="amountIn"
                    id="amountIn"
                    placeholder="0"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.amountIn}
                    disabled={!bothTokensSelected}
                  />
                  <button type="button" onClick={() => openTokenModal('0')}>
                    <div style={{ display: 'flex' }}>
                      {selectedToken0Name && selectedToken0Name === 'ckBTC' && <img alt="logo" src={ckBTC} />}
                      {selectedToken0Name && selectedToken0Name === 'ckETH' && <img alt="logo" src={ckETH} />}
                      {selectedToken0Name && selectedToken0Name === 'd.ckETH' && <img alt="logo" src={dckETH} />}
                      {selectedToken0Name && selectedToken0Name === 'd.ckBTC' && <img alt="logo" src={dckBTC} />}
                      <p>{selectedToken0Name || 'Select Token'}</p>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                    </svg>
                  </button>
                </div>
                <p>
                  Balance:
                  {' '}
                  {userBalanceToken0
                    ? Math.round((Number(userBalanceToken0) / 10 ** 18) * 1000) / 1000 : 0}
                </p>
                <div className={styles.quickInputButton}>
                  <button onClick={() => changeAmountIn(20)} style={{ backgroundColor: quickInputAmountIn === 20 ? 'rgba(126, 135, 255, 1)' : 'rgba(24, 25, 33, 1)' }} type="button">20%</button>
                  <button onClick={() => changeAmountIn(50)} style={{ backgroundColor: quickInputAmountIn === 50 ? 'rgba(126, 135, 255, 1)' : 'rgba(24, 25, 33, 1)' }} type="button">50%</button>
                  <button onClick={() => changeAmountIn(75)} style={{ backgroundColor: quickInputAmountIn === 75 ? 'rgba(126, 135, 255, 1)' : 'rgba(24, 25, 33, 1)' }} type="button">75%</button>
                  <button onClick={() => changeAmountIn(100)} style={{ backgroundColor: quickInputAmountIn === 100 ? 'rgba(126, 135, 255, 1)' : 'rgba(24, 25, 33, 1)' }} type="button">100%</button>
                </div>
              </div>
              <svg style={{ margin: '12px auto', cursor: 'pointer' }} onClick={handleSwapPlaceToken} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#ACB3F9" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.4697 16.5303C11.7626 16.8232 12.2374 16.8232 12.5303 16.5303L15.5303 13.5303C15.8232 13.2374 15.8232 12.7626 15.5303 12.4697C15.2374 12.1768 14.7626 12.1768 14.4697 12.4697L12.75 14.1893V8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8V14.1893L9.53033 12.4697C9.23744 12.1768 8.76256 12.1768 8.46967 12.4697C8.17678 12.7626 8.17678 13.2374 8.46967 13.5303L11.4697 16.5303Z" fill="#ACB3F9" />
              </svg>
              <div className={styles.TokenContainer}>
                <div className={styles.TokenContainerSelector}>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="amountOutMin"
                    id="amountOutMin"
                    placeholder="0.0"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.amountOutMin}
                    disabled
                  />
                  <button type="button" onClick={() => openTokenModal('1')}>
                    <div style={{ display: 'flex' }}>
                      {selectedToken1Name && selectedToken1Name === 'ckBTC' && <img alt="logo" src={ckBTC} />}
                      {selectedToken1Name && selectedToken1Name === 'ckETH' && <img alt="logo" src={ckETH} />}
                      {selectedToken1Name && selectedToken1Name === 'd.ckETH' && <img alt="logo" src={dckETH} />}
                      {selectedToken1Name && selectedToken1Name === 'd.ckBTC' && <img alt="logo" src={dckBTC} />}
                      <p>{selectedToken1Name || 'Select Token'}</p>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#858697" />
                    </svg>
                  </button>
                </div>
                <p>
                  Balance:
                  {' '}
                  {userBalanceToken1
                    ? Math.round((Number(userBalanceToken1) / 10 ** 18) * 1000) / 1000 : 0}
                </p>
              </div>
              {(principal && selectedToken0Name && selectedToken1Name
              && validation.values.amountIn && validation.values.amountOutMin
              ) ? (
                <button className={styles.SwapButton} type="submit">Swap</button>)
                : <button className={styles.SwapButtonDisable} disabled type="button">Enter an amount</button>}
            </form>
          </div>
        </div>

        <SelectTokenModal
          isTokenModalOpen={isTokenModalOpen}
          closeTokenModal={closeTokenModal}
          handleToken0Change={handleToken0Change}
          handleToken1Change={handleToken1Change}
          selectedTokenIdentifier={selectedTokenIdentifier}
          selectedToken0Name={validation.values.token0}
          selectedToken1Name={validation.values.token1}
        />

        <SwapModal
          isSwapModalOpen={isSwapModalOpen}
          closeSwapModal={closeSwapModal}
          formValues={formValues}
          price={price}
          slippage={slippage / 100}
          clearAll={clearAll}
        />

        <SettingModal
          isSettingModalOpen={isSettingModalOpen}
          closeSettingModal={closeSettingModal}
          slippage={slippage}
          handleSlippageChange={handleSlippageChange}
        />
      </div>
    </div>
  );
}
export default SwapPage;
