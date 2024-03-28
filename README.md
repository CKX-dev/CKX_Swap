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

dfx start --clean
### open new terminal
# dfx deps pull
dfx deps init --argument '(null)' internet-identity
dfx deps deploy
# mops install
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
                  owner = principal "nhiuj-uow5k-5ngvy-3cley-gf72c-vkjn2-2xuky-fxfsp-wy4uo-3eroo-fae";
                  subaccount = null;
                  };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'

  dfx deploy token1 --argument '( record {
      name = "Chain-key Ether";
      symbol = "ckETH";
      decimals = 18;
      fee = 0;
      max_supply = 1000_000_000_000_000_000_000_000;
      initial_balances = vec {
          record {
              record {
                  owner = principal "nhiuj-uow5k-5ngvy-3cley-gf72c-vkjn2-2xuky-fxfsp-wy4uo-3eroo-fae";
                  subaccount = null;
              };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'

### Deploy swap canister and add authority for 2 token
dfx deploy --network local swap --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id swap)\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token0)\", \"ICRC1\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token1)\", \"ICRC1\")"
dfx canister call swap createPair "(principal \"$(dfx canister id token0)\", principal \"$(dfx canister id token1)\")"

### Deploy aggregator canister 
dfx deploy --network local aggregator --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id aggregator)\", \"$(dfx canister --network local id swap)\")"

### Deploy deposit (staking) canister and authority for 2 token
dfx deploy --network local deposit --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id deposit)\", \"d.ckETH'\", \"d.ckETH\", \"$(dfx canister --network local id token0)\")"

dfx canister call deposit addToken "(principal \"$(dfx canister id token0)\", \"ICRC2\")"
dfx canister call deposit addToken "(principal \"$(dfx canister id token1)\", \"ICRC2\")"

### Deploy borrow canister
dfx deploy --network local borrow --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id aggregator)\", \"$(dfx canister --network local id swap)\", principal \"$(dfx canister --network local id token0)\", principal \"$(dfx canister --network local id token1)\")"
```

### Step 3. Run UI
```bash
npm run dev
```

### Transfer token command
```bash
dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "<Replace with your principal-id>"}; amount= 1_000_000_000_000_000_000 })'

dfx canister call token1 icrc1_transfer '(record {  to = record {owner=principal "<Replace with your principal-id>"}; amount= 1_000_000_000_000_000_000 })'
```