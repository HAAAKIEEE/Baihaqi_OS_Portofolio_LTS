export type SkillCategory = 'web' | 'ai' | 'devops';

export interface SkillPillar {
  id: SkillCategory;
  title: string;
  icon: string;
  accentClass: string;
  summary: string;
  terminalTags: string[];
}

export interface SkillMetric {
  name: string;
  category: SkillCategory;
  level: number;
  tone: 'primary' | 'tertiary';
}

export const SKILL_PILLARS: SkillPillar[] = [
  {
    id: 'web',
    title: 'Web Full-Stack',
    icon: 'language',
    accentClass: 'text-dark-primary',
    summary:
      'Laravel, Livewire, Tailwind CSS, PHP, dan MySQL untuk aplikasi bisnis & web modern yang cepat dan andal.',
    terminalTags: [
      'Laravel',
      'Livewire',
      'Tailwind CSS',
      'PHP',
      'MySQL',
      'REST API',
    ],
  },
  {
    id: 'ai',
    title: 'AI & Otomasi',
    icon: 'smart_toy',
    accentClass: 'text-dark-tertiary',
    summary:
      'Otomasi n8n Workflow serta integrasi AI / LLM (OpenAI & Gemini API) langsung di dalam sistem aplikasi.',
    terminalTags: [
      'n8n Workflows',
      'AI di Sistem (API)',
      'OpenAI / Gemini',
      'LLM Agents',
      'Webhook & Queue',
      'Auto-Reporting',
    ],
  },
  {
    id: 'devops',
    title: 'Linux & DevOps',
    icon: 'dns',
    accentClass: 'text-dark-on-surface',
    summary:
      'Linux VPS, Shared Hosting, Nginx, Docker, Bash/Zsh scripting, dan manajemen deployment aplikasi.',
    terminalTags: ['Linux VPS', 'Docker', 'Nginx', 'Bash / Zsh', 'CI/CD', 'Git'],
  },
];

export const SKILL_METRICS: SkillMetric[] = [
  { name: 'Laravel & PHP Full-Stack', category: 'web', level: 96, tone: 'primary' },
  { name: 'n8n & AI Workflow Automation', category: 'ai', level: 96, tone: 'tertiary' },
  { name: 'Livewire & Tailwind CSS', category: 'web', level: 95, tone: 'primary' },
  { name: 'Integrasi AI / LLM Langsung di Sistem', category: 'ai', level: 93, tone: 'tertiary' },
  { name: 'MySQL & Database Optimization', category: 'web', level: 92, tone: 'primary' },
  { name: 'REST API & Webhook Orchestration', category: 'ai', level: 90, tone: 'tertiary' },
  { name: 'Linux VPS, Docker & Nginx', category: 'devops', level: 89, tone: 'tertiary' },
  { name: 'Quality Assurance (QA) & Deployment', category: 'devops', level: 88, tone: 'primary' },
];
