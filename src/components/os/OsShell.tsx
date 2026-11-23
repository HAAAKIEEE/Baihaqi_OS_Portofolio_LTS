'use client';

import React from 'react';
import { OsProvider, useOs, type WindowAppId } from '@/context/OsContext';
import { PortfolioDataProvider } from '@/context/PortfolioDataContext';
import { CosmicWallpaper } from '@/components/os/CosmicWallpaper';
import { TopBar } from '@/components/os/TopBar';
import { BottomBar } from '@/components/os/BottomBar';
import { LockScreen } from '@/components/os/LockScreen';
import { CommandLauncher } from '@/components/os/CommandLauncher';
import { OsWindowFrame } from '@/components/os/OsWindowFrame';
import { HomeSearchBar } from '@/components/apps/HomeSearchBar';
import { AiSearchApp } from '@/components/apps/AiSearchApp';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { FileManagerApp } from '@/components/apps/FileManagerApp';
import { AiLabApp } from '@/components/apps/AiLabApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { SkillsApp } from '@/components/apps/SkillsApp';
import { GitHubApp } from '@/components/apps/GitHubApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { AdminPanelApp } from '@/components/apps/AdminPanelApp';

function renderWindowApp(id: WindowAppId) {
  switch (id) {
    case 'terminal':
      return <TerminalApp />;
    case 'projects':
      return <FileManagerApp />;
    case 'ai-lab':
      return <AiLabApp />;
    case 'about':
      return <AboutApp />;
    case 'skills':
      return <SkillsApp />;
    case 'github':
      return <GitHubApp />;
    case 'contact':
      return <ContactApp />;
    case 'settings':
      return <SettingsApp />;
    case 'ai-search':
      return <AiSearchApp />;
    case 'admin':
      return <AdminPanelApp />;
  }
}

function OsWorkspace() {
  const { activeApp, visibleWindows, isLocked } = useOs();

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between p-gutter-lg md:p-page-margin bg-dark-surface-container-lowest">
      <CosmicWallpaper />

      {isLocked ? (
        <LockScreen />
      ) : (
        <>
          <header className="relative z-40 w-full flex flex-col items-center gap-gutter-md sm:gap-gutter-lg pt-gutter-xs shrink-0">
            <TopBar />
          </header>

          <main className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center gap-gutter-lg py-gutter-md sm:py-gutter-lg overflow-y-auto md:overflow-visible no-scrollbar">
            {visibleWindows.length === 0 && (
              <div className="w-full flex items-center justify-center">
                <HomeSearchBar />
              </div>
            )}

            {visibleWindows.map((win) => (
              <OsWindowFrame
                key={win.id}
                windowState={win}
                isFocused={activeApp === win.id}
              >
                {renderWindowApp(win.id)}
              </OsWindowFrame>
            ))}
          </main>

          <BottomBar />
          <CommandLauncher />
        </>
      )}
    </div>
  );
}

export function OsShell() {
  return (
    <PortfolioDataProvider>
      <OsProvider>
        <OsWorkspace />
      </OsProvider>
    </PortfolioDataProvider>
  );
}
