### Instructions

```bash
git clone https://github.com/CKX-dev/CKX_Swap.git
cd CKX_Swap
npm install
```

### Step 1. build canisters

```bash
#### Make sure you not use anonymous identity  ###
dfx identity list
dfx identity use default
##################################################

dfx start
### open new terminal
# dfx deps pull
# dfx deps init --argument '(null)' internet-identity
# dfx deps deploy

# mops install
dfx deploy internet_identity --no-wallet
dfx canister create --all
dfx build
```

### Step 2. deploy all canisters

```bash
### Deploy 2 example demo tokens
  dfx deploy token0 --argument '( record {
      name = "Chain-key Bitcoin";
      symbol = "ckBTC";
      decimals = 18;
      fee = 0;
      max_supply = 1000_000_000_000_000_000_000_000;
      initial_balances = vec {
          record {
              record {
                  owner = principal "ln6uo-kltso-5nnoy-vpx3t-5gssy-m4ub5-bk4op-tiey6-ceb65-jklgn-4ae";
                  subaccount = null;
                  };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })' --network ic --with-cycles 1000000000

  dfx deploy token1 --argument '( record {
      name = "Chain-key Ether";
      symbol = "ckETH";
      decimals = 18;
      fee = 0;
      max_supply = 1000_000_000_000_000_000_000_000;
      initial_balances = vec {
          record {
              record {
                  owner = principal "ln6uo-kltso-5nnoy-vpx3t-5gssy-m4ub5-bk4op-tiey6-ceb65-jklgn-4ae";
                  subaccount = null;
              };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })' --network ic --with-cycles 1000000000

### Deploy swap canister and add authority for 2 token
dfx deploy --network ic swap --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network ic id swap)\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token0 --network ic)\", \"ICRC1\")" --network ic
dfx canister call swap addToken "(principal \"$(dfx canister id token1 --network ic)\", \"ICRC1\")" --network ic
dfx canister call swap createPair "(principal \"$(dfx canister id token0 --network ic)\", principal \"$(dfx canister id token1 --network ic)\")" --network ic

### Deploy aggregator canister 
dfx deploy --network ic aggregator --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network ic id aggregator)\", \"$(dfx canister --network ic id swap)\")"

### Deploy deposit (staking) canister and authority for 2 token
dfx deploy --network ic deposit0 --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network ic id deposit0)\", principal \"$(dfx canister --network ic id borrow)\", \"d.ckBTC'\", \"d.ckBTC\", \"$(dfx canister --network ic id token0)\")"

dfx canister call deposit0 addToken "(principal \"$(dfx canister --network ic id token0)\", \"ICRC2\")" --network ic

dfx deploy --network ic deposit1 --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network ic id deposit1)\", principal \"$(dfx canister --network ic id borrow)\",\"d.ckETH'\", \"d.ckETH\", \"$(dfx canister --network ic id token1)\")"

dfx canister call deposit1 addToken "(principal \"$(dfx canister --network ic id token1)\", \"ICRC2\")" --network ic

### Deploy borrow canister
dfx deploy --network ic borrow --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network ic id aggregator)\", principal \"$(dfx canister --network ic id deposit0)\", principal \"$(dfx canister --network ic id deposit1)\", \"$(dfx canister --network ic id swap)\", principal \"$(dfx canister --network ic id token0)\", principal \"$(dfx canister --network ic id token1)\")"
```

### Step 3. Run UI
```bash
npm run dev
```

### Transfer token command
```bash
dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "323jc-yaaaa-aaaap-qhjsa-cai"}; amount= 200_000_000_000_000_000_000 })' --network ic

dfx canister call token1 icrc1_transfer '(record {  to = record {owner=principal "323jc-yaaaa-aaaap-qhjsa-cai"}; amount= 200_000_000_000_000_000_000 })' --network ic
```
