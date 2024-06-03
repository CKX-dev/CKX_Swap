export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const DepositType = IDL.Record({
    'startTime' : Time,
    'duration' : IDL.Nat,
    'interest' : IDL.Nat,
    'isUsing' : IDL.Bool,
    'reserve0' : IDL.Nat,
    'reserve1' : IDL.Nat,
    'loadId' : IDL.Nat,
    'borrow' : IDL.Nat,
    'isActive' : IDL.Bool,
    'tokenIdBorrow' : IDL.Principal,
    'isAllowWithdraw' : IDL.Bool,
    'amount' : IDL.Nat,
  });
  const LoanDetail = IDL.Record({
    'id' : IDL.Nat,
    'isRepaid' : IDL.Bool,
    'borrower' : IDL.Principal,
    'tokenIdBorrow' : IDL.Principal,
  });
  const Balance__1 = IDL.Nat;
  const TxIndex = IDL.Nat;
  const Balance = IDL.Nat;
  const Timestamp = IDL.Nat64;
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Balance }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Balance }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Balance }),
  });
  const TransferResult = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
  const TxReceipt = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Borrow = IDL.Service({
    'borrow' : IDL.Func([IDL.Nat, IDL.Principal, IDL.Nat], [IDL.Text], []),
    'checkRemoveLP' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Nat)],
        [],
      ),
    'checkRemoveLP_2' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Float64)], []),
    'deposit' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'getAvaiableToBorrow' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], []),
    'getCurrentTotalBorrowed' : IDL.Func(
        [],
        [IDL.Record({ 'token0' : IDL.Nat, 'token1' : IDL.Nat })],
        [],
      ),
    'getDepositId' : IDL.Func([], [IDL.Opt(DepositType)], []),
    'getDepositIdPerUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(DepositType)],
        [],
      ),
    'getHealthRatio' : IDL.Func([IDL.Principal], [IDL.Float64], []),
    'getLoanDetail' : IDL.Func([IDL.Nat], [IDL.Opt(LoanDetail)], []),
    'getPairInfo' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], []),
    'getPairInfoPrincipal' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Text)], []),
    'getReserves' : IDL.Func([], [IDL.Vec(IDL.Nat)], []),
    'getTokenBalance' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [Balance__1],
        [],
      ),
    'getTokenDecimals' : IDL.Func([IDL.Principal], [IDL.Nat8], []),
    'getloanId' : IDL.Func([], [IDL.Nat], []),
    'rePay' : IDL.Func([], [IDL.Text], []),
    'sendInterestToLendingCanister' : IDL.Func([], [IDL.Text], []),
    'sendTokenToLendingCanister' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [TransferResult],
        [],
      ),
    'totalSupply_call' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'user' : IDL.Func([], [IDL.Text], []),
    'withdraw' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'withdrawTokenFromSwap' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
  });
  return Borrow;
};
export const init = ({ IDL }) => {
  return [
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
    IDL.Text,
    IDL.Principal,
    IDL.Principal,
  ];
};
