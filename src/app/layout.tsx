import type { Metadata } from 'next';
import { AnalyticsBeacon } from '@/components/AnalyticsBeacon';
import './globals.css';

export const metadata: Metadata = {
  title: 'Waris Khamkaweepart | Full Stack Developer',
  description:
    'Portfolio of Waris Khamkaweepart, a Full Stack Developer building pixel-perfect, accessible, and performant web applications.',
  keywords: ['Waris Khamkaweepart', 'Full Stack Developer', 'Software Engineer', 'React', 'Next.js', 'Portfolio'],
  openGraph: {
    title: 'Waris Khamkaweepart | Full Stack Developer',
    description: 'Building pixel-perfect, accessible, and performant web applications.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Waris Khamkaweepart Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waris Khamkaweepart | Full Stack Developer',
    description: 'Building pixel-perfect, accessible, and performant web applications.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden w-full antialiased bg-background text-foreground">
        <AnalyticsBeacon />
        {children}
      </body>
    </html>
  );
}
