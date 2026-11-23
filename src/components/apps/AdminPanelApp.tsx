'use client';

import React, { useEffect, useState } from 'react';
import { useOs } from '@/context/OsContext';
import { usePortfolioData, type EditableWorkflow } from '@/context/PortfolioDataContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';
import type { GitHubApiRepo, ProjectCaseStudy, ProjectCategory } from '@/data/projects';
import type { SkillCategory, SkillMetric } from '@/data/skills';
import type { ExperienceItem } from '@/data/experience';

type AdminTab = 'projects' | 'skills' | 'experience' | 'profile' | 'workflows';

export function AdminPanelApp() {
  const { isAdminAuthenticated, logoutAdmin, openApp, settings } = useOs();
  const {
    data,
    cloudSyncStatus,
    updateProfile,
    setCompetencies,
    addProject,
    updateProject,
    deleteProject,
    toggleHideGitHubRepo,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    resetAllData,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [toast, setToast] = useState<string | null>(null);

  // GitHub repos for visibility toggle
  const [ghRepos, setGhRepos] = useState<GitHubApiRepo[]>([]);
  useEffect(() => {
    fetch('https://api.github.com/users/HAAAKIEEE/repos?sort=updated&per_page=12')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (Array.isArray(list)) setGhRepos(list as GitHubApiRepo[]);
      })
      .catch(() => {});
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  // --- Project Form State ---
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectCategory>('web');
  const [projBadge, setProjBadge] = useState('Web App');
  const [projStack, setProjStack] = useState('Laravel • Livewire • Tailwind CSS');
  const [projImpact, setProjImpact] = useState('Production Ready');
  const [projUrl, setProjUrl] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjCategory('web');
    setProjBadge('Web App');
    setProjStack('Laravel • Livewire • Tailwind CSS');
    setProjImpact('Production Ready');
    setProjUrl('');
    setProjDesc('');
  };

  const startEditProject = (p: ProjectCaseStudy) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjBadge(p.badge);
    setProjStack(p.stack);
    setProjImpact(p.impact);
    setProjUrl(p.repoUrl ?? '');
    setProjDesc(p.summary);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const title = projTitle.trim();
    const desc = projDesc.trim();
    if (!title || !desc) return;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload: Omit<ProjectCaseStudy, 'id'> = {
      folderName: `${slug || 'project'}/`,
      category: projCategory,
      badge: projBadge.trim() || (projCategory === 'ai' ? 'AI Agent' : 'Web App'),
      title,
      shortDesc: desc,
      mobileShortDesc: desc,
      readmeTitle: `${slug || 'project'}/README.md`,
      impact: projImpact.trim() || 'Production',
      summary: desc,
      stack: projStack.trim() || 'Laravel • Tailwind CSS',
      repoUrl: projUrl.trim() || undefined,
      source: 'manual',
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
      notify('Proyek berhasil diperbarui.');
    } else {
      addProject(payload);
      notify('Proyek baru berhasil ditambahkan.');
    }
    resetProjectForm();
  };

  // --- Skill Form State ---
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillPct, setSkillPct] = useState(90);
  const [skillCat, setSkillCat] = useState<SkillCategory>('web');
  const [skillTone, setSkillTone] = useState<'primary' | 'tertiary'>('primary');

  const resetSkillForm = () => {
    setEditingSkillIdx(null);
    setSkillName('');
    setSkillPct(90);
    setSkillCat('web');
    setSkillTone('primary');
  };

  const startEditSkill = (idx: number, s: SkillMetric) => {
    setEditingSkillIdx(idx);
    setSkillName(s.name);
    setSkillPct(s.level);
    setSkillCat(s.category);
    setSkillTone(s.tone);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    const payload: SkillMetric = {
      name: skillName.trim(),
      level: Math.max(1, Math.min(100, Number(skillPct) || 80)),
      category: skillCat,
      tone: skillTone,
    };
    if (editingSkillIdx !== null) {
      updateSkill(editingSkillIdx, payload);
      notify('Skill berhasil diperbarui.');
    } else {
      addSkill(payload);
      notify('Skill baru berhasil ditambahkan.');
    }
    resetSkillForm();
  };

  // --- Experience Form State ---
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expHighlights, setExpHighlights] = useState('');

  const resetExpForm = () => {
    setEditingExpId(null);
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDesc('');
    setExpHighlights('');
  };

  const startEditExp = (item: ExperienceItem) => {
    setEditingExpId(item.id);
    setExpRole(item.role);
    setExpCompany(item.company);
    setExpPeriod(item.period);
    setExpDesc(item.description);
    setExpHighlights(item.highlights.join('\n'));
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;
    const highlights = expHighlights
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const payload: Omit<ExperienceItem, 'id'> = {
      role: expRole.trim(),
      company: expCompany.trim(),
      mobileRole: `${expRole.trim()} — ${expCompany.trim()}`,
      period: expPeriod.trim() || 'Sekarang',
      mobilePeriod: expPeriod.trim() || 'Now',
      accentClass: 'text-dark-primary',
      description: expDesc.trim(),
      highlights,
      mobileDescription: expDesc.trim(),
    };

    if (editingExpId) {
      updateExperience(editingExpId, payload);
      notify('Pengalaman kerja diperbarui.');
    } else {
      addExperience(payload);
      notify('Pengalaman kerja ditambahkan.');
    }
    resetExpForm();
  };

  // --- Profile Form State ---
  const [profName, setProfName] = useState(data.profile.name);
  const [profRole, setProfRole] = useState(data.profile.role);
  const [profLocation, setProfLocation] = useState(data.profile.location);
  const [profEmail, setProfEmail] = useState(data.profile.email);
  const [profWa, setProfWa] = useState(data.profile.whatsappNumber);
  const [profGithub, setProfGithub] = useState(data.profile.githubUrl);
  const [profCv, setProfCv] = useState(data.profile.cvUrl);
  const [profAvailability, setProfAvailability] = useState(data.profile.availabilityLabel);
  const [profBio, setProfBio] = useState(data.profile.bioSummary);
  const [profCompetencies, setProfCompetencies] = useState(data.competencies.join(', '));

  useEffect(() => {
    setProfName(data.profile.name);
    setProfRole(data.profile.role);
    setProfLocation(data.profile.location);
    setProfEmail(data.profile.email);
    setProfWa(data.profile.whatsappNumber);
    setProfGithub(data.profile.githubUrl);
    setProfCv(data.profile.cvUrl);
    setProfAvailability(data.profile.availabilityLabel);
    setProfBio(data.profile.bioSummary);
    setProfCompetencies(data.competencies.join(', '));
  }, [data.profile, data.competencies]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWa = profWa.replace(/[^0-9]/g, '');
    const waIntl = cleanWa.startsWith('0') ? `62${cleanWa.slice(1)}` : cleanWa;
    updateProfile({
      name: profName.trim(),
      role: profRole.trim(),
      location: profLocation.trim(),
      email: profEmail.trim(),
      whatsappNumber: profWa.trim(),
      whatsappUrl: `https://wa.me/${waIntl}`,
      githubUrl: profGithub.trim(),
      cvUrl: profCv.trim(),
      availabilityLabel: profAvailability.trim(),
      bioSummary: profBio.trim(),
    });
    setCompetencies(
      profCompetencies
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    );
    notify('Profil, kontak & kompetensi tersimpan.');
  };

  // --- Workflow Form State ---
  const [editingWfId, setEditingWfId] = useState<string | null>(null);
  const [wfTitle, setWfTitle] = useState('');
  const [wfDesc, setWfDesc] = useState('');
  const [wfNode1, setWfNode1] = useState('Webhook Trigger');
  const [wfNode2, setWfNode2] = useState('AI Agent');
  const [wfNode3, setWfNode3] = useState('Database / Notif');

  const resetWfForm = () => {
    setEditingWfId(null);
    setWfTitle('');
    setWfDesc('');
    setWfNode1('Webhook Trigger');
    setWfNode2('AI Agent');
    setWfNode3('Database / Notif');
  };

  const startEditWf = (wf: EditableWorkflow) => {
    setEditingWfId(wf.id);
    setWfTitle(wf.tabLabel);
    setWfDesc(wf.nodes[1]?.description ?? '');
    setWfNode1(wf.nodes[0]?.title ?? 'Trigger');
    setWfNode2(wf.nodes[1]?.title ?? 'Agent');
    setWfNode3(wf.nodes[2]?.title ?? 'Output');
  };

  const handleSaveWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfTitle.trim()) return;
    const desc = wfDesc.trim() || 'Alur kerja otomasi AI custom.';
    const payload: EditableWorkflow = {
      id: editingWfId ?? `wf-${Date.now()}`,
      tabLabel: wfTitle.trim(),
      mobileBadge: wfTitle.trim(),
      latency: 'Latency: 1.2s • Status: 200 OK',
      mobileStatus: '[200 OK] Latency: 1.2s • Active',
      nodes: [
        { stepLabel: '01 TRIGGER', icon: 'bolt', title: wfNode1.trim() || 'Trigger', description: 'Event input otomatis.', accent: 'tertiary' },
        { stepLabel: '02 PROSES AI', icon: 'smart_toy', title: wfNode2.trim() || 'AI Agent', description: desc, accent: 'primary' },
        { stepLabel: '03 AKSI', icon: 'check_circle', title: wfNode3.trim() || 'Output', description: 'Sinkronisasi & notifikasi.', accent: 'neutral' },
      ],
      logs: [
        {
          timestamp: '[14:00:00]',
          message: `workflow.init → "${wfTitle.trim()}" siap dijalankan.`,
          colorClass: 'text-dark-tertiary',
        },
      ],
    };

    if (editingWfId) {
      updateWorkflow(editingWfId, payload);
      notify('Workflow AI Lab diperbarui.');
    } else {
      addWorkflow(payload);
      notify('Workflow AI Lab ditambahkan.');
    }
    resetWfForm();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baihaqi-os-portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup JSON berhasil diunduh.');
  };

  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  if (!isAdminAuthenticated) {
    return (
      <section
        aria-label="Akses Terbatas — Admin Panel"
        className={`w-full max-w-xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-error/50 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
      >
        <WindowTitleBar appId="admin" title="root@linux-os:/admin — Access Denied" badgeText="Locked" />
        <div className="p-gutter-xl flex flex-col items-center text-center gap-gutter-md">
          <span className="material-symbols-outlined text-[40px] text-dark-error" aria-hidden="true">
            admin_panel_settings
          </span>
          <h1 className="font-headline text-title-md text-dark-on-surface">Autentikasi Root Diperlukan</h1>
          <p className="font-body text-body-sm text-dark-on-surface-variant">
            Buka <span className="font-mono text-dark-primary">Terminal</span> lalu ketik perintah{' '}
            <code className="font-mono text-dark-tertiary">sudo su</code> dan masukkan password admin.
          </p>
          <button
            type="button"
            onClick={() => openApp('terminal')}
            className="px-gutter-lg py-gutter-sm rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
          >
            Buka Terminal
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Admin Control Panel — Baihaqi OS"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/95 ${blurClass} border border-dark-primary/60 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="admin"
        title="root@linux-os:/admin — Control Panel"
        badgeText={
          cloudSyncStatus === 'synced'
            ? 'Cloudflare KV: Synced'
            : cloudSyncStatus === 'saving'
              ? 'Saving to KV...'
              : 'Local Mode (KV Opsional)'
        }
        rightSlot={
          <div className="flex items-center gap-gutter-xs">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-[11px] text-dark-on-surface-variant hover:text-dark-on-surface"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => {
                resetAllData();
                notify('Data dikembalikan ke default.');
              }}
              className="px-3 py-1 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-[11px] text-dark-on-surface-variant hover:text-dark-error"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3 py-1 rounded-full bg-dark-error/20 border border-dark-error/50 font-mono text-[11px] text-dark-error hover:bg-dark-error/30"
            >
              Logout Root
            </button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="px-gutter-lg py-gutter-sm bg-dark-surface-container/70 border-b border-dark-outline-variant/40 flex flex-wrap items-center justify-between gap-gutter-sm shrink-0">
        <div className="flex flex-wrap items-center gap-gutter-xs" role="tablist">
          {(
            [
              { id: 'projects', label: `Proyek (${data.projects.length})` },
              { id: 'skills', label: `Keahlian (${data.skills.length})` },
              { id: 'experience', label: `Pengalaman (${data.experiences.length})` },
              { id: 'profile', label: 'Profil & Kontak' },
              { id: 'workflows', label: `AI Lab (${data.workflows.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full font-label text-label-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-dark-primary text-dark-on-primary'
                  : 'bg-dark-surface-container-high text-dark-on-surface-variant hover:text-dark-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {toast && (
          <span className="font-mono text-label-sm text-emerald-300 bg-emerald-500/15 border border-emerald-400/40 px-3 py-1 rounded-full">
            {toast}
          </span>
        )}
      </div>

      {/* Scrollable Admin Body */}
      <div className="p-gutter-lg sm:p-gutter-xl flex-1 min-h-0 overflow-y-auto os-scroll flex flex-col gap-gutter-lg">
        {/* TAB 1: PROYEK */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <form
              onSubmit={handleSaveProject}
              className="lg:col-span-5 p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm h-fit"
            >
              <h2 className="font-headline text-title-md text-dark-on-surface">
                {editingProjectId ? 'Edit Proyek Manual' : 'Tambah Proyek Baru'}
              </h2>
              <input
                type="text"
                required
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                placeholder="Nama Proyek (cth. HRIS PT Gadai)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-gutter-xs">
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value as ProjectCategory)}
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                >
                  <option value="web">Web App</option>
                  <option value="ai">AI Automation</option>
                </select>
                <input
                  type="text"
                  value={projBadge}
                  onChange={(e) => setProjBadge(e.target.value)}
                  placeholder="Badge (cth. Laravel)"
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={projStack}
                onChange={(e) => setProjStack(e.target.value)}
                placeholder="Stack (Laravel • Livewire • MySQL)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="text"
                value={projImpact}
                onChange={(e) => setProjImpact(e.target.value)}
                placeholder="Impact (cth. 101 Cabang Aktif)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="url"
                value={projUrl}
                onChange={(e) => setProjUrl(e.target.value)}
                placeholder="URL Demo / Repo (opsional)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <textarea
                rows={3}
                required
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="Deskripsi lengkap proyek..."
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
              <div className="flex items-center gap-gutter-xs pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
                >
                  {editingProjectId ? 'Simpan Perubahan' : 'Tambah Proyek'}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-4 py-2 rounded-full bg-dark-surface-container-high text-dark-on-surface-variant font-label text-label-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 flex flex-col gap-gutter-md">
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-label text-label-sm uppercase tracking-wider text-dark-primary">
                  Proyek Manual Tersimpan ({data.projects.length})
                </h3>
                {data.projects.length === 0 ? (
                  <p className="p-gutter-md rounded bg-dark-surface-container-low/60 font-mono text-label-sm text-dark-outline">
                    Belum ada proyek manual. Tambahkan melalui form di sebelah kiri.
                  </p>
                ) : (
                  data.projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex items-start justify-between gap-gutter-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-headline text-body-md text-dark-on-surface font-semibold">{p.title}</p>
                        <p className="font-mono text-[11px] text-dark-tertiary">{p.stack}</p>
                        <p className="font-body text-body-sm text-dark-on-surface-variant line-clamp-2 mt-1">
                          {p.shortDesc}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditProject(p)}
                          className="px-2.5 py-1 rounded bg-dark-surface-container-high text-dark-primary font-mono text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteProject(p.id);
                            notify('Proyek dihapus.');
                          }}
                          className="px-2.5 py-1 rounded bg-dark-error/20 text-dark-error font-mono text-[11px]"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-gutter-xs pt-gutter-sm border-t border-dark-outline-variant/40">
                <h3 className="font-label text-label-sm uppercase tracking-wider text-dark-tertiary">
                  Kontrol Tampilan Repo GitHub ({ghRepos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-xs">
                  {ghRepos.map((repo) => {
                    const hidden = data.hiddenGitHubIds.includes(repo.id);
                    return (
                      <button
                        key={repo.id}
                        type="button"
                        onClick={() => toggleHideGitHubRepo(repo.id)}
                        className={`p-2.5 rounded border text-left flex items-center justify-between gap-2 transition-colors ${
                          hidden
                            ? 'bg-dark-surface-container-lowest/60 border-dark-outline-variant/30 text-dark-outline opacity-60'
                            : 'bg-dark-surface-container-low/80 border-dark-outline-variant/50 text-dark-on-surface'
                        }`}
                      >
                        <span className="font-mono text-label-sm truncate">{repo.name}</span>
                        <span className="font-mono text-[11px] shrink-0 text-dark-primary">
                          {hidden ? 'Hidden' : 'Visible'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEAHLIAN */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <form
              onSubmit={handleSaveSkill}
              className="lg:col-span-5 p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm h-fit"
            >
              <h2 className="font-headline text-title-md text-dark-on-surface">
                {editingSkillIdx !== null ? 'Edit Keahlian' : 'Tambah Keahlian'}
              </h2>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Nama Skill (cth. Laravel & PHP)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <div className="grid grid-cols-3 gap-gutter-xs">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={skillPct}
                  onChange={(e) => setSkillPct(Number(e.target.value))}
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                />
                <select
                  value={skillCat}
                  onChange={(e) => setSkillCat(e.target.value as SkillCategory)}
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-2 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                >
                  <option value="web">Web</option>
                  <option value="ai">AI</option>
                  <option value="devops">DevOps</option>
                </select>
                <select
                  value={skillTone}
                  onChange={(e) => setSkillTone(e.target.value as 'primary' | 'tertiary')}
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-2 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                >
                  <option value="primary">Primary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </div>
              <div className="flex items-center gap-gutter-xs pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
                >
                  {editingSkillIdx !== null ? 'Simpan' : 'Tambah Skill'}
                </button>
                {editingSkillIdx !== null && (
                  <button
                    type="button"
                    onClick={resetSkillForm}
                    className="px-4 py-2 rounded-full bg-dark-surface-container-high text-dark-on-surface-variant font-label text-label-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 flex flex-col gap-gutter-xs">
              {data.skills.map((s, idx) => (
                <div
                  key={`${s.name}-${idx}`}
                  className="p-3 rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-mono text-mono-md text-dark-on-surface">
                      {s.name} <span className="text-dark-primary">({s.level}%)</span>
                    </p>
                    <p className="font-mono text-[11px] text-dark-outline uppercase">{s.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditSkill(idx, s)}
                      className="px-2.5 py-1 rounded bg-dark-surface-container-high text-dark-primary font-mono text-[11px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteSkill(idx);
                        notify('Skill dihapus.');
                      }}
                      className="px-2.5 py-1 rounded bg-dark-error/20 text-dark-error font-mono text-[11px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PENGALAMAN */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <form
              onSubmit={handleSaveExp}
              className="lg:col-span-5 p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm h-fit"
            >
              <h2 className="font-headline text-title-md text-dark-on-surface">
                {editingExpId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
              </h2>
              <input
                type="text"
                required
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                placeholder="Jabatan / Peran"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="text"
                required
                value={expCompany}
                onChange={(e) => setExpCompany(e.target.value)}
                placeholder="Perusahaan / Instansi"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="text"
                value={expPeriod}
                onChange={(e) => setExpPeriod(e.target.value)}
                placeholder="Periode (cth. Sep 2025 – Sekarang)"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <textarea
                rows={2}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Ringkasan peran..."
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
              <textarea
                rows={3}
                value={expHighlights}
                onChange={(e) => setExpHighlights(e.target.value)}
                placeholder="Poin pencapaian (1 baris per poin)..."
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
              <div className="flex items-center gap-gutter-xs pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
                >
                  {editingExpId ? 'Simpan' : 'Tambah Pengalaman'}
                </button>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={resetExpForm}
                    className="px-4 py-2 rounded-full bg-dark-surface-container-high text-dark-on-surface-variant font-label text-label-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 flex flex-col gap-gutter-sm">
              {data.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-headline text-body-md text-dark-on-surface font-semibold">{exp.role}</p>
                    <p className="font-mono text-[11px] text-dark-tertiary">
                      {exp.company} • {exp.period}
                    </p>
                    <p className="font-body text-body-sm text-dark-on-surface-variant mt-1">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditExp(exp)}
                      className="px-2.5 py-1 rounded bg-dark-surface-container-high text-dark-primary font-mono text-[11px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteExperience(exp.id);
                        notify('Pengalaman dihapus.');
                      }}
                      className="px-2.5 py-1 rounded bg-dark-error/20 text-dark-error font-mono text-[11px]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFIL & KONTAK */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Nama</span>
              <input
                type="text"
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Role Utama</span>
              <input
                type="text"
                value={profRole}
                onChange={(e) => setProfRole(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Email</span>
              <input
                type="email"
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">WhatsApp</span>
              <input
                type="text"
                value={profWa}
                onChange={(e) => setProfWa(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Lokasi</span>
              <input
                type="text"
                value={profLocation}
                onChange={(e) => setProfLocation(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Status Badge</span>
              <input
                type="text"
                value={profAvailability}
                onChange={(e) => setProfAvailability(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">URL GitHub</span>
              <input
                type="url"
                value={profGithub}
                onChange={(e) => setProfGithub(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Path / URL File CV</span>
              <input
                type="text"
                value={profCv}
                onChange={(e) => setProfCv(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">Ringkasan Bio</span>
              <textarea
                rows={3}
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1">
              <span className="font-label text-label-sm text-dark-on-surface-variant">
                Kompetensi Utama (pisahkan dengan koma)
              </span>
              <textarea
                rows={2}
                value={profCompetencies}
                onChange={(e) => setProfCompetencies(e.target.value)}
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
              >
                Simpan Profil &amp; Kontak
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: AI LAB WORKFLOWS */}
        {activeTab === 'workflows' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <form
              onSubmit={handleSaveWorkflow}
              className="lg:col-span-5 p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm h-fit"
            >
              <h2 className="font-headline text-title-md text-dark-on-surface">
                {editingWfId ? 'Edit Workflow AI' : 'Tambah Workflow AI'}
              </h2>
              <input
                type="text"
                required
                value={wfTitle}
                onChange={(e) => setWfTitle(e.target.value)}
                placeholder="Nama Tab Workflow"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <textarea
                rows={2}
                value={wfDesc}
                onChange={(e) => setWfDesc(e.target.value)}
                placeholder="Deskripsi alur otomasi..."
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none resize-none"
              />
              <input
                type="text"
                value={wfNode1}
                onChange={(e) => setWfNode1(e.target.value)}
                placeholder="Step 1 Trigger"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="text"
                value={wfNode2}
                onChange={(e) => setWfNode2(e.target.value)}
                placeholder="Step 2 Proses AI"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <input
                type="text"
                value={wfNode3}
                onChange={(e) => setWfNode3(e.target.value)}
                placeholder="Step 3 Aksi / Output"
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
              />
              <div className="flex items-center gap-gutter-xs pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-md"
                >
                  {editingWfId ? 'Simpan' : 'Tambah Workflow'}
                </button>
                {editingWfId && (
                  <button
                    type="button"
                    onClick={resetWfForm}
                    className="px-4 py-2 rounded-full bg-dark-surface-container-high text-dark-on-surface-variant font-label text-label-sm"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 flex flex-col gap-gutter-sm">
              {data.workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-headline text-body-md text-dark-on-surface font-semibold">{wf.tabLabel}</p>
                    <p className="font-mono text-[11px] text-dark-tertiary">
                      {wf.nodes.map((n) => n.title).join(' → ')}
                    </p>
                    <p className="font-body text-body-sm text-dark-on-surface-variant mt-1">
                      {wf.nodes[1]?.description ?? wf.latency}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditWf(wf)}
                      className="px-2.5 py-1 rounded bg-dark-surface-container-high text-dark-primary font-mono text-[11px]"
                    >
                      Edit
                    </button>
                    {data.workflows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteWorkflow(wf.id);
                          notify('Workflow dihapus.');
                        }}
                        className="px-2.5 py-1 rounded bg-dark-error/20 text-dark-error font-mono text-[11px]"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
