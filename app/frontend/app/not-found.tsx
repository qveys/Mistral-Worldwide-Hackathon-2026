import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default function NotFound() {
  return (
    <ErrorLayout 
      code="404"
      icon="404"
      title="Lost in the Neural Void."
      message="Le cluster que vous recherchez n'existe pas ou a été déplacé vers une autre dimension."
    />
  );
}
