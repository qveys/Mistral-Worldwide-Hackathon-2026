import { Layers, Brain, Network, Zap } from 'lucide-react';
import { Roadmap } from '@/components/roadmap/RoadmapCanvas';

export type DocCategory = 'foundation' | 'capture' | 'strategy' | 'system';

export interface NavItem {
  id: DocCategory;
  label: string;
  icon: React.ElementType;
  desc: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'foundation', label: 'Design System', icon: Layers, desc: 'Atomes & Formulaires' },
  { id: 'capture', label: 'Brain Dump', icon: Brain, desc: 'Voix & Saisie Hybride' },
  { id: 'strategy', label: 'Intelligence', icon: Network, desc: 'Roadmap & Graphes' },
  { id: 'system', label: 'Infrastructure', icon: Zap, desc: 'Feedback & Résilience' },
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
