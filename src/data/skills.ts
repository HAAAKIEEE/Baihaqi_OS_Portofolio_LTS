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
      'Laravel, Livewire, Tailwind CSS, PHP, Next.js/TypeScript, dan MySQL / PostgreSQL untuk produk web cepat.',
    terminalTags: [
      'Laravel',
      'Livewire',
      'Tailwind CSS',
      'PHP',
      'Next.js / TS',
      'MySQL / PostgreSQL',
    ],
  },
  {
    id: 'ai',
    title: 'AI & Otomasi',
    icon: 'smart_toy',
    accentClass: 'text-dark-tertiary',
    summary:
      'n8n Workflow, Agen LLM (OpenAI & Gemini), RAG Pipeline, Python FastAPI, dan Webhook.',
    terminalTags: [
      'n8n Workflows',
      'LLM Agents',
      'OpenAI / Gemini',
      'Python',
      'RAG Pipelines',
      'REST & Webhooks',
    ],
  },
  {
    id: 'devops',
    title: 'Linux & DevOps',
    icon: 'dns',
    accentClass: 'text-dark-on-surface',
    summary:
      'Docker, Ubuntu/Arch Linux, Bash/Zsh scripting, Nginx reverse proxy, dan CI/CD GitHub Actions.',
    terminalTags: ['Docker', 'Ubuntu / Arch', 'Bash / Zsh', 'Nginx', 'CI/CD', 'Git'],
  },
];

export const SKILL_METRICS: SkillMetric[] = [
  { name: 'Laravel & PHP Full-Stack', category: 'web', level: 96, tone: 'primary' },
  { name: 'n8n & AI Workflow Automation', category: 'ai', level: 96, tone: 'tertiary' },
  { name: 'Livewire & Tailwind CSS', category: 'web', level: 95, tone: 'primary' },
  { name: 'LLM Agents & RAG Pipelines', category: 'ai', level: 92, tone: 'tertiary' },
  { name: 'TypeScript, Next.js & REST APIs', category: 'web', level: 90, tone: 'primary' },
  { name: 'Linux, Docker & Nginx', category: 'devops', level: 89, tone: 'tertiary' },
  { name: 'MySQL, PostgreSQL & pgvector', category: 'web', level: 88, tone: 'primary' },
  { name: 'Python & FastAPI', category: 'ai', level: 86, tone: 'tertiary' },
];
