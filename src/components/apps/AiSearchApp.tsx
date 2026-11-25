'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { matchPortfolioQuestion, type QaAnswer, type QaFollowUp } from '@/data/qa';
import { type AppId } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

const APP_IDS = new Set<string>([
  'about',
  'skills',
  'projects',
  'github',
  'contact',
  'ai-lab',
  'terminal',
]);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  answer?: QaAnswer;
  timestamp: string;
}

function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function AiSearchApp() {
  const { aiSearchQuery, openApp, openCaseStudy, settings } = useOs();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestBadge, setLatestBadge] = useState('RAG • qwen3.7-flash');
  const lastHandledQueryRef = useRef<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const query = rawText.trim();
      if (!query || loading) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}-${Math.random()}`,
        role: 'user',
        text: query,
        timestamp: nowTime(),
      };

      const historySnapshot = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.role === 'assistant' && m.answer ? m.answer.summary : m.text,
      }));

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      let resolvedAnswer: QaAnswer | null = null;
      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, history: historySnapshot }),
        });
        if (res.ok) {
          const payload = (await res.json()) as { ok?: boolean; answer?: QaAnswer };
          if (payload.ok && payload.answer) {
            resolvedAnswer = payload.answer;
          }
        }
      } catch {
        // Fallback below
      }

      if (!resolvedAnswer) {
        resolvedAnswer = matchPortfolioQuestion(query);
      }

      setLatestBadge(resolvedAnswer.badge);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        text: resolvedAnswer.summary,
        answer: resolvedAnswer,
        timestamp: nowTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    },
    [loading, messages]
  );

  useEffect(() => {
    const q = aiSearchQuery.trim();
    if (!q || lastHandledQueryRef.current === q) return;
    lastHandledQueryRef.current = q;
    sendMessage(q);
  }, [aiSearchQuery, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    const text = inputValue.trim();
    setInputValue('');
    sendMessage(text);
  };

  const handleFollowUp = (chip: QaFollowUp) => {
    if (loading) return;
    sendMessage(chip.question);
  };

  const handleNewChat = () => {
    setMessages([]);
    setLatestBadge('RAG • qwen3.7-flash');
  };

  const blur2xl = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Chat Asisten AI Baihaqi OS"
      className={`w-full max-w-4xl mx-auto h-[72vh] md:h-[75vh] rounded-xl bg-dark-surface-container-lowest/95 ${blur2xl} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="ai-search"
        title="ai-chat — Asisten RAG Baihaqi OS"
        badgeText={loading ? 'Mengetik...' : latestBadge}
        rightSlot={
          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-mono text-[11px] text-dark-on-surface-variant hover:text-dark-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
              add_comment
            </span>
            <span className="hidden sm:inline">Chat Baru</span>
          </button>
        }
      />

      {/* Scrollable Chat Messages Area */}
      <div
        aria-live="polite"
        className="flex-1 min-h-0 overflow-y-auto os-scroll p-gutter-md sm:p-gutter-xl flex flex-col gap-gutter-lg"
      >
        {messages.length === 0 && !loading && (
          <div className="my-auto flex flex-col items-center text-center gap-gutter-md py-gutter-xl">
            <div className="w-12 h-12 rounded-2xl bg-dark-primary/15 border border-dark-primary/40 flex items-center justify-center text-dark-primary">
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                auto_awesome
              </span>
            </div>
            <div>
              <h1 className="font-headline text-title-md text-dark-on-surface">
                Asisten AI Portofolio Baihaqi
              </h1>
              <p className="font-body text-body-sm text-dark-on-surface-variant mt-1 max-w-md">
                Tanyakan apa saja tentang pengalaman kerja, proyek GitHub, tech stack Laravel &amp; n8n, atau cara menghubungi Baihaqi.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-gutter-xs">
              {[
                'Apa pengalaman kerja Baihaqi?',
                'Tech stack andalan apa saja?',
                'Proyek terbaru di GitHub?',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => sendMessage(preset)}
                  className="px-3 py-1.5 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-body text-body-sm text-dark-on-surface hover:border-dark-primary transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isLastAssistant =
            msg.role === 'assistant' && idx === messages.length - 1;

          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-end gap-1">
                  <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-dark-primary text-dark-on-primary font-body text-body-sm sm:text-body-md shadow-md">
                    {msg.text}
                  </div>
                  <span className="font-mono text-[10px] text-dark-outline px-1">
                    Anda • {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          const ans = msg.answer;
          return (
            <div key={msg.id} className="flex items-start gap-gutter-sm sm:gap-gutter-md">
              <div className="w-8 h-8 rounded-xl bg-dark-tertiary-container/30 border border-dark-tertiary/40 text-dark-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  smart_toy
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-gutter-sm">
                <div className="p-gutter-md sm:p-gutter-lg rounded-2xl rounded-tl-sm bg-dark-surface-container-low/90 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm shadow-sm">
                  <p className="font-body text-body-sm sm:text-body-md text-dark-on-surface text-pretty">
                    {ans?.summary ?? msg.text}
                  </p>

                  {ans && ans.bullets.length > 0 && (
                    <ul className="space-y-1.5 pl-4 font-body text-body-sm text-dark-on-surface-variant list-disc">
                      {ans.bullets.map((bullet) => (
                        <li key={bullet.title}>
                          <strong className="text-dark-primary">{bullet.title}</strong> — {bullet.detail}
                        </li>
                      ))}
                    </ul>
                  )}

                  {ans && ans.sources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-gutter-xs border-t border-dark-outline-variant/30">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-dark-outline mr-1">
                        Sumber:
                      </span>
                      {ans.sources.map((src) => (
                        <button
                          key={src.file}
                          type="button"
                          onClick={() => {
                            if (APP_IDS.has(src.projectId)) {
                              openApp(src.projectId as AppId);
                            } else {
                              openCaseStudy(src.projectId);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dark-surface-container-high/90 border border-dark-outline-variant/50 hover:border-dark-primary font-mono text-[11px] text-dark-tertiary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]" aria-hidden="true">
                            {src.icon}
                          </span>
                          <span>{src.file}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <span className="font-mono text-[10px] text-dark-outline">
                    Baihaqi AI • {msg.timestamp}
                  </span>
                </div>

                {isLastAssistant && ans && ans.followUps.length > 0 && !loading && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ans.followUps.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => handleFollowUp(chip)}
                        className="px-3 py-1 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 font-body text-label-sm text-dark-on-surface-variant hover:text-dark-on-surface hover:border-dark-primary transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-gutter-sm sm:gap-gutter-md">
            <div className="w-8 h-8 rounded-xl bg-dark-tertiary-container/30 border border-dark-tertiary/40 text-dark-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] animate-pulse" aria-hidden="true">
                smart_toy
              </span>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-dark-surface-container-low/90 border border-dark-outline-variant/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dark-primary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-dark-tertiary animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-dark-primary animate-bounce [animation-delay:300ms]" />
              <span className="font-mono text-label-sm text-dark-on-surface-variant ml-1">
                Mencari di data Baihaqi OS...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Pinned Bottom Chat Input Bar */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="shrink-0 p-gutter-md sm:px-gutter-xl sm:py-gutter-md bg-dark-surface-container/80 border-t border-dark-outline-variant/40"
      >
        <div className="flex items-center gap-gutter-sm rounded-full bg-dark-surface-container-low/90 border border-dark-outline-variant/60 focus-within:border-dark-primary px-gutter-md py-1.5 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-dark-tertiary shrink-0" aria-hidden="true">
            auto_awesome
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            aria-label="Kirim pesan ke Asisten AI Baihaqi"
            placeholder="Ketik pertanyaan lanjutan tentang Baihaqi..."
            className="w-full bg-transparent border-0 p-1 font-body text-body-sm sm:text-body-md text-dark-on-surface placeholder:text-dark-outline focus:ring-0 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            aria-label="Kirim pesan"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container disabled:opacity-40 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_upward
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
