"use client";

import { useCallback, useEffect, useState } from "react";

export type TaskPriority = "low" | "medium" | "high";

const XP_MAP: Record<TaskPriority, number> = {
  low: 10,
  medium: 25,
  high: 50,
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-task", title: "Premier Pas", description: "Completez votre premiere tache", icon: "🎯" },
  { id: "five-tasks", title: "En Route", description: "Completez 5 taches", icon: "🚀" },
  { id: "streak-3", title: "Regulier", description: "3 jours consecutifs", icon: "🔥" },
  { id: "xp-100", title: "Centurion", description: "Atteignez 100 XP", icon: "⭐" },
];

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  completedTasks: number;
  unlockedAchievements: string[];
}

const STORAGE_KEY = "echomaps-gamification";

function loadState(): GamificationState {
  if (typeof window === "undefined") {
    return { xp: 0, level: 1, streak: 0, lastActiveDate: null, completedTasks: 0, unlockedAchievements: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { xp: 0, level: 1, streak: 0, lastActiveDate: null, completedTasks: 0, unlockedAchievements: [] };
}

function saveState(state: GamificationState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadState);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]!;
    setState(prev => {
      if (prev.lastActiveDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0]!;

      const newStreak = prev.lastActiveDate === yesterdayStr ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  }, []);

  const completeTask = useCallback((priority: TaskPriority) => {
    updateStreak();

    setState(prev => {
      const xpGain = XP_MAP[priority];
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 100) + 1;
      const newCompleted = prev.completedTasks + 1;
      const newUnlocked = [...prev.unlockedAchievements];

      // Check achievements
      const checkAchievement = (id: string) => {
        if (!newUnlocked.includes(id)) {
          newUnlocked.push(id);
          const achievement = ACHIEVEMENTS.find(a => a.id === id);
          if (achievement) {
            setNewAchievement({ ...achievement, unlockedAt: Date.now() });
          }
        }
      };

      if (newCompleted >= 1) checkAchievement("first-task");
      if (newCompleted >= 5) checkAchievement("five-tasks");
      if (newXp >= 100) checkAchievement("xp-100");

      const today = new Date().toISOString().split("T")[0]!;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0]!;
      const currentStreak = prev.lastActiveDate === yesterdayStr ? prev.streak + 1 : (prev.lastActiveDate === today ? prev.streak : 1);
      if (currentStreak >= 3) checkAchievement("streak-3");

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedTasks: newCompleted,
        unlockedAchievements: newUnlocked,
      };
    });
  }, [updateStreak]);

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  return {
    ...state,
    achievements: ACHIEVEMENTS,
    newAchievement,
    completeTask,
    dismissAchievement,
  };
}
