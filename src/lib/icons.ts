/**
 * Universal Portfolio Icon Registry & Design Tokens
 * 
 * Official Sources:
 * - Simple Icons (Brand & Tech Vectors): https://simpleicons.org/
 * - FontAwesome 6 (Universal UI): https://fontawesome.com/icons
 * - Unicode Consortium (Standard UTF-8 Emojis): https://unicode.org/emoji/charts/full-emoji-list.html
 * - Emojipedia: https://emojipedia.org/
 */

export interface IconDefinition {
  name: string;
  type: 'si' | 'fa' | 'emoji';
  token: string;
  category: string;
  sourceUrl?: string;
}

export const ICON_REGISTRY: Record<string, IconDefinition> = {
  // ── Channels & Brand Socials ──────────────────────────────
  gmail: { name: 'Gmail', type: 'si', token: 'SiGmail', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/gmail' },
  google: { name: 'Google', type: 'si', token: 'SiGoogle', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/google' },
  x: { name: 'X (Twitter)', type: 'si', token: 'SiX', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/x' },
  twitter: { name: 'Twitter', type: 'si', token: 'SiX', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/x' },
  github: { name: 'GitHub', type: 'si', token: 'SiGithub', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/github' },
  linkedin: { name: 'LinkedIn', type: 'si', token: 'SiLinkedin', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/linkedin' },
  instagram: { name: 'Instagram', type: 'si', token: 'SiInstagram', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/instagram' },
  discord: { name: 'Discord', type: 'si', token: 'SiDiscord', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/discord' },
  youtube: { name: 'YouTube', type: 'si', token: 'SiYoutube', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/youtube' },
  telegram: { name: 'Telegram', type: 'si', token: 'SiTelegram', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/telegram' },
  whatsapp: { name: 'WhatsApp', type: 'si', token: 'SiWhatsapp', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/whatsapp' },
  medium: { name: 'Medium', type: 'si', token: 'SiMedium', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/medium' },
  spotify: { name: 'Spotify', type: 'si', token: 'SiSpotify', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/spotify' },
  threads: { name: 'Threads', type: 'si', token: 'SiThreads', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/threads' },
  reddit: { name: 'Reddit', type: 'si', token: 'SiReddit', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/reddit' },
  twitch: { name: 'Twitch', type: 'si', token: 'SiTwitch', category: 'Social', sourceUrl: 'https://simpleicons.org/icons/twitch' },

  // ── Frontend Technologies ─────────────────────────────────
  react: { name: 'React', type: 'si', token: 'SiReact', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/react' },
  nextjs: { name: 'Next.js', type: 'si', token: 'SiNextdotjs', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/nextdotjs' },
  'next.js': { name: 'Next.js', type: 'si', token: 'SiNextdotjs', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/nextdotjs' },
  typescript: { name: 'TypeScript', type: 'si', token: 'SiTypescript', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/typescript' },
  javascript: { name: 'JavaScript', type: 'si', token: 'SiJavascript', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/javascript' },
  vue: { name: 'Vue.js', type: 'si', token: 'SiVuedotjs', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/vuedotjs' },
  'vue.js': { name: 'Vue.js', type: 'si', token: 'SiVuedotjs', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/vuedotjs' },
  angular: { name: 'Angular', type: 'si', token: 'SiAngular', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/angular' },
  svelte: { name: 'Svelte', type: 'si', token: 'SiSvelte', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/svelte' },
  tailwind: { name: 'Tailwind CSS', type: 'si', token: 'SiTailwindcss', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/tailwindcss' },
  'tailwind css': { name: 'Tailwind CSS', type: 'si', token: 'SiTailwindcss', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/tailwindcss' },
  html: { name: 'HTML5', type: 'si', token: 'SiHtml5', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/html5' },
  'html / css': { name: 'HTML / CSS', type: 'si', token: 'SiHtml5', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/html5' },
  css: { name: 'CSS3', type: 'si', token: 'SiCss3', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/css3' },
  sass: { name: 'Sass', type: 'si', token: 'SiSass', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/sass' },
  redux: { name: 'Redux', type: 'si', token: 'SiRedux', category: 'Frontend', sourceUrl: 'https://simpleicons.org/icons/redux' },
  figma: { name: 'Figma', type: 'si', token: 'SiFigma', category: 'Design', sourceUrl: 'https://simpleicons.org/icons/figma' },

  // ── Backend & Runtime ─────────────────────────────────────
  nodejs: { name: 'Node.js', type: 'si', token: 'SiNodedotjs', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/nodedotjs' },
  'node.js': { name: 'Node.js', type: 'si', token: 'SiNodedotjs', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/nodedotjs' },
  express: { name: 'Express', type: 'si', token: 'SiExpress', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/express' },
  'express.js': { name: 'Express', type: 'si', token: 'SiExpress', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/express' },
  python: { name: 'Python', type: 'si', token: 'SiPython', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/python' },
  fastapi: { name: 'FastAPI', type: 'si', token: 'SiFastapi', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/fastapi' },
  django: { name: 'Django', type: 'si', token: 'SiDjango', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/django' },
  go: { name: 'Go', type: 'si', token: 'SiGo', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/go' },
  golang: { name: 'Go', type: 'si', token: 'SiGo', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/go' },
  rust: { name: 'Rust', type: 'si', token: 'SiRust', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/rust' },
  graphql: { name: 'GraphQL', type: 'si', token: 'SiGraphql', category: 'Backend', sourceUrl: 'https://simpleicons.org/icons/graphql' },

  // ── Database & Storage ────────────────────────────────────
  postgresql: { name: 'PostgreSQL', type: 'si', token: 'SiPostgresql', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/postgresql' },
  postgres: { name: 'PostgreSQL', type: 'si', token: 'SiPostgresql', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/postgresql' },
  mysql: { name: 'MySQL', type: 'si', token: 'SiMysql', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/mysql' },
  mongodb: { name: 'MongoDB', type: 'si', token: 'SiMongodb', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/mongodb' },
  redis: { name: 'Redis', type: 'si', token: 'SiRedis', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/redis' },
  prisma: { name: 'Prisma ORM', type: 'si', token: 'SiPrisma', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/prisma' },
  'prisma orm': { name: 'Prisma ORM', type: 'si', token: 'SiPrisma', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/prisma' },
  supabase: { name: 'Supabase', type: 'si', token: 'SiSupabase', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/supabase' },
  firebase: { name: 'Firebase', type: 'si', token: 'SiFirebase', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/firebase' },
  sqlite: { name: 'SQLite', type: 'si', token: 'SiSqlite', category: 'Database', sourceUrl: 'https://simpleicons.org/icons/sqlite' },

  // ── DevOps & Cloud ────────────────────────────────────────
  docker: { name: 'Docker', type: 'si', token: 'SiDocker', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/docker' },
  kubernetes: { name: 'Kubernetes', type: 'si', token: 'SiKubernetes', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/kubernetes' },
  aws: { name: 'Amazon AWS', type: 'si', token: 'SiAmazonwebservices', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/amazonaws' },
  gcp: { name: 'Google Cloud', type: 'si', token: 'SiGooglecloud', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/googlecloud' },
  'google cloud (gcp)': { name: 'Google Cloud', type: 'si', token: 'SiGooglecloud', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/googlecloud' },
  azure: { name: 'Microsoft Azure', type: 'fa', token: 'FaCloud', category: 'DevOps', sourceUrl: 'https://fontawesome.com/icons/cloud' },
  vercel: { name: 'Vercel', type: 'si', token: 'SiVercel', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/vercel' },
  linux: { name: 'Linux', type: 'si', token: 'SiLinux', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/linux' },
  'linux / bash': { name: 'Linux', type: 'si', token: 'SiLinux', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/linux' },
  git: { name: 'Git', type: 'si', token: 'SiGit', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/git' },
  'git & github': { name: 'Git & GitHub', type: 'si', token: 'SiGit', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/git' },
  nginx: { name: 'Nginx', type: 'si', token: 'SiNginx', category: 'DevOps', sourceUrl: 'https://simpleicons.org/icons/nginx' },

  // ── AI & Machine Learning ─────────────────────────────────
  openai: { name: 'OpenAI', type: 'si', token: 'SiOpenai', category: 'AI/ML', sourceUrl: 'https://simpleicons.org/icons/openai' },
  pytorch: { name: 'PyTorch', type: 'si', token: 'SiPytorch', category: 'AI/ML', sourceUrl: 'https://simpleicons.org/icons/pytorch' },
  tensorflow: { name: 'TensorFlow', type: 'si', token: 'SiTensorflow', category: 'AI/ML', sourceUrl: 'https://simpleicons.org/icons/tensorflow' },
};
