'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { PROJECTS, type ProjectCaseStudy } from '@/data/projects';
import { CORE_COMPETENCIES, EDUCATION_INFO, EXPERIENCES, type ExperienceItem } from '@/data/experience';
import { SKILL_METRICS, SKILL_PILLARS, type SkillMetric, type SkillPillar } from '@/data/skills';
import { WORKFLOW_LIST, type AiWorkflow } from '@/data/workflows';

const STORAGE_KEY = 'baihaqi_os_cms_data_v1';

export type EditableProfile = typeof PROFILE_INFO;
export type EditableEducation = typeof EDUCATION_INFO;
export type EditableWorkflow = Omit<AiWorkflow, 'id'> & { id: string };

export interface PortfolioDataState {
  profile: EditableProfile;
  projects: ProjectCaseStudy[];
  hiddenGitHubIds: number[];
  experiences: ExperienceItem[];
  education: EditableEducation;
  competencies: string[];
  skillPillars: SkillPillar[];
  skills: SkillMetric[];
  workflows: EditableWorkflow[];
}

function getDefaultState(): PortfolioDataState {
  return {
    profile: { ...PROFILE_INFO },
    projects: [...PROJECTS],
    hiddenGitHubIds: [],
    experiences: EXPERIENCES.map((e) => ({ ...e, highlights: [...e.highlights] })),
    education: { ...EDUCATION_INFO },
    competencies: [...CORE_COMPETENCIES],
    skillPillars: SKILL_PILLARS.map((p) => ({ ...p, terminalTags: [...p.terminalTags] })),
    skills: SKILL_METRICS.map((s) => ({ ...s })),
    workflows: WORKFLOW_LIST.map((w) => ({ ...w, nodes: [...w.nodes], logs: [...w.logs] })),
  };
}

export type CloudSyncStatus = 'idle' | 'saving' | 'synced' | 'local-only' | 'error';

interface PortfolioDataContextValue {
  data: PortfolioDataState;
  cloudSyncStatus: CloudSyncStatus;
  setAdminPassword: (password: string | null) => void;
  updateProfile: (partial: Partial<EditableProfile>) => void;
  updateEducation: (partial: Partial<EditableEducation>) => void;
  setCompetencies: (items: string[]) => void;
  addProject: (item: Omit<ProjectCaseStudy, 'id'>) => void;
  updateProject: (id: string, partial: Partial<ProjectCaseStudy>) => void;
  deleteProject: (id: string) => void;
  toggleHideGitHubRepo: (repoId: number) => void;
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, partial: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  addSkill: (item: SkillMetric) => void;
  updateSkill: (index: number, partial: Partial<SkillMetric>) => void;
  deleteSkill: (index: number) => void;
  addWorkflow: (item: EditableWorkflow) => void;
  updateWorkflow: (id: string, partial: Partial<EditableWorkflow>) => void;
  deleteWorkflow: (id: string) => void;
  resetAllData: () => void;
}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioDataState>(getDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('idle');

  useEffect(() => {
    const defaults = getDefaultState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PortfolioDataState>;
        setData({
          profile: { ...defaults.profile, ...(parsed.profile ?? {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : defaults.projects,
          hiddenGitHubIds: Array.isArray(parsed.hiddenGitHubIds) ? parsed.hiddenGitHubIds : [],
          experiences: Array.isArray(parsed.experiences) ? parsed.experiences : defaults.experiences,
          education: { ...defaults.education, ...(parsed.education ?? {}) },
          competencies: Array.isArray(parsed.competencies) ? parsed.competencies : defaults.competencies,
          skillPillars: Array.isArray(parsed.skillPillars) ? parsed.skillPillars : defaults.skillPillars,
          skills: Array.isArray(parsed.skills) ? parsed.skills : defaults.skills,
          workflows: Array.isArray(parsed.workflows) ? parsed.workflows : defaults.workflows,
        });
      }
    } catch {
      // Ignore corrupt localStorage and keep defaults
    }

    fetch('/api/portfolio')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: { storage?: string; data?: Partial<PortfolioDataState> | null } | null) => {
        if (!payload) {
          setCloudSyncStatus('local-only');
          return;
        }
        if (payload.storage === 'cloudflare-kv') {
          setCloudSyncStatus('synced');
        } else {
          setCloudSyncStatus('local-only');
        }
        if (payload.data) {
          const remote = payload.data;
          setData({
            profile: { ...defaults.profile, ...(remote.profile ?? {}) },
            projects: Array.isArray(remote.projects) ? remote.projects : defaults.projects,
            hiddenGitHubIds: Array.isArray(remote.hiddenGitHubIds) ? remote.hiddenGitHubIds : [],
            experiences: Array.isArray(remote.experiences) ? remote.experiences : defaults.experiences,
            education: { ...defaults.education, ...(remote.education ?? {}) },
            competencies: Array.isArray(remote.competencies) ? remote.competencies : defaults.competencies,
            skillPillars: Array.isArray(remote.skillPillars) ? remote.skillPillars : defaults.skillPillars,
            skills: Array.isArray(remote.skills) ? remote.skills : defaults.skills,
            workflows: Array.isArray(remote.workflows) ? remote.workflows : defaults.workflows,
          });
        }
      })
      .catch(() => {
        setCloudSyncStatus('local-only');
      })
      .finally(() => {
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }

    if (!adminPassword) return;
    setCloudSyncStatus('saving');
    fetch('/api/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          setCloudSyncStatus('synced');
        } else if (res.status === 503 || res.status === 404) {
          setCloudSyncStatus('local-only');
        } else {
          setCloudSyncStatus('error');
        }
      })
      .catch(() => {
        setCloudSyncStatus('local-only');
      });
  }, [data, hydrated, adminPassword]);

  const updateProfile = useCallback((partial: Partial<EditableProfile>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }));
  }, []);

  const updateEducation = useCallback((partial: Partial<EditableEducation>) => {
    setData((prev) => ({ ...prev, education: { ...prev.education, ...partial } }));
  }, []);

  const setCompetencies = useCallback((items: string[]) => {
    setData((prev) => ({ ...prev, competencies: items }));
  }, []);

  const addProject = useCallback((item: Omit<ProjectCaseStudy, 'id'>) => {
    const id = `manual-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      projects: [{ ...item, id }, ...prev.projects],
    }));
  }, []);

  const updateProject = useCallback((id: string, partial: Partial<ProjectCaseStudy>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  const toggleHideGitHubRepo = useCallback((repoId: number) => {
    setData((prev) => {
      const exists = prev.hiddenGitHubIds.includes(repoId);
      return {
        ...prev,
        hiddenGitHubIds: exists
          ? prev.hiddenGitHubIds.filter((id) => id !== repoId)
          : [...prev.hiddenGitHubIds, repoId],
      };
    });
  }, []);

  const addExperience = useCallback((item: Omit<ExperienceItem, 'id'>) => {
    const id = `exp-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      experiences: [{ ...item, id }, ...prev.experiences],
    }));
  }, []);

  const updateExperience = useCallback((id: string, partial: Partial<ExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  const addSkill = useCallback((item: SkillMetric) => {
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, item],
    }));
  }, []);

  const updateSkill = useCallback((index: number, partial: Partial<SkillMetric>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s, idx) => (idx === index ? { ...s, ...partial } : s)),
    }));
  }, []);

  const deleteSkill = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  }, []);

  const addWorkflow = useCallback((item: EditableWorkflow) => {
    setData((prev) => ({
      ...prev,
      workflows: [...prev.workflows, item],
    }));
  }, []);

  const updateWorkflow = useCallback((id: string, partial: Partial<EditableWorkflow>) => {
    setData((prev) => ({
      ...prev,
      workflows: prev.workflows.map((w) => (w.id === id ? { ...w, ...partial } : w)),
    }));
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      workflows: prev.workflows.filter((w) => w.id !== id),
    }));
  }, []);

  const resetAllData = useCallback(() => {
    const defaults = getDefaultState();
    setData(defaults);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        cloudSyncStatus,
        setAdminPassword,
        updateProfile,
        updateEducation,
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
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return ctx;
}
