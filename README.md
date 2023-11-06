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
dfx canister create --all
dfx build

dfx identity list
#### Make sure you not use anonymous identity 
dfx identity use default

dfx canister install token0 --argument="(\"/frontend/assets/ckETH.png\", \"Chain-key Ether\", \"ckETH\", 8, 10000000000000, principal \"$(dfx identity get-principal)\", 0)"
dfx canister install token1 --argument="(\"/frontend/assets/ckBTC.png\", \"Chain-key Bitcoin\", \"ckBTC\", 8, 10000000000000, principal \"$(dfx identity get-principal)\", 0)"
dfx deploy --network local swap --argument="(principal \"$(dfx identity get-principal)\", principal \"$(dfx canister --network local id swap)\")"
npm run dev

### Open new terminal:

dfx canister call swap addToken "(principal \"$(dfx canister id token0)\", \"DIP20\")"
dfx canister call swap addToken "(principal \"$(dfx canister id token1)\", \"DIP20\")"
dfx canister call swap createPair "(principal \"$(dfx canister id token0)\", principal \"$(dfx canister id token1)\")"

#### Replace with your identity principal on front end

dfx canister call token0 mint "(principal \"pr7zo-q76yf-7eapm-nh23w-bj5s5-ulqok-jcyhe-ed2e4-fbsg4-tnpd6-pae\", 10000000000000)"
dfx canister call token1 mint "(principal \"pr7zo-q76yf-7eapm-nh23w-bj5s5-ulqok-jcyhe-ed2e4-fbsg4-tnpd6-pae\", 10000000000000)"
```