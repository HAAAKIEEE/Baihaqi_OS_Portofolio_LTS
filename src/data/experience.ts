export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  mobileRole: string;
  period: string;
  mobilePeriod: string;
  accentClass: string;
  description: string;
  highlights: string[];
  mobileDescription: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'gadai-intira',
    role: 'Kepala Divisi IT | IT Support | Administrasi',
    company: 'PT Gadai Intira Nusantara',
    mobileRole: 'Kepala Divisi IT — PT Gadai Intira Nusantara',
    period: 'September 2025 – Sekarang',
    mobilePeriod: 'Sep 2025–Now',
    accentClass: 'text-dark-tertiary',
    description:
      'Memimpin tim IT (2 orang) dalam pengelolaan administrasi digital, IT Support kantor pusat & cabang, Quality Assurance, serta pengembangan sistem internal perusahaan.',
    highlights: [
      'Mengembangkan & memelihara aplikasi internal Laravel & MySQL (HRIS, Payroll, Absensi Online, KPI Dashboard, dan POS).',
      'Mengelola deployment & pemeliharaan sistem pada 2 server Linux VPS dan 2 shared hosting.',
      'Mendukung digitalisasi dan operasional sistem untuk 101 cabang serta 20+ pengguna kantor pusat.',
    ],
    mobileDescription:
      'IT Support, QA, dan pengembangan HRIS/Payroll/POS Laravel & MySQL untuk 101 cabang.',
  },
  {
    id: 'freelance-web-doc',
    role: 'Freelance Web, AI Automation & Document Specialist',
    company: 'Independen',
    mobileRole: 'Freelance Web, AI & Doc Specialist',
    period: '2024 – Sekarang',
    mobilePeriod: '2024–Now',
    accentClass: 'text-dark-primary',
    description:
      'Membangun aplikasi web dan otomasi AI sesuai kebutuhan operasional klien sekaligus menangani pengolahan data dan dokumentasi profesional.',
    highlights: [
      'Merancang alur otomasi AI (n8n workflow, Agen LLM & RAG pipeline) untuk efisiensi operasional dan dukungan pelanggan.',
      'Mengembangkan sistem administrasi kelurahan, monitoring kinerja karyawan, dan digital guestbook.',
      'Menangani analisis kebutuhan klien, deployment aplikasi, maintenance, troubleshooting, dan technical support.',
      'Menyediakan layanan formatting dokumen, proofreading, pengolahan data, serta materi presentasi (Word, Excel, PowerPoint).',
    ],
    mobileDescription:
      'Aplikasi web klien, otomasi AI (n8n & Agen LLM), support, dan pengolahan dokumen.',
  },
];

export const EDUCATION_INFO = {
  institution: 'Politeknik Hasnur',
  program: 'D3 Teknik Informatika',
  period: '2022–2025',
  gpa: 'IPK: 3.87 / 4.00',
  honor: 'Diakui sebagai Mahasiswa Berprestasi',
};

export const CORE_COMPETENCIES: string[] = [
  'n8n & AI Workflow Automation',
  'LLM Agents & RAG Pipelines',
  'OpenAI / Gemini API',
  'Laravel & MySQL',
  'Livewire & Tailwind CSS',
  'IT Support & Troubleshooting',
  'Administrasi IT',
  'Application Support',
  'System Administration',
  'Quality Assurance (QA)',
  'Software Deployment (Linux VPS)',
  'Data Entry & Validation',
  'Microsoft Office & Excel',
  'Google Sheets & Reporting',
  'Document Management',
];
