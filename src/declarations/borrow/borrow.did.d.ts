import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Balance = bigint;
export interface Borrow {
  'borrow' : ActorMethod<[bigint, Principal], string>,
  'deposit' : ActorMethod<[bigint], string>,
  'getDepositId' : ActorMethod<[], [] | [DepositType]>,
  'getDepositIdPerUser' : ActorMethod<[Principal], [] | [DepositType]>,
  'getPairInfo' : ActorMethod<[bigint], Array<bigint>>,
  'getPairInfoPrincipal' : ActorMethod<[bigint], Array<string>>,
  'getTokenBalance' : ActorMethod<[Principal, Principal], Balance>,
  'getTokenDecimals' : ActorMethod<[Principal], number>,
  'rePay' : ActorMethod<[], string>,
  'totalSupply_call' : ActorMethod<[string], bigint>,
  'withdraw' : ActorMethod<[bigint], string>,
}
export interface DepositType {
  'startTime' : Time,
  'isUsing' : boolean,
  'borrow' : bigint,
  'isActive' : boolean,
  'tokenIdBorrow' : Principal,
  'isAllowWithdraw' : boolean,
  'amount' : bigint,
}
export type Time = bigint;
export interface _SERVICE extends Borrow {}
