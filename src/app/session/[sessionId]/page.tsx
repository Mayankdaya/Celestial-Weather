'use client';

import { EditorLayout } from '@/components/editor-layout';
import { useSearchParams } from 'next/navigation';

export default function Page({ params }: { params: { sessionId: string } }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'javascript';

  return <EditorLayout sessionId={params.sessionId} initialLanguage={lang} />;
}
