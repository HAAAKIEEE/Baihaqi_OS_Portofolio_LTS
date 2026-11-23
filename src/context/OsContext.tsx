'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppId } from '@/data/profile';

export type WindowAppId = Exclude<AppId, 'home'>;

export interface OsSettings {
  glassmorphism: boolean;
  showDesktopStats: boolean;
}

export interface OsWindowInstance {
  id: WindowAppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

const DEFAULT_POSITIONS: Record<WindowAppId, { x: number; y: number }> = {
  terminal: { x: -42, y: -18 },
  projects: { x: 34, y: 16 },
  'ai-lab': { x: -24, y: 24 },
  about: { x: 42, y: -14 },
  skills: { x: 14, y: 28 },
  github: { x: -34, y: 18 },
  contact: { x: 26, y: -22 },
  settings: { x: 0, y: 0 },
  'ai-search': { x: -12, y: -8 },
};

function createInitialWindows(): Record<WindowAppId, OsWindowInstance> {
  return {
    terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.terminal } },
    projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.projects } },
    'ai-lab': { id: 'ai-lab', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS['ai-lab'] } },
    about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.about } },
    skills: { id: 'skills', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.skills } },
    github: { id: 'github', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.github } },
    contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.contact } },
    settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS.settings } },
    'ai-search': { id: 'ai-search', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: { ...DEFAULT_POSITIONS['ai-search'] } },
  };
}

function getMaxZIndex(windows: Record<WindowAppId, OsWindowInstance>): number {
  let max = 10;
  for (const win of Object.values(windows)) {
    if (win.isOpen && win.zIndex > max) {
      max = win.zIndex;
    }
  }
  return max;
}

interface OsContextValue {
  windows: Record<WindowAppId, OsWindowInstance>;
  openWindows: OsWindowInstance[];
  visibleWindows: OsWindowInstance[];
  activeApp: AppId;
  isLocked: boolean;
  isLauncherOpen: boolean;
  aiSearchQuery: string;
  selectedCaseStudyId: string;
  settings: OsSettings;
  openApp: (app: AppId) => void;
  toggleApp: (app: WindowAppId) => void;
  closeApp: () => void;
  closeWindow: (app: WindowAppId) => void;
  closeAllWindows: () => void;
  minimizeWindow: (app: WindowAppId) => void;
  toggleMaximizeWindow: (app: WindowAppId) => void;
  focusWindow: (app: WindowAppId) => void;
  updateWindowPosition: (app: WindowAppId, position: { x: number; y: number }) => void;
  showDesktop: () => void;
  lockSession: () => void;
  unlockSession: () => void;
  openLauncher: () => void;
  closeLauncher: () => void;
  toggleLauncher: () => void;
  askAi: (query: string) => void;
  openCaseStudy: (projectId: string) => void;
  setSelectedCaseStudyId: (projectId: string) => void;
  updateSettings: (partial: Partial<OsSettings>) => void;
}

const OsContext = createContext<OsContextValue | null>(null);

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Record<WindowAppId, OsWindowInstance>>(createInitialWindows);
  const [isLocked, setIsLocked] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState(
    'Apa saja proyek otomasi AI yang pernah dibangun Baihaqi?'
  );
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState('autoflow');
  const [settings, setSettings] = useState<OsSettings>({
    glassmorphism: true,
    showDesktopStats: true,
  });

  const openWindows = useMemo(
    () =>
      Object.values(windows)
        .filter((w) => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  );

  const visibleWindows = useMemo(
    () => openWindows.filter((w) => !w.isMinimized),
    [openWindows]
  );

  const activeApp: AppId = useMemo(() => {
    if (visibleWindows.length === 0) return 'home';
    return visibleWindows[visibleWindows.length - 1].id;
  }, [visibleWindows]);

  const showDesktop = useCallback(() => {
    setWindows((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next) as WindowAppId[]) {
        if (next[key].isOpen) {
          next[key] = { ...next[key], isMinimized: true };
        }
      }
      return next;
    });
  }, []);

  const openApp = useCallback(
    (app: AppId) => {
      setIsLauncherOpen(false);
      if (app === 'home') {
        showDesktop();
        return;
      }
      setWindows((prev) => {
        const nextZ = getMaxZIndex(prev) + 1;
        return {
          ...prev,
          [app]: {
            ...prev[app],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        };
      });
    },
    [showDesktop]
  );

  const toggleApp = useCallback((app: WindowAppId) => {
    setIsLauncherOpen(false);
    setWindows((prev) => {
      const target = prev[app];
      const visible = Object.values(prev).filter((w) => w.isOpen && !w.isMinimized);
      const topVisible = visible.sort((a, b) => a.zIndex - b.zIndex)[visible.length - 1];
      const nextZ = getMaxZIndex(prev) + 1;

      if (!target.isOpen || target.isMinimized) {
        return {
          ...prev,
          [app]: { ...target, isOpen: true, isMinimized: false, zIndex: nextZ },
        };
      }

      if (topVisible && topVisible.id !== app) {
        return {
          ...prev,
          [app]: { ...target, zIndex: nextZ },
        };
      }

      return {
        ...prev,
        [app]: { ...target, isMinimized: true },
      };
    });
  }, []);

  const closeWindow = useCallback((app: WindowAppId) => {
    setWindows((prev) => ({
      ...prev,
      [app]: {
        ...prev[app],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: { ...DEFAULT_POSITIONS[app] },
      },
    }));
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows(createInitialWindows());
  }, []);

  const closeApp = useCallback(() => {
    if (activeApp !== 'home') {
      closeWindow(activeApp);
    }
  }, [activeApp, closeWindow]);

  const minimizeWindow = useCallback((app: WindowAppId) => {
    setWindows((prev) => ({
      ...prev,
      [app]: {
        ...prev[app],
        isMinimized: true,
      },
    }));
  }, []);

  const toggleMaximizeWindow = useCallback((app: WindowAppId) => {
    setWindows((prev) => {
      const target = prev[app];
      const nextZ = getMaxZIndex(prev) + 1;
      return {
        ...prev,
        [app]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          isMaximized: !target.isMaximized,
          zIndex: nextZ,
        },
      };
    });
  }, []);

  const focusWindow = useCallback((app: WindowAppId) => {
    setWindows((prev) => {
      const target = prev[app];
      if (!target.isOpen) return prev;
      const maxZ = getMaxZIndex(prev);
      if (target.zIndex === maxZ && !target.isMinimized) {
        return prev;
      }
      return {
        ...prev,
        [app]: {
          ...target,
          isMinimized: false,
          zIndex: maxZ + 1,
        },
      };
    });
  }, []);

  const updateWindowPosition = useCallback(
    (app: WindowAppId, position: { x: number; y: number }) => {
      setWindows((prev) => ({
        ...prev,
        [app]: {
          ...prev[app],
          position,
        },
      }));
    },
    []
  );

  const lockSession = useCallback(() => {
    setIsLauncherOpen(false);
    setIsLocked(true);
  }, []);

  const unlockSession = useCallback(() => {
    setIsLocked(false);
  }, []);

  const openLauncher = useCallback(() => {
    if (!isLocked) setIsLauncherOpen(true);
  }, [isLocked]);

  const closeLauncher = useCallback(() => {
    setIsLauncherOpen(false);
  }, []);

  const toggleLauncher = useCallback(() => {
    if (!isLocked) setIsLauncherOpen((prev) => !prev);
  }, [isLocked]);

  const askAi = useCallback(
    (query: string) => {
      const clean = query.trim();
      if (clean) setAiSearchQuery(clean);
      openApp('ai-search');
    },
    [openApp]
  );

  const openCaseStudy = useCallback(
    (projectId: string) => {
      setSelectedCaseStudyId(projectId);
      openApp('projects');
    },
    [openApp]
  );

  const updateSettings = useCallback((partial: Partial<OsSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLocked) return;

      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        setIsLauncherOpen((prev) => !prev);
        return;
      }

      if (key === 'escape') {
        if (isLauncherOpen) {
          event.preventDefault();
          setIsLauncherOpen(false);
          return;
        }
        const target = event.target as HTMLElement | null;
        const isTyping =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);
        if (!isTyping && activeApp !== 'home') {
          closeWindow(activeApp);
        }
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        if (key === 't') {
          event.preventDefault();
          openApp('terminal');
        } else if (key === 'p') {
          event.preventDefault();
          openApp('projects');
        } else if (key === 'a') {
          event.preventDefault();
          openApp('ai-lab');
        } else if (key === 'l') {
          event.preventDefault();
          lockSession();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp, closeWindow, isLauncherOpen, isLocked, lockSession, openApp]);

  return (
    <OsContext.Provider
      value={{
        windows,
        openWindows,
        visibleWindows,
        activeApp,
        isLocked,
        isLauncherOpen,
        aiSearchQuery,
        selectedCaseStudyId,
        settings,
        openApp,
        toggleApp,
        closeApp,
        closeWindow,
        closeAllWindows,
        minimizeWindow,
        toggleMaximizeWindow,
        focusWindow,
        updateWindowPosition,
        showDesktop,
        lockSession,
        unlockSession,
        openLauncher,
        closeLauncher,
        toggleLauncher,
        askAi,
        openCaseStudy,
        setSelectedCaseStudyId,
        updateSettings,
      }}
    >
      {children}
    </OsContext.Provider>
  );
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) {
    throw new Error('useOs must be used within an OsProvider');
  }
  return ctx;
}
