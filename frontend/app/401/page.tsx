import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default function Unauthorized() {
  return (
    <ErrorLayout 
      code="401"
      icon="401"
      title="Access Denied."
      message="Vos identifiants de synchronisation sont invalides ou ont expiré. Veuillez vous reconnecter."
    />
  );
}
