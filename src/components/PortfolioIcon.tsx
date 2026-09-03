'use client';

import React, { useState } from 'react';
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
  SiLinuxfoundation,
  SiGit,
  SiNginx,
  SiOpenai,
  SiHuggingface,
  SiNvidia,
  SiPytorch,
  SiTensorflow,
  SiCoursera,
  SiHashicorp,
  SiOracle,
  SiUdemy,
  SiMeta,
  SiUdacity,
  SiEdx,
  SiPluralsight,
  SiDatacamp,
  SiCodecademy,
  SiFreecodecamp,
  SiScrimba,
  SiKaggle,
  SiLeetcode,
  SiHackerrank,
  SiKhanacademy,
  SiSnowflake,
  SiDatabricks,
  SiSalesforce,
  SiRedhat,
  SiCisco,
  SiVmware,
  SiStripe,
  SiApple,
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
  FaCloud,
  FaCertificate,
  FaAward,
  FaMicrosoft,
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
  const [imgError, setImgError] = useState(false);

  const getIconElement = () => {
    // 1. Remote Image URL (CDN / Google Favicon / Custom Upload)
    if (!imgError && icon && (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:image'))) {
      return (
        <img
          src={icon}
          alt={name || 'Logo'}
          width={size}
          height={size}
          style={{
            objectFit: 'contain',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '4px',
            verticalAlign: 'middle',
            display: 'inline-block',
            ...style,
          }}
          className={className}
          onError={() => {
            // Gracefully switch to fallback vector icon/symbol
            setImgError(true);
          }}
        />
      );
    }

    // 2. Explicit Token / Icon Key
    if (icon && icon.trim()) {
      const trimmed = icon.trim();
      const lower = trimmed.toLowerCase();

      // Socials & Brand
      if (lower === 'gmail') return <SiGmail size={size} className={className} style={style} />;
      if (lower === 'github') return <SiGithub size={size} className={className} style={style} />;
      if (lower === 'linkedin') return <SiLinkedin size={size} className={className} style={style} />;
      if (lower === 'twitter' || lower === 'x') return <SiX size={size} className={className} style={style} />;

      // Cloud & Enterprise
      if (lower === 'aws' || lower === 'amazon') return <SiAmazonwebservices size={size} className={className} style={style} />;
      if (lower === 'gcp' || lower === 'google' || lower === 'googlecloud') return <SiGooglecloud size={size} className={className} style={style} />;
      if (lower === 'azure' || lower === 'microsoft') return <FaMicrosoft size={size} className={className} style={style} />;
      if (lower === 'ibm') return <FaBuilding size={size} className={className} style={style} />;
      if (lower === 'oracle') return <SiOracle size={size} className={className} style={style} />;
      if (lower === 'hashicorp') return <SiHashicorp size={size} className={className} style={style} />;
      if (lower === 'redhat') return <SiRedhat size={size} className={className} style={style} />;
      if (lower === 'cisco') return <SiCisco size={size} className={className} style={style} />;
      if (lower === 'vmware') return <SiVmware size={size} className={className} style={style} />;
      if (lower === 'snowflake') return <SiSnowflake size={size} className={className} style={style} />;
      if (lower === 'databricks') return <SiDatabricks size={size} className={className} style={style} />;
      if (lower === 'salesforce') return <SiSalesforce size={size} className={className} style={style} />;
      if (lower === 'linux') return <SiLinux size={size} className={className} style={style} />;
      if (lower === 'linuxfoundation') return <SiLinuxfoundation size={size} className={className} style={style} />;
      if (lower === 'docker') return <SiDocker size={size} className={className} style={style} />;
      if (lower === 'kubernetes' || lower === 'cncf') return <SiKubernetes size={size} className={className} style={style} />;

      // MOOCs & Learning
      if (lower === 'coursera') return <SiCoursera size={size} className={className} style={style} />;
      if (lower === 'udemy') return <SiUdemy size={size} className={className} style={style} />;
      if (lower === 'edx') return <SiEdx size={size} className={className} style={style} />;
      if (lower === 'udacity') return <SiUdacity size={size} className={className} style={style} />;
      if (lower === 'pluralsight') return <SiPluralsight size={size} className={className} style={style} />;
      if (lower === 'datacamp') return <SiDatacamp size={size} className={className} style={style} />;
      if (lower === 'codecademy') return <SiCodecademy size={size} className={className} style={style} />;
      if (lower === 'freecodecamp') return <SiFreecodecamp size={size} className={className} style={style} />;
      if (lower === 'scrimba') return <SiScrimba size={size} className={className} style={style} />;
      if (lower === 'kaggle') return <SiKaggle size={size} className={className} style={style} />;
      if (lower === 'leetcode') return <SiLeetcode size={size} className={className} style={style} />;
      if (lower === 'hackerrank') return <SiHackerrank size={size} className={className} style={style} />;
      if (lower === 'khanacademy') return <SiKhanacademy size={size} className={className} style={style} />;

      // AI & Data
      if (lower === 'deeplearning') return <SiOpenai size={size} className={className} style={style} />;
      if (lower === 'openai') return <SiOpenai size={size} className={className} style={style} />;
      if (lower === 'huggingface') return <SiHuggingface size={size} className={className} style={style} />;
      if (lower === 'nvidia') return <SiNvidia size={size} className={className} style={style} />;

      // Ecosystems
      if (lower === 'meta') return <SiMeta size={size} className={className} style={style} />;
      if (lower === 'apple') return <SiApple size={size} className={className} style={style} />;
      if (lower === 'stripe') return <SiStripe size={size} className={className} style={style} />;
      if (lower === 'supabase') return <SiSupabase size={size} className={className} style={style} />;
      if (lower === 'vercel') return <SiVercel size={size} className={className} style={style} />;
      if (lower === 'prisma') return <SiPrisma size={size} className={className} style={style} />;
      if (lower === 'mongodb') return <SiMongodb size={size} className={className} style={style} />;
      if (lower === 'redis') return <SiRedis size={size} className={className} style={style} />;

      // Universities
      if (['stanford', 'mit', 'harvard', 'oxford', 'cambridge', 'berkeley', 'cmu', 'chula', 'mahidol', 'ku', 'kmutt'].includes(lower)) {
        return <FaUniversity size={size} className={className} style={style} />;
      }

      // If it looks like an emoji or single symbol
      if (trimmed.length <= 4) {
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
    }

    // 3. Identify by platform, name, or URL string
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
    if (target.includes('azure') || target.includes('microsoft')) return <FaMicrosoft size={size} className={className} style={style} />;
    if (target.includes('vercel')) return <SiVercel size={size} className={className} style={style} />;
    if (target.includes('linux')) return <SiLinux size={size} className={className} style={style} />;
    if (target.includes('git')) return <SiGit size={size} className={className} style={style} />;
    if (target.includes('nginx')) return <SiNginx size={size} className={className} style={style} />;

    // ── AI & Machine Learning ─────────────────────────────────
    if (target.includes('openai') || target.includes('gpt') || target.includes('llm') || target.includes('ai')) return <SiOpenai size={size} className={className} style={style} />;
    if (target.includes('huggingface') || target.includes('hugging face')) return <SiHuggingface size={size} className={className} style={style} />;
    if (target.includes('nvidia')) return <SiNvidia size={size} className={className} style={style} />;
    if (target.includes('pytorch')) return <SiPytorch size={size} className={className} style={style} />;
    if (target.includes('tensorflow')) return <SiTensorflow size={size} className={className} style={style} />;

    // ── MOOCs & Coding Platforms ──────────────────────────────
    if (target.includes('coursera')) return <SiCoursera size={size} className={className} style={style} />;
    if (target.includes('udemy')) return <SiUdemy size={size} className={className} style={style} />;
    if (target.includes('edx')) return <SiEdx size={size} className={className} style={style} />;
    if (target.includes('udacity')) return <SiUdacity size={size} className={className} style={style} />;
    if (target.includes('pluralsight')) return <SiPluralsight size={size} className={className} style={style} />;
    if (target.includes('datacamp')) return <SiDatacamp size={size} className={className} style={style} />;
    if (target.includes('codecademy')) return <SiCodecademy size={size} className={className} style={style} />;
    if (target.includes('freecodecamp')) return <SiFreecodecamp size={size} className={className} style={style} />;
    if (target.includes('scrimba')) return <SiScrimba size={size} className={className} style={style} />;
    if (target.includes('kaggle')) return <SiKaggle size={size} className={className} style={style} />;
    if (target.includes('leetcode')) return <SiLeetcode size={size} className={className} style={style} />;
    if (target.includes('hackerrank')) return <SiHackerrank size={size} className={className} style={style} />;
    if (target.includes('khan academy') || target.includes('khanacademy')) return <SiKhanacademy size={size} className={className} style={style} />;

    // ── Enterprise & Ecosystems ───────────────────────────────
    if (target.includes('ibm')) return <FaBuilding size={size} className={className} style={style} />;
    if (target.includes('oracle')) return <SiOracle size={size} className={className} style={style} />;
    if (target.includes('hashicorp')) return <SiHashicorp size={size} className={className} style={style} />;
    if (target.includes('redhat') || target.includes('red hat')) return <SiRedhat size={size} className={className} style={style} />;
    if (target.includes('cisco')) return <SiCisco size={size} className={className} style={style} />;
    if (target.includes('vmware')) return <SiVmware size={size} className={className} style={style} />;
    if (target.includes('snowflake')) return <SiSnowflake size={size} className={className} style={style} />;
    if (target.includes('databricks')) return <SiDatabricks size={size} className={className} style={style} />;
    if (target.includes('salesforce') || target.includes('trailhead')) return <SiSalesforce size={size} className={className} style={style} />;
    if (target.includes('meta')) return <SiMeta size={size} className={className} style={style} />;
    if (target.includes('apple')) return <SiApple size={size} className={className} style={style} />;
    if (target.includes('stripe')) return <SiStripe size={size} className={className} style={style} />;

    // ── Career, Education & UI Fallbacks ──────────────────────
    if (target.includes('university') || target.includes('school') || target.includes('stanford') || target.includes('harvard') || target.includes('mit') || target.includes('oxford') || target.includes('cambridge')) {
      return <FaUniversity size={size} className={className} style={style} />;
    }
    if (target.includes('degree') || target.includes('education')) return <FaGraduationCap size={size} className={className} style={style} />;
    if (target.includes('company') || target.includes('corp')) return <FaBuilding size={size} className={className} style={style} />;
    if (target.includes('cert') || target.includes('credential')) return <FaCertificate size={size} className={className} style={style} />;
    if (target.includes('award') || target.includes('honor')) return <FaAward size={size} className={className} style={style} />;
    if (target.includes('experience') || target.includes('role') || target.includes('job')) return <FaBriefcase size={size} className={className} style={style} />;
    if (target.includes('location') || target.includes('city')) return <FaMapMarkerAlt size={size} className={className} style={style} />;
    if (target.includes('date') || target.includes('calendar')) return <FaCalendarAlt size={size} className={className} style={style} />;

    // Universal Default
    return <FaGlobe size={size} className={className} style={style} />;
  };

  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
      {getIconElement()}
    </span>
  );
}
