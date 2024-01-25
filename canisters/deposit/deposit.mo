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
import Tokens "./tokens";
import ExperimentalCycles "mo:base/ExperimentalCycles";
// import SB "mo:StableBuffer/StableBuffer";
import Cycles = "mo:base/ExperimentalCycles";
import Nat32 "mo:base/Nat32";
import Blob "mo:base/Blob";
// import Hex "./Hex";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Float "mo:base/Float";
import ICRCtoken "../ICRC1/Canisters/Token";

// import Account "./Account";

import ICRC1 "./ICRC1";
import Archive "./ICRC1/Canisters/Archive";

// shared (msg) actor class Deposit(owner_ : Principal, deposit_id : Principal, init_args : ICRC1.TokenInitArgs) : async ICRC1.FullInterface = this {
shared (msg) actor class Deposit(
    owner_ : Principal,
    deposit_id : Principal,
    _name : Text,
    _symbol : Text,
    deposit_token_id : Text,
) = this {
    type Errors = {
        #InsufficientBalance;
        #InsufficientAllowance;
        #LedgerTrap;
        #AmountTooSmall;
        #BlockUsed;
        #ErrorOperationStyle;
        #ErrorTo;
        #Other : Text
    };

    type ICRCTransferError = {
        #BadFee;
        #BadBurn;
        #InsufficientFunds;
        #InsufficientAllowance; //only for icrc2
        #TooOld;
        #CreatedInFuture;
        #Duplicate;
        #TemporarilyUnavailable;
        #GenericError;
        #Expired; //only for approve
        #CustomError : Text; // custom error for logic
    };
    type ICRCTokenTxReceipt = {
        #Ok : Nat;
        #Err : ICRCTransferError
    };
    type ICRCMetaDataValue = {
        #Nat8 : Nat8;
        #Nat : Nat;
        #Int : Int;
        #Blob : Blob;
        #Text : Text
    };
    type CapDetails = {
        CapV1RootBucketId : ?Text;
        CapV1Status : Bool;
        CapV2RootBucketId : ?Text;
        CapV2Status : Bool
    };
    type Subaccount = Blob;
    type ICRCAccount = {
        owner : Principal;
        subaccount : ?Subaccount
    };
    type ICRCTransferArg = {
        from_subaccount : ?Subaccount;
        to : ICRCAccount;
        amount : Nat
    };
    type TransferFromArgs = {
        from_subaccount : ICRCAccount;
        to : ICRCAccount;
        amount : Nat
    };
    type Metadata = {
        logo : Text;
        name : Text;
        symbol : Text;
        decimals : Nat8;
        totalSupply : Nat;
        owner : Principal;
        fee : Nat
    };
    public type ICRC2TokenActor = actor {
        icrc2_approve : shared (from_subaccount : ?Subaccount, spender : Principal, amount : Nat) -> async ICRCTokenTxReceipt;
        icrc2_allowance : shared (account : Subaccount, spender : Principal) -> async (allowance : Nat, expires_at : ?Nat64);
        icrc1_balance_of : (account : ICRCAccount) -> async Nat;
        icrc1_decimals : () -> async Nat8;
        icrc1_name : () -> async Text;
        icrc1_symbol : () -> async Text;
        icrc1_metadata : () -> async [(Text, ICRCMetaDataValue)];
        icrc1_total_supply : () -> async Nat;
        icrc1_transfer : shared (ICRCTransferArg) -> async ICRCTokenTxReceipt;
        icrc2_transfer_from : shared (TransferFromArgs) -> async ICRCTokenTxReceipt
    };
    type DepositSubAccounts = {
        transactionOwner : Principal;
        depositAId : Text;
        subaccount : Blob;
        created_at : Time.Time
    };
    public type ICRC1SubAccountBalance = Result.Result<Nat, Text>;

    private stable var feeTo : Principal = owner_;
    private var depositTransactions = HashMap.HashMap<Principal, DepositSubAccounts>(1, Principal.equal, Principal.hash);
    private stable var depositTransactionsEntries : [(Principal, DepositSubAccounts)] = [];
    private var tokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);
    private stable let depositCounterV2 : Nat = 10000;
    private stable var owner : Principal = owner_;
    private var canister_token_ID : Text = deposit_token_id;

    public shared func getTokenId() : async Text {
        return canister_token_ID
    };

    public shared ({ caller }) func setTokenId(canisterId : Text) : async Text {
        if (caller != owner_) {
            return "You are not owner"
        };
        canister_token_ID := canisterId;
        return "Success"
    };

    public type TransferReceipt = {
        #Ok : Nat;
        #Err : Errors;
        #ICRCTransferError : ICRCTransferError
    };
    type TokenActorVariable = {
        #ICRC2TokenActor : ICRC2TokenActor;
        #Err : Errors
    };
    public type TxReceipt = Result.Result<Nat, Text>;
    private stable var txcounter : Nat = 0;

    private func effectiveDepositAmount(tokenId : Text, value : Nat) : Nat {
        return value
    };
    private func getICRC1SubAccount(caller : Principal) : Blob {
        switch (depositTransactions.get(caller)) {
            case (?deposit) {
                return deposit.subaccount
            };
            case (_) {
                let subaccount = Utils.generateSubaccount({
                    caller = caller;
                    id = depositCounterV2
                });
                return subaccount
            }
        }
    };
    private func _getTokenActor(tokenId : Text) : TokenActorVariable {
        var tokenCanister : ICRC2TokenActor = actor (tokenId);
        return #ICRC2TokenActor(tokenCanister)
    };
    public shared (msg) func getICRC1SubAccountBalance(user : Principal, tid : Text) : async ICRC1SubAccountBalance {
        // assert (_checkAuth(msg.caller));
        let tokenCanister = _getTokenActor(tid);
        switch (tokenCanister) {
            case (#ICRC2TokenActor(ICRC2TokenActor)) {
                let subaccount = getICRC1SubAccount(user);
                var depositSubAccount : ICRCAccount = {
                    owner = Principal.fromActor(this);
                    subaccount = ?subaccount
                };
                let balance = await ICRC2TokenActor.icrc1_balance_of(depositSubAccount);
                return #ok(balance)
            };
            case (_) {
                return #err("tid/tokenid passed is not a supported ICRC2 canister")
            }
        }
    };

    private func _transferFrom(tokenCanister : TokenActorVariable, caller : Principal, value : Nat, fee : Nat) : async TransferReceipt {
        switch (tokenCanister) {
            case (#ICRC2TokenActor(ICRC2TokenActor)) {

                let subaccount = getICRC1SubAccount(caller);
                var depositSubAccount : ICRCAccount = {
                    // owner = Principal.fromActor(this);
                    owner = caller;
                    // subaccount = ?subaccount
                    subaccount = null
                };
                var balance = await ICRC2TokenActor.icrc1_balance_of(depositSubAccount);
                if (balance >= value +fee) {
                    var defaultSubaccount : Blob = Utils.defaultSubAccount();
                    var transferArg : TransferFromArgs = {
                        from_subaccount = {
                            owner = caller;
                            subaccount = ?defaultSubaccount
                        };
                        to = {
                            owner = Principal.fromActor(this);
                            subaccount = ?defaultSubaccount
                        };
                        amount = value
                    };
                    // var txid = await ICRC2TokenActor.icrc1_transfer(transferArg);

                    var txid = await ICRC2TokenActor.icrc2_transfer_from(transferArg);
                    switch (txid) {
                        case (#Ok(id)) { return #Ok(id) };
                        case (#Err(e)) { return #ICRCTransferError(e) }
                    }
                } else {
                    // return #ICRCTransferError(#CustomError("transaction amount not matched"))
                    return #ICRCTransferError(#CustomError("transaction amount not matched " # Nat.toText(balance) # Principal.toText(caller)))
                }
            };
            case (_) {
                Prelude.unreachable()
            }
        }
    };

    public query func balanceOf(tokenId : Text, who : Principal) : async Nat {
        return tokens.balanceOf(tokenId, who)
    };

    private func _getTokenActorWithType(tokenId : Text, tokenType : Text) : TokenActorVariable {
        switch (tokenType) {
            case ("ICRC1") {
                var tokenCanister : ICRC2TokenActor = actor (tokenId);
                return #ICRC2TokenActor(tokenCanister)
            };
            case ("ICRC2") {
                var tokenCanister : ICRC2TokenActor = actor (tokenId);
                return #ICRC2TokenActor(tokenCanister)
            };
            case (_) {
                Prelude.unreachable()
            }
        }
    };

    private func _extractICRCMetadata(tokenId : Principal, metadatas : [(Text, ICRCMetaDataValue)]) : Metadata {
        var name : Text = "";
        var symbol : Text = "";
        var fee : Nat = 0;
        var decimals : Nat = 0;
        for (metadata in metadatas.vals()) {
            switch (metadata.0) {
                case ("icrc1:name") {
                    switch (metadata.1) {
                        case (#Text(data)) {
                            name := data
                        };
                        case (_) {}
                    }
                };
                case ("icrc1:symbol") {
                    switch (metadata.1) {
                        case (#Text(data)) {
                            symbol := data
                        };
                        case (_) {}
                    }
                };
                case ("icrc1:decimals") {
                    switch (metadata.1) {
                        case (#Nat(data)) {
                            decimals := data
                        };
                        case (_) {}
                    }
                };
                case ("icrc1:fee") {
                    switch (metadata.1) {
                        case (#Nat(data)) {
                            fee := data
                        };
                        case (_) {}
                    }
                };
                case (_) {}
            }
        };
        var resultMeta : Metadata = {
            logo = "";
            name = name;
            symbol = symbol;
            decimals = Nat8.fromNat(decimals);
            totalSupply = 0;
            owner = tokenId;
            fee = fee
        };
        return resultMeta
    };

    private func _getMetadata(tokenCanister : TokenActorVariable, tokenId : Principal) : async Metadata {
        switch (tokenCanister) {
            case (#DIPtokenActor(dipTokenActor)) {
                var metadata = await dipTokenActor.getMetadata();
                return metadata
            };
            case (#YCTokenActor(ycTokenActor)) {
                var metadata = await ycTokenActor.getMetadata();
                return metadata
            };
            case (#ICRC2TokenActor(ICRC2TokenActor)) {
                var icrc1_metadata = await ICRC2TokenActor.icrc1_metadata();
                var metadata = _extractICRCMetadata(tokenId, icrc1_metadata);
                return metadata
            };
            case (#ICRC2TokenActor(icrc2TokenActor)) {
                var icrc2_metadata = await icrc2TokenActor.icrc1_metadata();
                var metadata = _extractICRCMetadata(tokenId, icrc2_metadata);
                return metadata
            };
            case (_) {
                Prelude.unreachable()
            }
        }
    };

    public type TokenInfo = Tokens.TokenInfo;
    private var tokenTypes = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
    private func createTokenType(tokenId : Principal, tokenType : Text) {
        let tid : Text = Principal.toText(tokenId);
        if (Option.isNull(tokenTypes.get(tid)) == true) {
            tokenTypes.put(tid, tokenType)
        }
    };
    public shared (msg) func addToken(tokenId : Principal, tokenType : Text) : async TxReceipt {
        if ((msg.caller == owner) == false) {
            return #err("unauthorized")
        };
        // if (tokens.getNumTokens() == maxTokens) return #err("max number of tokens reached");
        if (tokens.hasToken(Principal.toText(tokenId))) return #err("token exists");

        let tokenCanister = _getTokenActorWithType(Principal.toText(tokenId), tokenType);
        let metadata = await _getMetadata(tokenCanister, tokenId);

        let token : TokenInfo = {
            id = Principal.toText(tokenId);
            var name = metadata.name;
            var symbol = metadata.symbol;
            var decimals = metadata.decimals;
            var fee = metadata.fee;
            var totalSupply = 0;
            balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
            allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash)
        };
        assert (tokens.createToken(Principal.toText(tokenId), token));
        createTokenType(tokenId, tokenType);
        txcounter += 1;
        return #ok(txcounter - 1)
    };

    // Get interest
    private var intetest : Float = 0.5;

    public func getInterest(
        t1 : Time.Time,
        t2 : Time.Time,
        firstMultiplier : Float,
        decayPerDay : Float,
        period : Nat,
        lastUpdateTime : Int,
        isActive : Bool,
    ) : async Float {

        if (lastUpdateTime >= period) {
            return 0
        };

        var temp : Int = await compareTimestamps(t1, t2);
        // var temp : Int = await compareTimestamps(t1, t1 * nanosecondsPerDay);
        var n : Float = Float.fromInt(temp);
        let condition = Float.greater(n, Float.fromInt(period));
        if (condition) {
            n := Float.fromInt(period)
        };
        var X : Float = firstMultiplier;

        if (n < 1) {
            return 0
        } else {
            // n := n - 1
        };

        if (isActive == false) {
            return 0
        };
        var result = (intetest / 100) * ((n + 1) * X - ((decayPerDay * n * (n + 1)) / 2));

        if (lastUpdateTime > 0) {
            var Y : Float = Float.fromInt(lastUpdateTime) - 1;
            result := result - (intetest / 100) * ((Y +1) * X - ((decayPerDay * Y * (Y +1)) / 2))
        };
        return result
    };

    public func compareTimestamps(t1 : Time.Time, t2 : Time.Time) : async Int {
        if (t1 > t2) {
            return 0
        } else if (t2 > t1) {
            let diff = (t2 - t1) / nanosecondsPerDay;
            if (diff > 0) {
                return diff - 1
            } else {
                return 0
            }
        } else {
            return 0
        }
    };

    // Get mutiplier
    public func getMultiplier(t1 : Time.Time, t2 : Time.Time, firstMultiplier : Float, decayPerDay : Float, period : Nat) : async Float {
        var temp : Int = await compareTimestamps(t1, t2);
        var n : Float = Float.fromInt(temp);
        let condition = Float.greaterOrEqual(n, Float.fromInt(period));
        if (condition) {
            n := Float.fromInt(period)
        };

        return firstMultiplier - decayPerDay * n
    };

    type DepositType = {
        id : Nat;
        amount : Nat;
        firstMultiplier : Float;
        duration : Nat;
        startTime : Time.Time;
        lastUpdateTime : Nat or Int; // Days

        isActive : Bool
    };

    private var depositInfoCkETH = HashMap.HashMap<Principal, [DepositType]>(1, Principal.equal, Principal.hash);
    private var depositInfoCkBTC = HashMap.HashMap<Principal, [DepositType]>(1, Principal.equal, Principal.hash);

    // private var idPerDepposit = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    private func updateArrayForPrincipal(userPId : Principal, newValue : Nat, newDepInform : DepositType) : () {
        let maybeArray = depositInfoCkETH.get(userPId);
        var updateInform : [DepositType] = [];

        switch (maybeArray) {
            case (?r) {
                for (depEle in r.vals()) {
                    // updateInform := Array.append(updateInform, [newDepInform])
                    updateInform := Array.append(updateInform, [depEle])
                }
            };
            case (_) {}
        };
        updateInform := Array.append(updateInform, [newDepInform]);
        depositInfoCkETH.put(userPId, updateInform)
    };

    public shared (msg) func deposit(tokenId : Principal, value : Nat, duration : Nat) : async TxReceipt {
        if (value < 10000) {
            return #err("Value too small")
        };
        let tid : Text = Principal.toText(tokenId);

        if (tokens.hasToken(tid) == false) return #err("token not exist");

        let tokenCanister = _getTokenActor(tid);

        let result = await _transferFrom(tokenCanister, msg.caller, value, tokens.getFee(tid));
        let txid = switch (result) {
            case (#Ok(id)) { id };
            case (#Err(e)) { return #err("token transfer failed:" # tid) };
            // case(#ICRCTransferError(e)) { return #err("token transfer failed:" # tid); };
            case (#ICRCTransferError(e)) {
                switch (e) {
                    case (#BadBurn) { return #err("BadBurn") };
                    case (#BadFee) { return #err("BadFee") };
                    case (#CreatedInFuture) { return #err("CreatedInFuture") };
                    case (#CustomError(text)) {
                        return #err("CustomError: " # text)
                    };
                    case (#Duplicate) { return #err("Duplicate") };
                    case (#Expired) { return #err("Expired") };
                    case (#GenericError) { return #err("GenericError") };
                    case (#InsufficientAllowance) {
                        return #err("InsufficientAllowance")
                    };
                    case (#InsufficientFunds) {
                        return #err("InsufficientFunds")
                    };
                    case (#TemporarilyUnavailable) {
                        return #err("TemporarilyUnavailable")
                    };
                    case (#TooOld) { return #err("TooOld") }
                }
            }
        };
        if (value < tokens.getFee(tid)) return #err("value less than token transfer fee");
        ignore tokens.mint(tid, msg.caller, effectiveDepositAmount(tid, value));

        var firstNum = getFirstMultiplier(value, duration);
        var maybeId = depositID.get(msg.caller);
        var id = 0;
        switch (maybeId) {
            case (?r) {
                id := r;
                depositID.put(msg.caller, id +1)
            };
            case (_) {
                id := 0;
                depositID.put(msg.caller, id +1)
            }
        };
        var newDepInform : DepositType = {
            amount = value;
            firstMultiplier = firstNum;
            duration = duration;
            startTime = Time.now();
            id = id;
            lastUpdateTime = 0;
            isActive = true
        };

        updateArrayForPrincipal(msg.caller, value, newDepInform);

        // var mintValue : Nat = Nat64.toNat(Int64.toNat64(Float.toInt64(Float.floor(firstNum))));
        // let result0 : ICRC1.TransferResult = await privateMint(msg.caller, mintValue);

        txcounter += 1;
        return #ok(txcounter - 1)
    };

    private func getFirstMultiplier(value : Nat, period : Nat) : Float {
        switch (period) {
            case (1) { return Float.fromInt(value) * 1.0006 };
            case (3) { return Float.fromInt(value) * 1.0518 };
            case (7) { return Float.fromInt(value) * 1.1068 };
            case (14) { return Float.fromInt(value) * 1.1666 };
            case (30) { return Float.fromInt(value) * 1.2358 };
            case (90) { return Float.fromInt(value) * 1.3401 };
            case (180) { return Float.fromInt(value) * 1.4741 };
            case (270) { return Float.fromInt(value) * 1.6182 };
            case (360) { return Float.fromInt(value) * 1.7729 };
            case (450) { return Float.fromInt(value) * 1.9392 };
            case (540) { return Float.fromInt(value) * 2.1176 };
            case (_) { return Float.fromInt(value) * 1.0006 }
        }
    };

    public func getCurrentMultiplier(userInfo : DepositType) : async Float {
        var firstMul : Float = getFirstMultiplier(userInfo.amount, userInfo.duration);
        var decayPerDay : Float = await getDecayPerDay(userInfo);
        var daysHavePass : Int = await compareTimestamps(Time.now(), userInfo.startTime);

        return userInfo.firstMultiplier - (Float.fromInt(daysHavePass) * decayPerDay)
    };

    private func getDecayPerDay(userInfo : DepositType) : async Float {
        var firstMul : Float = getFirstMultiplier(userInfo.amount, userInfo.duration);
        var deposit : Int = userInfo.amount;
        var duration : Int = userInfo.duration;

        return (firstMul - Float.fromInt(deposit)) / Float.fromInt(duration)
    };

    public func getDepositId(userId : Principal) : async ?[DepositType] {
        return depositInfoCkETH.get(userId)
    };

    // private var nanosecondsPerDay : Time.Time = 24 * 60 * 60 * 1_000_000_000;
    private var nanosecondsPerDay : Time.Time = 60 * 1_000_000_000;
    var depositID = HashMap.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);
    // var isProcessing = HashMap.HashMap<Principal, [Nat]>(1, Principal.equal, Principal.hash);

    type InnerMap = HashMap.HashMap<Nat, Bool>;
    type OuterMap = HashMap.HashMap<Principal, InnerMap>;
    let isProcessing : OuterMap = HashMap.HashMap<Principal, InnerMap>(1, Principal.equal, Principal.hash);

    public shared (msg) func withdrawInterest(index : Nat) : async ICRC1.TransferResult {

        var maybeArray = depositInfoCkETH.get(msg.caller);

        switch (maybeArray) {
            case (?r) {
                if (r.size() <= index) {
                    return #Err(#GenericError { error_code = 101; message = "Not found Id" })
                };
                if (not r[index].isActive) {
                    return #Err(#GenericError { error_code = 102; message = "This stake has already withdrawn" })
                };

                // var t1 = r[index].lastUpdateTime;
                var t1 = r[index].startTime + r[index].lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                var t2 = Time.now();
                var firstMultiplier = getFirstMultiplier(r[index].amount, r[index].duration);
                var decayPerDay = await getDecayPerDay(r[index]);
                var updateDay = await compareTimestamps(t1, t2);
                var currentMul : Float = await getCurrentMultiplier(r[index]);
                var currentInterest : Float = await getInterest(t1, t2, firstMultiplier, decayPerDay, r[index].duration, r[index].lastUpdateTime, r[index].isActive);

                if (currentInterest <= 0) {
                    return #Err(#GenericError { error_code = 404; message = "current Interest equal zero" })
                };

                var withdrawValue : Nat = Nat64.toNat(Int64.toNat64(Float.toInt64(Float.floor(currentInterest))));

                if (updateDay > r[index].duration) {
                    updateDay := r[index].duration
                };

                var newDepInform : DepositType = {
                    id = index;
                    amount = r[index].amount;
                    duration = r[index].duration;
                    firstMultiplier = firstMultiplier;
                    isActive = true;
                    lastUpdateTime = updateDay; //updateDay
                    startTime = r[index].startTime
                };

                var arrTemp : DepositType = r[index];
                var updateInform : [DepositType] = [];
                switch (maybeArray) {
                    case (?r) {
                        for (depEle in r.vals()) {
                            if (arrTemp == depEle) {
                                updateInform := Array.append(updateInform, [newDepInform])
                            } else {
                                updateInform := Array.append(updateInform, [depEle])
                            }
                        }
                    };
                    case (_) {}
                };
                // updateInform := Array.append(updateInform, [newDepInform]);
                if (true) {
                    depositInfoCkETH.put(msg.caller, updateInform)
                } else {
                    depositInfoCkBTC.put(msg.caller, updateInform)
                };
                //////// case give ckETH
                var canister2 = actor (canister_token_ID) : actor {
                    icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult;
                    // icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
                };
                // let approve : ICRC1.ApproveResult = await canister2.icrc2_approve {
                //     from_subaccount = null;
                //     spender = msg.caller;
                //     amount = withdrawValue;
                //     expires_at = null;
                //     fee = null;
                //     memo = null;
                //     created_at_time = null;
                //     expected_allowance = null
                // };
                let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
                    from_subaccount = null;
                    to = { owner = msg.caller; subaccount = null };
                    amount = withdrawValue;
                    memo = null;
                    fee = null;
                    created_at_time = null
                };
                return tx
            };
            case (_) {
                return #Err(#GenericError { error_code = 202; message = "Not found Id" })
            }
        }
    };
    /////////////////////////////////// FIX THIS ///////////////////////////////////
    public shared (msg) func privateWithdrawInterest(index : Nat, user : Principal) : async ICRC1.TransferResult {

        var maybeArray = depositInfoCkETH.get(user);

        switch (maybeArray) {
            case (?r) {
                if (r.size() <= index) {
                    return #Err(#GenericError { error_code = 101; message = "Not found Id" })
                };
                if (not r[index].isActive) {
                    return #Err(#GenericError { error_code = 102; message = "This stake has already withdrawn" })
                };

                // var t1 = r[index].lastUpdateTime;
                var t1 = r[index].startTime + r[index].lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                var t2 = Time.now();
                var firstMultiplier = getFirstMultiplier(r[index].amount, r[index].duration);
                var decayPerDay = await getDecayPerDay(r[index]);
                var updateDay = await compareTimestamps(t1, t2);
                var currentMul : Float = await getCurrentMultiplier(r[index]);
                var currentInterest : Float = await getInterest(t1, t2, firstMultiplier, decayPerDay, r[index].duration, r[index].lastUpdateTime, r[index].isActive);

                if (currentInterest <= 0) {
                    return #Err(#GenericError { error_code = 404; message = "current Interest equal zero" })
                };

                var withdrawValue : Nat = Nat64.toNat(Int64.toNat64(Float.toInt64(Float.floor(currentInterest))));

                if (updateDay > r[index].duration) {
                    updateDay := r[index].duration
                };

                var newDepInform : DepositType = {
                    id = index;
                    amount = r[index].amount;
                    duration = r[index].duration;
                    firstMultiplier = firstMultiplier;
                    isActive = true;
                    lastUpdateTime = updateDay; //updateDay
                    startTime = r[index].startTime
                };

                var arrTemp : DepositType = r[index];
                var updateInform : [DepositType] = [];
                switch (maybeArray) {
                    case (?r) {
                        for (depEle in r.vals()) {
                            if (arrTemp == depEle) {
                                updateInform := Array.append(updateInform, [newDepInform])
                            } else {
                                updateInform := Array.append(updateInform, [depEle])
                            }
                        }
                    };
                    case (_) {}
                };
                // updateInform := Array.append(updateInform, [newDepInform]);
                if (true) {
                    depositInfoCkETH.put(user, updateInform)
                } else {
                    depositInfoCkBTC.put(user, updateInform)
                };
                //////// case give ckETH
                var canister2 = actor (canister_token_ID) : actor {
                    icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult
                };
                let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
                    from_subaccount = null;
                    to = { owner = user; subaccount = null };
                    amount = withdrawValue;
                    memo = null;
                    fee = null;
                    created_at_time = null
                };
                return tx
            };
            case (_) {
                return #Err(#GenericError { error_code = 202; message = "Not found Id" })
            }
        }
    };

    public func getInterestUI(userId : Principal) : async Float {
        var maybeArray = depositInfoCkETH.get(userId);

        var totalInterest : Float = 0;
        switch (maybeArray) {
            case (?r) {
                // let indices = Iter.range(0, r.size() -1);
                for (depEle in r.vals()) {
                    var t1 = depEle.startTime + depEle.lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                    var t2 = Time.now();
                    var firstMultiplier = getFirstMultiplier(depEle.amount, depEle.duration);
                    var decayPerDay = await getDecayPerDay(depEle);
                    var updateDay = await compareTimestamps(t1, t2);
                    var currentMul : Float = await getCurrentMultiplier(depEle);
                    var currentInterest : Float = await getInterest(t1, t2, firstMultiplier, decayPerDay, depEle.duration, depEle.lastUpdateTime, depEle.isActive);
                    totalInterest += currentInterest
                };
                return totalInterest
            };
            case (_) {
                return totalInterest
            }
        };
        return totalInterest
    };

    public shared (msg) func withdrawInterestAll() : async ICRC1.TransferResult {
        var maybeArray = depositInfoCkETH.get(msg.caller);

        var totalWithdraw : Nat = 0;
        switch (maybeArray) {
            case (?r) {
                // let indices = Iter.range(0, r.size() -1);

                for (depEle in r.vals()) {
                    var t1 = depEle.startTime + depEle.lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                    var t2 = Time.now();
                    var firstMultiplier = getFirstMultiplier(depEle.amount, depEle.duration);
                    var decayPerDay = await getDecayPerDay(depEle);
                    var updateDay = await compareTimestamps(t1, t2);
                    var currentMul : Float = await getCurrentMultiplier(depEle);
                    var currentInterest : Float = await getInterest(t1, t2, firstMultiplier, decayPerDay, depEle.duration, depEle.lastUpdateTime, depEle.isActive);

                    if (currentInterest <= 0) {
                        // return #Err(#GenericError { error_code = 404; message = "current Interest equal zero" })
                    } else {
                        var withdrawValue : Nat = Nat64.toNat(Int64.toNat64(Float.toInt64(Float.floor(currentInterest))));
                        totalWithdraw += withdrawValue;

                        if (updateDay > depEle.duration) {
                            updateDay := depEle.duration
                        };

                        var newDepInform : DepositType = {
                            id = depEle.id;
                            amount = depEle.amount;
                            duration = depEle.duration;
                            firstMultiplier = firstMultiplier;
                            isActive = true;
                            lastUpdateTime = updateDay; //updateDay
                            startTime = depEle.startTime
                        };

                        var arrTemp : DepositType = depEle;
                        var updateInform : [DepositType] = [];
                        switch (maybeArray) {
                            case (?r) {
                                for (depEle in r.vals()) {
                                    if (arrTemp == depEle) {
                                        updateInform := Array.append(updateInform, [newDepInform])
                                    } else {
                                        updateInform := Array.append(updateInform, [depEle])
                                    }
                                }
                            };
                            case (_) {}
                        };
                        if (true) {
                            depositInfoCkETH.put(msg.caller, updateInform)
                        } else {
                            depositInfoCkBTC.put(msg.caller, updateInform)
                        }
                    }
                }
            };
            case (_) {
                return #Err(#GenericError { error_code = 404; message = "Not found Id" })
            }
        };

        var canister2 = actor (canister_token_ID) : actor {
            icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult;
            // icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
        };
        // let approve : ICRC1.ApproveResult = await canister2.icrc2_approve {
        //     from_subaccount = null;
        //     spender = msg.caller;
        //     amount = totalWithdraw;
        //     expires_at = null;
        //     fee = null;
        //     memo = null;
        //     created_at_time = null;
        //     expected_allowance = null
        // };
        let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
            from_subaccount = null;
            to = { owner = msg.caller; subaccount = null };
            amount = totalWithdraw;
            memo = null;
            fee = null;
            created_at_time = null
        };

        //////// case give d.ckETH
        // let result : ICRC1.TransferResult = await privateMint(userId, 1);
        return tx
    };

    public func getTokenDecimals() : async Nat8 {
        var canister2 = actor (canister_token_ID) : actor {
            icrc1_decimals : () -> async Nat8
        };
        let decimals : Nat8 = await canister2.icrc1_decimals();
        return decimals
    };

    public func getTokenBalance(userId : Principal) : async ICRC1.Balance {
        let acct : Account = {
            owner = userId;
            subaccount = null
        };
        var canister2 = actor (canister_token_ID) : actor {
            icrc1_balance_of : (args : ICRC1.Account) -> async ICRC1.Balance
        };
        let balance : Nat = await canister2.icrc1_balance_of(acct);
        return balance
    };

    public func getWrapBalance(userId : Principal) : async ICRC1.Balance {
        let acct : Account = {
            owner = userId;
            subaccount = null
        };
        let balance : Nat = await icrc1_balance_of(acct);
        return balance
    };

    public shared (msg) func withdrawDepositAndInterest(index : Nat) : async ICRC1.TransferResult {
        var maybeArray = depositInfoCkETH.get(msg.caller);

        let outerMap0 = isProcessing.get(msg.caller);
        switch (outerMap0) {
            case (null) {
                /* handle case when the outer map does not contain the key */
            };
            case (?innerMap) {
                let innerValue = innerMap.get(index);
                switch (innerValue) {
                    case (null) {
                        /* handle case when the inner map does not contain the key */
                    };
                    case (?value) {
                        if (value == true) {
                            return #Err(#GenericError { error_code = 000; message = "This Stake is processing" })
                        }
                    }
                }
            }
        };

        switch (maybeArray) {
            case (?r) {
                if (r.size() <= index) {
                    return #Err(#GenericError { error_code = 400; message = "Not found Id" })
                };
                if (r[index].isActive == false) {
                    return #Err(#GenericError { error_code = 404; message = "Already withdrawn" })
                };

                let outerMap1 = isProcessing.get(msg.caller);
                switch (outerMap1) {
                    case (null) {
                        let newInnerMap = HashMap.HashMap<Nat, Bool>(1, Nat.equal, Hash.hash);
                        newInnerMap.put(index, true);
                        isProcessing.put(msg.caller, newInnerMap)
                    };
                    case (?innerMap) {
                        innerMap.put(index, true)
                    }
                };

                var t1 = r[index].startTime + r[index].lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                var t2 = Time.now();
                var updateDay = await compareTimestamps(t1, t2);
                assert (updateDay >= 0);

                var duration = r[index].duration;
                var firstDeposit = r[index].amount;

                if (updateDay >= duration) {
                    let result : ICRC1.TransferResult = await privateMint(msg.caller, firstDeposit)
                } else {
                    var withdrawValue = (firstDeposit * 95 / 100);
                    var canister2 = actor (canister_token_ID) : actor {
                        icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult;
                        // icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
                    };
                    // let approve : ICRC1.ApproveResult = await canister2.icrc2_approve {
                    //     from_subaccount = null;
                    //     spender = msg.caller;
                    //     amount = withdrawValue;
                    //     expires_at = null;
                    //     fee = null;
                    //     memo = null;
                    //     created_at_time = null;
                    //     expected_allowance = null
                    // };
                    let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
                        from_subaccount = null;
                        to = { owner = msg.caller; subaccount = null };
                        amount = withdrawValue;
                        memo = null;
                        fee = null;
                        created_at_time = null
                    }
                };

                // var firstMultiplier = await getFirstMultiplier(r[index].amount, r[index].duration);
                var decayPerDay = getDecayPerDay(r[index]);
                var currentMul : Float = await getCurrentMultiplier(r[index]);

                var arrTemp : DepositType = r[index];
                var updateInform : [DepositType] = [];

                var newDepInform : DepositType = {
                    id = index;
                    amount = r[index].amount;
                    duration = r[index].duration;
                    firstMultiplier = r[index].firstMultiplier;
                    isActive = false;
                    lastUpdateTime = updateDay; //updateDay
                    startTime = r[index].startTime
                };

                switch (maybeArray) {
                    case (?r) {
                        for (depEle in r.vals()) {
                            if (arrTemp == depEle) {
                                updateInform := Array.append(updateInform, [newDepInform])
                            } else {
                                updateInform := Array.append(updateInform, [depEle])
                            }
                        }
                    };
                    case (_) {}
                };
                var isSucces = await privateWithdrawInterest(index : Nat, msg.caller);
                // updateInform := Array.append(updateInform, [newDepInform]);
                if (true) {
                    depositInfoCkETH.put(msg.caller, updateInform)
                } else {
                    depositInfoCkBTC.put(msg.caller, updateInform)
                };

                let outerMap2 = isProcessing.get(msg.caller);
                switch (outerMap2) {
                    case (null) {
                        let newInnerMap = HashMap.HashMap<Nat, Bool>(1, Nat.equal, Hash.hash);
                        newInnerMap.put(index, false);
                        isProcessing.put(msg.caller, newInnerMap)
                    };
                    case (?innerMap) {
                        innerMap.put(index, false)
                    }
                };

            };
            case (_) {
                return #Err(#GenericError { error_code = 408; message = "Not found Id" })
            }
        };
        return #Ok(1)
    };

    public shared (msg) func unWrapToken(value : Nat) : async ICRC1.TransferResult {
        let acct : Account = {
            owner = msg.caller;
            subaccount = null
        };
        var balance = await icrc1_balance_of(acct);

        if (value > balance) {
            return #Err(#GenericError { error_code = 001; message = "input exceed balance" })
        };

        // var transferBurnTx = await transferBurn(value, msg.caller);

        // switch (transferBurnTx) {
        //     case (#Err _) {
        //         return #Err(#GenericError { error_code = 002; message = "insufficient to burn" })
        //     };
        //     case (#Ok _) {}
        // };
        var _value : Balance = value;
        var defaultSubaccount : Blob = Utils.defaultSubAccount();
        // var transferArg = {
        //     from_subaccount = {
        //         owner = msg.caller;
        //         subaccount = ?defaultSubaccount
        //     };
        //     created_at_time = null;
        //     fee = null;
        //     memo = null;
        //     to = {
        //         owner = Principal.fromActor(this);
        //         subaccount = ?defaultSubaccount
        //     };
        //     amount = _value
        // };
        var transferArg : ICRC1.TransferFromArgs = {
            from_subaccount = {
                owner = msg.caller;
                subaccount = ?defaultSubaccount
            };
            created_at_time = null;
            fee = null;
            memo = null;
            to = {
                owner = deposit_id;
                subaccount = ?defaultSubaccount
            };
            amount = _value;
        };
        var tx0 = await icrc2_transfer_from(transferArg);
        switch (tx0) {
            case (#Err _) {
                return #Err(#GenericError { error_code = 002; message = "burn d.ckETH fail" });
            };
            case (#Ok _) {}
        };

        var transferValue = value * 999 / 1000;

        var canister2 = actor (canister_token_ID) : actor {
            icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult;
            // icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
        };
        // let approve : ICRC1.ApproveResult = await canister2.icrc2_approve {
        //     from_subaccount = null;
        //     spender = msg.caller;
        //     amount = transferValue;
        //     expires_at = null;
        //     fee = null;
        //     memo = null;
        //     created_at_time = null;
        //     expected_allowance = null
        // };
        let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
            from_subaccount = null;
            to = { owner = msg.caller; subaccount = null };
            amount = transferValue;
            memo = null;
            fee = null;
            created_at_time = null
        };
        return tx
        // return #Ok(1);
    };

    public shared (msg) func approveToken(value : Nat) : async ICRC1.ApproveResult {
        var ckETH_canister = actor (canister_token_ID) : actor {
            icrc2_approve(args : ICRC1.ApproveArgs) : async ICRC1.ApproveResult
        };
        let approve : ICRC1.ApproveResult = await ckETH_canister.icrc2_approve {
            from_subaccount = null;
            spender = Principal.fromActor(this);
            amount = value;
            expires_at = null;
            fee = null;
            memo = null;
            created_at_time = null;
            expected_allowance = null
        };
        return approve
    };

    public shared (msg) func privateWithdraw(index : Nat, caller : Principal) : async ICRC1.TransferResult {
        var maybeArray = depositInfoCkETH.get(caller);

        let outerMap0 = isProcessing.get(caller);
        switch (outerMap0) {
            case (null) {
                /* handle case when the outer map does not contain the key */
            };
            case (?innerMap) {
                let innerValue = innerMap.get(index);
                switch (innerValue) {
                    case (null) {
                        /* handle case when the inner map does not contain the key */
                    };
                    case (?value) {
                        if (value == true) {
                            return #Err(#GenericError { error_code = 000; message = "This Stake is processing" })
                        }
                    }
                }
            }
        };

        switch (maybeArray) {
            case (?r) {
                if (r.size() <= index) {
                    return #Err(#GenericError { error_code = 400; message = "Not found Id" })
                };
                if (r[index].isActive == false) {
                    return #Err(#GenericError { error_code = 404; message = "Already withdrawn" })
                };

                let outerMap1 = isProcessing.get(caller);
                switch (outerMap1) {
                    case (null) {
                        let newInnerMap = HashMap.HashMap<Nat, Bool>(1, Nat.equal, Hash.hash);
                        newInnerMap.put(index, true);
                        isProcessing.put(caller, newInnerMap)
                    };
                    case (?innerMap) {
                        innerMap.put(index, true)
                    }
                };

                var t1 = r[index].startTime + r[index].lastUpdateTime * 24 * 60 * 60 * 1_000_000_000;
                var t2 = Time.now();
                var updateDay = await compareTimestamps(t1, t2);
                assert (updateDay >= 0);

                var duration = r[index].duration;
                var firstDeposit = r[index].amount;

                if (updateDay >= duration) {
                    let result : ICRC1.TransferResult = await privateMint(caller, firstDeposit)
                } else {
                    var withdrawValue = (firstDeposit * 95 / 100);
                    var canister2 = actor (canister_token_ID) : actor {
                        icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult
                    };
                    let tx : ICRC1.TransferResult = await canister2.icrc1_transfer {
                        from_subaccount = null;
                        to = { owner = caller; subaccount = null };
                        amount = withdrawValue;
                        memo = null;
                        fee = null;
                        created_at_time = null
                    }
                };

                var decayPerDay = getDecayPerDay(r[index]);
                var currentMul : Float = await getCurrentMultiplier(r[index]);

                var arrTemp : DepositType = r[index];
                var updateInform : [DepositType] = [];

                var newDepInform : DepositType = {
                    id = index;
                    amount = r[index].amount;
                    duration = r[index].duration;
                    firstMultiplier = r[index].firstMultiplier;
                    isActive = false;
                    lastUpdateTime = updateDay; //updateDay
                    startTime = r[index].startTime
                };

                switch (maybeArray) {
                    case (?r) {
                        for (depEle in r.vals()) {
                            if (arrTemp == depEle) {
                                updateInform := Array.append(updateInform, [newDepInform])
                            } else {
                                updateInform := Array.append(updateInform, [depEle])
                            }
                        }
                    };
                    case (_) {}
                };
                // var isSucces = await privateWithdrawInterest(index, caller);
                // switch (isSucces) {
                //     case (#Err e) {
                //         return isSucces
                //     };
                //     case (_) {}
                // };
                
                // updateInform := Array.append(updateInform, [newDepInform]);
                if (true) {
                    depositInfoCkETH.put(caller, updateInform)
                } else {
                    depositInfoCkBTC.put(caller, updateInform)
                };

                let outerMap2 = isProcessing.get(caller);
                switch (outerMap2) {
                    case (null) {
                        let newInnerMap = HashMap.HashMap<Nat, Bool>(1, Nat.equal, Hash.hash);
                        newInnerMap.put(index, false);
                        isProcessing.put(caller, newInnerMap)
                    };
                    case (?innerMap) {
                        innerMap.put(index, false)
                    }
                }
            };
            case (_) {
                return #Err(#GenericError { error_code = 408; message = "Not found Id" })
            }
        };
        return #Ok(1)
    };

    public shared (msg) func withdrawDepositAndInterestArray(indexArr : [Nat]) : async [Nat] {
        var indexFail : [Nat] = [];
        var indexSucess : [Nat] = [];

        for (index in indexArr.vals()) {
            var tx : ICRC1.TransferResult = await privateWithdraw(index, msg.caller);
            switch (tx) {
                case (#Err _) {
                    indexFail := Array.append(indexFail, [index])
                };
                case (#Ok _) {
                    indexSucess := Array.append(indexSucess, [index])
                }
            }
        };
        return indexFail
    };

    private func transferBurn(value : Nat, userPId : Principal) : async ICRC1.TransferResult {
        var _amount : Balance = value;
        var defaultSubaccount : Blob = Utils.defaultSubAccount();

        var allowanceArg = {
            account = {
                owner = userPId;
                subaccount = ?defaultSubaccount
            };
            spender = {
                owner = Principal.fromActor(this);
                subaccount = ?defaultSubaccount
            }
        };
        var checkAllownce = await icrc2_allowance(allowanceArg);
        if (checkAllownce.allowance < value) {
            return #Err(#GenericError { error_code = 998; message = "Exceed allownce to burn" })
        };
        // var transferArg = {
        //     from_subaccount = {
        //         owner = userPId;
        //         subaccount = ?defaultSubaccount
        //     };
        //     created_at_time = null;
        //     fee = null;
        //     memo = null;
        //     to = {
        //         owner = Principal.fromActor(this);
        //         subaccount = ?defaultSubaccount
        //     };
        //     amount = _amount
        // };
        // var tx0 = await icrc2_transfer_from(transferArg);
        var transferArg : ICRC1.TransferFromArgs = {
            from_subaccount = {
                owner = userPId;
                subaccount = ?defaultSubaccount
            };
            created_at_time = null;
            fee = null;
            memo = null;
            to = {
                owner = Principal.fromActor(this);
                subaccount = ?defaultSubaccount
            };
            amount = _amount;
        };
        var tx0 = await icrc2_transfer_from(transferArg);
        var tx = await privateBurn(_amount);
        return tx
    };

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

    public shared (msg) func privateBurn(value : Nat) : async ICRC1.TransferResult {

        let burnParam : ICRC1.BurnArgs = {
            from_subaccount = null;
            amount = value;
            memo = null;
            created_at_time = null
        };

        let caller : Principal = owner_;
        let result : ICRC1.TransferResult = await burn(burnParam);
        return result
    };

    public func getPrincipal() : async Principal {
        return msg.caller
    };

    public shared (msg) func inc() : async Text {
        return Principal.toText(msg.caller)
    };
    public type Balance = Nat;

    public func timeNow() : async Int {
        return Time.now()
    };

    type Account = {
        owner : Principal;
        subaccount : ?Subaccount
    };
    let acct : Account = {
        owner = owner;
        subaccount = null
    };
    let init_args : ICRC1.TokenInitArgs = {
        name = _name;
        symbol = _symbol;
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
