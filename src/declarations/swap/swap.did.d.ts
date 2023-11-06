import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CanisterSettings {
  'freezing_threshold' : [] | [bigint],
  'controllers' : [] | [Array<Principal>],
  'memory_allocation' : [] | [bigint],
  'compute_allocation' : [] | [bigint],
}
export interface CanisterStatus {
  'status' : Status,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : CanisterSettings,
  'module_hash' : [] | [Uint8Array | number[]],
}
export interface CapDetails {
  'CapV2RootBucketId' : [] | [string],
  'CapV1Status' : boolean,
  'CapV2Status' : boolean,
  'CapV1RootBucketId' : [] | [string],
}
export interface DepositSubAccounts {
  'depositAId' : string,
  'subaccount' : Uint8Array | number[],
  'created_at' : Time,
  'transactionOwner' : Principal,
}
export type ICRC1SubAccountBalance = { 'ok' : bigint } |
  { 'err' : string };
export type ICRCTxReceipt = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export interface MonitorMetrics {
  'tokenBalancesSize' : bigint,
  'canisterStatus' : CanisterStatus,
  'blocklistedUsersCount' : bigint,
  'rewardTokensSize' : bigint,
  'lptokensSize' : bigint,
  'cycles' : bigint,
  'tokenAllowanceSize' : bigint,
  'rewardInfo' : bigint,
  'lpTokenAllowanceSize' : bigint,
  'rewardPairsSize' : bigint,
  'tokenCount' : bigint,
  'lpTokenBalancesSize' : bigint,
  'pairsCount' : bigint,
  'depositTransactionSize' : bigint,
}
export interface PairInfoExt {
  'id' : string,
  'price0CumulativeLast' : bigint,
  'creator' : Principal,
  'reserve0' : bigint,
  'reserve1' : bigint,
  'lptoken' : string,
  'totalSupply' : bigint,
  'token0' : string,
  'token1' : string,
  'price1CumulativeLast' : bigint,
  'kLast' : bigint,
  'blockTimestampLast' : bigint,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : [bigint, bigint] } |
  { 'err' : string };
export interface RewardInfo { 'tokenId' : string, 'amount' : bigint }
export type Status = { 'stopped' : null } |
  { 'stopping' : null } |
  { 'running' : null };
export interface Swap {
  'addAuth' : ActorMethod<[Principal], boolean>,
  'addLiquidity' : ActorMethod<
    [Principal, Principal, bigint, bigint, bigint, bigint, bigint],
    TxReceipt
  >,
  'addLiquidityForUser' : ActorMethod<
    [Principal, Principal, Principal, bigint, bigint],
    TxReceipt
  >,
  'addLiquidityForUserTest' : ActorMethod<
    [Principal, Principal, Principal, bigint, bigint],
    string
  >,
  'addToken' : ActorMethod<[Principal, string], TxReceipt>,
  'addUserToBlocklist' : ActorMethod<[Principal], boolean>,
  'allowance' : ActorMethod<[string, Principal, Principal], bigint>,
  'approve' : ActorMethod<[string, Principal, bigint], boolean>,
  'balanceOf' : ActorMethod<[string, Principal], bigint>,
  'burn' : ActorMethod<[string, bigint], boolean>,
  'createPair' : ActorMethod<[Principal, Principal], TxReceipt>,
  'decimals' : ActorMethod<[string], number>,
  'deposit' : ActorMethod<[Principal, bigint], TxReceipt>,
  'depositTo' : ActorMethod<[Principal, Principal, bigint], TxReceipt>,
  'exportBalances' : ActorMethod<[string], [] | [Array<[Principal, bigint]>]>,
  'exportFaileWithdraws' : ActorMethod<[], Array<[string, WithdrawState]>>,
  'exportLPTokens' : ActorMethod<[], Array<TokenInfoExt>>,
  'exportPairs' : ActorMethod<[], Array<PairInfoExt>>,
  'exportRewardInfo' : ActorMethod<[], Array<[Principal, Array<RewardInfo>]>>,
  'exportRewardPairs' : ActorMethod<[], Array<PairInfoExt>>,
  'exportSubAccounts' : ActorMethod<[], Array<[Principal, DepositSubAccounts]>>,
  'exportSwapInfo' : ActorMethod<[], SwapInfoExt>,
  'exportTokenTypes' : ActorMethod<[], Array<[string, string]>>,
  'exportTokens' : ActorMethod<[], Array<TokenInfoExt>>,
  'failedWithdrawRefund' : ActorMethod<[string], WithdrawRefundReceipt>,
  'getAllPairs' : ActorMethod<[], Array<PairInfoExt>>,
  'getAllRewardPairs' : ActorMethod<[], Array<PairInfoExt>>,
  'getAuthList' : ActorMethod<[], Array<[Principal, boolean]>>,
  'getBlocklistedUsers' : ActorMethod<[], Array<[Principal, boolean]>>,
  'getCapDetails' : ActorMethod<[], CapDetails>,
  'getHolders' : ActorMethod<[string], bigint>,
  'getICRC1SubAccountBalance' : ActorMethod<
    [Principal, string],
    ICRC1SubAccountBalance
  >,
  'getLPTokenId' : ActorMethod<[Principal, Principal], string>,
  'getLastTransactionOutAmount' : ActorMethod<[], SwapLastTransaction>,
  'getNumPairs' : ActorMethod<[], bigint>,
  'getPair' : ActorMethod<[Principal, Principal], [] | [PairInfoExt]>,
  'getPairs' : ActorMethod<[bigint, bigint], [Array<PairInfoExt>, bigint]>,
  'getSupportedTokenList' : ActorMethod<[], Array<TokenInfoWithType>>,
  'getSupportedTokenListByName' : ActorMethod<
    [string, bigint, bigint],
    [Array<TokenInfoExt>, bigint]
  >,
  'getSupportedTokenListSome' : ActorMethod<
    [bigint, bigint],
    [Array<TokenInfoExt>, bigint]
  >,
  'getSwapInfo' : ActorMethod<[], SwapInfo>,
  'getTokenMetadata' : ActorMethod<[string], TokenAnalyticsInfo>,
  'getUserBalances' : ActorMethod<[Principal], Array<[string, bigint]>>,
  'getUserICRC1SubAccount' : ActorMethod<[Principal], string>,
  'getUserInfo' : ActorMethod<[Principal], UserInfo>,
  'getUserInfoAbove' : ActorMethod<[Principal, bigint, bigint], UserInfo>,
  'getUserInfoByNamePageAbove' : ActorMethod<
    [Principal, bigint, string, bigint, bigint, bigint, string, bigint, bigint],
    UserInfoPage
  >,
  'getUserLPBalances' : ActorMethod<[Principal], Array<[string, bigint]>>,
  'getUserLPBalancesAbove' : ActorMethod<
    [Principal, bigint],
    Array<[string, bigint]>
  >,
  'getUserReward' : ActorMethod<[Principal, string, string], Result_1>,
  'historySize' : ActorMethod<[], bigint>,
  'initiateICRC1Transfer' : ActorMethod<[], Uint8Array | number[]>,
  'initiateICRC1TransferForUser' : ActorMethod<[Principal], ICRCTxReceipt>,
  'monitorMetrics' : ActorMethod<[], MonitorMetrics>,
  'name' : ActorMethod<[string], string>,
  'removeAuth' : ActorMethod<[Principal], boolean>,
  'removeLiquidity' : ActorMethod<
    [Principal, Principal, bigint, bigint, bigint, Principal, bigint],
    TxReceipt
  >,
  'removeUserFromBlocklist' : ActorMethod<[Principal], boolean>,
  'retryDeposit' : ActorMethod<[Principal], TxReceipt>,
  'retryDepositTo' : ActorMethod<[Principal, Principal, bigint], TxReceipt>,
  'setCapV1EnableStatus' : ActorMethod<[boolean], boolean>,
  'setCapV2CanisterId' : ActorMethod<[string], boolean>,
  'setCapV2EnableStatus' : ActorMethod<[boolean], Result>,
  'setFeeForToken' : ActorMethod<[string, bigint], boolean>,
  'setFeeOn' : ActorMethod<[boolean], boolean>,
  'setFeeTo' : ActorMethod<[Principal], boolean>,
  'setGlobalTokenFee' : ActorMethod<[bigint], boolean>,
  'setMaxTokens' : ActorMethod<[bigint], boolean>,
  'setOwner' : ActorMethod<[Principal], boolean>,
  'swapExactTokensForTokens' : ActorMethod<
    [bigint, bigint, Array<string>, Principal, bigint],
    TxReceipt
  >,
  'symbol' : ActorMethod<[string], string>,
  'totalSupply' : ActorMethod<[string], bigint>,
  'transferFrom' : ActorMethod<[string, Principal, Principal, bigint], boolean>,
  'updateAllTokenMetadata' : ActorMethod<[], boolean>,
  'updateTokenFees' : ActorMethod<[], boolean>,
  'updateTokenMetadata' : ActorMethod<[string], boolean>,
  'withdraw' : ActorMethod<[Principal, bigint], TxReceipt>,
}
export interface SwapInfo {
  'owner' : Principal,
  'cycles' : bigint,
  'tokens' : Array<TokenInfoExt>,
  'pairs' : Array<PairInfoExt>,
  'feeOn' : boolean,
  'feeTo' : Principal,
}
export interface SwapInfoExt {
  'owner' : Principal,
  'txcounter' : bigint,
  'depositCounter' : bigint,
  'feeOn' : boolean,
  'feeTo' : Principal,
}
export type SwapLastTransaction = {
    'RemoveLiquidityOutAmount' : [bigint, bigint]
  } |
  { 'SwapOutAmount' : bigint } |
  { 'NotFound' : boolean };
export type Time = bigint;
export interface TokenAnalyticsInfo {
  'fee' : bigint,
  'decimals' : number,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export interface TokenInfoExt {
  'id' : string,
  'fee' : bigint,
  'decimals' : number,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export interface TokenInfoWithType {
  'id' : string,
  'fee' : bigint,
  'decimals' : number,
  'name' : string,
  'totalSupply' : bigint,
  'tokenType' : string,
  'symbol' : string,
}
export type TxReceipt = { 'ok' : bigint } |
  { 'err' : string };
export interface UserInfo {
  'lpBalances' : Array<[string, bigint]>,
  'balances' : Array<[string, bigint]>,
}
export interface UserInfoPage {
  'lpBalances' : [Array<[string, bigint]>, bigint],
  'balances' : [Array<[string, bigint]>, bigint],
}
export type WithdrawRefundReceipt = { 'Ok' : boolean } |
  { 'Err' : string };
export interface WithdrawState {
  'tokenId' : string,
  'refundStatus' : boolean,
  'value' : bigint,
  'userPId' : Principal,
}
export interface _SERVICE extends Swap {}
