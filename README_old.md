The code is written in motoko and developed in The DFINITY command-line execution [environment](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent), please follow the documentation [here](https://internetcomputer.org/docs/current/developer-docs/setup/install/#installing-the-ic-sdk-1) to setup IC SDK environment and related command-line tools.

### Instructions for CKX Swap

```bash
git clone https://github.com/CKX-dev/CKX_Swap.git
cd CKX_Swap
npm install
dfx start --background
dfx deps pull
dfx deps init --argument '(null)' internet-identity
dfx deps deploy
mops install
dfx canister create --all
dfx build

dfx identity list
#### Make sure you not use anonymous identity
dfx identity use default

dfx deploy --network local swap --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id swap)\")"
npm run dev

```

```bash
### Open new terminal:

#### Replace with your identity principal on front end
dfx deploy token1 --argument '( record {
      name = "Chain-key Ether";
      symbol = "ckETH";
      decimals = 18;
      fee = 0;
      max_supply = 1000_000_000_000_000_000_000_000;
      initial_balances = vec {
          record {
              record {
                  owner = principal "<Replace with your principal-id on front end>";
                  subaccount = null;
              };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'


  dfx deploy token0 --argument '( record {
      name = "Chain-key Bitcoin";
      symbol = "ckBTC";
      decimals = 18;
      fee = 0;
      max_supply = 1000_000_000_000_000_000_000_000;
      initial_balances = vec {
          record {
              record {
                  owner = principal "<Replace with your principal-id on front end>";
                  subaccount = null;
                  };
              1000_000_000_000_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'

### Add token and create pair
dfx deploy --network local swap --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id swap)\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token0)\", \"ICRC1\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token1)\", \"ICRC1\")"
dfx canister call swap createPair "(principal \"$(dfx canister id token0)\", principal \"$(dfx canister id token1)\")"
```

```bash
### Archive
### DIP20 command - old version
dfx canister install token0 --argument="(\"/frontend/assets/ckETH.png\", \"Chain-key Ether\", \"ckETH\", 8, 10000000000000, principal \"$(dfx identity get-principal)\", 0)"
dfx canister install token1 --argument="(\"/frontend/assets/ckBTC.png\", \"Chain-key Bitcoin\", \"ckBTC\", 8, 10000000000000, principal \"$(dfx identity get-principal)\", 0)"

dfx canister call token0 mint "(principal \"euhen-l7nid-hchro-ehmy2-tjuyf-omnst-2mk32-uw6s2-oxwso-twha7-nqe\", 10000000000000)"
dfx canister call token1 mint "(principal \"euhen-l7nid-hchro-ehmy2-tjuyf-omnst-2mk32-uw6s2-oxwso-twha7-nqe\", 10000000000000)"
```

```bash
dfx deploy --network local deposit --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id deposit)\", \"d.ckETH'\", \"d.ckETH\", \"$(dfx canister --network local id token0)\")"

dfx canister call deposit addToken "(principal \"$(dfx canister id token0)\", \"ICRC2\")"
dfx canister call deposit addToken "(principal \"$(dfx canister id token1)\", \"ICRC2\")"

dfx canister call token0 icrc2_approve "(record { amount = 1_000_000_000_000_000_000; spender = principal \"bd3sg-teaaa-aaaaa-qaaba-cai\" })"
dfx canister call deposit deposit "(principal \"br5f7-7uaaa-aaaaa-qaaca-cai\",1_000_000_000_000_000,14)"

dfx canister call deposit withdrawInterest "(0)"

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

  dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "37her-33fjq-rfwha-qivgx-d6vla-k5m2i-h2g4r-nblsc-6adue-7bn7m-sae"}; amount= 1_000_000_000_000_000_000 })'

  dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "qnpll-mi6f2-gvc5r-jllnm-ksizs-ibfdb-yheio-3zlaw-zinu7-7ciuz-yqe"}; amount= 6_000_000_000_000_000_000 })'

  dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "br5f7-7uaaa-aaaaa-qaaca-cai"}; amount= 10_000_000_000_000_000_000 })'

  dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "be2us-64aaa-aaaaa-qaabq-cai"}; amount= 10_000_000_000_000_000_000 })'

  dfx canister call token0 icrc1_transfer '(record {  to = record {owner=principal "bkyz2-fmaaa-aaaaa-qaaaq-cai"}; amount= 10_000_000_000_000_000_000 })'
```

aggregator

```bash
dfx deploy --network local aggregator --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id aggregator)\", \"$(dfx canister --network local id swap)\")"

// br5f7-7uaaa-aaaaa-qaaca-cai
// b77ix-eeaaa-aaaaa-qaada-cai:bw4dl-smaaa-aaaaa-qaacq-cai

dfx canister call token0 icrc2_approve "(record { amount = 1_000_000_000; spender = principal \"$(dfx canister --network local id aggregator)\" })"

dfx canister call token1 icrc2_approve "(record { amount = 1_000_000_000; spender = principal \"$(dfx canister --network local id aggregator)\" })"

dfx canister call aggregator addLP "(
    principal \"b77ix-eeaaa-aaaaa-qaada-cai\",
    principal \"by6od-j4aaa-aaaaa-qaadq-cai\",
    10000000,
    20000000,
    0,
    0,
    0,
)"

dfx canister call aggregator icrc2_approve "(record { amount = 14141135; spender = principal \"$(dfx canister --network local id aggregator)\" })"

dfx canister call aggregator removeLP "(
    principal \"bw4dl-smaaa-aaaaa-qaacq-cai\",
    principal \"b77ix-eeaaa-aaaaa-qaada-cai\",
    14141135,
    0,
    0,
    principal \"37her-33fjq-rfwha-qivgx-d6vla-k5m2i-h2g4r-nblsc-6adue-7bn7m-sae\",
    0,
)"
```

```bash
// FOR LOAN

dfx deploy --network local borrow --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id aggregator)\", \"$(dfx canister --network local id swap)\", principal \"$(dfx canister --network local id token0)\", principal \"$(dfx canister --network local id token1)\")"

dfx canister call aggregator icrc2_approve "(record { amount = 14132130; spender = principal \"$(dfx canister --network local id borrow)\" })"

dfx canister call borrow deposit "(14132130)"
# dfx canister call borrow deposit "(14141135, 10000000, principal \"by6od-j4aaa-aaaaa-qaadq-cai\")"

------------------------------------------------------------------------------------------------------


dfx canister call borrow borrow "(8000000, principal \"by6od-j4aaa-aaaaa-qaadq-cai\")"

dfx canister call token1 icrc2_approve "(record { amount = 1_000_000_000; spender = principal \"$(dfx canister --network local id borrow)\" })"

dfx canister call borrow rePay "()"

dfx canister call borrow withdraw "()"

dfx canister call borrow getDepositId "()"

dfx canister call token1 icrc1_transfer '(record {  to = record {owner=principal "37her-33fjq-rfwha-qivgx-d6vla-k5m2i-h2g4r-nblsc-6adue-7bn7m-sae"}; amount= 1_000_000_000_000_000_000 })'

dfx canister call token1 icrc1_transfer '(record {  to = record {owner=principal "be2us-64aaa-aaaaa-qaabq-cai"}; amount= 1_000_000_000_000_000_000 })'
```

### Swap

```bash
dfx canister call token0 icrc2_approve "(record { amount = 1_000_000_000; spender = principal \"$(dfx canister --network local id swap)\" })"
dfx canister call token1 icrc2_approve "(record { amount = 1_000_000_000; spender = principal \"$(dfx canister --network local id swap)\" })"

dfx canister call swap deposit "(principal \"$(dfx canister --network local id token0)\",10000000)"
dfx canister call swap deposit "(principal \"$(dfx canister --network local id token1)\",10000000)"

dfx canister call swap swapExactTokensForTokens '(100000, 200, vec {"b77ix-eeaaa-aaaaa-qaada-cai"; "by6od-j4aaa-aaaaa-qaadq-cai"}, principal "37her-33fjq-rfwha-qivgx-d6vla-k5m2i-h2g4r-nblsc-6adue-7bn7m-sae", 99999999999999999999)'
```
