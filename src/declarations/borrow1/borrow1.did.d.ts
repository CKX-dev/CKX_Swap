import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Balance = bigint;
export type Balance__1 = bigint;
export interface Borrow {
  'borrow' : ActorMethod<[bigint, Principal, bigint], string>,
  'checkRemoveLP' : ActorMethod<[Array<Principal>], Array<bigint>>,
  'checkRemoveLP_2' : ActorMethod<[Principal], Array<number>>,
  'deposit' : ActorMethod<[bigint], string>,
  'getAvaiableToBorrow' : ActorMethod<[bigint], Array<bigint>>,
  'getCurrentTotalBorrowed' : ActorMethod<
    [],
    { 'token0' : bigint, 'token1' : bigint }
  >,
  'getDepositId' : ActorMethod<[], [] | [DepositType]>,
  'getDepositIdPerUser' : ActorMethod<[Principal], [] | [DepositType]>,
  'getHealthRatio' : ActorMethod<[Principal], number>,
  'getLoanDetail' : ActorMethod<[bigint], [] | [LoanDetail]>,
  'getPairInfo' : ActorMethod<[bigint], Array<bigint>>,
  'getPairInfoPrincipal' : ActorMethod<[bigint], Array<string>>,
  'getReserves' : ActorMethod<[], Array<bigint>>,
  'getTokenBalance' : ActorMethod<[Principal, Principal], Balance__1>,
  'getTokenDecimals' : ActorMethod<[Principal], number>,
  'getloanId' : ActorMethod<[], bigint>,
  'rePay' : ActorMethod<[], string>,
  'sendInterestToLendingCanister' : ActorMethod<[], string>,
  'sendTokenToLendingCanister' : ActorMethod<
    [Principal, bigint],
    TransferResult
  >,
  'totalSupply_call' : ActorMethod<[string], bigint>,
  'user' : ActorMethod<[], string>,
  'withdraw' : ActorMethod<[bigint], string>,
  'withdrawTokenFromSwap' : ActorMethod<[Principal, bigint], TxReceipt>,
}
export interface DepositType {
  'startTime' : Time,
  'duration' : bigint,
  'interest' : bigint,
  'isUsing' : boolean,
  'reserve0' : bigint,
  'reserve1' : bigint,
  'loadId' : bigint,
  'borrow' : bigint,
  'isActive' : boolean,
  'tokenIdBorrow' : Principal,
  'isAllowWithdraw' : boolean,
  'amount' : bigint,
}
export interface LoanDetail {
  'id' : bigint,
  'isRepaid' : boolean,
  'borrower' : Principal,
  'tokenIdBorrow' : Principal,
}
export type Time = bigint;
export type Timestamp = bigint;
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
export type TransferResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type TxIndex = bigint;
export type TxReceipt = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE extends Borrow {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
