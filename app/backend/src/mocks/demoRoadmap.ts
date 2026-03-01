export const DEMO_REVISED_ROADMAP = {
  roadmap: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Align project scope',
      description: 'Confirm MVP scope before implementation.',
      priority: 4,
      dependencies: [],
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      title: 'Build backend routes',
      description: 'Implement structure and revise endpoints with validation.',
      priority: 5,
      dependencies: ['11111111-1111-4111-8111-111111111111'],
    },
  ],
};
