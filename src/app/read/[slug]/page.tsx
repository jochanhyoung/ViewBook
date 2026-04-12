import { notFound } from 'next/navigation';
import { getPage, pages } from '@/content/index';
import { BookViewer } from '@/components/layout/BookViewer';

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }));
}

interface ReadPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  return <BookViewer page={page} />;
}
