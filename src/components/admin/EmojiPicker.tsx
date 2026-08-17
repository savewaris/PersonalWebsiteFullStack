'use client';

import React, { useState } from 'react';
import {
  HOBBY_EMOJI_PALETTE,
  INTEREST_EMOJI_PALETTE,
  TECH_EMOJI_PALETTE,
  SOCIAL_EMOJI_PALETTE,
  COMMON_EMOJI_PALETTE,
} from '@/lib/emojis';
import styles from './admin.module.css';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  category?: 'skills' | 'hobbies' | 'interests' | 'socials' | 'all';
}

export function EmojiPicker({ onSelect, category = 'all' }: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<'tech' | 'hobbies' | 'interests' | 'socials' | 'common'>(
    category === 'skills'
      ? 'tech'
      : category === 'hobbies'
      ? 'hobbies'
      : category === 'interests'
      ? 'interests'
      : category === 'socials'
      ? 'socials'
      : 'common'
  );

  const getPalette = () => {
    switch (activeTab) {
      case 'tech':
        return TECH_EMOJI_PALETTE;
      case 'hobbies':
        return HOBBY_EMOJI_PALETTE;
      case 'interests':
        return INTEREST_EMOJI_PALETTE;
      case 'socials':
        return SOCIAL_EMOJI_PALETTE;
      default:
        return COMMON_EMOJI_PALETTE;
    }
  };

  const palette = getPalette();

  return (
    <div style={{ marginTop: '8px', padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('common')}
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            background: activeTab === 'common' ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: activeTab === 'common' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Popular
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tech')}
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            background: activeTab === 'tech' ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: activeTab === 'tech' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Tech &amp; Stack
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hobbies')}
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            background: activeTab === 'hobbies' ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: activeTab === 'hobbies' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Hobbies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('interests')}
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            background: activeTab === 'interests' ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: activeTab === 'interests' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Interests
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('socials')}
          style={{
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            background: activeTab === 'socials' ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: activeTab === 'socials' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Socials
        </button>
      </div>

      {/* Emoji Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))', gap: '4px', maxHeight: '110px', overflowY: 'auto' }}>
        {palette.map((emoji, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(emoji)}
            style={{
              padding: '4px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
