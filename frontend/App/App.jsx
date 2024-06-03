import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from '../hooks/use-auth-client';

import { LOCATION } from '../constants';

import Layout from '../layout/Layout';
import SwapPage from '../pages/swap/SwapPage';
import LiquidityPage from '../pages/liquidity/LiquidityPage';
import AddLiquidityPage from '../pages/addLiquidity/AddLiquidityPage';
import PoolPage from '../pages/pool/PoolPage';
import Classic from '../pages/pool/ClassicPool/Classic';
import BorrowPage from '../pages/borrow/BorrowPage';
import LendPage from '../pages/lend/LendPage';
import PorfolioPage from '../pages/porfolio/PorfolioPage';
import LeaderboardPage from '../pages/leaderboard/LeaderboardPage';
import FaucetPage from '../pages/faucet/FaucetPage';
import BridgePage from '../pages/bridge/BridgePage';
import DissolvePage from '../pages/bridge/dissolve/DissolvePage';
import MintPage from '../pages/bridge/mint/MintPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={LOCATION.SWAP} replace />}
        />

        <Route path={LOCATION.SWAP} element={<Layout />}>
          <Route index element={<SwapPage />} />

          <Route exact path={LOCATION.LIQUIDITY} element={<LiquidityPage />} />
          <Route exact path={LOCATION.ADD_LIQUIDITY} element={<AddLiquidityPage />} />
        </Route>

        <Route path={LOCATION.BORROW} element={<Layout />}>
          <Route index element={<BorrowPage />} />
        </Route>

        <Route path={LOCATION.LEND} element={<Layout />}>
          <Route index element={<LendPage />} />
        </Route>

        <Route path={LOCATION.PORFOLIO} element={<Layout />}>
          <Route index element={<PorfolioPage />} />
        </Route>

        <Route path={LOCATION.LEADERBOARD} element={<Layout />}>
          <Route index element={<LeaderboardPage />} />
        </Route>

        <Route path={LOCATION.BRIDGE} element={<Layout />}>
          <Route index element={<BridgePage />} />

          <Route exact path="dissolve" element={<DissolvePage />} />
          <Route exact path="mint" element={<MintPage />} />
        </Route>

        <Route path={LOCATION.POOL} element={<Layout />}>
          <Route index element={<PoolPage />} />

          <Route path="classic/:pair" element={<Classic />} />
          <Route exact path="myPosition" element={<Classic />} />
          <Route exact path="deposit" element={<Classic />} />
          <Route exact path="withdraw" element={<Classic />} />
        </Route>

        <Route path={LOCATION.FAUCET} element={<Layout />}>
          <Route index element={<FaucetPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default function MyApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
