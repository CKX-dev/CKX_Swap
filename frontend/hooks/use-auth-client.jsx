import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

import { AuthClient } from '@dfinity/auth-client';

/*
 * Import canister definitions like this:
 */
import * as swap from '../../src/declarations/swap';
import * as token0 from '../../src/declarations/token0';
import * as token1 from '../../src/declarations/token1';
import * as deposit0 from '../../src/declarations/deposit0';
import * as deposit1 from '../../src/declarations/deposit1';
import * as aggregator from '../../src/declarations/aggregator';
import * as borrow from '../../src/declarations/borrow';
import { getMapping } from '../utils';

const AuthContext = createContext();

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === 'ic'
        ? 'https://identity.ic0.app/#authorize'
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943#authorize`,
  },
};

/**
 *
 * @param options
 * @param {AuthClientCreateOptions} options.createOptions
 * @param {AuthClientLoginOptions} options.loginOptions
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [swapActor, setSwapActor] = useState(null);
  const [token0Actor, setToken0Actor] = useState(null);
  const [token1Actor, setToken1Actor] = useState(null);
  const [deposit0Actor, setDeposit0Actor] = useState(null);
  const [deposit1Actor, setDeposit1Actor] = useState(null);
  const [aggregatorActor, setAggregatorActor] = useState(null);
  const [borrowActor, setBorrowActor] = useState(null);

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  async function updateClient(client) {
    const isAuthenticatedRes = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticatedRes);

    const identityRes = client.getIdentity();
    setIdentity(identityRes);

    const principalRes = identityRes.getPrincipal();
    setPrincipal(principalRes);

    setAuthClient(client);

    const swapActorRes = swap.createActor(swap.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setSwapActor(swapActorRes);

    const token0ActorRes = token0.createActor(token0.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setToken0Actor(token0ActorRes);

    const token1ActorRes = token1.createActor(token1.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setToken1Actor(token1ActorRes);

    const deposit0ActorRes = deposit0.createActor(deposit0.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setDeposit0Actor(deposit0ActorRes);

    const deposit1ActorRes = deposit1.createActor(deposit1.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setDeposit1Actor(deposit1ActorRes);

    const aggregatorActorRes = aggregator.createActor(aggregator.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setAggregatorActor(aggregatorActorRes);

    const borrowActorRes = borrow.createActor(borrow.canisterId, {
      agentOptions: {
        identity: identityRes,
      },
    });

    setBorrowActor(borrowActorRes);
  }

  const getMappingFromPair = async (pairMapping) => {
    const pair = await getMapping(identity, pairMapping);
    return pair;
  };

  async function logout() {
    await authClient?.logout();
    await updateClient(authClient);
  }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    swapActor,
    token0Actor,
    token1Actor,
    deposit0Actor,
    deposit1Actor,
    aggregatorActor,
    borrowActor,
    getMappingFromPair,
  };
};

/**
 * @type {React.FC}
 */
export function AuthProvider({ children }) {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
