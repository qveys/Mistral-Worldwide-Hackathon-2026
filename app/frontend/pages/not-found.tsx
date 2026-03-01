import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default function RootNotFound() {
  return (
    <ErrorLayout
      code="404"
      icon="404"
      title="Lost in the Neural Void."
      message="The cluster you're looking for doesn't exist or has been moved."
    />
  );
}
