import type { PlayerProfile, PlayerStats, LeaderboardEntry } from './types';
import { SEED_LEADERBOARD } from './gameData';

const PROFILE_KEY = 'bhaasi_profile_v1';
const LEADERBOARD_KEY = 'bhaasi_leaderboard_v1';
const SOUND_KEY = 'bhaasi_sound_v1';

export function getDefaultStats(): PlayerStats {
  return {
    totalExpressions: 0,
    totalAttempts: 0,
    totalFails: 0,
    consecutiveFails: 0,
    attemptsPerLevel: {},
    bestScores: {},
    expressionCounts: {},
    failCounts: {},
    totalTimeMs: 0,
    highestScore: 0,
    levelsCompleted: 0,
    allLevelsComplete: false,
  };
}

export function getDefaultProfile(): PlayerProfile {
  return {
    name: '',
    nickname: '',
    dramaScore: 0,
    currentLevel: 1,
    highestLevel: 1,
    bestExpression: 0,
    unlockedLevels: [1],
    unlockedAchievements: [],
    stats: getDefaultStats(),
  };
}

export function loadProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerProfile;
    const defaults = getDefaultProfile();
    return {
      ...defaults,
      ...parsed,
      stats: { ...getDefaultStats(), ...parsed.stats },
    };
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage might be unavailable — silently ignore
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [...SEED_LEADERBOARD];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [...SEED_LEADERBOARD];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    // silently ignore
  }
}

export function loadSoundPref(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveSoundPref(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // silently ignore
  }
}
