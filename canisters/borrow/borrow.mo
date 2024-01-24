import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Prelude "mo:base/Prelude";
import Buffer "mo:base/Buffer";
import Utils "./utils";
// import Tokens "./tokens";
import ExperimentalCycles "mo:base/ExperimentalCycles";
// import SB "mo:StableBuffer/StableBuffer";
import Cycles = "mo:base/ExperimentalCycles";
import Nat32 "mo:base/Nat32";
import Blob "mo:base/Blob";
// import Hex "./Hex";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Float "mo:base/Float";
// import Account "./Account";
import ICRC1 "./ICRC1";
import Archive "./ICRC1/Canisters/Archive";

shared (msg) actor class Borrow(
    owner_ : Principal,
    aggregator_id : Principal,
    _swap_id : Text,
    token0 : Principal,
    token1 : Principal,
) = this {

    private var swap_id : Text = _swap_id;

    type DepositType = {
        amount : Nat;
        startTime : Time.Time;
        isActive : Bool;
        tokenIdBorrow : Principal;
        borrow : Nat;
        isUsing : Bool;
        isAllowWithdraw : Bool
    };

    public type PairInfoExt = {
        id : Text;
        token0 : Text; //Principal;
        token1 : Text; //Principal;
        creator : Principal;
        reserve0 : Nat;
        reserve1 : Nat;
        price0CumulativeLast : Nat;
        price1CumulativeLast : Nat;
        kLast : Nat;
        blockTimestampLast : Int;
        totalSupply : Nat;
        lptoken : Text
    };

    private var depositInfoLpToken = HashMap.HashMap<Principal, DepositType>(1, Principal.equal, Principal.hash);

    private var fee = 1;

    private func checkBalance(canister : Principal, checkAmount : Nat) : async Bool {
        var lpToken_canister = actor (Principal.toText(canister)) : actor {
            icrc1_balance_of(args : ICRC1.Account) : async ICRC1.Balance
        };
        var defaultSubaccount : Blob = Utils.defaultSubAccount();
        let caller : ICRC1.Account = {
            owner = Principal.fromActor(this);
            subaccount = ?defaultSubaccount
        };
        var balance_caller = await lpToken_canister.icrc1_balance_of(caller);
        if (balance_caller < checkAmount) {
            return false
        } else {
            return true
        }
    };

    public shared (msg) func deposit(
        lpValue : Nat
    ) : async Text {

        var lpToken_canister = actor (Principal.toText(aggregator_id)) : actor {
            icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult
        };
        var defaultSubaccount : Blob = Utils.defaultSubAccount();
        var transferArg : ICRC1.TransferFromArgs = {
            from_subaccount = {
                owner = msg.caller;
                subaccount = ?defaultSubaccount
            };
            created_at_time = null;
            fee = null;
            memo = null;
            to = {
                owner = Principal.fromActor(this);
                subaccount = ?defaultSubaccount
            };
            amount = lpValue
        };
        var tx0 = await lpToken_canister.icrc2_transfer_from(transferArg);

        switch (tx0) {
            case (#Err e) {
                switch (e) {
                    case (#BadFee { expected_fee }) {
                        return "BadFee: Expected fee is " # Nat.toText(expected_fee)
                    };
                    case (#BadBurn { min_burn_amount }) {
                        return "BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                    };
                    case (#InsufficientFunds { balance }) {
                        return "InsufficientFunds: Balance is " # Nat.toText(balance)
                    };
                    case (#InsufficientAllowance { allowance }) {
                        return "InsufficientAllowance: Allowance is " # Nat.toText(allowance)
                    };
                    case (#TooOld) {
                        return "TooOld"
                    };
                    case (#CreatedInFuture { ledger_time }) {
                        return "CreatedInFuture: Ledger time is " # Nat64.toText(ledger_time)
                    };
                    case (#Duplicate { duplicate_of }) {
                        return "Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                    };
                    case (#TemporarilyUnavailable) {
                        return "TemporarilyUnavailable"
                    };
                    case (#GenericError { error_code; message }) {
                        return "GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                    }
                }
            };
            case (#Ok _) {
                // var tx = await lend(borrowValue, msg.caller, tokenId_canister_borrow, lpValue);
                // return tx
                let maybeArray = depositInfoLpToken.get(msg.caller);
                switch (maybeArray) {
                    case (?r) {
                        if (r.isActive == false) {
                            var newDepInform : DepositType = {
                                amount = lpValue;
                                startTime = 0;
                                isActive = true;
                                tokenIdBorrow = r.tokenIdBorrow;
                                borrow = r.borrow;
                                isUsing = false;
                                isAllowWithdraw = r.isAllowWithdraw
                            };
                            depositInfoLpToken.put(msg.caller, newDepInform);
                            return "Update deposit"
                        } else {
                            var newDepInform : DepositType = {
                                amount = r.amount + lpValue;
                                startTime = 0;
                                isActive = true;
                                tokenIdBorrow = r.tokenIdBorrow;
                                borrow = r.borrow;
                                isUsing = false;
                                isAllowWithdraw = r.isAllowWithdraw
                            };
                            depositInfoLpToken.put(msg.caller, newDepInform);
                            return "Update deposit"
                        }
                    };
                    case (_) {
                        var newDepInform : DepositType = {
                            amount = lpValue;
                            startTime = 0;
                            isActive = true;
                            tokenIdBorrow = token0; // so wwrong
                            borrow = 0;
                            isUsing = false;
                            isAllowWithdraw = true
                        };
                        depositInfoLpToken.put(msg.caller, newDepInform);
                        return "Update new deposit"
                    }
                };
                return "Deposit ok"
            }
        };

        return "Update Ok"
    };

    public shared (msg) func borrow(
        borrowValue : Nat,
        tokenId_canister_borrow : Principal,
    ) : async Text {
        let maybeArray = depositInfoLpToken.get(msg.caller);

        switch (maybeArray) {
            case (?r) {
                if (r.isActive == false) {
                    return "Please deposit first"
                };
                if (r.isUsing == true) {
                    return "Repay your last borrow first"
                };
                var lpValue = r.amount;
                var isCheckBalance = await checkBalance(tokenId_canister_borrow, borrowValue);
                if (not isCheckBalance) {
                    return "canister balance is not enough"
                };

                var amountTokens = await getPairInfo(lpValue);
                var principalTokens = await getPairInfoPrincipal(lpValue);
                var amountToken0 = amountTokens[0];
                var amountToken1 = amountTokens[1];
                var principalToken0 = principalTokens[0];
                var principalToken1 = principalTokens[1];

                if (Principal.toText(tokenId_canister_borrow) == principalToken0) {
                    if (borrowValue > amountToken0 * 60 / 100) {
                        return "Exceed 60% of acceptable borrowing"
                    }
                } else if (Principal.toText(tokenId_canister_borrow) == principalToken1) {
                    if (borrowValue > amountToken1 * 60 / 100) {
                        return "Exceed 60% of acceptable borrowing"
                    }
                } else {
                    return "Invalid Token Canister"
                };

                var tx = await lend(borrowValue, msg.caller, tokenId_canister_borrow, lpValue);
                return tx
            };
            case (_) {
                return "You haven't deposit"
            }
        };

        return "ABC"
    };

    public shared (msg) func rePay() : async Text {
        let maybeArray = depositInfoLpToken.get(msg.caller);

        switch (maybeArray) {
            case (?r) {
                if (r.isActive == false) {
                    return "Not found borrow id please deposit"
                };
                var targetInfo = r;

                var borrowValue = targetInfo.borrow;
                var valueShouldPaid = borrowValue + (borrowValue * fee / 100);
                var lpValue = targetInfo.amount;
                var token_canister_to_pay = targetInfo.tokenIdBorrow;

                var repayToken = actor (Principal.toText(token_canister_to_pay)) : actor {
                    icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult
                };
                var defaultSubaccount : Blob = Utils.defaultSubAccount();
                var transferArg : ICRC1.TransferFromArgs = {
                    from_subaccount = {
                        owner = msg.caller;
                        subaccount = ?defaultSubaccount
                    };
                    created_at_time = null;
                    fee = null;
                    memo = null;
                    to = {
                        owner = Principal.fromActor(this);
                        subaccount = ?defaultSubaccount
                    };
                    amount = valueShouldPaid
                };
                var tx0 = await repayToken.icrc2_transfer_from(transferArg);

                switch (tx0) {
                    case (#Err e) {
                        switch (e) {
                            case (#BadFee { expected_fee }) {
                                return "Pay back with interest - BadFee: Expected fee is " # Nat.toText(expected_fee)
                            };
                            case (#BadBurn { min_burn_amount }) {
                                return "Pay back with interest - BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                            };
                            case (#InsufficientFunds { balance }) {
                                return "Pay back with interest - InsufficientFunds: Balance is " # Nat.toText(balance)
                            };
                            case (#InsufficientAllowance { allowance }) {
                                return "Pay back with interest - InsufficientAllowance: Allowance is " # Nat.toText(allowance)
                            };
                            case (#TooOld) {
                                return "Pay back with interest - TooOld"
                            };
                            case (#CreatedInFuture { ledger_time }) {
                                return "Pay back with interest - CreatedInFuture: Ledger time is " # Nat64.toText(ledger_time)
                            };
                            case (#Duplicate { duplicate_of }) {
                                return "Pay back with interest - Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                            };
                            case (#TemporarilyUnavailable) {
                                return "Pay back with interest - TemporarilyUnavailable"
                            };
                            case (#GenericError { error_code; message }) {
                                return "Pay back with interest - GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                            }
                        }
                    };
                    case (#Ok _) {
                        // update record to true for withdraw
                        let maybeArray = depositInfoLpToken.get(msg.caller);
                        switch (maybeArray) {
                            case (?r) {
                                var newDepInform : DepositType = {
                                    amount = r.amount;
                                    startTime = r.startTime;
                                    isActive = true;
                                    tokenIdBorrow = r.tokenIdBorrow;
                                    borrow = r.borrow;
                                    isUsing = false;
                                    isAllowWithdraw = true
                                };
                                depositInfoLpToken.put(msg.caller, newDepInform);
                                return "Ok, you can withdraw your deposit now"
                            };
                            case (_) {
                                var newDepInform : DepositType = {
                                    amount = lpValue;
                                    startTime = Time.now();
                                    isActive = true;
                                    tokenIdBorrow = msg.caller;
                                    borrow = borrowValue;
                                    isUsing = false;
                                    isAllowWithdraw = true
                                };
                                depositInfoLpToken.put(msg.caller, newDepInform);
                                return "Ok you can withdraw your deposit now"
                            }
                        }
                    }
                }
            };
            case (_) {
                return "Not found Id"
            }
        }
    };

    public shared (msg) func withdraw(withdraw_value : Nat) : async Text {
        let maybeArray = depositInfoLpToken.get(msg.caller);

        switch (maybeArray) {
            case (?r) {
                var lpValue = r.amount;
                if (r.isAllowWithdraw == false) {
                    return "Not allow"
                };
                if (r.isActive == false) {
                    return "Not found withdraw Id"
                };
                if (withdraw_value > lpValue) {
                    return "Withdraw exceed your deposit" # Nat.toText(lpValue)
                };
                var lpToken_canister = actor (Principal.toText(aggregator_id)) : actor {
                    icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult
                };
                let tx1 : ICRC1.TransferResult = await lpToken_canister.icrc1_transfer {
                    from_subaccount = null;
                    to = { owner = msg.caller; subaccount = null };
                    amount = withdraw_value;
                    memo = null;
                    fee = null;
                    created_at_time = null
                };

                switch (tx1) {
                    case (#Err e) {
                        switch (e) {
                            case (#BadFee { expected_fee }) {
                                return "Withdraw - BadFee: Expected fee is " # Nat.toText(expected_fee)
                            };
                            case (#BadBurn { min_burn_amount }) {
                                return "Withdraw - BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                            };
                            case (#InsufficientFunds { balance }) {
                                return "Withdraw - InsufficientFunds: Balance is " # Nat.toText(balance)
                            };
                            case (#InsufficientAllowance { allowance }) {
                                return "Withdraw - InsufficientAllowance: Allowance is " # Nat.toText(allowance)
                            };
                            case (#TooOld) {
                                return "Withdraw - TooOld"
                            };
                            case (#CreatedInFuture { ledger_time }) {
                                return "Withdraw - CreatedInFuture: Ledger time is " # Nat64.toText(ledger_time)
                            };
                            case (#Duplicate { duplicate_of }) {
                                return "Withdraw - Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                            };
                            case (#TemporarilyUnavailable) {
                                return "Withdraw - TemporarilyUnavailable"
                            };
                            case (#GenericError { error_code; message }) {
                                return "Withdraw - GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                            }
                        }
                    };
                    case (#Ok _) {
                        let maybeArray = depositInfoLpToken.get(msg.caller);
                        switch (maybeArray) {
                            case (?r) {
                                if (withdraw_value < lpValue) {
                                    var newDepInform : DepositType = {
                                        amount = r.amount - withdraw_value;
                                        startTime = r.startTime;
                                        isActive = true;
                                        tokenIdBorrow = r.tokenIdBorrow;
                                        borrow = r.borrow;
                                        isUsing = r.isUsing;
                                        isAllowWithdraw = true
                                    };
                                    depositInfoLpToken.put(msg.caller, newDepInform)
                                } else {
                                    var newDepInform : DepositType = {
                                        amount = 0;
                                        startTime = r.startTime;
                                        isActive = false;
                                        tokenIdBorrow = r.tokenIdBorrow;
                                        borrow = r.borrow;
                                        isUsing = r.isUsing;
                                        isAllowWithdraw = false
                                    };
                                    depositInfoLpToken.put(msg.caller, newDepInform)
                                };
                                return "Withdraw Success"
                            };
                            case (_) {
                                var newDepInform : DepositType = {
                                    amount = 0;
                                    startTime = 0;
                                    isActive = false;
                                    tokenIdBorrow = msg.caller;
                                    borrow = 0;
                                    isUsing = false;
                                    isAllowWithdraw = false
                                };
                                depositInfoLpToken.put(msg.caller, newDepInform);
                                return "Withdraw Successful"
                            }
                        }
                    }
                }
            };
            case (_) {
                return "Not found Id"
            }
        }
    };

    private func lend(borrowValue : Nat, user : Principal, tokenId : Principal, lpValue : Nat) : async Text {
        var borrowToken_id = actor (Principal.toText(tokenId)) : actor {
            icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult
        };
        var defaultSubaccount : Blob = Utils.defaultSubAccount();

        let tx0 : ICRC1.TransferResult = await borrowToken_id.icrc1_transfer {
            from_subaccount = null;
            to = { owner = user; subaccount = null };
            amount = borrowValue;
            memo = null;
            fee = null;
            created_at_time = null
        };

        switch (tx0) {
            case (#Err e) {
                switch (e) {
                    case (#BadFee { expected_fee }) {
                        return "Lend - BadFee: Expected fee is " # Nat.toText(expected_fee)
                    };
                    case (#BadBurn { min_burn_amount }) {
                        return "Lend - BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                    };
                    case (#InsufficientFunds { balance }) {
                        return "Lend - InsufficientFunds: Balance is " # Nat.toText(balance)
                    };
                    case (#InsufficientAllowance { allowance }) {
                        return "Lend - InsufficientAllowance: Allowance is " # Nat.toText(allowance)
                    };
                    case (#TooOld) {
                        return "Lend - TooOld"
                    };
                    case (#CreatedInFuture { ledger_time }) {
                        return "Lend - CreatedInFuture: Ledger time is " # Nat64.toText(ledger_time)
                    };
                    case (#Duplicate { duplicate_of }) {
                        return "Lend - Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                    };
                    case (#TemporarilyUnavailable) {
                        return "Lend - TemporarilyUnavailable"
                    };
                    case (#GenericError { error_code; message }) {
                        return "Lend - GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                    }
                }
            };
            case (#Ok _) {
                let maybeArray = depositInfoLpToken.get(user);
                switch (maybeArray) {
                    case (?r) {
                        var newDepInform : DepositType = {
                            amount = r.amount;
                            startTime = Time.now();
                            isActive = true;
                            tokenIdBorrow = tokenId;
                            borrow = borrowValue;
                            isUsing = true;
                            isAllowWithdraw = false
                        };
                        depositInfoLpToken.put(user, newDepInform);
                        return "Success"
                    };
                    case (_) {
                        var newDepInform : DepositType = {
                            amount = lpValue;
                            startTime = Time.now();
                            isActive = true;
                            tokenIdBorrow = tokenId;
                            borrow = borrowValue;
                            isUsing = true;
                            isAllowWithdraw = false
                        };
                        depositInfoLpToken.put(user, newDepInform);
                        return "Successful"
                    }
                }
            }
        }
    };

    public func getPairInfo(lpAmount : Nat) : async [Nat] {
        let tid0 : Text = Principal.toText(token0);
        let tid1 : Text = Principal.toText(token1);

        var pairId = _getlpTokenId(Principal.toText(token0), Principal.toText(token1));
        var totalSupply_ = await totalSupply_call(pairId);

        var canister_call = actor (swap_id) : actor {
            getPair(token0 : Principal, token1 : Principal) : async ?PairInfoExt
        };

        var pre_pair = await canister_call.getPair(token0, token1);
        var pair = switch (pre_pair) {
            case (?p) { p };
            case (_) {
                return [0, 0]
            }
        };

        // var totalSupply = pair.totalSupply + feeLP;
        var totalSupply = pair.totalSupply;
        var amount0 : Nat = lpAmount * pair.reserve0 / totalSupply;
        var amount1 : Nat = lpAmount * pair.reserve1 / totalSupply;
        // var amount0M = 0;
        // var amount1M = 0;

        Debug.print(debug_show ((amount0, amount1)));
        if (amount0 == 0 or amount1 == 0) return [0, 0];

        // make sure that amount0 <-> pair.token0
        // if (tid0 == pair.token0) {
        //     amount0M := amount0Min;
        //     amount1M := amount1Min
        // } else {
        //     amount0M := amount1Min;
        //     amount1M := amount0Min
        // };

        // if (amount0 < amount0M or amount1 < amount1M) return [0,0];

        return [amount0, amount1]
    };

    public func getPairInfoPrincipal(lpAmount : Nat) : async [Text] {
        let tid0 : Text = Principal.toText(token0);
        let tid1 : Text = Principal.toText(token1);

        var pairId = _getlpTokenId(Principal.toText(token0), Principal.toText(token1));
        var totalSupply_ = await totalSupply_call(pairId);

        var canister_call = actor (swap_id) : actor {
            getPair(token0 : Principal, token1 : Principal) : async ?PairInfoExt
        };

        var pre_pair = await canister_call.getPair(token0, token1);
        var pair = switch (pre_pair) {
            case (?p) { p };
            case (_) {
                return []
            }
        };

        // var totalSupply = pair.totalSupply + feeLP;
        var totalSupply = pair.totalSupply;
        var amount0 : Nat = lpAmount * pair.reserve0 / totalSupply;
        var amount1 : Nat = lpAmount * pair.reserve1 / totalSupply;
        // var amount0M = 0;
        // var amount1M = 0;

        Debug.print(debug_show ((amount0, amount1)));
        if (amount0 == 0 or amount1 == 0) return [];

        return [pair.token0, pair.token1]
    };

    private func _getlpTokenId(token0 : Text, token1 : Text) : Text {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        let pair_str = t0 # ":" # t1;
        return pair_str
    };

    public func totalSupply_call(tokenId : Text) : async Nat {
        var canister_call = actor (swap_id) : actor {
            totalSupply(tokenId : Text) : async Nat
        };
        let get_pair_totalSupply : Nat = await canister_call.totalSupply(tokenId : Text);
        return get_pair_totalSupply
    };

    public shared (msg) func getDepositId() : async ?DepositType {
        return depositInfoLpToken.get(msg.caller)
    };

    public func getDepositIdPerUser(user : Principal) : async ?DepositType {
        return depositInfoLpToken.get(user)
    };

    public func getTokenBalance(tokenId : Principal, user : Principal) : async ICRC1.Balance {
        var token_canister = actor (Principal.toText(tokenId)) : actor {
            icrc1_balance_of(args : ICRC1.Account) : async ICRC1.Balance
        };
        let account : ICRC1.Account = {
            owner = user;
            subaccount = null
        };
        var balance = await token_canister.icrc1_balance_of(account);
        return balance
    };

    public func getTokenDecimals(tokenId : Principal) : async Nat8 {
        var token_canister = actor (Principal.toText(tokenId)) : actor {
            icrc1_decimals() : async Nat8
        };

        var decimals = await token_canister.icrc1_decimals();
        return decimals
    }
}
