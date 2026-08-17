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
  }

  return { category: 'General', icon: '⚡' };
}

export async function GET(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim() || 'trending web development';
  const type = searchParams.get('type') || 'skills';

  try {
    // Query GitHub Topics API for live developer technologies
    const targetQuery = encodeURIComponent(query.replace(/\s+/g, '+'));
    const response = await fetch(
      `https://api.github.com/search/topics?q=${targetQuery}&per_page=20`,
      {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
          'User-Agent': 'Personal-Portfolio-Admin',
        },
        next: { revalidate: 3600 }, // Cache live web results for 1 hour
      }
    );

    if (!response.ok) {
      // Fallback search via repositories if topics is rate-limited
      const repoRes = await fetch(
        `https://api.github.com/search/repositories?q=${targetQuery}+stars:>500&sort=stars&order=desc&per_page=15`,
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
          const { category, icon } = inferCategoryAndIcon(repo.name, query);
          return {
            name,
            category,
            icon,
            proficiency: 80,
            description: repo.description,
          };
        });

        return apiSuccess({ query, type, results });
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
      const { category, icon } = inferCategoryAndIcon(t.name, query);

      return {
        name: displayName,
        category,
        icon,
        proficiency: 85,
        description: t.short_description || t.description || undefined,
      };
    });

    return apiSuccess({ query, type, results });
  } catch (err: any) {
    return apiError('Failed to fetch live web recommendations', 500, err?.message);
  }
}
