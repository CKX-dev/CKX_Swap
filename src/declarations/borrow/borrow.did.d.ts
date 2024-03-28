import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Balance = bigint;
export interface Borrow {
  'borrow' : ActorMethod<[bigint, Principal], string>,
  'checkRemoveLP' : ActorMethod<[Array<Principal>], Array<bigint>>,
  'checkRemoveLP_2' : ActorMethod<[Principal], Array<number>>,
  'deposit' : ActorMethod<[bigint], string>,
  'getDepositId' : ActorMethod<[], [] | [DepositType]>,
  'getDepositIdPerUser' : ActorMethod<[Principal], [] | [DepositType]>,
  'getLoanDetail' : ActorMethod<[bigint], [] | [LoanDetail]>,
  'getPairInfo' : ActorMethod<[bigint], Array<bigint>>,
  'getPairInfoPrincipal' : ActorMethod<[bigint], Array<string>>,
  'getReserves' : ActorMethod<[], Array<bigint>>,
  'getTokenBalance' : ActorMethod<[Principal, Principal], Balance>,
  'getTokenDecimals' : ActorMethod<[Principal], number>,
  'getTotalLoan' : ActorMethod<[], bigint>,
  'rePay' : ActorMethod<[], string>,
  'totalSupply_call' : ActorMethod<[string], bigint>,
  'updateTotalLoan' : ActorMethod<[], undefined>,
  'user' : ActorMethod<[], string>,
  'withdraw' : ActorMethod<[bigint], string>,
}
export interface DepositType {
  'startTime' : Time,
  'isUsing' : boolean,
  'reserve0' : bigint,
  'reserve1' : bigint,
  'borrow' : bigint,
  'isActive' : boolean,
  'tokenIdBorrow' : Principal,
  'isAllowWithdraw' : boolean,
  'amount' : bigint,
}
export interface LoanDetail { 'id' : bigint, 'borrower' : Principal }
export type Time = bigint;
export interface _SERVICE extends Borrow {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
