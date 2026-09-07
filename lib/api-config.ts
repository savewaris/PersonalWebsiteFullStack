export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return ''; // Browser should use relative path in production
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};