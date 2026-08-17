import React from 'react';
import {
  SiGmail,
  SiGoogle,
  SiX,
  SiGithub,
  SiLinkedin,
  SiInstagram,
  SiDiscord,
  SiYoutube,
  SiTelegram,
  SiWhatsapp,
  SiMedium,
  SiSpotify,
  SiThreads,
  SiReddit,
  SiTwitch,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiSass,
  SiRedux,
  SiFigma,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFastapi,
  SiDjango,
  SiGo,
  SiRust,
  SiGraphql,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiSqlite,
  SiDocker,
  SiKubernetes,
  SiAmazonwebservices,
  SiGooglecloud,
  SiVercel,
  SiLinux,
  SiGit,
  SiNginx,
  SiOpenai,
  SiPytorch,
  SiTensorflow,
} from 'react-icons/si';

import {
  FaBriefcase,
  FaBuilding,
  FaGraduationCap,
  FaUniversity,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaGlobe,
  FaExternalLinkAlt,
  FaCloud,
} from 'react-icons/fa';

interface PortfolioIconProps {
  name?: string;
  platform?: string;
  url?: string;
  icon?: string | null;
  category?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PortfolioIcon({
  name = '',
  platform = '',
  url = '',
  icon,
  size = 18,
  className,
  style,
}: PortfolioIconProps) {
  // 1. Explicit Custom Icon / Emoji override (if provided and is an emoji or symbol)
  if (icon && icon.trim()) {
    const trimmed = icon.trim();
    const lowerIcon = trimmed.toLowerCase();
    if (lowerIcon === 'gmail') return <SiGmail size={size} className={className} style={style} />;
    if (lowerIcon === 'github') return <SiGithub size={size} className={className} style={style} />;
    if (lowerIcon === 'linkedin') return <SiLinkedin size={size} className={className} style={style} />;
    if (lowerIcon === 'twitter' || lowerIcon === 'x') return <SiX size={size} className={className} style={style} />;
    
    // Otherwise render UTF-8 emoji
    return (
      <span
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        className={className}
      >
        {trimmed}
      </span>
    );
  }

  // 2. Identify by platform, name, or URL string
  const target = `${platform} ${name} ${url}`.toLowerCase();

  // ── Channels & Brand Socials ──────────────────────────────
  if (target.includes('gmail') || target.includes('@gmail.com')) return <SiGmail size={size} className={className} style={style} />;
  if (target.includes('google')) return <SiGoogle size={size} className={className} style={style} />;
  if (target.includes('twitter') || target.includes('x.com') || target.includes('x / twitter') || platform.toLowerCase() === 'x') {
    return <SiX size={size} className={className} style={style} />;
  }
  if (target.includes('github')) return <SiGithub size={size} className={className} style={style} />;
  if (target.includes('linkedin')) return <SiLinkedin size={size} className={className} style={style} />;
  if (target.includes('instagram')) return <SiInstagram size={size} className={className} style={style} />;
  if (target.includes('discord')) return <SiDiscord size={size} className={className} style={style} />;
  if (target.includes('youtube')) return <SiYoutube size={size} className={className} style={style} />;
  if (target.includes('telegram') || target.includes('t.me')) return <SiTelegram size={size} className={className} style={style} />;
  if (target.includes('whatsapp') || target.includes('wa.me')) return <SiWhatsapp size={size} className={className} style={style} />;
  if (target.includes('threads')) return <SiThreads size={size} className={className} style={style} />;
  if (target.includes('reddit')) return <SiReddit size={size} className={className} style={style} />;
  if (target.includes('spotify')) return <SiSpotify size={size} className={className} style={style} />;
  if (target.includes('medium')) return <SiMedium size={size} className={className} style={style} />;
  if (target.includes('twitch')) return <SiTwitch size={size} className={className} style={style} />;
  if (target.includes('email') || target.includes('mail') || url.toLowerCase().startsWith('mailto:')) {
    return <FaEnvelope size={size} className={className} style={style} />;
  }

  // ── Frontend & Frameworks ─────────────────────────────────
  if (target.includes('next.js') || target.includes('nextjs')) return <SiNextdotjs size={size} className={className} style={style} />;
  if (target.includes('react')) return <SiReact size={size} className={className} style={style} />;
  if (target.includes('typescript')) return <SiTypescript size={size} className={className} style={style} />;
  if (target.includes('javascript')) return <SiJavascript size={size} className={className} style={style} />;
  if (target.includes('vue')) return <SiVuedotjs size={size} className={className} style={style} />;
  if (target.includes('angular')) return <SiAngular size={size} className={className} style={style} />;
  if (target.includes('svelte')) return <SiSvelte size={size} className={className} style={style} />;
  if (target.includes('tailwind')) return <SiTailwindcss size={size} className={className} style={style} />;
  if (target.includes('html')) return <SiHtml5 size={size} className={className} style={style} />;
  if (target.includes('css') || target.includes('sass')) return <SiCss3 size={size} className={className} style={style} />;
  if (target.includes('redux')) return <SiRedux size={size} className={className} style={style} />;
  if (target.includes('figma')) return <SiFigma size={size} className={className} style={style} />;

  // ── Backend & Runtime ─────────────────────────────────────
  if (target.includes('node.js') || target.includes('nodejs')) return <SiNodedotjs size={size} className={className} style={style} />;
  if (target.includes('express')) return <SiExpress size={size} className={className} style={style} />;
  if (target.includes('python')) return <SiPython size={size} className={className} style={style} />;
  if (target.includes('fastapi')) return <SiFastapi size={size} className={className} style={style} />;
  if (target.includes('django')) return <SiDjango size={size} className={className} style={style} />;
  if (target.includes('golang') || target.includes(' go')) return <SiGo size={size} className={className} style={style} />;
  if (target.includes('rust')) return <SiRust size={size} className={className} style={style} />;
  if (target.includes('graphql')) return <SiGraphql size={size} className={className} style={style} />;

  // ── Database & Storage ────────────────────────────────────
  if (target.includes('postgres')) return <SiPostgresql size={size} className={className} style={style} />;
  if (target.includes('mysql')) return <SiMysql size={size} className={className} style={style} />;
  if (target.includes('mongodb')) return <SiMongodb size={size} className={className} style={style} />;
  if (target.includes('redis')) return <SiRedis size={size} className={className} style={style} />;
  if (target.includes('prisma')) return <SiPrisma size={size} className={className} style={style} />;
  if (target.includes('supabase')) return <SiSupabase size={size} className={className} style={style} />;
  if (target.includes('firebase')) return <SiFirebase size={size} className={className} style={style} />;
  if (target.includes('sqlite')) return <SiSqlite size={size} className={className} style={style} />;

  // ── DevOps & Cloud ────────────────────────────────────────
  if (target.includes('docker')) return <SiDocker size={size} className={className} style={style} />;
  if (target.includes('kubernetes')) return <SiKubernetes size={size} className={className} style={style} />;
  if (target.includes('aws') || target.includes('amazon')) return <SiAmazonwebservices size={size} className={className} style={style} />;
  if (target.includes('gcp') || target.includes('google cloud')) return <SiGooglecloud size={size} className={className} style={style} />;
  if (target.includes('azure')) return <FaCloud size={size} className={className} style={style} />;
  if (target.includes('vercel')) return <SiVercel size={size} className={className} style={style} />;
  if (target.includes('linux')) return <SiLinux size={size} className={className} style={style} />;
  if (target.includes('git')) return <SiGit size={size} className={className} style={style} />;
  if (target.includes('nginx')) return <SiNginx size={size} className={className} style={style} />;

  // ── AI & Machine Learning ─────────────────────────────────
  if (target.includes('openai') || target.includes('gpt') || target.includes('llm') || target.includes('ai')) return <SiOpenai size={size} className={className} style={style} />;
  if (target.includes('pytorch')) return <SiPytorch size={size} className={className} style={style} />;
  if (target.includes('tensorflow')) return <SiTensorflow size={size} className={className} style={style} />;

  // ── Career, Education & UI Fallbacks ──────────────────────
  if (target.includes('university') || target.includes('school')) return <FaUniversity size={size} className={className} style={style} />;
  if (target.includes('degree') || target.includes('education')) return <FaGraduationCap size={size} className={className} style={style} />;
  if (target.includes('company') || target.includes('corp')) return <FaBuilding size={size} className={className} style={style} />;
  if (target.includes('experience') || target.includes('role') || target.includes('job')) return <FaBriefcase size={size} className={className} style={style} />;
  if (target.includes('location') || target.includes('city')) return <FaMapMarkerAlt size={size} className={className} style={style} />;
  if (target.includes('date') || target.includes('calendar')) return <FaCalendarAlt size={size} className={className} style={style} />;

  // Universal Default
  return <FaGlobe size={size} className={className} style={style} />;
}
