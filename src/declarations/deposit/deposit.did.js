export const idlFactory = ({ IDL }) => {
  const TxReceipt = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const TxIndex = IDL.Nat;
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const ApproveResult = IDL.Variant({ 'Ok' : TxIndex, 'Err' : ApproveError });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Balance = IDL.Nat;
  const BurnArgs = IDL.Record({
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
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
  const Time = IDL.Int;
  const DepositType = IDL.Record({
    'id' : IDL.Nat,
    'startTime' : Time,
    'duration' : IDL.Nat,
    'firstMultiplier' : IDL.Float64,
    'isActive' : IDL.Bool,
    'lastUpdateTime' : IDL.Int,
    'amount' : IDL.Nat,
    'lastClaimedTime' : IDL.Int,
  });
  const ICRC1SubAccountBalance = IDL.Variant({
    'ok' : IDL.Nat,
    'err' : IDL.Text,
  });
  const Balance__1 = IDL.Nat;
  const TxIndex__1 = IDL.Nat;
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Burn = IDL.Record({
    'from' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const Mint__1 = IDL.Record({
    'to' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const Transfer = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'from' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const Transaction__1 = IDL.Record({
    'burn' : IDL.Opt(Burn),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint__1),
    'timestamp' : Timestamp,
    'index' : TxIndex,
    'transfer' : IDL.Opt(Transfer),
  });
  const GetTransactionsRequest = IDL.Record({
    'start' : TxIndex,
    'length' : IDL.Nat,
  });
  const Transaction = IDL.Record({
    'burn' : IDL.Opt(Burn),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint__1),
    'timestamp' : Timestamp,
    'index' : TxIndex,
    'transfer' : IDL.Opt(Transfer),
  });
  const GetTransactionsRequest__1 = IDL.Record({
    'start' : TxIndex,
    'length' : IDL.Nat,
  });
  const TransactionRange = IDL.Record({
    'transactions' : IDL.Vec(Transaction),
  });
  const QueryArchiveFn = IDL.Func(
      [GetTransactionsRequest__1],
      [TransactionRange],
      ['query'],
    );
  const ArchivedTransaction = IDL.Record({
    'callback' : QueryArchiveFn,
    'start' : TxIndex,
    'length' : IDL.Nat,
  });
  const GetTransactionsResponse = IDL.Record({
    'first_index' : TxIndex,
    'log_length' : IDL.Nat,
    'transactions' : IDL.Vec(Transaction),
    'archived_transactions' : IDL.Vec(ArchivedTransaction),
  });
  const Account__1 = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const MetaDatum = IDL.Tuple(IDL.Text, Value);
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const AllowanceArgs = IDL.Record({
    'account' : Account,
    'spender' : Account,
  });
  const Allowance = IDL.Record({
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const ApproveArgs = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'expected_allowance' : IDL.Opt(IDL.Nat),
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : IDL.Principal,
  });
  const TransferFromArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : Account,
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : Balance }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Balance }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Balance }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Balance }),
  });
  const TransferFromResult = IDL.Variant({
    'Ok' : TxIndex,
    'Err' : TransferFromError,
  });
  const Mint = IDL.Record({
    'to' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : Balance,
  });
  const Deposit = IDL.Service({
    'addToken' : IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
    'approveToken' : IDL.Func([IDL.Nat], [ApproveResult], []),
    'balanceOf' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
    'burn' : IDL.Func([BurnArgs], [TransferResult], []),
    'deposit' : IDL.Func([IDL.Principal, IDL.Nat, IDL.Nat], [TxReceipt], []),
    'depositReward' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'deposit_cycles' : IDL.Func([], [], []),
    'getCurrentMultiplier' : IDL.Func([DepositType], [IDL.Float64], []),
    'getDepositId' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(DepositType))],
        [],
      ),
    'getICRC1SubAccountBalance' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [ICRC1SubAccountBalance],
        [],
      ),
    'getInterestInfo' : IDL.Func([IDL.Principal], [IDL.Nat], []),
    'getInterestUI' : IDL.Func([IDL.Principal], [IDL.Float64], []),
    'getMultiplier' : IDL.Func(
        [Time, Time, IDL.Float64, IDL.Float64, IDL.Nat],
        [IDL.Float64],
        [],
      ),
    'getPrincipal' : IDL.Func([], [IDL.Principal], []),
    'getTokenBalance' : IDL.Func([IDL.Principal], [Balance__1], []),
    'getTokenDecimals' : IDL.Func([], [IDL.Nat8], []),
    'getTokenId' : IDL.Func([], [IDL.Text], []),
    'getWrapBalance' : IDL.Func([IDL.Principal], [Balance__1], []),
    'get_transaction' : IDL.Func([TxIndex__1], [IDL.Opt(Transaction__1)], []),
    'get_transactions' : IDL.Func(
        [GetTransactionsRequest],
        [GetTransactionsResponse],
        ['query'],
      ),
    'icrc1_balance_of' : IDL.Func([Account__1], [Balance__1], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [Balance__1], ['query']),
    'icrc1_metadata' : IDL.Func([], [IDL.Vec(MetaDatum)], ['query']),
    'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account__1)], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [Balance__1], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'icrc2_allowance' : IDL.Func([AllowanceArgs], [Allowance], ['query']),
    'icrc2_approve' : IDL.Func([ApproveArgs], [ApproveResult], []),
    'icrc2_transfer_from' : IDL.Func(
        [TransferFromArgs],
        [TransferFromResult],
        [],
      ),
    'inc' : IDL.Func([], [IDL.Text], []),
    'mint' : IDL.Func([Mint], [TransferResult], []),
    'privateBurn' : IDL.Func([IDL.Nat], [TransferResult], []),
    'setTokenId' : IDL.Func([IDL.Text], [IDL.Text], []),
    'timeNow' : IDL.Func([], [IDL.Int], []),
    'unWrapToken' : IDL.Func([IDL.Nat], [TransferResult], []),
    'withdrawDepositAndInterestArray' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        [],
      ),
    'withdrawInterestAll' : IDL.Func([], [TransferResult], []),
  });
  return Deposit;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Text, IDL.Text, IDL.Text];
};
