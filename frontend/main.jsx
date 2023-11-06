import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App/App';
import Notification from './components/Notification/Notification';

import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
    <Notification />
  </React.StrictMode>,
);
