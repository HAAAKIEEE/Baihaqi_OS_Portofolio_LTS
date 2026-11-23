'use client';

import React, { useState } from 'react';
import { WORKFLOWS, WORKFLOW_LIST, type WorkflowId, type WorkflowLogLine } from '@/data/workflows';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function AiLabApp() {
  const { settings } = useOs();
  const [selectedId, setSelectedId] = useState<WorkflowId>('crm');
  const [extraLogs, setExtraLogs] = useState<Record<WorkflowId, WorkflowLogLine[]>>({
    crm: [],
    rag: [],
    ocr: [],
  });

  const activeWorkflow = WORKFLOWS[selectedId];
  const combinedLogs = [...activeWorkflow.logs, ...extraLogs[selectedId]];

  const handleRunSimulation = () => {
    const now = new Date();
    const ts = `[${now.toTimeString().slice(0, 8)}]`;
    const nextLine: WorkflowLogLine = {
      timestamp: ts,
      message: `simulation.run → workflow="${selectedId}" selesai tanpa galat (200 OK)`,
      colorClass: 'text-dark-tertiary',
    };
    setExtraLogs((prev) => ({
      ...prev,
      [selectedId]: [...prev[selectedId], nextLine],
    }));
  };

  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="AI Lab — Demo Alur Kerja Otomasi"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="ai-lab"
        title="ai-lab.service — Studio Otomasi & Agen LLM"
        badgeText="18 Alur Aktif"
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg sm:gap-gutter-xl">
        {/* Workflow Selector Tabs + Run Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex flex-wrap items-center gap-gutter-xs" role="tablist" aria-label="Pilih Alur Otomasi">
            {WORKFLOW_LIST.map((wf) => {
              const isSelected = wf.id === selectedId;
              return (
                <button
                  key={wf.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(wf.id)}
                  className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm transition-colors duration-state-change ease-state-change ${
                    isSelected
                      ? 'bg-dark-primary text-dark-on-primary'
                      : 'bg-dark-surface-container-high text-dark-on-surface-variant hover:text-dark-on-surface'
                  }`}
                >
                  {wf.tabLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleRunSimulation}
            data-component-id="button-primary"
            data-component-type="button"
            data-component-variant="primary"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-gutter-xs px-gutter-lg py-gutter-xs rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change ease-state-change"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              play_arrow
            </span>
            <span data-design-text-token="label-lg" className="font-label text-label-lg">
              Jalankan Simulasi
            </span>
          </button>
        </div>

        {/* 3-Node Pipeline Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md items-stretch">
          {activeWorkflow.nodes.map((node) => {
            const borderClass =
              node.accent === 'primary'
                ? 'border-dark-primary/50'
                : 'border-dark-outline-variant/50';
            const stepColor =
              node.accent === 'tertiary'
                ? 'text-dark-tertiary'
                : node.accent === 'primary'
                  ? 'text-dark-primary'
                  : 'text-dark-on-surface-variant';
            const iconColor =
              node.accent === 'tertiary'
                ? 'text-dark-tertiary'
                : node.accent === 'primary'
                  ? 'text-dark-primary'
                  : 'text-dark-on-surface';

            return (
              <article
                key={node.stepLabel}
                className={`h-full p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border ${borderClass} flex flex-col gap-gutter-sm`}
              >
                <div className="flex items-center justify-between">
                  <span
                    data-design-text-token="label-sm"
                    className={`font-label text-label-sm uppercase tracking-wider ${stepColor}`}
                  >
                    {node.stepLabel}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${iconColor}`} aria-hidden="true">
                    {node.icon}
                  </span>
                </div>
                <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                  {node.title}
                </h2>
                <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                  {node.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Live Execution Trace Console */}
        <article className="p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm">
          <header className="flex flex-wrap items-center justify-between gap-gutter-sm border-b border-dark-outline-variant/40 pb-gutter-sm">
            <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
              Execution Log (stdout)
            </span>
            <span
              data-design-text-token="mono-md"
              className="font-mono text-mono-md text-dark-tertiary tabular-nums"
            >
              {activeWorkflow.latency}
            </span>
          </header>
          <div aria-live="polite" className="font-mono text-mono-md text-dark-on-surface-variant space-y-gutter-xs">
            {combinedLogs.map((log, index) => (
              <p key={`${log.timestamp}-${index}`}>
                <span className={log.colorClass}>{log.timestamp}</span> {log.message}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
