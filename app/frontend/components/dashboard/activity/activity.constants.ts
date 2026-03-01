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
  { id: '1', type: 'commit' as const, msgKey: 'mock.msg1', projectKey: 'mock.project1', timeKey: 'mock.time1', userKey: 'mock.user1' },
  { id: '2', type: 'status' as const, msgKey: 'mock.msg2', projectKey: 'mock.project2', timeKey: 'mock.time2', userKey: 'mock.user2' },
  { id: '3', type: 'comment' as const, msgKey: 'mock.msg3', projectKey: 'mock.project3', timeKey: 'mock.time3', userKey: 'mock.user3' },
  { id: '4', type: 'neural' as const, msgKey: 'mock.msg4', projectKey: 'mock.project4', timeKey: 'mock.time4', userKey: 'mock.user4' },
  { id: '5', type: 'commit' as const, msgKey: 'mock.msg5', projectKey: 'mock.project5', timeKey: 'mock.time5', userKey: 'mock.user5' },
  { id: '6', type: 'status' as const, msgKey: 'mock.msg6', projectKey: 'mock.project6', timeKey: 'mock.time6', userKey: 'mock.user6' },
];

export const LIVE_INSIGHTS_KEYS = ['insight1', 'insight2', 'insight3'] as const;
