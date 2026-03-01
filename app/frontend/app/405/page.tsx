import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default function MethodNotAllowed() {
  return (
    <ErrorLayout 
      code="405"
      icon="405"
      title="Protocol Breach."
      message="Cette méthode de requête n'est pas autorisée pour ce point de terminaison."
    />
  );
}
