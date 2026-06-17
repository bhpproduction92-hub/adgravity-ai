import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master SEO Manager | AdGravity.AI Control Center',
  description: 'Manage dynamic meta tags, JSON-LD schema scripts, automated indexing triggers, and search engine crawlers.',
};

export default function SEOManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
