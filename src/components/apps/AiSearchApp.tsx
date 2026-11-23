'use client';

import React, { useEffect, useState } from 'react';
import { matchPortfolioQuestion, type QaAnswer, type QaFollowUp } from '@/data/qa';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function AiSearchApp() {
  const { aiSearchQuery, askAi, openCaseStudy, settings } = useOs();
  const [inputValue, setInputValue] = useState(aiSearchQuery);
  const [answer, setAnswer] = useState<QaAnswer>(() => matchPortfolioQuestion(aiSearchQuery));

  useEffect(() => {
    setInputValue(aiSearchQuery);
    setAnswer(matchPortfolioQuestion(aiSearchQuery));
  }, [aiSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    askAi(q);
  };

  const handleFollowUp = (chip: QaFollowUp) => {
    setInputValue(chip.question);
    askAi(chip.question);
  };

  const blur2xl = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Jawaban Asisten Baihaqi OS"
      aria-live="polite"
      className={`w-full max-w-4xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blur2xl} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="ai-search"
        title="ai-search — Ringkasan Jawaban & Asisten AI"
        badgeText={answer.badge}
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg">
        {/* Active Search Bar */}
        <form
          onSubmit={handleSubmit}
          data-component-id="searchbar-standard"
          data-component-type="searchbar"
          data-component-variant="standard"
          role="search"
          className="w-full rounded-lg bg-dark-surface-container-low/80 border border-dark-primary/60 p-gutter-md flex flex-col gap-gutter-sm sm:gap-gutter-md shadow-lg"
        >
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Pertanyaan untuk Baihaqi OS"
            placeholder="Tanya tentang proyek, stack, atau ketersediaan Baihaqi..."
            className="w-full bg-transparent border-0 p-0 font-body text-body-md text-dark-on-surface placeholder:text-dark-on-surface-variant focus:ring-0 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-xs">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-dark-tertiary-container/30 text-dark-tertiary">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                  smart_toy
                </span>
              </span>
              <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                Asisten Portofolio Baihaqi OS
              </span>
            </div>
            <div className="flex items-center gap-gutter-sm">
              <span
                data-design-text-token="label-sm"
                className="hidden sm:inline-flex items-center gap-gutter-xs px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high/80 border border-dark-outline-variant/50 font-label text-label-sm text-dark-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                  search
                </span>
                Pencarian AI
              </span>
              <button
                type="submit"
                aria-label="Kirim pertanyaan"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change ease-state-change"
              >
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Answer Content */}
        <div className="flex flex-col gap-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <span className="material-symbols-outlined text-[18px] text-dark-primary" aria-hidden="true">
              auto_awesome
            </span>
            <h1 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
              Ringkasan Jawaban
            </h1>
          </div>
          <p data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-on-surface text-pretty">
            {answer.summary}
          </p>
          <ul className="space-y-gutter-xs pl-gutter-md font-body text-body-sm sm:text-body-md text-dark-on-surface-variant list-disc">
            {answer.bullets.map((bullet) => (
              <li key={bullet.title}>
                <strong className="text-dark-primary">{bullet.title}</strong> — {bullet.detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-gutter-sm">
          <span
            data-design-text-token="label-sm"
            className="font-label text-label-sm uppercase tracking-wider text-dark-outline"
          >
            Sumber Terkait di Baihaqi OS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch">
            {answer.sources.map((src) => (
              <button
                key={src.file}
                type="button"
                onClick={() => openCaseStudy(src.projectId)}
                className="text-left h-full p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/50 hover:border-dark-primary transition-colors duration-state-change flex flex-col gap-gutter-xs"
              >
                <div className="flex items-center justify-between gap-gutter-sm w-full">
                  <span
                    data-design-text-token="mono-md"
                    className={`font-mono text-mono-md ${
                      src.accent === 'tertiary' ? 'text-dark-tertiary' : 'text-dark-primary'
                    }`}
                  >
                    {src.file}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-dark-on-surface-variant" aria-hidden="true">
                    {src.icon}
                  </span>
                </div>
                <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  {src.stack}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-gutter-xs pt-gutter-sm border-t border-dark-outline-variant/40">
          <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-outline">
            Pertanyaan Lanjutan
          </span>
          <div className="flex flex-wrap gap-gutter-xs">
            {answer.followUps.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => handleFollowUp(chip)}
                className="px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-body text-body-sm text-dark-on-surface hover:border-dark-primary transition-colors duration-state-change ease-state-change"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
