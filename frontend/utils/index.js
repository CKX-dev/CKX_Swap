import * as swap from '../../src/declarations/swap';
import * as t0 from '../../src/declarations/token0';
import * as t1 from '../../src/declarations/token1';
import * as deposit0 from '../../src/declarations/deposit0';
import * as deposit1 from '../../src/declarations/deposit1';
import * as aggregator from '../../src/declarations/aggregator';
import * as aggregator0 from '../../src/declarations/aggregator0';
import * as aggregator1 from '../../src/declarations/aggregator1';
import * as borrow from '../../src/declarations/borrow';
import * as borrow0 from '../../src/declarations/borrow0';
import * as borrow1 from '../../src/declarations/borrow1';

import ckETH from '../assets/ckETH.png';
import ckBTC from '../assets/ckBTC.png';
import dckETH from '../assets/d.cketh.png';
import dckBTC from '../assets/d.ckBTC.png';

export const calculateAmount0Desired = (
  amount1Desired,
  currPrice,
  priceLower,
  priceHigher,
) => {
  const L = amount1Desired / (Math.sqrt(currPrice) - Math.sqrt(priceLower));
  const amount0Desired = (L * (Math.sqrt(priceHigher) - Math.sqrt(currPrice)))
  / (Math.sqrt(currPrice) * Math.sqrt(priceHigher));

  return amount0Desired.toFixed(6) || 0;
};

export const calculateAmount1Desired = (
  amount0Desired,
  currPrice,
  priceLower,
  priceHigher,
) => {
  const L = (amount0Desired * Math.sqrt(currPrice) * Math.sqrt(priceHigher))
            / (Math.sqrt(priceHigher) - Math.sqrt(currPrice));
  const amount1Desired = L * (Math.sqrt(currPrice) - Math.sqrt(priceLower));

  return amount1Desired.toFixed(6) || 0;
};

export const getPriceFromPair = async (swapActor, token0, token1) => {
  const pairinfo = await swapActor.getPair(
    token0,
    token1,
  );

  const res0 = Number(pairinfo[0].reserve0);
  const rls = (1 * res0) / Number(pairinfo[0].reserve1);

  if (token0.toText() === pairinfo[0].token0) {
    return (parseFloat(1 / rls));
  }

  return parseFloat(rls);
};

export const getTokenFromPair = async (swapActor, token0, token1) => {
  const pairinfo = await swapActor.getPair(
    token0,
    token1,
  );

  const res0 = Number(pairinfo[0].reserve0);
  const rls = (1 * res0) / Number(pairinfo[0].reserve1);

  const res1 = Number(pairinfo[0].reserve1);

  if (token0.toText() === pairinfo[0].token0) {
    return [res0, res1, (parseFloat(1 / rls))];
  }

  return [res1, res0, parseFloat(rls)];
};

export const getAmountOutMin = async (formValues, swapActor, Principal) => {
  const pairinfo = await swapActor.getPair(
    Principal.fromText(formValues.token0),
    Principal.fromText(formValues.token1),
  );

  let reserve0;
  let reserve1;
  if (formValues.token0 === pairinfo[0].token0) {
    reserve0 = Number(pairinfo[0].reserve0);
    reserve1 = Number(pairinfo[0].reserve1);
  } else {
    reserve0 = Number(pairinfo[0].reserve1);
    reserve1 = Number(pairinfo[0].reserve0);
  }
  // console.log(`reserve0: ${reserve0}`, `reserve1: ${reserve1}`);
  const amountInWithFee = formValues.amountIn * 997;
  const numerator = amountInWithFee * reserve1;
  const denominator = reserve0 * 1000 + amountInWithFee;
  const AmountOutMin = numerator / denominator;

  return AmountOutMin;
};

export const getDecimals = async (swapActor, tokenId) => {
  const decimals = await swapActor.decimals(
    tokenId,
  );
  return decimals;
};

export const getActor = (canisterId, identity) => {
  if (canisterId === t0.canisterId) {
    return t0.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === t1.canisterId) {
    return t1.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === deposit0.canisterId) {
    return deposit0.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === deposit1.canisterId) {
    return deposit1.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === aggregator.canisterId) {
    return aggregator.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === aggregator0.canisterId) {
    return aggregator0.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === aggregator1.canisterId) {
    return aggregator1.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === borrow.canisterId) {
    return borrow.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === borrow0.canisterId) {
    return borrow0.createActor(canisterId, { agentOptions: { identity } });
  } if (canisterId === borrow1.canisterId) {
    return borrow1.createActor(canisterId, { agentOptions: { identity } });
  }
  throw new Error('Unknown canisterId');
};

const tokenDetails = {
  [t0.canisterId]: {
    label: 'ckBTC',
    image: ckBTC,
    name: 'Bitcoin',
    canisterId: t0.canisterId,
  },
  [t1.canisterId]: {
    label: 'ckETH',
    image: ckETH,
    name: 'Ethereum',
    canisterId: t1.canisterId,
  },
  [deposit0.canisterId]: {
    label: 'd.ckBTC',
    image: dckBTC,
    name: 'd.ckBTC',
    canisterId: deposit0.canisterId,
  },
  [deposit1.canisterId]: {
    label: 'd.ckETH',
    image: dckETH,
    name: 'd.ckETH',
    canisterId: deposit1.canisterId,
  },
};

export const getMapping = async (identity, pairMapping) => {
  const swapActor = swap.createActor(swap.canisterId, { agentOptions: { identity } });
  const pairs = await swapActor.getAllPairs();

  const updatedPairMapping = { ...pairMapping };

  pairs.forEach((pair) => {
    const { token0, token1, id } = pair;
    const token0Details = tokenDetails[token0];
    const token1Details = tokenDetails[token1];

    if (!token0Details || !token1Details) {
      console.warn(`Token details missing for pair: ${id}`);
      return;
    }

    Object.entries(pairMapping).forEach(([pairKey, existingPair]) => {
      if (
        (existingPair.token0CanisterId === token0Details.canisterId
          && existingPair.token1CanisterId === token1Details.canisterId)
        || (existingPair.token0CanisterId === token1Details.canisterId
          && existingPair.token1CanisterId === token0Details.canisterId)
      ) {
        updatedPairMapping[pairKey] = {
          ...existingPair,
          token0Label: token0Details.label,
          token1Label: token1Details.label,
          token0Image: token0Details.image,
          token1Image: token1Details.image,
          token0Name: token0Details.name,
          token1Name: token1Details.name,
          token0CanisterId: token0Details.canisterId,
          token1CanisterId: token1Details.canisterId,
        };
      }
    });
  });

  return updatedPairMapping;
};
