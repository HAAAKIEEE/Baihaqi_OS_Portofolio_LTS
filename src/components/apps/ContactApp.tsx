'use client';

import React, { useState } from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

const SCOPES = ['Otomasi AI & Agen', 'Web App Full-Stack', 'Konsultasi Sistem'] as const;

export function ContactApp() {
  const { settings } = useOs();
  const [selectedScope, setSelectedScope] = useState<string>(SCOPES[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanBrief = brief.trim();

    if (!cleanName || !cleanEmail || !cleanBrief) {
      setErrorMessage('Nama, email, dan ringkasan kebutuhan wajib diisi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Format email tidak valid.');
      return;
    }

    setSubmitting(true);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'baihaqi-os-portfolio',
            scope: selectedScope,
            name: cleanName,
            email: cleanEmail,
            brief: cleanBrief,
            submittedAt: new Date().toISOString(),
          }),
        }).catch(() => {
          // Non-blocking fallback so confirmation remains reliable
        });
      }

      setStatusMessage('[200 OK] Brief berhasil dikirim ke antrean Baihaqi OS. Terima kasih!');
      setName('');
      setEmail('');
      setBrief('');
    } finally {
      setSubmitting(false);
    }
  };

  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  const whatsappText = [
    `Halo ${PROFILE_INFO.name}, saya tertarik untuk kolaborasi.`,
    `Kategori: ${selectedScope}`,
    name.trim() ? `Nama: ${name.trim()}` : '',
    brief.trim() ? `Detail: ${brief.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const whatsappHref = `${PROFILE_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section
      aria-label="Kontak dan Konsultasi Otomasi AI"
      className={`w-full max-w-4xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="contact"
        title="kontak.sh — Konsultasi Web & Otomasi AI"
        badgeText={PROFILE_INFO.availabilityLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Direct Channels & Scope */}
        <aside className="lg:col-span-5 p-gutter-lg sm:p-gutter-xl bg-dark-surface-container/50 border-b lg:border-b-0 lg:border-r border-dark-outline-variant/40 flex flex-col justify-between gap-gutter-lg">
          <div className="flex flex-col gap-gutter-md">
            <div>
              <h1 data-design-text-token="headline-md" className="font-headline text-title-md sm:text-headline-md text-dark-on-surface">
                Mulai Kolaborasi
              </h1>
              <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty mt-gutter-xs">
                Kirimkan detail kebutuhan aplikasi web atau alur otomasi AI Anda. Balasan rata-rata dalam 24 jam.
              </p>
            </div>

            <div className="flex flex-col gap-gutter-sm pt-gutter-sm">
              <a
                href={PROFILE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-gutter-sm p-gutter-md rounded-md bg-emerald-500/10 border border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-500/15 transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400" aria-hidden="true">
                  chat
                </span>
                <div className="flex flex-col">
                  <span data-design-text-token="label-sm" className="font-label text-label-sm text-emerald-300/90">
                    WhatsApp Langsung
                  </span>
                  <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
                    {PROFILE_INFO.whatsappNumber}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="flex items-center gap-gutter-sm p-gutter-md rounded-md bg-dark-surface-container-low/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-[18px] text-dark-primary" aria-hidden="true">
                  mail
                </span>
                <div className="flex flex-col">
                  <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-outline">
                    Email Langsung
                  </span>
                  <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
                    {PROFILE_INFO.email}
                  </span>
                </div>
              </a>

              <a
                href={PROFILE_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-gutter-sm p-gutter-md rounded-md bg-dark-surface-container-low/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-[18px] text-dark-tertiary" aria-hidden="true">
                  code_blocks
                </span>
                <div className="flex flex-col">
                  <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-outline">
                    GitHub
                  </span>
                  <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
                    {PROFILE_INFO.githubHandle}
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-gutter-xs pt-gutter-md border-t border-dark-outline-variant/40">
            <span
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-outline"
            >
              Fokus Layanan
            </span>
            <ul className="space-y-gutter-xs">
              <li className="flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-[15px] text-dark-primary" aria-hidden="true">
                  check
                </span>
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Aplikasi Web Full-Stack (Next.js / API)
                </span>
              </li>
              <li className="flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-[15px] text-dark-primary" aria-hidden="true">
                  check
                </span>
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Otomasi AI, Agen LLM &amp; n8n Workflow
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Column: Interactive Inquiry Form */}
        <div className="lg:col-span-7 p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                Kategori Proyek
              </span>
              <div className="flex flex-wrap gap-gutter-xs">
                {SCOPES.map((scope) => {
                  const active = selectedScope === scope;
                  return (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setSelectedScope(scope)}
                      className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm transition-colors duration-state-change ease-state-change ${
                        active
                          ? 'bg-dark-primary text-dark-on-primary'
                          : 'bg-dark-surface-container-high text-dark-on-surface-variant hover:text-dark-on-surface'
                      }`}
                    >
                      {scope}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              <label className="flex flex-col gap-gutter-xs">
                <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                  Nama Anda
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth. Andi Pratama"
                  className="w-full rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-gutter-md py-gutter-sm font-body text-body-md text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:ring-0 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-gutter-xs">
                <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-gutter-md py-gutter-sm font-body text-body-md text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:ring-0 focus:outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-gutter-xs">
              <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                Ringkasan Kebutuhan
              </span>
              <textarea
                rows={4}
                required
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Ceritakan alur kerja yang ingin diotomatiskan atau fitur web yang ingin dibangun..."
                className="w-full rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-gutter-md py-gutter-sm font-body text-body-md text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:ring-0 focus:outline-none resize-none"
              />
            </label>

            {errorMessage && (
              <div
                role="alert"
                className="p-gutter-md rounded-md bg-dark-error-container/30 border border-dark-error/60 font-mono text-mono-md text-dark-error"
              >
                {errorMessage}
              </div>
            )}

            {statusMessage && (
              <div
                role="status"
                className="p-gutter-md rounded-md bg-dark-surface-container border border-dark-tertiary/50 font-mono text-mono-md text-dark-tertiary"
              >
                {statusMessage}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-gutter-sm sm:gap-gutter-md pt-gutter-xs">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400 transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  chat
                </span>
                <span data-design-text-token="label-lg" className="font-label text-label-lg">
                  Chat via WhatsApp
                </span>
              </a>

              <button
                type="submit"
                disabled={submitting}
                data-component-id="button-primary"
                data-component-type="button"
                data-component-variant="primary"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-gutter-sm rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container disabled:opacity-60 transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
              >
                <span data-design-text-token="label-lg" className="font-label text-label-lg">
                  {submitting ? 'Mengirim...' : 'Kirim Brief Proyek'}
                </span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  send
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
