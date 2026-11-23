export type AppId =
  | 'home'
  | 'terminal'
  | 'projects'
  | 'ai-lab'
  | 'about'
  | 'skills'
  | 'github'
  | 'contact'
  | 'settings'
  | 'ai-search'
  | 'admin';

export interface DockAppItem {
  id: Exclude<AppId, 'home' | 'settings' | 'ai-search' | 'admin'>;
  label: string;
  icon: string;
  accentClass: string;
}

export const LOCAL_WALLPAPER_URL = '/rolling-hills-pink.jpg';

export const WALLPAPER_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrCnyzY6lrXUFC80BxCBhUjO3X5BVjHUjMbqi91hlKTRKu9UX4hol2w0CSTeFWo6MoUdS9oHAIWr9Is_6xE4gwLUR7jM8LAp5M39KbzEgRpCdViC-n-x2IMraLWAJ3GWe8p6T_gyl3TptT0v3kQ5edg_yUHEoc6Y9zoeQpLOfCw2hvpY2hsYOdV8Fef-gs1-4w54zD8KGztp4d5-tPTA7cC5AEHtUdhLvZ1Iu7HjhD52yPYWIwN9MrP3iVYOGgwyb_6s';

export const PROFILE_INFO = {
  name: 'Baihaqi',
  username: 'baihaqi',
  host: 'baihaqi@linux-os',
  avatarUrl: '/baihaqi.jpeg',
  originalPhotoUrl: '/baihaqi.jpeg',
  role: 'Web Developer & AI Automation Specialist',
  shortRole: 'Web Dev & AI Automation',
  osName: 'Baihaqi OS 2.4 LTS',
  osShortName: 'BAIHAQI OS v2.4',
  osBanner: 'BAIHAQI OS v2.4 LTS',
  compositor: 'Wayland Glass',
  kernel: '6.11-cosmic',
  shell: 'zsh 5.9 + Wayland',
  location: 'Kalimantan Selatan, Indonesia (UTC+7)',
  email: 'haqi20082004@gmail.com',
  whatsappNumber: '089530203497',
  whatsappUrl: 'https://wa.me/6289530203497',
  cvUrl: '/cv-baihaqi.pdf',
  websiteUrl: 'https://www.baihaqi.my.id',
  githubHandle: 'github.com/HAAAKIEEE',
  githubUrl: 'https://github.com/HAAAKIEEE/',
  availabilityLabel: 'Tersedia Proyek',
  availabilityMobileLabel: 'Siap Proyek',
  responseSla: 'Respon < 24 Jam',
  tagline: 'Baihaqi — Web & AI Automation',
  bioSummary:
    'Profesional IT Support, Administrasi IT, Quality Assurance, dan Web Developer (D3 Teknik Informatika, IPK 3.87). Berpengalaman membangun aplikasi Laravel & MySQL sekaligus mengembangkan otomasi alur kerja AI (n8n, Agen LLM & RAG).',
  terminalBio:
    'I build reliable web applications with Laravel, Livewire, Tailwind CSS, and MySQL, combined with intelligent AI automation using n8n workflows or direct AI integrations inside the system.',
};

export const SYSTEM_STATS = [
  { value: '42+', label: 'Proyek Web', colorClass: 'text-dark-tertiary' },
  { value: '18', label: 'Alur AI', colorClass: 'text-dark-primary' },
  { value: '4+ Thn', label: 'Pengalaman', colorClass: 'text-dark-on-surface' },
] as const;

export const DOCK_APPS: DockAppItem[] = [
  { id: 'terminal', label: 'Terminal', icon: 'terminal', accentClass: 'text-dark-primary' },
  { id: 'projects', label: 'Proyek', icon: 'folder_code', accentClass: 'text-dark-tertiary' },
  { id: 'ai-lab', label: 'AI Lab', icon: 'smart_toy', accentClass: 'text-dark-primary' },
  { id: 'about', label: 'Tentang', icon: 'person', accentClass: 'text-dark-on-surface' },
  { id: 'skills', label: 'Keahlian', icon: 'layers', accentClass: 'text-dark-tertiary' },
  { id: 'github', label: 'GitHub', icon: 'code_blocks', accentClass: 'text-dark-on-surface' },
  { id: 'contact', label: 'Kontak', icon: 'mail', accentClass: 'text-dark-primary' },
];

export const APP_PATHS: Record<AppId, { desktop: string; mobile: string }> = {
  home: { desktop: 'baihaqi@linux-os:~', mobile: 'baihaqi@os' },
  terminal: { desktop: 'baihaqi@linux-os:~/terminal', mobile: '~/terminal' },
  projects: { desktop: 'baihaqi@linux-os:~/projects', mobile: '~/projects' },
  'ai-lab': { desktop: 'baihaqi@linux-os:~/ai-lab', mobile: '~/ai-lab' },
  about: { desktop: 'baihaqi@linux-os:~/tentang', mobile: '~/tentang.md' },
  skills: { desktop: 'baihaqi@linux-os:~/keahlian', mobile: '~/keahlian' },
  github: { desktop: 'baihaqi@linux-os:~/github', mobile: '~/github' },
  contact: { desktop: 'baihaqi@linux-os:~/kontak', mobile: '~/kontak.sh' },
  settings: { desktop: 'baihaqi@linux-os:~/pengaturan', mobile: '~/settings.conf' },
  'ai-search': { desktop: 'baihaqi@linux-os:~/pencarian', mobile: 'baihaqi@os' },
  admin: { desktop: 'root@linux-os:/admin', mobile: '~/admin' },
};
