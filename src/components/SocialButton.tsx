'use client';

import React, { useState } from 'react';
import { PortfolioIcon } from '@/components/PortfolioIcon';

interface SocialButtonProps {
  platform: string;
  url: string;
  icon?: string | null;
  actionType?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  showPlatformLabel?: boolean;
}

export function SocialButton({
  platform,
  url,
  icon,
  actionType = 'redirect',
  size = 20,
  className,
  style,
  showPlatformLabel = false,
}: SocialButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Clean mailto: or https:// if copying a pure handle/email
      const textToCopy = url.replace(/^mailto:/, '').replace(/^https?:\/\//, '');
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (actionType === 'copy') {
    return (
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          type="button"
          onClick={handleCopy}
          className={className}
          title={`Click to copy: ${url}`}
          style={{
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            background: 'inherit',
            color: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '24px',
            padding: '3px 4px',
            gap: showPlatformLabel ? '6px' : undefined,
            ...style,
          }}
        >
          <PortfolioIcon platform={platform} url={url} icon={icon} size={size} />
          {showPlatformLabel && <span>{platform}</span>}
        </button>

        {/* Animated Copied Tooltip */}
        {copied && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent, #5e6ad2)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              zIndex: 100,
              animation: 'fadeInUp 0.2s ease forwards',
            }}
          >
            Copied! 📋
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={platform}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '24px',
        padding: '3px 4px',
        ...style,
      }}
    >
      <PortfolioIcon platform={platform} url={url} icon={icon} size={size} />
      {showPlatformLabel && <span>{platform}</span>}
    </a>
  );
}
