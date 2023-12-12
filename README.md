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
dfx deploy token0 --argument '( record {                      
      name = "Chain-key Ether";                               
      symbol = "ckETH";                                             
      decimals = 8;                                                    
      fee = 0;                                                
      max_supply = 1_000_000_000_000;                         
      initial_balances = vec {                                
          record {
              record {                                        
                  owner = principal "<Replace with your principal-id on front end>";   
                  subaccount = null;                          
              };
              100_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'  


  dfx deploy token1 --argument '( record {                      
      name = "Chain-key Bitcoin";                                                                
      symbol = "ckBTC";                                             
      decimals = 8;                                                                                      
      fee = 0;                                                
      max_supply = 1_000_000_000_000;                         
      initial_balances = vec {                                
          record {             
              record {                                        
                  owner = principal "<Replace with your principal-id on front end>";   
                  subaccount = null;
                  };                                              
              100_000_000                                     
          }                    
      };                                                      
      min_burn_amount = 0;                                                                          
      minting_account = null; 
      advanced_settings = null;
  })'

### Add token and create pair
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

dfx canister call deposit addToken "(principal \"br5f7-7uaaa-aaaaa-qaaca-cai\", \"ICRC1\")"

dfx canister call token0 icrc2_approve "(record { amount = 1_000_000; spender = principal \"bd3sg-teaaa-aaaaa-qaaba-cai\" })"  
dfx canister call deposit deposit "(principal \"br5f7-7uaaa-aaaaa-qaaca-cai\",100_000,14)"
## dfx canister call deposit deposit "(principal \"br5f7-7uaaa-aaaaa-qaaca-cai\",1000)"

dfx deploy token0 --argument '( record {                      
      name = "Chain-key Ether";                               
      symbol = "ckETH";                                             
      decimals = 8;                                                    
      fee = 0;                                                
      max_supply = 1_000_000_000_000;                         
      initial_balances = vec {                                
          record {
              record {                                        
                  owner = principal "nhiuj-uow5k-5ngvy-3cley-gf72c-vkjn2-2xuky-fxfsp-wy4uo-3eroo-fae";   
                  subaccount = null;                          
              };
              100_000_000_000
          }
      };
      min_burn_amount = 0;
      minting_account = null;
      advanced_settings = null;
  })'  


  dfx deploy token1 --argument '( record {                      
      name = "Chain-key Bitcoin";                                                                
      symbol = "ckBTC";                                             
      decimals = 8;                                                                                      
      fee = 0;                                                
      max_supply = 1_000_000_000_000;                         
      initial_balances = vec {                                
          record {             
              record {                                        
                  owner = principal "nhiuj-uow5k-5ngvy-3cley-gf72c-vkjn2-2xuky-fxfsp-wy4uo-3eroo-fae";   
                  subaccount = null;
                  };                                              
              100_000_000_000                                     
          }                    
      };                                                      
      min_burn_amount = 0;                                                                          
      minting_account = null; 
      advanced_settings = null;
  })'
```