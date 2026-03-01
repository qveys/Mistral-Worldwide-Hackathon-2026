import type { RoadmapCanvasView } from '@/lib/mapRoadmap';
import { Layers, Brain, Network, Zap, Eye, Terminal, Microscope } from 'lucide-react';

export type DocCategory = 'foundation' | 'capture' | 'strategy' | 'system' | 'live-preview' | 'api' | 'methodology';

export interface NavItem {
  id: DocCategory;
  labelKey: string;
  icon: React.ElementType;
  descKey: string;
}

export const NAV_ITEMS_COMPONENTS: NavItem[] = [
  { id: 'foundation', labelKey: 'designSystem', icon: Layers, descKey: 'atomsForms' },
  { id: 'capture', labelKey: 'brainDump', icon: Brain, descKey: 'voiceHybrid' },
  { id: 'strategy', labelKey: 'intelligence', icon: Network, descKey: 'roadmapGraphs' },
  { id: 'system', labelKey: 'infrastructure', icon: Zap, descKey: 'feedbackResilience' },
];

export const NAV_ITEMS_DOCS: NavItem[] = [
  { id: 'methodology', labelKey: 'methodology', icon: Microscope, descKey: 'processAI' },
  { id: 'api', labelKey: 'apiReference', icon: Terminal, descKey: 'endpointsWebhooks' },
];

export const NAV_ITEMS_LIVE_PREVIEW: NavItem[] = [
  { id: 'live-preview', labelKey: 'livePreview', icon: Eye, descKey: 'interactiveGallery' },
];

export interface NavSection {
  titleKey: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  { titleKey: 'components', items: NAV_ITEMS_COMPONENTS },
  { titleKey: 'documentation', items: NAV_ITEMS_DOCS },
  { titleKey: 'lab', items: NAV_ITEMS_LIVE_PREVIEW },
];

export const MOCK_ROADMAP: RoadmapCanvasView = {
  id: 'demo-roadmap',
  title: 'EchoMaps Launch Plan',
  objectives: [
    { id: 'obj-1', title: 'Core Infrastructure', color: 'blue' },
    { id: 'obj-2', title: 'Product Launch', color: 'blue' }
  ],
  timeSlots: [
    {
      day: 1, period: 'AM',
      tasks: [
        { id: 'rt-1', title: 'Setup Cloud Infrastructure', status: 'done', priority: 'high', estimate: 'L', objectiveId: 'obj-1', dependsOn: [] },
        { id: 'rt-2', title: 'Database Schema Design', status: 'doing', priority: 'medium', estimate: 'M', objectiveId: 'obj-1', dependsOn: ['rt-1'] }
      ]
    }
  ]
};
