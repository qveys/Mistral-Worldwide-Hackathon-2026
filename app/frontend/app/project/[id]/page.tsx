import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Projet ${id} — EchoMaps`,
    description: "Roadmap partagee via EchoMaps",
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let project = null;
  let error = null;

  try {
    const res = await fetch(`${apiUrl}/api/project/${id}`, { cache: "no-store" });
    if (res.ok) {
      project = await res.json();
    } else {
      error = "Projet introuvable";
    }
  } catch {
    error = "Impossible de charger le projet";
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">404</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <a
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retour a l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Roadmap partagee
        </h1>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          Lecture seule
        </span>
      </header>

      <div className="grid gap-4">
        {project?.roadmap?.map((task: { id: string; title: string; description: string; priority: number }) => (
          <div
            key={task.id}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">{task.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                P{task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
