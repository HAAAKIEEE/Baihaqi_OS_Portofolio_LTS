export interface ExperienceItem {
  id: string;
  role: string;
  mobileRole: string;
  period: string;
  mobilePeriod: string;
  accentClass: string;
  description: string;
  mobileDescription: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'ai-consultant',
    role: 'AI Automation & Full-Stack Consultant',
    mobileRole: 'AI Automation Consultant',
    period: '2024 – Sekarang',
    mobilePeriod: '2024–Now',
    accentClass: 'text-dark-tertiary',
    description:
      'Merancang sistem agen AI, pipeline RAG, dan integrasi n8n + webhook untuk mengotomatiskan CRM, dukungan pelanggan, dan pelaporan data.',
    mobileDescription: 'Sistem agen AI, RAG pipeline, dan integrasi n8n CRM.',
  },
  {
    id: 'senior-web',
    role: 'Senior Web Developer',
    mobileRole: 'Senior Web Developer',
    period: '2022 – 2024',
    mobilePeriod: '2022–2024',
    accentClass: 'text-dark-primary',
    description:
      'Membangun aplikasi SaaS & sistem bisnis multi-tenant menggunakan Laravel, Livewire, Tailwind CSS, dan MySQL/PostgreSQL dengan performa tinggi dan keandalan produksi.',
    mobileDescription: 'Aplikasi web & SaaS Laravel, Livewire, Tailwind CSS & PostgreSQL.',
  },
  {
    id: 'frontend-api',
    role: 'Frontend & API Engineer',
    mobileRole: 'Frontend & API Engineer',
    period: '2021 – 2022',
    mobilePeriod: '2021–2022',
    accentClass: 'text-dark-on-surface-variant',
    description:
      'Mengembangkan antarmuka responsif Tailwind CSS / Livewire serta REST API Laravel & Next.js untuk platform e-commerce dan dashboard operasional.',
    mobileDescription: 'Antarmuka Tailwind CSS / Livewire & REST API Laravel.',
  },
];
