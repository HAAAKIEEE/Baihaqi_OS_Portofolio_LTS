export interface QaBullet {
  title: string;
  detail: string;
}

export interface QaSourceRef {
  projectId: string;
  file: string;
  stack: string;
  icon: string;
  accent: 'tertiary' | 'primary';
}

export interface QaFollowUp {
  key: 'ai_projects' | 'stack' | 'availability' | 'experience' | 'github';
  label: string;
  question: string;
}

export interface QaAnswer {
  key: QaFollowUp['key'];
  question: string;
  badge: string;
  summary: string;
  bullets: QaBullet[];
  sources: QaSourceRef[];
  followUps: QaFollowUp[];
}

const DEFAULT_SOURCES: QaSourceRef[] = [
  {
    projectId: 'autoflow',
    file: 'autoflow-ai-crm/README.md',
    stack: 'n8n • OpenAI API • Node.js • PostgreSQL',
    icon: 'folder_special',
    accent: 'tertiary',
  },
  {
    projectId: 'docsmind',
    file: 'docsmind-rag/README.md',
    stack: 'Python • Gemini API • pgvector • FastAPI',
    icon: 'smart_toy',
    accent: 'primary',
  },
];

const WEB_SOURCES: QaSourceRef[] = [
  {
    projectId: 'pulseboard',
    file: 'pulseboard-saas/README.md',
    stack: 'Laravel • Livewire • Tailwind CSS • PostgreSQL',
    icon: 'folder_code',
    accent: 'primary',
  },
  {
    projectId: 'karyacommerce',
    file: 'karyacommerce-api/README.md',
    stack: 'Laravel • PHP • Tailwind CSS • PostgreSQL',
    icon: 'folder_code',
    accent: 'tertiary',
  },
];

export const QA_TOPICS: Record<QaFollowUp['key'], QaAnswer> = {
  ai_projects: {
    key: 'ai_projects',
    question: 'Apa saja proyek otomasi AI yang pernah dibangun Baihaqi?',
    badge: '0.8s • 3 Sumber',
    summary:
      'Baihaqi telah membangun 18 alur otomasi AI produksi yang berfokus pada efisiensi operasional bisnis dan integrasi LLM. Tiga proyek unggulannya meliputi:',
    bullets: [
      {
        title: 'AutoFlow AI Lead Router',
        detail:
          'Pipeline n8n & LLM yang memangkas waktu respons lead CRM dari 4 jam menjadi 12 detik (+38% konversi).',
      },
      {
        title: 'DocsMind RAG Assistant',
        detail:
          'Agen dukungan pelanggan berbasis pgvector & Gemini API yang menyelesaikan 64% tiket secara otomatis.',
      },
      {
        title: 'Invoice OCR Pipeline',
        detail:
          'Ekstraksi faktur PDF otomatis ke database akuntansi PostgreSQL.',
      },
    ],
    sources: DEFAULT_SOURCES,
    followUps: [
      {
        key: 'stack',
        label: 'Apa stack teknologi utama Baihaqi?',
        question: 'Apa stack teknologi utama Baihaqi?',
      },
      {
        key: 'availability',
        label: 'Apakah Baihaqi tersedia untuk proyek baru?',
        question: 'Apakah Baihaqi tersedia untuk proyek baru?',
      },
    ],
  },
  stack: {
    key: 'stack',
    question: 'Apa stack teknologi utama Baihaqi?',
    badge: '0.6s • 3 Pilar',
    summary:
      'Stack utama Baihaqi untuk pengembangan web adalah Laravel, Livewire, Tailwind CSS, PHP, dan MySQL/PostgreSQL (serta Next.js/TypeScript), dipadukan dengan n8n, Python FastAPI, OpenAI/Gemini API, dan pgvector untuk otomasi AI di atas infrastruktur Linux & Docker.',
    bullets: [
      {
        title: 'Web Full-Stack',
        detail:
          'Laravel & PHP Full-Stack (96%), Livewire & Tailwind CSS (95%), serta TypeScript/Next.js & MySQL/PostgreSQL (88%).',
      },
      {
        title: 'AI & Otomasi',
        detail: 'n8n & AI Workflow Automation (96%), LLM Agents & RAG Pipelines (92%), Python FastAPI (86%).',
      },
      {
        title: 'Linux & DevOps',
        detail: 'Ubuntu/Arch Linux, Wayland, Docker, Nginx reverse proxy, dan CI/CD GitHub Actions (89%).',
      },
    ],
    sources: [...DEFAULT_SOURCES.slice(0, 1), ...WEB_SOURCES.slice(0, 1)],
    followUps: [
      {
        key: 'ai_projects',
        label: 'Proyek otomasi AI unggulan?',
        question: 'Apa saja proyek otomasi AI yang pernah dibangun Baihaqi?',
      },
      {
        key: 'availability',
        label: 'Apakah tersedia untuk proyek baru?',
        question: 'Apakah Baihaqi tersedia untuk proyek baru?',
      },
    ],
  },
  availability: {
    key: 'availability',
    question: 'Apakah Baihaqi tersedia untuk proyek baru?',
    badge: '0.4s • Status Aktif',
    summary:
      'Ya, Baihaqi saat ini tersedia untuk proyek baru baik untuk pengembangan aplikasi web full-stack maupun konsultasi otomasi alur kerja AI. Anda dapat mengirim brief langsung melalui aplikasi Kontak atau email ke halo@baihaqi.dev.',
    bullets: [
      {
        title: 'Kategori Layanan',
        detail: 'Otomasi AI & Agen LLM (n8n/RAG), Web App Full-Stack (Next.js/API), dan Konsultasi Sistem.',
      },
      {
        title: 'Waktu Respons & Zona Waktu',
        detail: 'Rata-rata balasan kurang dari 24 jam • Berbasis di Indonesia (UTC+7).',
      },
    ],
    sources: DEFAULT_SOURCES,
    followUps: [
      {
        key: 'experience',
        label: 'Bagaimana pengalaman kerja Baihaqi?',
        question: 'Bagaimana pengalaman kerja dan latar belakang Baihaqi?',
      },
      {
        key: 'stack',
        label: 'Apa stack teknologi utama Baihaqi?',
        question: 'Apa stack teknologi utama Baihaqi?',
      },
    ],
  },
  experience: {
    key: 'experience',
    question: 'Bagaimana pengalaman kerja dan latar belakang Baihaqi?',
    badge: '0.7s • 4+ Tahun',
    summary:
      'Baihaqi memiliki 4+ tahun pengalaman profesional dengan rekam jejak 42+ proyek web selesai dan 18 alur otomasi AI di produksi.',
    bullets: [
      {
        title: 'AI Automation & Full-Stack Consultant (2024 – Sekarang)',
        detail: 'Merancang agen AI, pipeline RAG, dan integrasi n8n + webhook untuk CRM dan operasional tim.',
      },
      {
        title: 'Senior Web Developer (2022 – 2024)',
        detail: 'Membangun aplikasi SaaS multi-tenant Next.js, TypeScript, dan PostgreSQL dengan performa sub-100ms.',
      },
      {
        title: 'Frontend & API Engineer (2021 – 2022)',
        detail: 'Mengembangkan antarmuka React/Tailwind serta REST API Node.js untuk e-commerce dan dashboard.',
      },
    ],
    sources: WEB_SOURCES,
    followUps: [
      {
        key: 'ai_projects',
        label: 'Lihat proyek otomasi AI',
        question: 'Apa saja proyek otomasi AI yang pernah dibangun Baihaqi?',
      },
      {
        key: 'github',
        label: 'Aktivitas open source & GitHub?',
        question: 'Apa saja repositori open source Baihaqi di GitHub?',
      },
    ],
  },
  github: {
    key: 'github',
    question: 'Apa saja repositori open source Baihaqi di GitHub?',
    badge: '0.5s • 28 Repos',
    summary:
      'Di GitHub (github.com/baihaqi), Baihaqi mencatat 1,240+ kontribusi dan 490+ stars pada berbagai starter kit AI automation, Next.js, dan konfigurasi Linux.',
    bullets: [
      {
        title: 'n8n-ai-agent-starter (★ 184)',
        detail: 'Template produksi agen LLM dan router webhook untuk alur kerja otomasi n8n.',
      },
      {
        title: 'nextjs-linux-portfolio (★ 142)',
        detail: 'Antarmuka portofolio interaktif bergaya desktop Linux dengan sistem jendela kaca.',
      },
      {
        title: 'pgvector-rag-kit (★ 96) & arch-hyprland-dotfiles (★ 68)',
        detail: 'Toolkit pencarian semantik FastAPI + pgvector serta dotfiles Wayland, Zsh, dan Neovim.',
      },
    ],
    sources: DEFAULT_SOURCES,
    followUps: [
      {
        key: 'stack',
        label: 'Apa stack teknologi utama Baihaqi?',
        question: 'Apa stack teknologi utama Baihaqi?',
      },
      {
        key: 'availability',
        label: 'Apakah tersedia untuk proyek baru?',
        question: 'Apakah Baihaqi tersedia untuk proyek baru?',
      },
    ],
  },
};

export function matchPortfolioQuestion(rawQuery: string): QaAnswer {
  const q = rawQuery.toLowerCase().trim();

  if (
    q.includes('stack') ||
    q.includes('teknologi') ||
    q.includes('skill') ||
    q.includes('keahlian') ||
    q.includes('laravel') ||
    q.includes('livewire') ||
    q.includes('tailwind') ||
    q.includes('php') ||
    q.includes('nextjs') ||
    q.includes('typescript')
  ) {
    return { ...QA_TOPICS.stack, question: rawQuery.trim() || QA_TOPICS.stack.question };
  }

  if (
    q.includes('tersedia') ||
    q.includes('hire') ||
    q.includes('kontak') ||
    q.includes('contact') ||
    q.includes('jasa') ||
    q.includes('konsultasi') ||
    q.includes('proyek baru')
  ) {
    return {
      ...QA_TOPICS.availability,
      question: rawQuery.trim() || QA_TOPICS.availability.question,
    };
  }

  if (
    q.includes('pengalaman') ||
    q.includes('karir') ||
    q.includes('karier') ||
    q.includes('resume') ||
    q.includes('tentang') ||
    q.includes('siapa') ||
    q.includes('experience')
  ) {
    return {
      ...QA_TOPICS.experience,
      question: rawQuery.trim() || QA_TOPICS.experience.question,
    };
  }

  if (
    q.includes('github') ||
    q.includes('repo') ||
    q.includes('open source') ||
    q.includes('git')
  ) {
    return { ...QA_TOPICS.github, question: rawQuery.trim() || QA_TOPICS.github.question };
  }

  return {
    ...QA_TOPICS.ai_projects,
    question: rawQuery.trim() || QA_TOPICS.ai_projects.question,
  };
}
