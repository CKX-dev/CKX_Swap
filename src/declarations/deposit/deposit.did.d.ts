import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Account__1 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export interface AllowanceArgs { 'account' : Account, 'spender' : Account }
export interface ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Principal,
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type ApproveResult = { 'Ok' : TxIndex } |
  { 'Err' : ApproveError };
export interface ArchivedTransaction {
  'callback' : QueryArchiveFn,
  'start' : TxIndex,
  'length' : bigint,
}
export type Balance = bigint;
export type Balance__1 = bigint;
export interface Burn {
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface BurnArgs {
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface Deposit {
  'addToken' : ActorMethod<[Principal, string], TxReceipt>,
  'approveToken' : ActorMethod<[bigint], ApproveResult>,
  'balanceOf' : ActorMethod<[string, Principal], bigint>,
  'burn' : ActorMethod<[BurnArgs], TransferResult>,
  'deposit' : ActorMethod<[Principal, bigint, bigint], TxReceipt>,
  'depositReward' : ActorMethod<[Principal, bigint], TxReceipt>,
  'deposit_cycles' : ActorMethod<[], undefined>,
  'getCurrentMultiplier' : ActorMethod<[DepositType], number>,
  'getDepositId' : ActorMethod<[Principal], [] | [Array<DepositType>]>,
  'getICRC1SubAccountBalance' : ActorMethod<
    [Principal, string],
    ICRC1SubAccountBalance
  >,
  'getInterestInfo' : ActorMethod<[Principal], bigint>,
  'getInterestUI' : ActorMethod<[Principal], number>,
  'getMultiplier' : ActorMethod<[Time, Time, number, number, bigint], number>,
  'getPrincipal' : ActorMethod<[], Principal>,
  'getTokenBalance' : ActorMethod<[Principal], Balance__1>,
  'getTokenDecimals' : ActorMethod<[], number>,
  'getTokenId' : ActorMethod<[], string>,
  'getWrapBalance' : ActorMethod<[Principal], Balance__1>,
  'get_transaction' : ActorMethod<[TxIndex__1], [] | [Transaction__1]>,
  'get_transactions' : ActorMethod<
    [GetTransactionsRequest],
    GetTransactionsResponse
  >,
  'icrc1_balance_of' : ActorMethod<[Account__1], Balance__1>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], Balance__1>,
  'icrc1_metadata' : ActorMethod<[], Array<MetaDatum>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account__1]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Balance__1>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'icrc2_allowance' : ActorMethod<[AllowanceArgs], Allowance>,
  'icrc2_approve' : ActorMethod<[ApproveArgs], ApproveResult>,
  'icrc2_transfer_from' : ActorMethod<[TransferFromArgs], TransferFromResult>,
  'inc' : ActorMethod<[], string>,
  'mint' : ActorMethod<[Mint], TransferResult>,
  'privateBurn' : ActorMethod<[bigint], TransferResult>,
  'setTokenId' : ActorMethod<[string], string>,
  'timeNow' : ActorMethod<[], bigint>,
  'unWrapToken' : ActorMethod<[bigint], TransferResult>,
  'withdrawDepositAndInterestArray' : ActorMethod<
    [Array<bigint>],
    Array<bigint>
  >,
  'withdrawInterestAll' : ActorMethod<[], TransferResult>,
}
export interface DepositType {
  'id' : bigint,
  'startTime' : Time,
  'duration' : bigint,
  'firstMultiplier' : number,
  'isActive' : boolean,
  'lastUpdateTime' : bigint,
  'amount' : bigint,
  'lastClaimedTime' : bigint,
}
export interface GetTransactionsRequest { 'start' : TxIndex, 'length' : bigint }
export interface GetTransactionsRequest__1 {
  'start' : TxIndex,
  'length' : bigint,
}
export interface GetTransactionsResponse {
  'first_index' : TxIndex,
  'log_length' : bigint,
  'transactions' : Array<Transaction>,
  'archived_transactions' : Array<ArchivedTransaction>,
}
export type ICRC1SubAccountBalance = { 'ok' : bigint } |
  { 'err' : string };
export type MetaDatum = [string, Value];
export interface Mint {
  'to' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface Mint__1 {
  'to' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export type QueryArchiveFn = ActorMethod<
  [GetTransactionsRequest__1],
  TransactionRange
>;
export type Subaccount = Uint8Array | number[];
export interface SupportedStandard { 'url' : string, 'name' : string }
export type Time = bigint;
export type Timestamp = bigint;
export interface Transaction {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint__1],
  'timestamp' : Timestamp,
  'index' : TxIndex,
  'transfer' : [] | [Transfer],
}
export interface TransactionRange { 'transactions' : Array<Transaction> }
export interface Transaction__1 {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint__1],
  'timestamp' : Timestamp,
  'index' : TxIndex,
  'transfer' : [] | [Transfer],
}
export interface Transfer {
  'to' : Account,
  'fee' : [] | [Balance],
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [Balance],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Balance } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Balance } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Balance } };
export interface TransferFromArgs {
  'to' : Account,
  'fee' : [] | [Balance],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : Account,
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : Balance } } |
  { 'BadBurn' : { 'min_burn_amount' : Balance } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Balance } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Balance } };
export type TransferFromResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferFromError };
export type TransferResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type TxIndex = bigint;
export type TxIndex__1 = bigint;
export type TxReceipt = { 'ok' : bigint } |
  { 'err' : string };
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface _SERVICE extends Deposit {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
