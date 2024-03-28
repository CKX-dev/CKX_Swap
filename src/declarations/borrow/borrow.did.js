export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const DepositType = IDL.Record({
    'startTime' : Time,
    'isUsing' : IDL.Bool,
    'reserve0' : IDL.Nat,
    'reserve1' : IDL.Nat,
    'borrow' : IDL.Nat,
    'isActive' : IDL.Bool,
    'tokenIdBorrow' : IDL.Principal,
    'isAllowWithdraw' : IDL.Bool,
    'amount' : IDL.Nat,
  });
  const LoanDetail = IDL.Record({ 'id' : IDL.Nat, 'borrower' : IDL.Principal });
  const Balance = IDL.Nat;
  const Borrow = IDL.Service({
    'borrow' : IDL.Func([IDL.Nat, IDL.Principal], [IDL.Text], []),
    'checkRemoveLP' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Nat)],
        [],
      ),
    'checkRemoveLP_2' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Float64)], []),
    'deposit' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'getDepositId' : IDL.Func([], [IDL.Opt(DepositType)], []),
    'getDepositIdPerUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(DepositType)],
        [],
      ),
    'getLoanDetail' : IDL.Func([IDL.Nat], [IDL.Opt(LoanDetail)], []),
    'getPairInfo' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], []),
    'getPairInfoPrincipal' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Text)], []),
    'getReserves' : IDL.Func([], [IDL.Vec(IDL.Nat)], []),
    'getTokenBalance' : IDL.Func([IDL.Principal, IDL.Principal], [Balance], []),
    'getTokenDecimals' : IDL.Func([IDL.Principal], [IDL.Nat8], []),
    'getTotalLoan' : IDL.Func([], [IDL.Nat], ['query']),
    'rePay' : IDL.Func([], [IDL.Text], []),
    'totalSupply_call' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'updateTotalLoan' : IDL.Func([], [], []),
    'user' : IDL.Func([], [IDL.Text], []),
    'withdraw' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
  return Borrow;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Text, IDL.Principal, IDL.Principal];
};
