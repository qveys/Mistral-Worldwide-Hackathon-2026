export declare const mockRoadmap: {
    roadmap: {
        id: string;
        title: string;
        description: string;
        priority: number;
        dependencies: string[];
    }[];
    metadata: {
        processingTimeMs: number;
        modelUsed: string;
        confidenceScore: number;
    };
};
export declare const mockRevision: {
    revisedRoadmap: ({
        id: string;
        title: string;
        description: string;
        priority: number;
        status: "modified";
        dependencies: string[];
    } | {
        id: string;
        title: string;
        description: string;
        priority: number;
        status: "unchanged";
        dependencies: string[];
    })[];
    changesSummary: {
        itemsModified: number;
        itemsAdded: number;
        itemsRemoved: number;
        confidenceScore: number;
    };
};
export declare const mockClarify: {
    needsClarification: boolean;
};
export declare const mockTranscript = "Je veux creer une application mobile pour aider les etudiants a organiser leurs projets de groupe. Il faudrait un systeme de taches avec des deadlines et un chat integre.";
//# sourceMappingURL=mockData.d.ts.map