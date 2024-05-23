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
// import ICRCtoken "../ICRC1/Canisters/Token";

import Account "./Account";

import ICRC1 "./ICRC1";
// import Archive "./ICRC1/Canisters/Archive";

shared (msg) actor class Aggregator(
    owner_ : Principal,
    aggregator_id : Principal,
    _swap_id : Text,
) = this {
    public type TxReceipt = Result.Result<Nat, Text>;

    private stable var owner : Principal = owner_;
    private var swap_id : Text = _swap_id;

    public shared func getSwapId() : async Text {
        return swap_id
    };

    public shared ({ caller }) func setSwapId(canisterId : Text) : async Text {
        if (caller != owner_) {
            return "You are not owner"
        };
        swap_id := canisterId;
        return "Success"
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

    private stable var minimum_liquidity = 10 ** 3;

    public shared (msg) func addLP(
        token0 : Principal,
        token1 : Principal,
        amount0Desired : Nat,
        amount1Desired : Nat,
        amount0Min : Nat,
        amount1Min : Nat,
        deadline : Int,
    ) : async Text {
        // transfer token 0 to this canister
        var token0_canister = actor (Principal.toText(token0)) : actor {
            icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult;
            icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
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
            amount = amount0Desired
        };
        var tx0 = await token0_canister.icrc2_transfer_from(transferArg);

        switch (tx0) {
            case (#Err _) {
                return "Transfer token 0 fail"
            };
            case (#Ok _) {}
        };
        // transfer token 1 to this canister
        var token1_canister = actor (Principal.toText(token1)) : actor {
            icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult;
            icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
        };
        var transferArg2 : ICRC1.TransferFromArgs = {
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
            amount = amount1Desired
        };
        var tx1 = await token1_canister.icrc2_transfer_from(transferArg2);

        switch (tx1) {
            case (#Err _) {
                return "Transfer token 1 fail"
            };
            case (#Ok _) {}
        };

        // deposit token to swap canister
        let approve : ICRC1.ApproveResult = await token0_canister.icrc2_approve {
            from_subaccount = null;
            spender = Principal.fromText(swap_id);
            amount = amount0Desired;
            expires_at = null;
            fee = null;
            memo = null;
            created_at_time = null;
            expected_allowance = null
        };

        let approve2 : ICRC1.ApproveResult = await token1_canister.icrc2_approve {
            from_subaccount = null;
            spender = Principal.fromText(swap_id);
            amount = amount1Desired;
            expires_at = null;
            fee = null;
            memo = null;
            created_at_time = null;
            expected_allowance = null
        };

        var deposit_call = actor (swap_id) : actor {
            deposit(tokenId : Principal, value : Nat) : async TxReceipt
        };
        let depositToken0 : TxReceipt = await deposit_call.deposit(token0, amount0Desired);
        switch (depositToken0) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                // return "Ok";
            }
        };

        let depositToken1 : TxReceipt = await deposit_call.deposit(token1, amount1Desired);
        switch (depositToken1) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                // return "Ok";
            }
        };
        // add lp
        var canister_call = actor (swap_id) : actor {
            addLiquidity(token0 : Principal, token1 : Principal, amount0Desired : Nat, amount1Desired : Nat, amount0Min : Nat, amount1Min : Nat, deadline : Int) : async TxReceipt;
            getPair(token0 : Principal, token1 : Principal) : async ?PairInfoExt
        };

        var pairId = _getlpTokenId(Principal.toText(token0), Principal.toText(token1));
        var totalSupply_ = await totalSupply_call(pairId);

        var pre_pair = await canister_call.getPair(token0, token1);
        var pair = switch (pre_pair) {
            case (?p) { p };
            case (_) {
                return "pair not exist"
            }
        };

        var tid0 = Principal.toText(token0);
        var tid1 = Principal.toText(token1);
        var amount0 = 0;
        var amount1 = 0;
        var amount0D = amount0Desired;
        var amount1D = amount1Desired;
        var amount0M = amount0Min;
        var amount1M = amount1Min;
        var reserve0 = pair.reserve0;
        var reserve1 = pair.reserve1;
        if (tid0 == pair.token1) {
            amount0D := amount1Desired;
            amount1D := amount0Desired;
            amount0M := amount1Min;
            amount1M := amount0Min
        };

        if (reserve0 == 0 and reserve1 == 0) {
            amount0 := amount0D;
            amount1 := amount1D
        } else {
            let amount1Optimal = Utils.quote(amount0D, reserve0, reserve1);
            if (amount1Optimal <= amount1D) {
                assert (amount1Optimal >= amount1M);
                amount0 := amount0D;
                amount1 := amount1Optimal
            } else {
                let amount0Optimal = Utils.quote(amount1D, reserve1, reserve0);
                assert (amount0Optimal <= amount0D);
                assert (amount0Optimal >= amount0M);
                amount0 := amount0Optimal;
                amount1 := amount1D
            }
        };

        var lpAmount = 0;
        if (totalSupply_ == 0) {
            lpAmount := Utils.sqrt(amount0 * amount1) - minimum_liquidity;
            // ignore lptokens.mint(pair.id, blackhole, minimum_liquidity)
        } else {
            lpAmount := Nat.min(amount0 * totalSupply_ / reserve0, amount1 * totalSupply_ / reserve1)
        };

        let addLiquidity_canister_call : TxReceipt = await canister_call.addLiquidity(token0, token1, amount0Desired, amount1Desired, amount0Min, amount1Min, Time.now() +10000000000);

        switch (addLiquidity_canister_call) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                var tx = await privateMint(msg.caller, lpAmount);
                switch (tx) {
                    case (#Err error) {
                        switch (error) {
                            case (#TimeError) { return "TimeError" };
                            case (#BadFee { expected_fee }) {
                                return "BadFee: Expected fee is " # Nat.toText(expected_fee)
                            };
                            case (#BadBurn { min_burn_amount }) {
                                return "BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                            };
                            case (#InsufficientFunds { balance }) {
                                return "InsufficientFunds: Balance is " # Nat.toText(balance)
                            };
                            case (#Duplicate { duplicate_of }) {
                                return "Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                            };
                            case (#TemporarilyUnavailable) {
                                return "TemporarilyUnavailable"
                            };
                            case (#GenericError { error_code; message }) {
                                return "GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                            };
                            case (_) {
                                return "Error"
                            }
                        }
                    };
                    case (#Ok _) {
                        return "Ok"
                    }
                }
                // return "Ok"
            }
        }
    };

    public shared (msg) func addLPForUser(
        userPId : Principal,
        token0 : Principal,
        token1 : Principal,
        amount0Desired : Nat,
        amount1Desired : Nat,
        amount0Min : Nat,
        amount1Min : Nat,
        deadline : Int,
    ) : async Text {
        // transfer token 0 to this canister
        var token0_canister = actor (Principal.toText(token0)) : actor {
            icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult;
            icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
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
            amount = amount0Desired
        };
        var tx0 = await token0_canister.icrc2_transfer_from(transferArg);

        switch (tx0) {
            case (#Err _) {
                return "Transfer token 0 fail"
            };
            case (#Ok _) {}
        };
        // transfer token 1 to this canister
        var token1_canister = actor (Principal.toText(token1)) : actor {
            icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult;
            icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
        };
        var transferArg2 : ICRC1.TransferFromArgs = {
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
            amount = amount1Desired
        };
        var tx1 = await token1_canister.icrc2_transfer_from(transferArg2);

        switch (tx1) {
            case (#Err _) {
                return "Transfer token 1 fail"
            };
            case (#Ok _) {}
        };

        // deposit token to swap canister
        let approve : ICRC1.ApproveResult = await token0_canister.icrc2_approve {
            from_subaccount = null;
            spender = Principal.fromText(swap_id);
            amount = amount0Desired;
            expires_at = null;
            fee = null;
            memo = null;
            created_at_time = null;
            expected_allowance = null
        };

        let approve2 : ICRC1.ApproveResult = await token1_canister.icrc2_approve {
            from_subaccount = null;
            spender = Principal.fromText(swap_id);
            amount = amount1Desired;
            expires_at = null;
            fee = null;
            memo = null;
            created_at_time = null;
            expected_allowance = null
        };

        var deposit_call = actor (swap_id) : actor {
            deposit(tokenId : Principal, value : Nat) : async TxReceipt
        };
        let depositToken0 : TxReceipt = await deposit_call.deposit(token0, amount0Desired);
        switch (depositToken0) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                // return "Ok";
            }
        };

        let depositToken1 : TxReceipt = await deposit_call.deposit(token1, amount1Desired);
        switch (depositToken1) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                // return "Ok";
            }
        };
        // add lp
        var canister_call = actor (swap_id) : actor {
            addLiquidity(token0 : Principal, token1 : Principal, amount0Desired : Nat, amount1Desired : Nat, amount0Min : Nat, amount1Min : Nat, deadline : Int) : async TxReceipt;
            getPair(token0 : Principal, token1 : Principal) : async ?PairInfoExt
        };

        var pairId = _getlpTokenId(Principal.toText(token0), Principal.toText(token1));
        var totalSupply_ = await totalSupply_call(pairId);

        var pre_pair = await canister_call.getPair(token0, token1);
        var pair = switch (pre_pair) {
            case (?p) { p };
            case (_) {
                return "pair not exist"
            }
        };

        var tid0 = Principal.toText(token0);
        var tid1 = Principal.toText(token1);
        var amount0 = 0;
        var amount1 = 0;
        var amount0D = amount0Desired;
        var amount1D = amount1Desired;
        var amount0M = amount0Min;
        var amount1M = amount1Min;
        var reserve0 = pair.reserve0;
        var reserve1 = pair.reserve1;
        if (tid0 == pair.token1) {
            amount0D := amount1Desired;
            amount1D := amount0Desired;
            amount0M := amount1Min;
            amount1M := amount0Min
        };

        if (reserve0 == 0 and reserve1 == 0) {
            amount0 := amount0D;
            amount1 := amount1D
        } else {
            let amount1Optimal = Utils.quote(amount0D, reserve0, reserve1);
            if (amount1Optimal <= amount1D) {
                assert (amount1Optimal >= amount1M);
                amount0 := amount0D;
                amount1 := amount1Optimal
            } else {
                let amount0Optimal = Utils.quote(amount1D, reserve1, reserve0);
                assert (amount0Optimal <= amount0D);
                assert (amount0Optimal >= amount0M);
                amount0 := amount0Optimal;
                amount1 := amount1D
            }
        };

        var lpAmount = 0;
        if (totalSupply_ == 0) {
            lpAmount := Utils.sqrt(amount0 * amount1) - minimum_liquidity;
            // ignore lptokens.mint(pair.id, blackhole, minimum_liquidity)
        } else {
            lpAmount := Nat.min(amount0 * totalSupply_ / reserve0, amount1 * totalSupply_ / reserve1)
        };

        let addLiquidity_canister_call : TxReceipt = await canister_call.addLiquidity(token0, token1, amount0Desired, amount1Desired, amount0Min, amount1Min, Time.now() +10000000000);

        switch (addLiquidity_canister_call) {
            case (#err e) {
                return e
            };
            case (#ok _) {
                var tx = await privateMint(userPId, lpAmount);
                switch (tx) {
                    case (#Err error) {
                        switch (error) {
                            case (#TimeError) { return "TimeError" };
                            case (#BadFee { expected_fee }) {
                                return "BadFee: Expected fee is " # Nat.toText(expected_fee)
                            };
                            case (#BadBurn { min_burn_amount }) {
                                return "BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount)
                            };
                            case (#InsufficientFunds { balance }) {
                                return "InsufficientFunds: Balance is " # Nat.toText(balance)
                            };
                            case (#Duplicate { duplicate_of }) {
                                return "Duplicate: Duplicate of " # Nat.toText(duplicate_of)
                            };
                            case (#TemporarilyUnavailable) {
                                return "TemporarilyUnavailable"
                            };
                            case (#GenericError { error_code; message }) {
                                return "GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message
                            };
                            case (_) {
                                return "Error"
                            }
                        }
                    };
                    case (#Ok _) {
                        return "Ok"
                    }
                }
                // return "Ok"
            }
        }
    };

    public shared (msg) func removeLP(
        token0 : Principal,
        token1 : Principal,
        lpAmount : Nat,
        amount0Min : Nat,
        amount1Min : Nat,
        to : Principal,
        deadline : Int,
    ) : async Text {
        let caller : Account = {
            owner = msg.caller;
            subaccount = null
        };
        var balance_caller = await icrc1_balance_of(caller);
        if (balance_caller < lpAmount) {
            return "Call exceed balance"
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
            amount = lpAmount
        };
        var transfer_from_tx = await icrc2_transfer_from(transferArg);
        switch (transfer_from_tx) {
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
            case (#Ok _) {}
        };

        var canister_call = actor (swap_id) : actor {
            removeLiquidity(
                token0 : Principal,
                token1 : Principal,
                lpAmount : Nat,
                amount0Min : Nat,
                amount1Min : Nat,
                to : Principal,
                deadline : Int,
            ) : async TxReceipt
        };
        let removeLiquidity_canister_call : TxReceipt = await canister_call.removeLiquidity(token0, token1, lpAmount, amount0Min, amount1Min, to, Time.now() +10000000000);

        switch (removeLiquidity_canister_call) {
            case (#err errr) {
                // var transferArg : ICRC1.TransferFromArgs = {
                var transferArg : ICRC1.TransferArgs = {
                    // from_subaccount = {
                    //     owner = aggregator_id;
                    //     subaccount = ?defaultSubaccount
                    // }; //// if transfer then this will null
                    from_subaccount = null;
                    ///
                    created_at_time = null;
                    fee = null;
                    memo = null;
                    to = {
                        owner = msg.caller;
                        subaccount = ?defaultSubaccount
                    };
                    amount = lpAmount
                };

                // var rtToken = await icrc2_transfer_from(transferArg);
                var rtToken = await icrc1_transfer(transferArg);
                switch (rtToken) {
                    case (#Err e) {
                        switch (e) {
                            case (#BadFee { expected_fee }) {
                                return "BadFee: Expected fee is " # Nat.toText(expected_fee) # "AND" # errr
                            };
                            case (#BadBurn { min_burn_amount }) {
                                return "BadBurn: Minimum burn amount is " # Nat.toText(min_burn_amount) # "AND" # errr
                            };
                            case (#InsufficientFunds { balance }) {
                                return "InsufficientFunds: Balance is " # Nat.toText(balance) # "AND" # errr
                            };
                            case (#InsufficientAllowance { allowance }) {
                                return "InsufficientAllowance: Allowance is " # Nat.toText(allowance) # "AND" # errr
                            };
                            case (#TooOld) {
                                return "TooOld" # "AND" # errr
                            };
                            case (#CreatedInFuture { ledger_time }) {
                                return "CreatedInFuture: Ledger time is " # Nat64.toText(ledger_time) # "AND" # errr
                            };
                            case (#Duplicate { duplicate_of }) {
                                return "Duplicate: Duplicate of " # Nat.toText(duplicate_of) # "AND" # errr
                            };
                            case (#TemporarilyUnavailable) {
                                return "TemporarilyUnavailable" # "AND" # errr
                            };
                            case (#GenericError { error_code; message }) {
                                return "GenericError: Error code is " # Nat.toText(error_code) # ", Message is " # message # "AND" # errr
                            }
                        }
                    };
                    case (#Ok _) {
                        return "Remove lpToken fail success return lpToken for user"
                    }
                }
            };
            case (#ok _) {
                return "Ok"
            }
        }
    };

    // private var lppattern : Text.Pattern = #text ":";
    public func totalSupply_call(tokenId : Text) : async Nat {
        var canister_call = actor (swap_id) : actor {
            totalSupply(tokenId : Text) : async Nat
        };
        let get_pair_totalSupply : Nat = await canister_call.totalSupply(tokenId : Text);
        // if (Text.contains(tokenId, lppattern)) {
        //     return lptokens.totalSupply(tokenId)
        // } else {
        //     return tokens.totalSupply(tokenId)
        // }
        return get_pair_totalSupply
    };

    private func _getlpTokenId(token0 : Text, token1 : Text) : Text {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        let pair_str = t0 # ":" # t1;
        return pair_str
    };

    type Subaccount = Blob;
    type Account = {
        owner : Principal;
        subaccount : ?Subaccount
    };

    public func get_principal() : async Principal {
        return Principal.fromActor(this)
    };

    public func getAggregator_id() : async Principal {
        return aggregator_id
    };

    let acct : Account = {
        owner = owner;
        subaccount = null
    };

    let init_args : ICRC1.TokenInitArgs = {
        name = "ckBTC<>d.ckBTC";
        symbol = "ckBTC<>d.ckBTC";
        decimals = 18;
        fee = 0;
        max_supply = 100_000_000_000_000_000_000_000; // 100k
        initial_balances = [(
            acct,
            100_000_000_000_000_000,
        )];
        min_burn_amount = 0;

        minting_account = null;

        advanced_settings = null
    };

    let icrc1_args : ICRC1.InitArgs = {
        init_args with minting_account = Option.get(
            init_args.minting_account,
            {
                owner = owner;
                subaccount = null
            },
        )
    };

    stable let token = ICRC1.init(icrc1_args);

    public shared (msg) func testPrincipal() : async Text {
        return Principal.toText(msg.caller)
    };
    public shared (msg) func caller() : async Text {
        return await testPrincipal()
    };
    public type Balance = Nat;
    private func privateMint(userId : Principal, value : Nat) : async ICRC1.TransferResult {

        let acct : Account = {
            owner = userId;
            subaccount = null
        };
        let amut : Balance = value;
        let mintParam : ICRC1.Mint = {
            to = acct;
            amount = amut;
            memo = null;
            created_at_time = null
        };

        // let caller : Principal = owner_;
        let caller : Principal = owner_;
        let result : ICRC1.TransferResult = await mint2(mintParam, caller);
        // let result : ICRC1.TransferResult = await mint(mintParam);
        return result
    };

    /// Functions for the ICRC1 token standard
    public shared query func icrc1_name() : async Text {
        ICRC1.name(token)
    };

    public shared query func icrc1_symbol() : async Text {
        ICRC1.symbol(token)
    };

    public shared query func icrc1_decimals() : async Nat8 {
        ICRC1.decimals(token)
    };

    public shared query func icrc1_fee() : async ICRC1.Balance {
        ICRC1.fee(token)
    };

    public shared query func icrc1_metadata() : async [ICRC1.MetaDatum] {
        ICRC1.metadata(token)
    };

    public shared query func icrc1_total_supply() : async ICRC1.Balance {
        ICRC1.total_supply(token)
    };

    public shared query func icrc1_minting_account() : async ?ICRC1.Account {
        ?ICRC1.minting_account(token)
    };

    public shared query func icrc1_balance_of(args : ICRC1.Account) : async ICRC1.Balance {
        ICRC1.balance_of(token, args)
    };

    public shared query func icrc1_supported_standards() : async [ICRC1.SupportedStandard] {
        ICRC1.supported_standards(token)
    };

    public shared ({ caller }) func icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult {
        await* ICRC1.transfer(token, args, caller)
    };

    public shared ({ caller }) func mint(args : ICRC1.Mint) : async ICRC1.TransferResult {
        await* ICRC1.mint(token, args, caller)
    };

    private func mint2(args : ICRC1.Mint, caller : Principal) : async ICRC1.TransferResult {
        await* ICRC1.mint2(token, args, caller)
    };

    public shared ({ caller }) func burn(args : ICRC1.BurnArgs) : async ICRC1.TransferResult {
        await* ICRC1.burn(token, args, caller)
    };

    public shared ({ caller }) func icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult {
        await* ICRC1.approve(token, args, caller)
    };

    public shared ({ caller }) func icrc2_transfer_from(args : ICRC1.TransferFromArgs) : async ICRC1.TransferFromResult {
        await* ICRC1.transfer_from(token, args, caller)
    };

    public shared query func icrc2_allowance(args : ICRC1.AllowanceArgs) : async ICRC1.Allowance {
        ICRC1.get_allowance_of(token, args.account, args.spender)
    };

    // Functions for integration with the rosetta standard
    public shared query func get_transactions(req : ICRC1.GetTransactionsRequest) : async ICRC1.GetTransactionsResponse {
        ICRC1.get_transactions(token, req)
    };

    // Additional functions not included in the ICRC1 standard
    public shared func get_transaction(i : ICRC1.TxIndex) : async ?ICRC1.Transaction {
        await* ICRC1.get_transaction(token, i)
    };

    // Deposit cycles into this canister.
    public shared func deposit_cycles() : async () {
        let amount = ExperimentalCycles.available();
        let accepted = ExperimentalCycles.accept(amount);
        assert (accepted == amount)
    }
}
