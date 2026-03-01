import { redirect } from 'next/navigation';

// This route is now served under [locale]/dashboard/roadmaps/new
// The middleware should redirect, but this ensures no fallback is rendered.
export default function NewRoadmapFallback() {
    redirect('/');
}
