# OAuth 2.0 Authentication Guide

## What is OAuth?

**OAuth (Open Authorization)** is a protocol that allows users to grant third-party applications limited access to their resources without sharing passwords.

### Key Concepts

#### 1. **Why OAuth?**
- **Security**: Users don't share passwords with your app
- **Convenience**: One-click login with existing accounts (Google, Facebook, etc.)
- **Trust**: Users trust established providers (Google, GitHub, etc.)
- **User Experience**: Faster signup/login process

#### 2. **OAuth Flow (Simplified)**

```
User → Your App → OAuth Provider (Google) → User Authorizes → Provider Returns Token → Your App Uses Token
```

**Step-by-step:**
1. User clicks "Login with Google" in your app
2. User is redirected to Google's login page
3. User enters Google credentials (on Google's secure site)
4. User authorizes your app to access their info
5. Google redirects back to your app with an **authorization code**
6. Your app exchanges the code for an **access token**
7. Your app uses the token to get user info (name, email, etc.)
8. User is logged into your app

#### 3. **Key Terms**

- **OAuth Provider**: Service that authenticates users (Google, Facebook, GitHub)
- **Client ID**: Public identifier for your app (safe to expose)
- **Client Secret**: Private key (keep secret, server-side only)
- **Authorization Code**: Temporary code from provider
- **Access Token**: Token used to access user's info
- **Redirect URI**: URL where provider sends user back after login
- **Scope**: What permissions you're requesting (email, profile, etc.)

#### 4. **OAuth vs Traditional Login**

| Traditional Login | OAuth Login |
|------------------|-------------|
| User creates account in your app | User uses existing account (Google, etc.) |
| You store passwords (security risk) | No passwords stored |
| User remembers another password | User uses familiar account |
| You handle password reset | Provider handles security |

## Implementation in This App

### Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Clicks "Login with Google"
       ▼
┌─────────────┐
│  React App  │
│  (Frontend) │
└──────┬──────┘
       │
       │ 2. Opens Google OAuth URL
       ▼
┌─────────────┐
│   Google    │
│  OAuth Page │
└──────┬──────┘
       │
       │ 3. User logs in & authorizes
       ▼
┌─────────────┐
│   Google    │
│  Redirects   │
│  with code   │
└──────┬──────┘
       │
       │ 4. Code sent to your app
       ▼
┌─────────────┐
│  React App  │
│  Exchanges  │
│  code→token │
└──────┬──────┘
       │
       │ 5. Gets user info
       ▼
┌─────────────┐
│  AuthContext│
│  Stores user│
└─────────────┘
```

### Files Created

1. **`src/services/oauthService.ts`**: Handles OAuth flow
2. **`src/components/OAuthButton.tsx`**: OAuth login button
3. **Updated `src/context/AuthContext.tsx`**: Added OAuth login method
4. **Updated `src/pages/Login.tsx`**: Added OAuth buttons

### How It Works in Code

#### Step 1: User Clicks OAuth Button
```typescript
// User clicks "Login with Google"
<OAuthButton provider="google" />
```

#### Step 2: Redirect to Google
```typescript
// Opens Google OAuth URL
window.location.href = `https://accounts.google.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=email profile`
```

#### Step 3: Google Redirects Back
```typescript
// Google redirects to: http://localhost:3000/auth/callback?code=ABC123
// We extract the code from URL
const code = new URLSearchParams(window.location.search).get('code');
```

#### Step 4: Exchange Code for Token
```typescript
// Send code to your backend (or use client-side flow)
const token = await exchangeCodeForToken(code);
```

#### Step 5: Get User Info
```typescript
// Use token to get user info
const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${token}` }
});
```

#### Step 6: Store User in Context
```typescript
// Save user to AuthContext
setUser({
  id: userInfo.id,
  name: userInfo.name,
  email: userInfo.email,
  role: 'user'
});
```

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - **Application type**: Web application
   - **Name**: Grocery Store App
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)
6. Copy **Client ID** and **Client Secret**

### 2. Environment Variables

Create `.env` file:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_CLIENT_SECRET=your_client_secret_here
REACT_APP_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Security Notes

⚠️ **Important:**
- **Client Secret** should NEVER be in frontend code
- In production, use a backend server to handle token exchange
- For demo purposes, we're using a simplified flow
- Real apps should have a backend API endpoint for OAuth

## OAuth Providers

### Google OAuth
- **Pros**: Most popular, reliable, good documentation
- **Cons**: Requires Google account
- **Use case**: General purpose apps

### GitHub OAuth
- **Pros**: Developer-friendly, good for tech apps
- **Cons**: Requires GitHub account
- **Use case**: Developer tools, tech communities

### Facebook OAuth
- **Pros**: Large user base
- **Cons**: Privacy concerns, complex setup
- **Use case**: Social apps

## Testing OAuth

### Development Mode
1. Use `http://localhost:3000` as redirect URI
2. Test with your own Google account
3. Check browser console for errors

### Production Mode
1. Update redirect URI to your domain
2. Use HTTPS (required by OAuth)
3. Test with multiple accounts

## Common Issues

### 1. "Redirect URI mismatch"
- **Cause**: Redirect URI in code doesn't match Google Console
- **Fix**: Ensure exact match (including http/https, trailing slashes)

### 2. "Invalid client"
- **Cause**: Wrong Client ID
- **Fix**: Check `.env` file and Google Console

### 3. "Access blocked"
- **Cause**: App not verified (for production)
- **Fix**: Use test users in Google Console during development

## Best Practices

1. **Always use HTTPS in production** (OAuth requirement)
2. **Store tokens securely** (httpOnly cookies, not localStorage for sensitive apps)
3. **Handle token expiration** (refresh tokens)
4. **Validate tokens** on your backend
5. **Use scopes minimally** (only request what you need)
6. **Handle errors gracefully** (network issues, user cancellation)

## Next Steps

1. Add more providers (GitHub, Facebook)
2. Implement token refresh
3. Add backend API for secure token exchange
4. Implement logout from OAuth provider
5. Add user profile picture from OAuth
