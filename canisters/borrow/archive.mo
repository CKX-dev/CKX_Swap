import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
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
// import Types "./types";
// import Cap "./cap/Cap";
// import CapV2 "./cap/CapV2";
// import IC "./cap/IC";
// import Root "./cap/Root";
import Cycles = "mo:base/ExperimentalCycles";
import Nat32 "mo:base/Nat32";
import Blob "mo:base/Blob";
// import Hex "./Hex";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Float "mo:base/Float";
// import Account "./Account";

shared (msg) actor class Deposit(owner_ : Principal, deposit_id : Principal) = this {
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
    public type ICRC1TokenActor = actor {
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

    public type TransferReceipt = {
        #Ok : Nat;
        #Err : Errors;
        #ICRCTransferError : ICRCTransferError
    };
    type TokenActorVariable = {
        #ICRC1TokenActor : ICRC1TokenActor;
        #Err : Errors
    };
    public type TxReceipt = Result.Result<Nat, Text>;
    private stable var txcounter : Nat = 0;

    public shared (msg) func deposit(tokenId : Principal, value : Nat) : async TxReceipt {
        let tid : Text = Principal.toText(tokenId);
        ////// CHECK THIS
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

        txcounter += 1;
        return #ok(txcounter - 1)
    };

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
        var tokenCanister : ICRC1TokenActor = actor (tokenId);
        return #ICRC1TokenActor(tokenCanister)
    };
    public shared (msg) func getICRC1SubAccountBalance(user : Principal, tid : Text) : async ICRC1SubAccountBalance {
        // assert (_checkAuth(msg.caller));
        let tokenCanister = _getTokenActor(tid);
        switch (tokenCanister) {
            case (#ICRC1TokenActor(icrc1TokenActor)) {
                let subaccount = getICRC1SubAccount(user);
                var depositSubAccount : ICRCAccount = {
                    owner = Principal.fromActor(this);
                    subaccount = ?subaccount
                };
                let balance = await icrc1TokenActor.icrc1_balance_of(depositSubAccount);
                return #ok(balance)
            };
            case (_) {
                return #err("tid/tokenid passed is not a supported ICRC1 canister")
            }
        }
    };

    private func _transferFrom(tokenCanister : TokenActorVariable, caller : Principal, value : Nat, fee : Nat) : async TransferReceipt {
        switch (tokenCanister) {
            case (#ICRC1TokenActor(icrc1TokenActor)) {

                let subaccount = getICRC1SubAccount(caller);
                var depositSubAccount : ICRCAccount = {
                    // owner = Principal.fromActor(this);
                    owner = caller;
                    // subaccount = ?subaccount
                    subaccount = null
                };
                var balance = await icrc1TokenActor.icrc1_balance_of(depositSubAccount);
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
                    // var txid = await icrc1TokenActor.icrc1_transfer(transferArg);

                    var txid = await icrc1TokenActor.icrc2_transfer_from(transferArg);
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

    // private var lppattern : Text.Pattern = #text ":";
    // private var lptokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);

    public query func balanceOf(tokenId : Text, who : Principal) : async Nat {
        return tokens.balanceOf(tokenId, who)
    };

    private func _getTokenActorWithType(tokenId : Text, tokenType : Text) : TokenActorVariable {
        switch (tokenType) {
            case ("ICRC1") {
                var tokenCanister : ICRC1TokenActor = actor (tokenId);
                return #ICRC1TokenActor(tokenCanister)
            };
            case ("ICRC2") {
                //ICRC2 not implemented.
                Prelude.unreachable()
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
            case (#ICRC1TokenActor(icrc1TokenActor)) {
                var icrc1_metadata = await icrc1TokenActor.icrc1_metadata();
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
    private var intetest: Float = 0.5;

  public func getInterest(t1: Time.Time, t2: Time.Time, firstMultiplier: Float, decayPerDay: Float, period: Nat) : async Float {
    var temp: Int = await compareTimestamps(t1, t2);
    var n: Float = Float.fromInt(temp);
    let condition = Float.greaterOrEqual(n, Float.fromInt(period));
    if(condition){
      n := Float.fromInt(period);
    };
    var X: Float = firstMultiplier;

    var result = (intetest/100)*((n+1)*X-((decayPerDay*n*(n+1))/2));
    return result;
  };

  public func compareTimestamps(t1: Time.Time, t2: Time.Time) : async Int {
    let nanosecondsPerSecond : Nat = 1_000_000_000;
    let secondsPerMinute : Nat = 60;
    let minutesPerHour : Nat = 60;
    let hoursPerDay : Nat = 24;

    let nanosecondsPerDay : Nat = hoursPerDay * minutesPerHour * secondsPerMinute * nanosecondsPerSecond;

    if (t1 > t2) {
      let diff = (t1 - t2) / nanosecondsPerDay;
      if(diff > 0){
        return diff - 1;
      }else{
        return 0;
      }
    } else if (t2 > t1) {
      let diff = (t2 - t1) / nanosecondsPerDay;
      if(diff > 0){
        return diff - 1;
      }else{
        return 0;
      }
    } else {
      return 0;
    }
  };

// Get mutiplier
    public func getMultiplier(t1: Time.Time, t2: Time.Time, firstMultiplier: Float, decayPerDay: Float, period: Nat) : async Float{
        var temp: Int = await compareTimestamps(t1, t2);
        var n: Float = Float.fromInt(temp);
        let condition = Float.greaterOrEqual(n, Float.fromInt(period));
        if(condition){
            n := Float.fromInt(period);
        };

        return firstMultiplier - decayPerDay * n;
    };
}
