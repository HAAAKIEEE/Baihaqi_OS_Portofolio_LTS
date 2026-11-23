'use client';

import React, { useState } from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { SKILL_PILLARS } from '@/data/skills';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

interface LogEntry {
  id: number;
  command: string;
  response: string;
}

export function TerminalApp() {
  const { openApp, lockSession, settings } = useOs();
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const executeCommand = (rawCmd: string) => {
    const normalized = rawCmd.trim().toLowerCase();
    if (!normalized) return;

    if (normalized === 'clear') {
      setLogs([]);
      return;
    }

    let response = '';
    if (normalized === 'help') {
      response =
        'Available commands: neofetch, bio, whoami, skills, projects, ai, github, contact, settings, lock, clear';
    } else if (normalized === 'bio' || normalized === 'neofetch' || normalized === 'neofetch --bio') {
      response =
        'Baihaqi — Web Developer & AI Automation Specialist (4+ yrs, Laravel/Livewire/Tailwind + n8n/LLM Agents).';
    } else if (normalized === 'whoami') {
      response = `${PROFILE_INFO.username} — ${PROFILE_INFO.role} (${PROFILE_INFO.location})`;
    } else if (normalized === 'skills' || normalized === 'cat skills.json' || normalized === 'cat ~/skills.json') {
      response =
        'Stack: Laravel, Livewire, Tailwind CSS, PHP, TypeScript/Next.js, MySQL/PostgreSQL, Python, n8n, OpenAI/Gemini API, Docker, Linux.';
    } else if (normalized === 'contact') {
      response = `Email: ${PROFILE_INFO.email} | GitHub: ${PROFILE_INFO.githubHandle} | Status: Open for projects.`;
    } else if (normalized === 'projects' || normalized === 'ls ~/projects') {
      openApp('projects');
      return;
    } else if (normalized === 'ai' || normalized === 'ai-lab') {
      openApp('ai-lab');
      return;
    } else if (normalized === 'github') {
      openApp('github');
      return;
    } else if (normalized === 'settings') {
      openApp('settings');
      return;
    } else if (normalized === 'lock') {
      lockSession();
      return;
    } else {
      response = `zsh: command executed -> ${normalized} (try 'help', 'bio', 'skills', 'projects', or 'contact')`;
    }

    setLogs((prev) => [...prev, { id: Date.now() + Math.random(), command: rawCmd.trim(), response }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    executeCommand(commandInput);
    setCommandInput('');
  };

  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Terminal App — Bio dan Keahlian"
      className={`w-full max-w-4xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="terminal"
        title="baihaqi@linux-os: ~ (zsh)"
        rightSlot={
          <div className="hidden sm:flex items-center gap-gutter-xs">
            <button
              type="button"
              onClick={() => executeCommand('neofetch')}
              className="px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-label-sm text-dark-primary hover:bg-dark-surface-container-highest transition-colors duration-state-change ease-state-change"
            >
              neofetch
            </button>
            <button
              type="button"
              onClick={() => executeCommand('skills')}
              className="px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-label-sm text-dark-tertiary hover:bg-dark-surface-container-highest transition-colors duration-state-change ease-state-change"
            >
              cat skills.json
            </button>
            <button
              type="button"
              onClick={() => executeCommand('clear')}
              className="px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-label-sm text-dark-on-surface-variant hover:text-dark-on-surface transition-colors duration-state-change ease-state-change"
            >
              clear
            </button>
          </div>
        }
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg sm:gap-gutter-xl">
        {/* Section 1: $ neofetch --bio */}
        <div className="flex flex-col gap-gutter-md">
          <div className="flex items-center gap-gutter-sm font-mono text-mono-md">
            <span className="text-dark-tertiary">baihaqi@linux-os</span>
            <span className="text-dark-outline">:</span>
            <span className="text-dark-primary">~</span>
            <span className="text-dark-on-surface">$ neofetch --bio</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-lg items-start p-gutter-md sm:p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-gutter-lg rounded-md bg-dark-surface-container/80 border border-dark-outline-variant/30 text-center gap-gutter-sm">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-dark-primary-container/25 to-dark-surface-container-high border border-dark-primary/50 overflow-hidden shadow-md">
                <img
                  src={PROFILE_INFO.avatarUrl}
                  alt={`Avatar ${PROFILE_INFO.name}`}
                  className="w-full h-full object-cover object-[50%_62%]"
                />
              </div>
              <div>
                <p data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                  {PROFILE_INFO.name}
                </p>
                <p data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-tertiary">
                  {PROFILE_INFO.host}
                </p>
              </div>
              <span
                data-component-id="badge-status"
                data-component-type="badge"
                data-component-variant="status"
                role="status"
                className="inline-flex items-center px-gutter-sm py-gutter-xs rounded-full bg-dark-tertiary-container/25 border border-dark-tertiary/40 text-dark-tertiary"
              >
                <span data-design-text-token="label-sm" className="font-label text-label-sm">
                  Open to Work
                </span>
              </span>
            </div>

            <div className="md:col-span-8 flex flex-col gap-gutter-md">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter-lg gap-y-gutter-sm font-mono text-mono-md">
                <div className="flex items-baseline gap-gutter-sm">
                  <dt className="text-dark-primary shrink-0">Role:</dt>
                  <dd className="text-dark-on-surface">{PROFILE_INFO.shortRole}</dd>
                </div>
                <div className="flex items-baseline gap-gutter-sm">
                  <dt className="text-dark-primary shrink-0">Kernel:</dt>
                  <dd className="text-dark-on-surface">{PROFILE_INFO.osName}</dd>
                </div>
                <div className="flex items-baseline gap-gutter-sm">
                  <dt className="text-dark-primary shrink-0">Shell:</dt>
                  <dd className="text-dark-on-surface">{PROFILE_INFO.shell}</dd>
                </div>
                <div className="flex items-baseline gap-gutter-sm">
                  <dt className="text-dark-primary shrink-0">Uptime:</dt>
                  <dd className="text-dark-on-surface tabular-nums">4+ Years Experience</dd>
                </div>
              </dl>

              <div className="border-t border-dark-outline-variant/40 pt-gutter-md">
                <p data-design-text-token="body-md" className="font-body text-body-md text-dark-on-surface-variant text-pretty">
                  {PROFILE_INFO.terminalBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: $ cat ~/skills.json */}
        <div className="flex flex-col gap-gutter-md">
          <div className="flex items-center gap-gutter-sm font-mono text-mono-md">
            <span className="text-dark-tertiary">baihaqi@linux-os</span>
            <span className="text-dark-outline">:</span>
            <span className="text-dark-primary">~</span>
            <span className="text-dark-on-surface">$ cat ~/skills.json</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md items-stretch">
            {SKILL_PILLARS.map((pillar) => (
              <article
                key={pillar.id}
                className="h-full p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex flex-col gap-gutter-md"
              >
                <header className="flex items-center gap-gutter-sm">
                  <span className={`material-symbols-outlined text-[18px] ${pillar.accentClass}`} aria-hidden="true">
                    {pillar.icon}
                  </span>
                  <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                    {pillar.id === 'web' ? 'Web Development' : pillar.id === 'ai' ? 'AI & Automation' : pillar.title}
                  </h2>
                </header>
                <div className="flex flex-wrap gap-gutter-xs">
                  {pillar.terminalTags.map((tag, idx) => (
                    <span
                      key={tag}
                      className={`px-gutter-sm py-gutter-xs rounded-sm bg-dark-surface-container-high font-mono text-label-sm ${
                        pillar.id === 'ai' && idx === 0
                          ? 'text-dark-tertiary'
                          : pillar.id === 'web' && idx === 0
                            ? 'text-dark-primary'
                            : 'text-dark-on-surface'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Live Dynamic Output Area */}
        {logs.length > 0 && (
          <div
            aria-live="polite"
            className="flex flex-col gap-gutter-sm p-gutter-md rounded-md bg-dark-surface-container/70 border border-dark-outline-variant/40 font-mono text-mono-md"
          >
            {logs.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-1">
                <span className="text-dark-primary">$ {entry.command}</span>
                <span className="text-dark-on-surface-variant">{entry.response}</span>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Command Input Prompt */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-gutter-sm pt-gutter-sm border-t border-dark-outline-variant/40 font-mono text-mono-md"
        >
          <span className="hidden sm:inline text-dark-tertiary shrink-0">baihaqi@linux-os</span>
          <span className="hidden sm:inline text-dark-outline shrink-0">:~$</span>
          <span className="sm:hidden text-dark-tertiary shrink-0">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            aria-label="Terminal command input"
            placeholder="Type 'help', 'bio', 'skills', 'projects', or 'contact'..."
            className="w-full bg-transparent border-0 p-0 font-mono text-mono-md text-dark-on-surface placeholder:text-dark-outline focus:ring-0 focus:outline-none"
          />
        </form>
      </div>
    </section>
  );
}
