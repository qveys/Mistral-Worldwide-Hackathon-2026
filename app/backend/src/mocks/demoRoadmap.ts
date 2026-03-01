export const DEMO_TRANSCRIPT = `
We need to launch our mobile app by Q3. The first priority is getting the authentication system solid —
we want OAuth with Google and Apple sign-in. Then we need to build out the core feed feature, which pulls
content from our API and displays it in a scrollable list with infinite pagination. Push notifications are
critical for engagement, so we need Firebase Cloud Messaging integrated. We also want an onboarding flow
with three screens explaining the app features. Performance is key — the app should load in under 2 seconds
on mid-range devices. We need to set up CI/CD with Fastlane for automated builds and TestFlight distribution.
Analytics tracking with Mixpanel should be embedded from day one. Finally, we need a settings screen where
users can manage their profile, notification preferences, and privacy controls.
`.trim();

export const DEMO_ROADMAP = {
  roadmap: [
    {
      id: "task-001",
      title: "Set up authentication with OAuth providers",
      description: "Implement OAuth 2.0 authentication supporting Google and Apple sign-in. Include token refresh logic, secure storage of credentials, and session management.",
      priority: 1,
      dependencies: [],
    },
    {
      id: "task-002",
      title: "Build onboarding flow",
      description: "Create a three-screen onboarding experience highlighting key app features. Include skip option, progress indicators, and smooth transitions between screens.",
      priority: 2,
      dependencies: ["task-001"],
    },
    {
      id: "task-003",
      title: "Develop core content feed",
      description: "Build the main scrollable feed with infinite pagination, pull-to-refresh, and optimistic UI updates. Connect to the backend REST API with proper caching and error states.",
      priority: 1,
      dependencies: ["task-001"],
    },
    {
      id: "task-004",
      title: "Integrate push notifications with FCM",
      description: "Set up Firebase Cloud Messaging for push notifications. Handle notification permissions, foreground/background delivery, deep linking from notifications, and topic subscriptions.",
      priority: 2,
      dependencies: ["task-001"],
    },
    {
      id: "task-005",
      title: "Implement analytics tracking",
      description: "Integrate Mixpanel SDK for event tracking. Define and instrument key events: sign-up, login, feed scroll depth, content interactions, notification opens, and session duration.",
      priority: 3,
      dependencies: ["task-001", "task-003"],
    },
    {
      id: "task-006",
      title: "Build settings and profile management",
      description: "Create settings screen with profile editing, notification preference toggles, privacy controls, and account deletion flow. Sync preferences with backend.",
      priority: 3,
      dependencies: ["task-001", "task-004"],
    },
    {
      id: "task-007",
      title: "Optimize app performance",
      description: "Profile and optimize for sub-2-second cold start on mid-range devices. Implement lazy loading, image caching, bundle size reduction, and memory leak prevention.",
      priority: 2,
      dependencies: ["task-003"],
    },
    {
      id: "task-008",
      title: "Set up CI/CD pipeline with Fastlane",
      description: "Configure Fastlane for automated builds, code signing, TestFlight distribution, and release management. Set up GitHub Actions workflows for PR checks and nightly builds.",
      priority: 3,
      dependencies: [],
    },
  ],
  metadata: {
    processingTimeMs: 2000,
    modelUsed: "demo-mode",
    confidenceScore: 0.92,
  },
};

export const DEMO_REVISED_ROADMAP = {
  revisedRoadmap: DEMO_ROADMAP.roadmap.map((item, index) => ({
    ...item,
    status: index === 0 ? ("modified" as const) : ("unchanged" as const),
    ...(index === 0 && {
      description: item.description + " Added biometric authentication (Face ID / fingerprint) as a secondary login method.",
      priority: 1,
    }),
  })).concat([
    {
      id: "task-009",
      title: "Add offline mode with local caching",
      description: "Implement offline-first architecture with local SQLite caching. Allow users to browse previously loaded feed content without connectivity and sync when back online.",
      priority: 2,
      status: "added" as const,
      dependencies: ["task-003"],
    },
  ]),
  changesSummary: {
    itemsModified: 1,
    itemsAdded: 1,
    itemsRemoved: 0,
    confidenceScore: 0.89,
  },
};
