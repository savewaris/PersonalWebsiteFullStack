import { apiSuccess, apiError, requireAuthSession } from '@/lib/api-utils';

interface RawTopicItem {
  name: string;
  display_name?: string | null;
  short_description?: string | null;
  description?: string | null;
}

const CATEGORY_MAP: Record<string, { category: string; icon: string }> = {
  react: { category: 'Frontend', icon: '⚛️' },
  vue: { category: 'Frontend', icon: '💚' },
  angular: { category: 'Frontend', icon: '🅰️' },
  svelte: { category: 'Frontend', icon: '🧡' },
  nextjs: { category: 'Frontend', icon: '▲' },
  tailwind: { category: 'Frontend', icon: '🎨' },
  typescript: { category: 'Frontend', icon: '🔷' },
  javascript: { category: 'Frontend', icon: '🟨' },
  html: { category: 'Frontend', icon: '🌐' },
  css: { category: 'Frontend', icon: '🎨' },
  nodejs: { category: 'Backend', icon: '🟢' },
  python: { category: 'Backend', icon: '🐍' },
  golang: { category: 'Backend', icon: '🐹' },
  rust: { category: 'Backend', icon: '🦀' },
  java: { category: 'Backend', icon: '☕' },
  kotlin: { category: 'Backend', icon: '📱' },
  docker: { category: 'Cloud / DevOps', icon: '🐳' },
  kubernetes: { category: 'Cloud / DevOps', icon: '☸️' },
  aws: { category: 'Cloud / DevOps', icon: '☁️' },
  gcp: { category: 'Cloud / DevOps', icon: '☁️' },
  azure: { category: 'Cloud / DevOps', icon: '☁️' },
  graphql: { category: 'Backend', icon: '🕸️' },
  postgresql: { category: 'Database', icon: '🐘' },
  mongodb: { category: 'Database', icon: '🍃' },
  redis: { category: 'Database', icon: '⚡' },
  ai: { category: 'AI / ML', icon: '🤖' },
  machine_learning: { category: 'AI / ML', icon: '🧠' },
  llm: { category: 'AI / ML', icon: '✨' },
  langchain: { category: 'AI / ML', icon: '🦜' },
  pytorch: { category: 'AI / ML', icon: '🔥' },
  tensorflow: { category: 'AI / ML', icon: '🟧' },
};

const WORLD_LANGUAGES = [
  { name: 'English', flag: '🇬🇧', region: 'European', defaultProficiency: 'Fluent' },
  { name: 'Thai', flag: '🇹🇭', region: 'Asian', defaultProficiency: 'Native' },
  { name: 'Mandarin Chinese', flag: '🇨🇳', region: 'Asian', defaultProficiency: 'Intermediate' },
  { name: 'Japanese', flag: '🇯🇵', region: 'Asian', defaultProficiency: 'Intermediate' },
  { name: 'Korean', flag: '🇰🇷', region: 'Asian', defaultProficiency: 'Basic' },
  { name: 'Spanish', flag: '🇪🇸', region: 'Americas / European', defaultProficiency: 'Intermediate' },
  { name: 'French', flag: '🇫🇷', region: 'European', defaultProficiency: 'Intermediate' },
  { name: 'German', flag: '🇩🇪', region: 'European', defaultProficiency: 'Intermediate' },
  { name: 'Portuguese', flag: '🇧🇷', region: 'Americas / European', defaultProficiency: 'Basic' },
  { name: 'Italian', flag: '🇮🇹', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Russian', flag: '🇷🇺', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Arabic', flag: '🇸🇦', region: 'Middle Eastern', defaultProficiency: 'Basic' },
  { name: 'Hindi', flag: '🇮🇳', region: 'Asian', defaultProficiency: 'Basic' },
  { name: 'Vietnamese', flag: '🇻🇳', region: 'Asian', defaultProficiency: 'Basic' },
  { name: 'Indonesian', flag: '🇮🇩', region: 'Asian', defaultProficiency: 'Intermediate' },
  { name: 'Malay', flag: '🇲🇾', region: 'Asian', defaultProficiency: 'Basic' },
  { name: 'Tagalog / Filipino', flag: '🇵🇭', region: 'Asian', defaultProficiency: 'Basic' },
  { name: 'Dutch', flag: '🇳🇱', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Swedish', flag: '🇸🇪', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Norwegian', flag: '🇳🇴', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Danish', flag: '🇩🇰', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Finnish', flag: '🇫🇮', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Polish', flag: '🇵🇱', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Turkish', flag: '🇹🇷', region: 'Middle Eastern', defaultProficiency: 'Basic' },
  { name: 'Greek', flag: '🇬🇷', region: 'European', defaultProficiency: 'Basic' },
  { name: 'Hebrew', flag: '🇮🇱', region: 'Middle Eastern', defaultProficiency: 'Basic' },
];

function inferCategoryAndIcon(name: string, query?: string): { category: string; icon: string } {
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return val;
    }
  }

  if (query) {
    const qLower = query.toLowerCase();
    if (qLower.includes('ai') || qLower.includes('ml') || qLower.includes('llm')) return { category: 'AI / ML', icon: '🤖' };
    if (qLower.includes('front') || qLower.includes('ui') || qLower.includes('css')) return { category: 'Frontend', icon: '🎨' };
    if (qLower.includes('back') || qLower.includes('api') || qLower.includes('server')) return { category: 'Backend', icon: '⚙️' };
    if (qLower.includes('cloud') || qLower.includes('devops') || qLower.includes('infra')) return { category: 'Cloud / DevOps', icon: '☁️' };
    if (qLower.includes('db') || qLower.includes('data') || qLower.includes('sql')) return { category: 'Database', icon: '🗄️' };
    if (qLower.includes('photo') || qLower.includes('camera')) return { category: 'Creative', icon: '📷' };
    if (qLower.includes('game') || qLower.includes('gaming')) return { category: 'Gaming', icon: '🎮' };
    if (qLower.includes('music') || qLower.includes('audio')) return { category: 'Music', icon: '🎧' };
    if (qLower.includes('sport') || qLower.includes('fitness') || qLower.includes('run')) return { category: 'Sports', icon: '🏃' };
  }

  return { category: 'General', icon: '⚡' };
}

export async function GET(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'skills';
  const query = searchParams.get('query')?.trim() || '';

  // 1. Language Recommendations
  if (type === 'languages') {
    let filtered = WORLD_LANGUAGES;
    if (query) {
      const q = query.toLowerCase();
      filtered = WORLD_LANGUAGES.filter(
        (l) => l.name.toLowerCase().includes(q) || l.region.toLowerCase().includes(q)
      );
    }
    const results = filtered.map((l) => ({
      name: l.name,
      flag: l.flag,
      defaultProficiency: l.defaultProficiency,
      category: l.region,
      icon: l.flag,
    }));
    return apiSuccess({ query, type, results });
  }

  // 2. Skills, Hobbies, and Interests live web search
  const defaultQuery =
    type === 'hobbies'
      ? 'hobbies sports gaming creative'
      : type === 'interests'
      ? 'technology science startups ai'
      : 'trending web development';

  const searchQuery = query || defaultQuery;

  try {
    const targetQuery = encodeURIComponent(searchQuery.replace(/\s+/g, '+'));
    const response = await fetch(
      `https://api.github.com/search/topics?q=${targetQuery}&per_page=20`,
      {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
          'User-Agent': 'Personal-Portfolio-Admin',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      const repoRes = await fetch(
        `https://api.github.com/search/repositories?q=${targetQuery}+stars:>300&sort=stars&order=desc&per_page=15`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Personal-Portfolio-Admin',
          },
        }
      );

      if (repoRes.ok) {
        const repoData = await repoRes.json();
        const results = (repoData.items || []).map((repo: any) => {
          const name = repo.name
            .split(/[-_]/)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          const { category, icon } = inferCategoryAndIcon(repo.name, searchQuery);
          return {
            name,
            category,
            icon,
            emoji: icon,
            proficiency: 80,
            description: repo.description,
          };
        });

        return apiSuccess({ query: searchQuery, type, results });
      }

      return apiError('Unable to fetch live web trends at this moment', 502);
    }

    const data = await response.json();
    const topics: RawTopicItem[] = data.items || [];

    const results = topics.map((t) => {
      const displayName =
        t.display_name ||
        t.name
          .split(/[-_]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      const { category, icon } = inferCategoryAndIcon(t.name, searchQuery);

      return {
        name: displayName,
        category,
        icon,
        emoji: icon,
        proficiency: 85,
        description: t.short_description || t.description || undefined,
      };
    });

    return apiSuccess({ query: searchQuery, type, results });
  } catch (err: any) {
    return apiError('Failed to fetch live web recommendations', 500, err?.message);
  }
}
