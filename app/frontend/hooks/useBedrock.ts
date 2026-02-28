"use client";

import { useCallback, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: number;
  dependencies?: string[];
  dependsOn?: string[];
  status?: "unchanged" | "modified" | "removed" | "added";
}

export interface RoadmapResponse {
  roadmap: RoadmapItem[];
  metadata: {
    processingTimeMs: number;
    modelUsed: string;
    confidenceScore: number;
  };
}

export interface RevisionResponse {
  revisedRoadmap: RoadmapItem[];
  changesSummary: {
    itemsModified: number;
    itemsAdded: number;
    itemsRemoved: number;
    confidenceScore: number;
  };
}

export interface UseBedrockReturn {
  roadmap: RoadmapItem[] | null;
  isLoading: boolean;
  error: string | null;
  generateRoadmap: (transcript: string, userId: string, sessionId: string) => Promise<RoadmapResponse | null>;
  reviseRoadmap: (roadmapId: string, instructions: string, userId: string) => Promise<RevisionResponse | null>;
  setRoadmap: (roadmap: RoadmapItem[] | null) => void;
}

export function useBedrock(): UseBedrockReturn {
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = useCallback(async (
    transcript: string,
    userId: string,
    sessionId: string
  ): Promise<RoadmapResponse | null> => {
    setIsLoading(true);
    setError(null);

    // Optimistic: keep current roadmap visible during loading
    try {
      const response = await fetch(`${API_URL}/api/structure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, userId, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: RoadmapResponse = await response.json();
      setRoadmap(data.roadmap);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate roadmap";
      setError(msg);
      // Rollback: roadmap stays as-is (optimistic rollback)
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reviseRoadmap = useCallback(async (
    roadmapId: string,
    instructions: string,
    userId: string
  ): Promise<RevisionResponse | null> => {
    setIsLoading(true);
    setError(null);

    // Save current state for rollback
    const previousRoadmap = roadmap;

    try {
      const response = await fetch(`${API_URL}/api/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, revisionInstructions: instructions, userId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: RevisionResponse = await response.json();
      setRoadmap(data.revisedRoadmap);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to revise roadmap";
      setError(msg);
      // Rollback to previous state
      setRoadmap(previousRoadmap);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [roadmap]);

  return {
    roadmap,
    isLoading,
    error,
    generateRoadmap,
    reviseRoadmap,
    setRoadmap,
  };
}
