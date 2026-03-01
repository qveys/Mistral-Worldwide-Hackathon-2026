import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Projet ${id} — EchoMaps`;
  const description = "Roadmap partagée via EchoMaps";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const encodedId = encodeURIComponent(id);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let project = null;
  let error = null;

  try {
    const res = await fetch(`${apiUrl}/api/project/${encodedId}`, { cache: "no-store" });
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
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Roadmap partagée
        </h1>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          Lecture seule
        </span>
      </header>

      <div className="grid gap-4">
        {Array.isArray(project?.roadmap) && project.roadmap.length > 0 ? (
          project.roadmap.map((task: { id: string; title: string; description: string; priority: number }) => (
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
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Aucune tâche disponible</p>
        )}
      </div>
    </div>
  );
}
