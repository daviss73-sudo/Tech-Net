import { useState, useCallback } from 'react';
import { GameState, PlayerProgress, GamePhase } from '../types/game';
import { levels } from '../data/levels';

const STORAGE_KEY = 'technet-progress';

function loadProgress(): PlayerProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return {
    currentLevel: 1,
    completedLevels: [],
    totalCorrect: 0,
    totalAttempts: 0,
    levelScores: {},
    badgeEarned: false,
  };
}

function saveProgress(progress: PlayerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage errors
  }
}

export function useGameState() {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    currentLevel: 1,
    currentPacketIndex: 0,
    selectedPath: [],
    deliveredPackets: 0,
    levelCorrect: 0,
    levelTotal: 0,
    showFeedback: false,
    feedbackCorrect: false,
  });

  const startLevel = useCallback((levelId: number) => {
    setGameState({
      phase: 'playing',
      currentLevel: levelId,
      currentPacketIndex: 0,
      selectedPath: [],
      deliveredPackets: 0,
      levelCorrect: 0,
      levelTotal: 0,
      showFeedback: false,
      feedbackCorrect: false,
    });
  }, []);

  // Add a node to the path (click navigation)
  const addNodeToPath = useCallback((nodeId: string) => {
    setGameState(prev => {
      const path = prev.selectedPath;
      // If clicking a node already in path, trim back to that node
      const existingIndex = path.indexOf(nodeId);
      if (existingIndex >= 0) {
        return { ...prev, selectedPath: path.slice(0, existingIndex + 1) };
      }
      return { ...prev, selectedPath: [...path, nodeId] };
    });
  }, []);

  // Clear the current path
  const clearPath = useCallback(() => {
    setGameState(prev => ({ ...prev, selectedPath: [] }));
  }, []);

  // Submit: check if path ends at correct server's node
  const submitPacket = useCallback(() => {
    setGameState(prev => {
      const level = levels.find(l => l.id === prev.currentLevel);
      if (!level) return prev;

      const currentPacket = level.packets[prev.currentPacketIndex];
      const lastNodeInPath = prev.selectedPath[prev.selectedPath.length - 1];
      // Find which server this node belongs to
      const destinationServer = level.servers.find(s => s.nodeId === lastNodeInPath);
      const isCorrect = destinationServer?.id === currentPacket.correctServerId;

      return {
        ...prev,
        showFeedback: true,
        feedbackCorrect: isCorrect,
        levelCorrect: prev.levelCorrect + (isCorrect ? 1 : 0),
        levelTotal: prev.levelTotal + 1,
        deliveredPackets: prev.deliveredPackets + (isCorrect ? 1 : 0),
      };
    });
  }, []);

  const nextPacket = useCallback(() => {
    setGameState(prev => {
      const level = levels.find(l => l.id === prev.currentLevel);
      if (!level) return prev;

      const nextIndex = prev.currentPacketIndex + 1;
      if (nextIndex >= level.packets.length) {
        // Level complete
        const newProgress: PlayerProgress = {
          ...progress,
          totalCorrect: progress.totalCorrect + prev.levelCorrect,
          totalAttempts: progress.totalAttempts + level.packets.length,
          completedLevels: [...new Set([...progress.completedLevels, prev.currentLevel])],
          levelScores: {
            ...progress.levelScores,
            [prev.currentLevel]: { correct: prev.levelCorrect, total: level.packets.length },
          },
          currentLevel: Math.min(prev.currentLevel + 1, levels.length),
          badgeEarned: false,
        };
        // Check badge: all levels complete + 70%+ accuracy
        const allComplete = newProgress.completedLevels.length >= levels.length;
        const totalC = Object.values(newProgress.levelScores).reduce((sum, s) => sum + s.correct, 0);
        const totalT = Object.values(newProgress.levelScores).reduce((sum, s) => sum + s.total, 0);
        if (allComplete && totalT > 0 && (totalC / totalT) >= 0.7) {
          newProgress.badgeEarned = true;
        }
        newProgress.totalCorrect = totalC;
        newProgress.totalAttempts = totalT;
        setProgress(newProgress);
        saveProgress(newProgress);

        return {
          ...prev,
          phase: prev.currentLevel >= levels.length ? 'gameComplete' : 'levelComplete',
          showFeedback: false,
          selectedPath: [],
        };
      }

      return {
        ...prev,
        currentPacketIndex: nextIndex,
        selectedPath: [],
        showFeedback: false,
        feedbackCorrect: false,
      };
    });
  }, [progress]);

  const goToMenu = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'menu' as GamePhase, selectedPath: [] }));
  }, []);

  const goToDashboard = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'dashboard' as GamePhase }));
  }, []);

  const restartLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPacketIndex: 0,
      selectedPath: [],
      deliveredPackets: 0,
      levelCorrect: 0,
      levelTotal: 0,
      showFeedback: false,
      feedbackCorrect: false,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: PlayerProgress = {
      currentLevel: 1,
      completedLevels: [],
      totalCorrect: 0,
      totalAttempts: 0,
      levelScores: {},
      badgeEarned: false,
    };
    setProgress(fresh);
    saveProgress(fresh);
    setGameState({
      phase: 'menu',
      currentLevel: 1,
      currentPacketIndex: 0,
      selectedPath: [],
      deliveredPackets: 0,
      levelCorrect: 0,
      levelTotal: 0,
      showFeedback: false,
      feedbackCorrect: false,
    });
  }, []);

  return {
    gameState,
    progress,
    startLevel,
    addNodeToPath,
    clearPath,
    submitPacket,
    nextPacket,
    goToMenu,
    goToDashboard,
    restartLevel,
    resetProgress,
  };
}
