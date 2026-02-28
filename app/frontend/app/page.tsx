export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-primary">Echo</span>Maps
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Dictez vos idees, l&apos;IA structure votre roadmap projet.
        </p>
        <div className="flex gap-4">
          <a
            href="/new"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Commencer
          </a>
          <a
            href="/templates"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Templates
          </a>
        </div>
      </main>
    </div>
  );
}
