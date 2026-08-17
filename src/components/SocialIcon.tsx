import React from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaDiscord,
  FaEnvelope,
  FaYoutube,
  FaTelegram,
  FaGlobe,
  FaTwitch,
  FaMedium,
  FaSpotify,
  FaFacebook,
} from 'react-icons/fa';

interface SocialIconProps {
  platform: string;
  url?: string;
  icon?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SocialIcon({ platform, url = '', icon, size, className, style }: SocialIconProps) {
  if (icon && icon.trim()) {
    // If it's a direct emoji or single symbol
    return <span style={{ ...style, fontSize: size ? `${size}px` : undefined }} className={className}>{icon}</span>;
  }

  const p = platform.toLowerCase();
  const u = url.toLowerCase();

  if (p.includes('github') || u.includes('github.com')) return <FaGithub size={size} className={className} style={style} />;
  if (p.includes('linkedin') || u.includes('linkedin.com')) return <FaLinkedin size={size} className={className} style={style} />;
  if (p.includes('instagram') || u.includes('instagram.com')) return <FaInstagram size={size} className={className} style={style} />;
  if (p.includes('twitter') || p.includes(' x') || p === 'x' || u.includes('twitter.com') || u.includes('x.com')) return <FaTwitter size={size} className={className} style={style} />;
  if (p.includes('discord') || u.includes('discord.')) return <FaDiscord size={size} className={className} style={style} />;
  if (p.includes('email') || p.includes('mail') || u.startsWith('mailto:')) return <FaEnvelope size={size} className={className} style={style} />;
  if (p.includes('youtube') || u.includes('youtube.com')) return <FaYoutube size={size} className={className} style={style} />;
  if (p.includes('telegram') || u.includes('t.me')) return <FaTelegram size={size} className={className} style={style} />;
  if (p.includes('twitch') || u.includes('twitch.tv')) return <FaTwitch size={size} className={className} style={style} />;
  if (p.includes('medium') || u.includes('medium.com')) return <FaMedium size={size} className={className} style={style} />;
  if (p.includes('spotify') || u.includes('spotify.com')) return <FaSpotify size={size} className={className} style={style} />;
  if (p.includes('facebook') || u.includes('facebook.com')) return <FaFacebook size={size} className={className} style={style} />;

  return <FaGlobe size={size} className={className} style={style} />;
}
