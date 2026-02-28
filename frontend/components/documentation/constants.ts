import { Layers, Brain, Network, Zap, Eye, Server } from 'lucide-react';
import { Roadmap } from '@/components/roadmap/RoadmapCanvas';

export type DocCategory = 'foundation' | 'capture' | 'strategy' | 'system' | 'live-preview' | 'backend';

export interface NavItem {
  id: DocCategory;
  label: string;
  icon: React.ElementType;
  desc: string;
}

export const NAV_ITEMS_COMPONENTS: NavItem[] = [
  { id: 'foundation', label: 'Design System', icon: Layers, desc: 'Atomes & Formulaires' },
  { id: 'capture', label: 'Brain Dump', icon: Brain, desc: 'Voix & Saisie Hybride' },
  { id: 'strategy', label: 'Intelligence', icon: Network, desc: 'Roadmap & Graphes' },
  { id: 'system', label: 'Infrastructure', icon: Zap, desc: 'Feedback & Résilience' },
];

export const NAV_ITEMS_LIVE_PREVIEW: NavItem[] = [
  { id: 'live-preview', label: 'Live Preview', icon: Eye, desc: 'Demonstration des composants' },
];

export const NAV_ITEMS_BACKEND: NavItem[] = [
  { id: 'backend', label: 'Backend', icon: Server, desc: 'Documentation du backend' },
];

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Single source of truth for sidebar sections — add/remove here only */
export const NAV_SECTIONS: NavSection[] = [
  { title: 'Composants', items: NAV_ITEMS_COMPONENTS },
  { title: 'Live Preview', items: NAV_ITEMS_LIVE_PREVIEW },
  { title: 'Backend', items: NAV_ITEMS_BACKEND },
];

export const MOCK_ROADMAP: Roadmap = {
  id: 'demo-roadmap',
  title: 'EchoMaps Launch Plan',
  objectives: [
    { id: 'obj-1', title: 'Core Infrastructure', color: 'blue' },
    { id: 'obj-2', title: 'Product Launch', color: 'orange' }
  ],
  timeSlots: [
    {
      day: 1, period: 'AM',
      tasks: [
        { id: 'rt-1', title: 'Setup Cloud Infrastructure', status: 'done', priority: 'high', estimate: 'L', objectiveId: 'obj-1' },
        { id: 'rt-2', title: 'Database Schema Design', status: 'doing', priority: 'medium', estimate: 'M', objectiveId: 'obj-1', dependencies: ['rt-1'] }
      ]
    }
  ]
};
