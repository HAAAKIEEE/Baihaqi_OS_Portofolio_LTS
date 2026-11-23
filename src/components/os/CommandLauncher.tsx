'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useOs } from '@/context/OsContext';

interface CommandEntry {
  id: string;
  group: 'system' | 'quick';
  icon: string;
  iconAccent: string;
  title: string;
  subtitle?: string;
  shortcut?: string;
  keywords: string;
  onSelect: () => void;
}

export function CommandLauncher() {
  const { isLauncherOpen, closeLauncher, openApp, askAi, lockSession, settings } = useOs();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<CommandEntry[]>(
    () => [
      {
        id: 'terminal',
        group: 'system',
        icon: 'terminal',
        iconAccent: 'text-dark-primary',
        title: 'Terminal App',
        subtitle: 'Buka shell interaktif, bio neofetch & skills.json',
        shortcut: 'Alt + T',
        keywords: 'terminal zsh shell bio neofetch skills',
        onSelect: () => openApp('terminal'),
      },
      {
        id: 'projects',
        group: 'system',
        icon: 'folder_code',
        iconAccent: 'text-dark-tertiary',
        title: 'File Manager (Proyek)',
        subtitle: 'Jelajahi 42+ proyek web dan studi kasus',
        shortcut: 'Alt + P',
        keywords: 'proyek project file manager case study readme',
        onSelect: () => openApp('projects'),
      },
      {
        id: 'ai-lab',
        group: 'system',
        icon: 'smart_toy',
        iconAccent: 'text-dark-primary',
        title: 'AI Lab Studio',
        subtitle: 'Simulasi alur kerja n8n, LLM Agent & RAG',
        shortcut: 'Alt + A',
        keywords: 'ai lab automation n8n llm agent rag workflow',
        onSelect: () => openApp('ai-lab'),
      },
      {
        id: 'about',
        group: 'system',
        icon: 'person',
        iconAccent: 'text-dark-on-surface',
        title: 'Tentang & Pengalaman',
        subtitle: 'Profil profesional & lini masa karier Baihaqi',
        keywords: 'tentang about resume cv pengalaman karier',
        onSelect: () => openApp('about'),
      },
      {
        id: 'skills',
        group: 'system',
        icon: 'layers',
        iconAccent: 'text-dark-tertiary',
        title: 'Monitor Keahlian (htop)',
        subtitle: 'Tech stack Web Full-Stack, AI & Linux DevOps',
        keywords: 'keahlian skills tech stack htop typescript nextjs',
        onSelect: () => openApp('skills'),
      },
      {
        id: 'settings',
        group: 'system',
        icon: 'settings',
        iconAccent: 'text-dark-on-surface-variant',
        title: 'Pengaturan Sistem',
        subtitle: 'Preferensi Glassmorphism & pintasan keyboard',
        keywords: 'settings pengaturan glassmorphism config',
        onSelect: () => openApp('settings'),
      },
      {
        id: 'quick-contact',
        group: 'quick',
        icon: 'mail',
        iconAccent: 'text-dark-tertiary',
        title: 'kontak --brief',
        subtitle: 'Kirim brief proyek Web / AI',
        keywords: 'kontak contact brief email proyek kolaborasi',
        onSelect: () => openApp('contact'),
      },
      {
        id: 'quick-github',
        group: 'quick',
        icon: 'code_blocks',
        iconAccent: 'text-dark-on-surface',
        title: 'github --repos',
        subtitle: 'Lihat repositori & commit terbaru',
        keywords: 'github repos open source git log commit',
        onSelect: () => openApp('github'),
      },
      {
        id: 'quick-ask',
        group: 'quick',
        icon: 'auto_awesome',
        iconAccent: 'text-dark-primary',
        title: 'ai --ask "Proyek Otomasi AI"',
        subtitle: 'Tanya asisten AI portofolio Baihaqi OS',
        keywords: 'ask ai search tanya asisten q&a',
        onSelect: () => askAi('Apa saja proyek otomasi AI yang pernah dibangun Baihaqi?'),
      },
      {
        id: 'quick-lock',
        group: 'quick',
        icon: 'lock',
        iconAccent: 'text-dark-tertiary',
        title: 'lock --session',
        subtitle: 'Kunci layar desktop Baihaqi OS',
        shortcut: 'Alt + L',
        keywords: 'lock kunci layar session',
        onSelect: () => lockSession(),
      },
    ],
    [askAi, lockSession, openApp]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [entries, query]);

  useEffect(() => {
    if (isLauncherOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isLauncherOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isLauncherOpen) return null;

  const systemItems = filtered.filter((e) => e.group === 'system');
  const quickItems = filtered.filter((e) => e.group === 'quick');
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filtered[selectedIndex];
      if (chosen) {
        chosen.onSelect();
      } else if (query.trim()) {
        askAi(query.trim());
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Peluncur Perintah Baihaqi OS"
      onClick={closeLauncher}
      className="fixed inset-0 z-50 flex items-center justify-center p-gutter-lg bg-dark-scrim/60 backdrop-blur-sm animate-surface-enter"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-2xl rounded-xl bg-dark-surface-container-lowest/95 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-gutter-md px-gutter-xl py-gutter-lg border-b border-dark-outline-variant/50 bg-dark-surface-container/60">
          <span className="material-symbols-outlined text-[20px] text-dark-primary" aria-hidden="true">
            search
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari aplikasi atau ketik perintah"
            placeholder="Cari aplikasi, proyek, atau ketik perintah Linux..."
            className="w-full bg-transparent border-0 p-0 font-body text-body-md text-dark-on-surface placeholder:text-dark-outline focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeLauncher}
            data-design-text-token="label-sm"
            className="px-gutter-sm py-gutter-xs rounded bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-label-sm text-dark-on-surface-variant hover:text-dark-on-surface"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-gutter-lg flex flex-col gap-gutter-lg max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-gutter-lg rounded-lg bg-dark-surface-container-low/70 border border-dark-outline-variant/40 flex flex-col items-center text-center gap-gutter-sm">
              <p data-design-text-token="body-md" className="font-body text-body-md text-dark-on-surface">
                Tidak ada perintah persis untuk &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => askAi(query)}
                className="inline-flex items-center gap-gutter-xs px-gutter-lg py-gutter-xs rounded-full bg-dark-primary text-dark-on-primary font-label text-label-sm hover:bg-dark-primary-container transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                  auto_awesome
                </span>
                Tanyakan ke Asisten AI
              </button>
            </div>
          ) : (
            <>
              {systemItems.length > 0 && (
                <div className="flex flex-col gap-gutter-xs">
                  <h2
                    data-design-text-token="label-sm"
                    className="font-label text-label-sm uppercase tracking-wider text-dark-outline px-gutter-sm mb-gutter-xs"
                  >
                    Aplikasi Sistem
                  </h2>
                  {systemItems.map((item) => {
                    const globalIdx = filtered.indexOf(item);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full text-left flex items-center justify-between gap-gutter-md p-gutter-md rounded-md border transition-colors duration-state-change ease-state-change ${
                          isSelected
                            ? 'bg-dark-surface-container-high/80 border-dark-primary/50'
                            : 'border-transparent hover:bg-dark-surface-container-high/60'
                        }`}
                      >
                        <div className="flex items-center gap-gutter-md min-w-0">
                          <span className={`material-symbols-outlined text-[20px] ${item.iconAccent}`} aria-hidden="true">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <p data-design-text-token="body-md" className="font-body text-body-md text-dark-on-surface truncate">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p
                                data-design-text-token="body-sm"
                                className="hidden sm:block font-body text-body-sm text-dark-on-surface-variant truncate"
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.shortcut && (
                          <span
                            data-design-text-token="mono-md"
                            className={`font-mono text-label-sm sm:text-mono-md shrink-0 ${
                              isSelected ? 'text-dark-primary' : 'text-dark-on-surface-variant'
                            }`}
                          >
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {quickItems.length > 0 && (
                <div className="flex flex-col gap-gutter-xs border-t border-dark-outline-variant/40 pt-gutter-md">
                  <h2
                    data-design-text-token="label-sm"
                    className="font-label text-label-sm uppercase tracking-wider text-dark-outline px-gutter-sm mb-gutter-xs"
                  >
                    Perintah Cepat
                  </h2>
                  {quickItems.map((item) => {
                    const globalIdx = filtered.indexOf(item);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full text-left flex items-center justify-between gap-gutter-md p-gutter-md rounded-md border transition-colors duration-state-change ease-state-change ${
                          isSelected
                            ? 'bg-dark-surface-container-high/80 border-dark-primary/50'
                            : 'border-transparent hover:bg-dark-surface-container-high/60'
                        }`}
                      >
                        <div className="flex items-center gap-gutter-md min-w-0">
                          <span className={`material-symbols-outlined text-[20px] ${item.iconAccent}`} aria-hidden="true">
                            {item.icon}
                          </span>
                          <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface truncate">
                            {item.title}
                          </span>
                        </div>
                        {item.subtitle && (
                          <span
                            data-design-text-token="body-sm"
                            className="hidden sm:inline font-body text-body-sm text-dark-on-surface-variant shrink-0"
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Launcher Footer Hints */}
        <footer className="flex items-center justify-between px-gutter-xl py-gutter-sm bg-dark-surface-container/70 border-t border-dark-outline-variant/40 font-mono text-label-sm text-dark-outline">
          <span>↑↓ Navigasi • ↵ Buka</span>
          <span>{filtered.length} Perintah Tersedia • Baihaqi OS v2.4</span>
        </footer>
      </section>
    </div>
  );
}
