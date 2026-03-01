'use client';

import { useCallback, useRef, useState } from 'react';
import { API_URL } from './api';
import type { Roadmap } from './types';

interface UseStructureReturn {
    roadmap: Roadmap | null;
    isLoading: boolean;
    error: string | null;
    activeStep: 'transcription' | 'analysis' | 'roadmap';
    structureBrainDump: (text: string, includePlanning: boolean) => Promise<Roadmap | null>;
    fetchProject: (projectId: string) => Promise<Roadmap | null>;
    setRoadmap: (roadmap: Roadmap | null) => void;
}

export function useStructure(): UseStructureReturn {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState<'transcription' | 'analysis' | 'roadmap'>(
        'analysis',
    );
    const abortRef = useRef<AbortController | null>(null);
    const fetchProjectAbortRef = useRef<AbortController | null>(null);

    const structureBrainDump = useCallback(
        async (text: string, includePlanning: boolean): Promise<Roadmap | null> => {
            // Abort previous request if any
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setIsLoading(true);
            setError(null);
            setRoadmap(null);
            setActiveStep('analysis');

            try {
                const response = await fetch(`${API_URL}/structure`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, includePlanning }),
                    signal: controller.signal,
                });

                setActiveStep('roadmap');

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    throw new Error(
                        (errorBody as { error?: string }).error ||
                            `Server error: ${response.status}`,
                    );
                }

                const data = (await response.json()) as Roadmap;
                setRoadmap(data);
                return data;
            } catch (err) {
                if ((err as Error).name === 'AbortError') return null;
                const message = err instanceof Error ? err.message : 'Failed to generate roadmap';
                setError(message);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const fetchProject = useCallback(async (projectId: string): Promise<Roadmap | null> => {
        fetchProjectAbortRef.current?.abort();
        const controller = new AbortController();
        fetchProjectAbortRef.current = controller;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/project/${projectId}`, {
                signal: controller.signal,
            });

            if (response.status === 404) {
                setError('Projet non trouvé');
                return null;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = (await response.json()) as Roadmap;
            setRoadmap(data);
            return data;
        } catch (err) {
            if ((err as Error).name === 'AbortError') return null;
            const message = err instanceof Error ? err.message : 'Failed to load project';
            setError(message);
            return null;
        } finally {
            if (fetchProjectAbortRef.current === controller) {
                setIsLoading(false);
            }
        }
    }, []);

    return {
        roadmap,
        isLoading,
        error,
        activeStep,
        structureBrainDump,
        fetchProject,
        setRoadmap,
    };
}
