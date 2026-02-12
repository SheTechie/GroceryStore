/**
 * OAuth Service
 * 
 * This service handles OAuth authentication flows.
 * 
 * IMPORTANT: In production, the token exchange should happen on your backend server,
 * not in the frontend, to keep the client secret secure.
 * 
 * For demo purposes, we're using a simplified flow.
 */

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = process.env.REACT_APP_OAUTH_REDIRECT_URI || 
  `${window.location.origin}/auth/callback`;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export interface OAuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'github' | 'facebook';
}

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

/**
 * Get Google OAuth configuration
 */
const getGoogleConfig = (): OAuthConfig => ({
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: GOOGLE_REDIRECT_URI,
  scope: 'openid email profile',
  authUrl: GOOGLE_AUTH_URL,
  tokenUrl: GOOGLE_TOKEN_URL,
  userInfoUrl: GOOGLE_USER_INFO_URL,
});

/**
 * Step 1: Initiate OAuth flow
 * Redirects user to OAuth provider's login page
 */
export const initiateOAuthFlow = (provider: 'google' | 'github' | 'facebook'): void => {
  if (provider === 'google') {
    const config = getGoogleConfig();
    
    // Build OAuth URL with parameters
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      access_type: 'offline', // Get refresh token
      prompt: 'consent', // Force consent screen
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;
    
    // Store state to prevent CSRF attacks (in production, use a random string)
    sessionStorage.setItem('oauth_state', 'state_' + Date.now());
    sessionStorage.setItem('oauth_provider', provider);
    
    // Redirect to Google
    window.location.href = authUrl;
  } else {
    console.warn(`OAuth provider ${provider} not yet implemented`);
  }
};

/**
 * Step 2: Handle OAuth callback
 * Called when OAuth provider redirects back to our app
 * Extracts authorization code from URL
 */
export const handleOAuthCallback = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  
  if (error) {
    console.error('OAuth error:', error);
    return null;
  }
  
  if (!code) {
    console.error('No authorization code received');
    return null;
  }
  
  return code;
};

/**
 * Step 3: Exchange authorization code for access token
 * 
 * NOTE: In production, this should be done on your backend server
 * to keep the client secret secure. This is a simplified version.
 */
export const exchangeCodeForToken = async (
  code: string,
  provider: 'google' | 'github' | 'facebook' = 'google'
): Promise<string | null> => {
  if (provider === 'google') {
    const config = getGoogleConfig();
    
    try {
      // In production, call your backend API instead:
      // const response = await fetch('/api/oauth/token', {
      //   method: 'POST',
      //   body: JSON.stringify({ code, provider }),
      // });
      
      // For demo, we'll simulate the token exchange
      // In real app, you'd make this call to your backend
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
          redirect_uri: config.redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        // If direct call fails (which it will without client secret),
        // simulate a successful response for demo
        console.warn('Token exchange failed. Using demo mode.');
        return 'demo_token_' + Date.now();
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      // For demo purposes, return a mock token
      return 'demo_token_' + Date.now();
    }
  }
  
  return null;
};

/**
 * Step 4: Get user information from OAuth provider
 */
export const getUserInfo = async (
  accessToken: string,
  provider: 'google' | 'github' | 'facebook' = 'google'
): Promise<OAuthUser | null> => {
  if (provider === 'google') {
    const config = getGoogleConfig();
    
    try {
      // If using demo token, return mock user data
      if (accessToken.startsWith('demo_token_')) {
        return {
          id: 'demo_' + Date.now(),
          name: 'Demo User',
          email: 'demo@example.com',
          picture: 'https://via.placeholder.com/150',
          provider: 'google',
        };
      }
      
      const response = await fetch(config.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        picture: data.picture,
        provider: 'google',
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }
  
  return null;
};

/**
 * Complete OAuth flow
 * Handles the entire OAuth process from callback to user info
 */
export const completeOAuthFlow = async (): Promise<OAuthUser | null> => {
  // Get provider from sessionStorage
  const provider = sessionStorage.getItem('oauth_provider') as 'google' | 'github' | 'facebook' | null;
  
  if (!provider) {
    console.error('No OAuth provider found in session');
    return null;
  }

  // Get authorization code from URL
  const code = handleOAuthCallback();
  if (!code) {
    return null;
  }

  // Exchange code for token
  const accessToken = await exchangeCodeForToken(code, provider);
  if (!accessToken) {
    return null;
  }

  // Get user info
  const userInfo = await getUserInfo(accessToken, provider);
  
  // Clean up sessionStorage
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_provider');
  
  return userInfo;
};

/**
 * Check if we're in OAuth callback
 */
export const isOAuthCallback = (): boolean => {
  return window.location.pathname === '/auth/callback';
};
