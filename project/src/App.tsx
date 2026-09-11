import { useState, useCallback, useEffect } from 'react';
import type { ScreenName, PlayerProfile, LevelDefinition, ToastMessage } from '@/game/types';
import { LEVELS, ACHIEVEMENTS } from '@/game/gameData';
import {
  loadProfile, saveProfile, getDefaultProfile, getDefaultStats,
  loadLeaderboard, saveLeaderboard, loadSoundPref, saveSoundPref,
} from '@/game/storage';
import { setSoundEnabled, playClick, playAchievement } from '@/game/sound';
import Header from '@/components/Header';
import Home from '@/components/Home';
import HowItWorks from '@/components/HowItWorks';
import About from '@/components/About';
import Leaderboard from '@/components/Leaderboard';
import Achievements from '@/components/Achievements';
import Analytics from '@/components/Analytics';
import LevelSelect from '@/components/LevelSelect';
import GameScreen from '@/components/GameScreen';
import FinalResult from '@/components/FinalResult';
import ProfileSetup from '@/components/ProfileSetup';
import ToastContainer from '@/components/Toast';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [activeLevel, setActiveLevel] = useState<LevelDefinition | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard());

  // Load profile and settings on mount
  useEffect(() => {
    const loaded = loadProfile();
    if (loaded) {
      setProfile(loaded);
    }
    const sound = loadSoundPref();
    setSoundEnabled(sound);
    setSoundEnabled(sound);
  }, []);

  // Toast management
  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Navigate
  const navigate = useCallback((s: ScreenName) => {
    playClick();
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    const newVal = !soundEnabled;
    setSoundEnabledState(newVal);
    setSoundEnabled(newVal);
    saveSoundPref(newVal);
    if (newVal) playClick();
  }, [soundEnabled]);

  // Profile setup complete
  const handleProfileComplete = useCallback((name: string, nickname: string) => {
    const newProfile: PlayerProfile = {
      ...getDefaultProfile(),
      name,
      nickname,
    };
    setProfile(newProfile);
    saveProfile(newProfile);
    setShowProfileSetup(false);
    setScreen('levelselect');
  }, []);

  // Start playing a level
  const handlePlay = useCallback((level: LevelDefinition) => {
    if (!profile) {
      setShowProfileSetup(true);
      return;
    }
    setActiveLevel(level);
    setScreen('game');
  }, [profile]);

  // Level complete handler
  const handleLevelComplete = useCallback((levelId: number, score: number, didPass: boolean) => {
    if (!profile) return;

    const level = LEVELS.find((l) => l.id === levelId);
    if (!level) return;

    setProfile((prev) => {
      if (!prev) return prev;
      const updated: PlayerProfile = { ...prev, stats: { ...prev.stats } };

      // Update stats
      updated.stats.totalExpressions += 1;
      updated.stats.totalAttempts += 1;
      updated.stats.attemptsPerLevel = {
        ...updated.stats.attemptsPerLevel,
        [levelId]: (updated.stats.attemptsPerLevel[levelId] ?? 0) + 1,
      };
      updated.stats.expressionCounts = {
        ...updated.stats.expressionCounts,
        [level.name]: (updated.stats.expressionCounts[level.name] ?? 0) + 1,
      };
      updated.stats.bestScores = {
        ...updated.stats.bestScores,
        [levelId]: Math.max(updated.stats.bestScores[levelId] ?? 0, score),
      };
      updated.stats.highestScore = Math.max(updated.stats.highestScore, score);

      // Estimate time spent (~10s per attempt)
      updated.stats.totalTimeMs += 10000;

      if (didPass) {
        updated.stats.consecutiveFails = 0;
        updated.stats.failCounts = {
          ...updated.stats.failCounts,
          [levelId]: updated.stats.failCounts[levelId] ?? 0,
        };

        // Award points
        updated.dramaScore += level.points;

        // Unlock next level
        if (!updated.unlockedLevels.includes(levelId + 1) && levelId < LEVELS.length) {
          updated.unlockedLevels = [...updated.unlockedLevels, levelId + 1];
        }

        // Update highest level
        if (levelId + 1 > updated.highestLevel) {
          updated.highestLevel = levelId + 1;
        }

        // Count completed levels
        const completedCount = LEVELS.filter(
          (l) => (updated.stats.bestScores[l.id] ?? 0) >= l.requiredScore,
        ).length;
        updated.stats.levelsCompleted = completedCount;
        updated.stats.allLevelsComplete = completedCount === LEVELS.length;

        // Update leaderboard
        setLeaderboard((prevBoard) => {
          const playerEntry = prevBoard.find((e) => e.isPlayer);
          let newBoard: typeof prevBoard;
          if (playerEntry) {
            newBoard = prevBoard.map((e) =>
              e.isPlayer ? { ...e, score: updated.dramaScore } : e,
            );
          } else {
            newBoard = [...prevBoard, { name: updated.nickname || updated.name, score: updated.dramaScore, isPlayer: true }];
          }
          saveLeaderboard(newBoard);
          return newBoard;
        });
      } else {
        updated.stats.totalFails += 1;
        updated.stats.consecutiveFails += 1;
        updated.stats.failCounts = {
          ...updated.stats.failCounts,
          [levelId]: (updated.stats.failCounts[levelId] ?? 0) + 1,
        };
      }

      // Update best expression
      updated.bestExpression = Math.max(updated.bestExpression, score);

      // Check for new achievements
      const newAchievements = ACHIEVEMENTS.filter(
        (a) =>
          !updated.unlockedAchievements.includes(a.id) && a.check(updated.stats),
      );
      if (newAchievements.length > 0) {
        updated.unlockedAchievements = [
          ...updated.unlockedAchievements,
          ...newAchievements.map((a) => a.id),
        ];
        // Show toast for each new achievement (delayed slightly)
        newAchievements.forEach((ach, i) => {
          setTimeout(() => {
            addToast(`Achievement Unlocked: ${ach.name}`, 'achievement');
            playAchievement();
          }, 500 + i * 1200);
        });
      }

      saveProfile(updated);
      return updated;
    });
  }, [profile, addToast]);

  // Next level
  const handleNextLevel = useCallback((next: LevelDefinition) => {
    setActiveLevel(next);
    setScreen('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset game
  const handleReset = useCallback(() => {
    const fresh = getDefaultProfile();
    setProfile(fresh);
    saveProfile(fresh);
    const freshBoard = loadLeaderboard().filter((e) => !e.isPlayer);
    saveLeaderboard(freshBoard);
    setLeaderboard(freshBoard);
    addToast('Progress reset. A fresh start for your drama career.', 'info');
    setScreen('home');
  }, [addToast]);

  // Determine next level
  const nextLevel = activeLevel
    ? LEVELS.find((l) => l.id === activeLevel.id + 1) ?? null
    : null;

  return (
    <div className="min-h-screen noise-bg">
      <Header
        current={screen}
        onNavigate={navigate}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="relative z-10">
        {screen === 'home' && <Home onNavigate={navigate} profile={profile} />}
        {screen === 'howitworks' && <HowItWorks />}
        {screen === 'about' && <About />}
        {screen === 'leaderboard' && <Leaderboard entries={leaderboard} />}
        {screen === 'achievements' && profile && (
          <Achievements stats={profile.stats} unlocked={profile.unlockedAchievements} />
        )}
        {screen === 'analytics' && profile && <Analytics stats={profile.stats} />}
        {screen === 'finalresult' && profile && (
          <FinalResult profile={profile} onNavigate={navigate} onReset={handleReset} />
        )}

        {screen === 'levelselect' && profile && (
          <LevelSelect profile={profile} onPlay={handlePlay} onNavigate={navigate} />
        )}
        {screen === 'levelselect' && !profile && (
          <div className="max-w-md mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Profile Yet</h2>
            <p className="text-gray-400 mb-6">Create a player profile to start your drama journey.</p>
            <button onClick={() => setShowProfileSetup(true)} className="btn-primary">
              Create Profile
            </button>
          </div>
        )}

        {screen === 'game' && activeLevel && profile && (
          <GameScreen
            key={activeLevel.id}
            level={activeLevel}
            profile={profile}
            onLevelComplete={handleLevelComplete}
            onNavigate={navigate}
            onNextLevel={handleNextLevel}
            nextLevel={nextLevel}
            demoMode={demoMode}
            onToggleDemo={() => setDemoMode(true)}
          />
        )}
      </main>

      {showProfileSetup && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}

      <ToastContainer toasts={toasts} />

      {/* Footer */}
      <footer className="border-t border-green-500/10 py-8 text-center relative z-10">
        <p className="text-gray-600 text-xs">
          BHAASI — The Expression Challenge · 100% Useless, 100% Technically Impressive
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Camera processing is local. No data is uploaded. No practical purpose is served.
        </p>
      </footer>
    </div>
  );
}
