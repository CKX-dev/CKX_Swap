export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const DepositType = IDL.Record({
    'startTime' : Time,
    'isUsing' : IDL.Bool,
    'borrow' : IDL.Nat,
    'isActive' : IDL.Bool,
    'tokenIdBorrow' : IDL.Principal,
    'isAllowWithdraw' : IDL.Bool,
    'amount' : IDL.Nat,
  });
  const Balance = IDL.Nat;
  const Borrow = IDL.Service({
    'borrow' : IDL.Func([IDL.Nat, IDL.Principal], [IDL.Text], []),
    'deposit' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'getDepositId' : IDL.Func([], [IDL.Opt(DepositType)], []),
    'getDepositIdPerUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(DepositType)],
        [],
      ),
    'getPairInfo' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], []),
    'getPairInfoPrincipal' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Text)], []),
    'getTokenBalance' : IDL.Func([IDL.Principal, IDL.Principal], [Balance], []),
    'getTokenDecimals' : IDL.Func([IDL.Principal], [IDL.Nat8], []),
    'rePay' : IDL.Func([], [IDL.Text], []),
    'totalSupply_call' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'withdraw' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
  return Borrow;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Text, IDL.Principal, IDL.Principal];
};
