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

        <Route path="/pool" element={<Layout />}>
          <Route index element={<PoolPage />} />

          <Route exact path="/pool/classic" element={<Classic />} />
          <Route exact path="/pool/myPosition" element={<Classic />} />
          <Route exact path="/pool/deposit" element={<Classic />} />
          <Route exact path="/pool/withdraw" element={<Classic />} />
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
