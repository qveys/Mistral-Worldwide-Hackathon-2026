export const STATIC_ACTIVITY_DATA = [
  1, 2, 0, 3, 1, 0, 0, 2, 3, 1, 0, 2, 0, 1,
  0, 1, 2, 1, 0, 3, 2, 1, 0, 0, 2, 3, 1, 0,
  3, 2, 1, 0, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0,
  1, 0, 0, 2, 3, 1, 2, 0, 3, 1, 0, 0, 2, 3,
  2, 1, 0, 0, 1, 2, 3, 1, 0, 2, 0, 1, 0, 1,
  0, 3, 2, 1, 0, 0, 2, 3, 1, 0, 3, 2, 1, 0,
  2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 1, 0, 0, 2,
].slice(0, 14 * 7);

export const MOCK_ACTIVITIES = [
  { id: '1', type: 'commit' as const, msg: 'Refactored dependency graph for topological consistency', project: 'Microservices v2', time: '2m ago', user: 'Mistral IA' },
  { id: '2', type: 'status' as const, msg: 'Roadmap "Product Launch Q3" marked as Stable', project: 'Q3 Launch', time: '45m ago', user: 'Admin' },
  { id: '3', type: 'comment' as const, msg: 'Added documentation for AWS Bedrock integration', project: 'Cloud Strategy', time: '2h ago', user: 'DevUnit' },
  { id: '4', type: 'neural' as const, msg: 'Detected 4 potential bottlenecks in graph execution', project: 'API Gateway', time: '4h ago', user: 'Neural Engine' },
  { id: '5', type: 'commit' as const, msg: 'Updated objective priority: High', project: 'Security Audit', time: '1d ago', user: 'Admin' },
  { id: '6', type: 'status' as const, msg: 'New context sync completed', project: 'Mobile UI', time: '2d ago', user: 'Mistral IA' },
];

export const LIVE_INSIGHTS = [
  "Peak activity detected at 10:00 AM.",
  "Mistral IA contributed to 64% of today's syncs.",
  "Zero integrity failures in the last 24h."
];
