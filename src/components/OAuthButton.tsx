import React from 'react';
import { initiateOAuthFlow } from '../services/oauthService';
import './OAuthButton.css';

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'facebook';
  onLoading?: (loading: boolean) => void;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onLoading }) => {
  const handleClick = () => {
    if (onLoading) {
      onLoading(true);
    }
    
    try {
      initiateOAuthFlow(provider);
    } catch (error) {
      console.error(`Error initiating ${provider} OAuth:`, error);
      if (onLoading) {
        onLoading(false);
      }
    }
  };

  const getProviderInfo = () => {
    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          icon: '🔵',
          color: '#4285F4',
          className: 'google-btn',
        };
      case 'github':
        return {
          name: 'GitHub',
          icon: '⚫',
          color: '#24292e',
          className: 'github-btn',
        };
      case 'facebook':
        return {
          name: 'Facebook',
          icon: '🔵',
          color: '#1877F2',
          className: 'facebook-btn',
        };
      default:
        return {
          name: provider,
          icon: '🔐',
          color: '#666',
          className: 'default-btn',
        };
    }
  };

  const providerInfo = getProviderInfo();

  return (
    <button
      type="button"
      className={`oauth-btn ${providerInfo.className}`}
      onClick={handleClick}
      style={{ '--provider-color': providerInfo.color } as React.CSSProperties}
    >
      <span className="oauth-icon">{providerInfo.icon}</span>
      <span className="oauth-text">Continue with {providerInfo.name}</span>
    </button>
  );
};
