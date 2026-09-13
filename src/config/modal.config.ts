/**
 * Centralized Modal System Configuration
 * Single source of truth for modal sizing tiers, spring physics, and visual tokens.
 * All public and admin modals across the portfolio derive their layout,
 * animations, and tokens from this file.
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface ModalSizeConfig {
  maxWidth: string;
  maxHeight?: string;
  minHeight?: string;
  padding: string;
  borderRadius: string;
}

export interface ModalThemeTokens {
  backdropBlur: string;
  backdropBg: string;
  contentBg: string;
  borderColor: string;
  boxShadow: string;
  headerBorderColor: string;
  closeBtnBg: string;
  closeBtnHoverBg: string;
  closeBtnColor: string;
}

export interface ModalPhysicsConfig {
  overlay: {
    initial: { opacity: number };
    animate: { opacity: number };
    exit: { opacity: number };
    transition: { duration: number; ease: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear' };
  };
  content: {
    initial: { opacity: number; scale: number; y: number };
    animate: { opacity: number; scale: number; y: number };
    exit: { opacity: number; scale: number; y: number };
    transition: {
      type: 'spring';
      stiffness: number;
      damping: number;
      mass: number;
    };
  };
}

export interface ModalConfig {
  sizes: Record<ModalSize, ModalSizeConfig>;
  theme: ModalThemeTokens;
  physics: ModalPhysicsConfig;
}

export const MODAL_CONFIG: ModalConfig = {
  sizes: {
    sm: {
      maxWidth: '460px',
      padding: '24px',
      borderRadius: '16px',
    },
    md: {
      maxWidth: '600px',
      padding: '24px',
      borderRadius: '18px',
    },
    lg: {
      maxWidth: '840px',
      padding: '28px',
      borderRadius: '20px',
    },
    xl: {
      maxWidth: '1120px',
      padding: '28px',
      borderRadius: '22px',
    },
    fullscreen: {
      maxWidth: '96vw',
      maxHeight: '94vh',
      minHeight: '85vh',
      padding: '20px',
      borderRadius: '20px',
    },
  },

  theme: {
    backdropBlur: '12px',
    backdropBg: 'rgba(5, 7, 15, 0.76)',
    contentBg: 'rgba(15, 18, 28, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow:
      '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 40px -10px rgba(94, 106, 210, 0.15)',
    headerBorderColor: 'rgba(255, 255, 255, 0.08)',
    closeBtnBg: 'rgba(255, 255, 255, 0.06)',
    closeBtnHoverBg: 'rgba(255, 255, 255, 0.14)',
    closeBtnColor: 'var(--text-secondary, #94a3b8)',
  },

  physics: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 12 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 8 },
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 30,
        mass: 0.8,
      },
    },
  },
};
