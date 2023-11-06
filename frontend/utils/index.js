export const calculateAmount0Desired = (
  amount1Desired,
  currPrice,
  priceLower,
  priceHigher,
) => {
  const L = amount1Desired / (Math.sqrt(currPrice) - Math.sqrt(priceLower));
  const amount0Desired = (L * (Math.sqrt(priceHigher) - Math.sqrt(currPrice)))
  / (Math.sqrt(currPrice) * Math.sqrt(priceHigher));

  return Math.round(amount0Desired);
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

  return Math.round(amount1Desired);
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
