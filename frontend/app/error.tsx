'use client';

import { ErrorLayout } from '@/components/ui/ErrorLayout';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorLayout 
      code="500"
      icon="500"
      title="Neural Sync Failure."
      message="Une anomalie critique a été détectée dans le moteur de traitement. Nos ingénieurs sont sur le coup."
    />
  );
}
