import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOAuthFlow, isOAuthCallback } from '../services/oauthService';
import './OAuthCallback.css';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Complete the OAuth flow
        const oauthUser = await completeOAuthFlow();
        
        if (oauthUser) {
          // Login user with OAuth data
          loginWithOAuth(oauthUser);
          setStatus('success');
          
          // Redirect to home after a brief delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage('Failed to authenticate. Please try again.');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage('An error occurred during authentication.');
      }
    };

    if (isOAuthCallback()) {
      handleOAuthCallback();
    } else {
      // Not an OAuth callback, redirect to home
      navigate('/', { replace: true });
    }
  }, [navigate, loginWithOAuth]);

  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-container">
        {status === 'processing' && (
          <>
            <div className="spinner"></div>
            <h2>Completing sign in...</h2>
            <p>Please wait while we authenticate you.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Sign in successful!</h2>
            <p>Redirecting you to the home page...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Sign in failed</h2>
            <p>{errorMessage}</p>
            <button 
              className="retry-btn"
              onClick={() => navigate('/login', { replace: true })}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
