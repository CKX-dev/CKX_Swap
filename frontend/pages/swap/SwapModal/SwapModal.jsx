import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { Principal } from '@dfinity/principal';
import { useAuth } from '../../../hooks/use-auth-client';

// import * as swap from '../../../../src/declarations/swap';
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
  const { principal, swapActor } = useAuth();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleToSymbol = async (t0, t1) => {
    const token0 = await swapActor.symbol(t0);
    const token1 = await swapActor.symbol(t1);

    setTokens([token0, token1]);
  };

  const handleSwap = async () => {
    try {
      setLoading(true);

      // const timestamp = Math.floor(new Date().getTime() / 1000) + 600;
      const timestamp = Math.floor(new Date().getTime() * 1000000000) + 600;

      const AmountOutMin = await getAmountOutMin(formValues, swapActor, Principal);

      console.log('Output Amount: ', AmountOutMin);
      console.log('formValues.amountOutMin: ', formValues.amountOutMin);
      const PE = formValues.amountIn * price;
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

      // console.log('CHECK: ', formValues.amountIn, ' ', AmountOutMin, '', minSlippage);
      const res = await swapActor.swapExactTokensForTokens(
        Math.floor(formValues.amountIn),
        // formValues.amountOutMin,
        Math.floor(AmountOutMin - (AmountOutMin * Math.abs(minSlippage))),
        [Principal.fromText(formValues.token0).toString(),
          Principal.fromText(formValues.token1).toString()],
        principal,
        timestamp,
      );

      console.log('token0: ', Principal.fromText(formValues.token0).toString());
      console.log('token1: ', Principal.fromText(formValues.token1).toString());
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
          onClick={handleSwap}
          disabled={loading}
        >
          {loading ? 'Swaping...' : 'Swap'}
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
