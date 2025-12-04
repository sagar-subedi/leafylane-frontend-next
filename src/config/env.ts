// Environment configuration
export const config = {
    // OAuth2 Auth Server URL - use production URL if NEXT_PUBLIC_AUTH_SERVER_URL is not set
    authServerUrl: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'https://oauth2-auth-server.sagar88.com.np',

    // Frontend Callback URL
    callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || 'https://leafylane.sagar88.com.np/callback',

    // OAuth2 Client Configuration
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || 'leafylane-client-spa',
    scope: process.env.NEXT_PUBLIC_SCOPE || 'store.shop offline_access',
    state: process.env.NEXT_PUBLIC_STATE || 'dJMLwhM2coXgXTiQ5m4ooL66Bo1z94tqwlcYGTFiiu8=',

    // PKCE Configuration
    codeChallenge: 'Xs5p9CFnsixtb5Fnq5JK9E0Kj5eh0WBhFuvvhAfhrMo',
    codeChallengeMethod: 'S256',
    codeVerifier: 'pUh2fQtq~Cqc~aWskoZK2BWEFezeLZCK1rADtcvVbdh',
};

// Helper to check if running in development
export const isDevelopment = process.env.NODE_ENV === 'development';
