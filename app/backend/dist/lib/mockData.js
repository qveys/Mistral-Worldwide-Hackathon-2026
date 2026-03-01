export const mockRoadmap = {
    roadmap: [
        {
            id: "task-1",
            title: "Definir la vision produit",
            description: "Clarifier les objectifs, le public cible et la proposition de valeur",
            priority: 1,
            dependencies: []
        },
        {
            id: "task-2",
            title: "Etude de marche",
            description: "Analyser la concurrence et identifier les opportunites",
            priority: 1,
            dependencies: ["task-1"]
        },
        {
            id: "task-3",
            title: "Prototypage MVP",
            description: "Construire un prototype minimal pour valider le concept",
            priority: 2,
            dependencies: ["task-2"]
        },
        {
            id: "task-4",
            title: "Tests utilisateurs",
            description: "Recruter des beta testeurs et collecter les retours",
            priority: 3,
            dependencies: ["task-3"]
        },
        {
            id: "task-5",
            title: "Lancement v1",
            description: "Deployer la premiere version et lancer la communication",
            priority: 4,
            dependencies: ["task-4"]
        }
    ],
    metadata: {
        processingTimeMs: 1200,
        modelUsed: "demo-mode",
        confidenceScore: 0.92
    }
};
export const mockRevision = {
    revisedRoadmap: [
        {
            id: "task-1",
            title: "Definir la vision produit",
            description: "Clarifier les objectifs, le public cible et la proposition de valeur",
            priority: 1,
            status: "unchanged",
            dependencies: []
        },
        {
            id: "task-2",
            title: "Etude de marche approfondie",
            description: "Analyser la concurrence, les tendances et les besoins utilisateurs",
            priority: 1,
            status: "modified",
            dependencies: ["task-1"]
        },
        {
            id: "task-3",
            title: "Prototypage MVP",
            description: "Construire un prototype minimal pour valider le concept",
            priority: 2,
            status: "unchanged",
            dependencies: ["task-2"]
        },
        {
            id: "task-4",
            title: "Tests utilisateurs",
            description: "Recruter des beta testeurs et collecter les retours",
            priority: 3,
            status: "unchanged",
            dependencies: ["task-3"]
        },
        {
            id: "task-5",
            title: "Lancement v1",
            description: "Deployer la premiere version et lancer la communication",
            priority: 4,
            status: "unchanged",
            dependencies: ["task-4"]
        }
    ],
    changesSummary: {
        itemsModified: 1,
        itemsAdded: 0,
        itemsRemoved: 0,
        confidenceScore: 0.88
    }
};
export const mockClarify = {
    needsClarification: false
};
export const mockTranscript = "Je veux creer une application mobile pour aider les etudiants a organiser leurs projets de groupe. Il faudrait un systeme de taches avec des deadlines et un chat integre.";
//# sourceMappingURL=mockData.js.map