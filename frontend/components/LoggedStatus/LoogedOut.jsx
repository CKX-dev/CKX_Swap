import React from 'react';

import { useAuth } from '../../hooks/use-auth-client';

function LoggedOut() {
  const { login } = useAuth();

  return (
    <div className="container">
      <button type="button" id="loginButton" onClick={login} style={{ display: 'flex', padding: '0px 16px 0px 16px' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '8px', alignSelf: 'center' }}
        >
          <path d="M13.3334 8.00002V5.33335H4.00002C3.6464 5.33335 3.30726 5.19288 3.05721 4.94283C2.80716 4.69278 2.66669 4.35364 2.66669 4.00002C2.66669 3.26669 3.26669 2.66669 4.00002 2.66669H12V5.33335" stroke="#A6ADFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.66669 4V12C2.66669 12.7333 3.26669 13.3333 4.00002 13.3333H13.3334V10.6667" stroke="#A6ADFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8C11.6464 8 11.3073 8.14048 11.0572 8.39052C10.8072 8.64057 10.6667 8.97971 10.6667 9.33333C10.6667 10.0667 11.2667 10.6667 12 10.6667H14.6667V8H12Z" stroke="#A6ADFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ color: 'rgba(166, 173, 250, 1)', fontSize: '16px', alignSelf: 'center' }}>Connect</p>
      </button>
    </div>
  );
}

export default LoggedOut;
