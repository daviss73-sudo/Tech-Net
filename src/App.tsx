import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { FeedbackModal } from './components/FeedbackModal';
import { LevelComplete } from './components/LevelComplete';
import { Dashboard } from './components/Dashboard';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { HelpModal } from './components/HelpModal';
import { useGameState } from './hooks/useGameState';
import { useAccessibility } from './hooks/useAccessibility';
import { levels, feedbackDatabase } from './data/levels';

export default function App() {
  const {
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
  } = useGameState();

  const {
    settings,
    toggleHighContrast,
    toggleReducedMotion,
    setTextScale,
    toggleScreenReader,
  } = useAccessibility();

  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const currentLevel = levels.find(l => l.id === gameState.currentLevel);

  // Handle keyboard escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showA11yPanel) setShowA11yPanel(false);
        else if (showHelp) setShowHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showA11yPanel, showHelp]);

  const handleNextLevel = useCallback(() => {
    const nextLevelId = gameState.currentLevel + 1;
    if (nextLevelId <= levels.length) {
      startLevel(nextLevelId);
    } else {
      goToMenu();
    }
  }, [gameState.currentLevel, startLevel, goToMenu]);

  const getFeedback = () => {
    if (!currentLevel) return null;
    const packet = currentLevel.packets[gameState.currentPacketIndex];
    return feedbackDatabase[packet.correctServerId] || null;
  };

  const getCorrectServerName = () => {
    if (!currentLevel) return '';
    const packet = currentLevel.packets[gameState.currentPacketIndex];
    const server = currentLevel.servers.find(s => s.id === packet.correctServerId);
    return server?.name || '';
  };

  return (
    <div className="app" style={{ fontSize: `${settings.textScale}rem` }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header
        levelTitle={gameState.phase === 'playing' && currentLevel ? currentLevel.title : undefined}
        levelSubtitle={gameState.phase === 'playing' && currentLevel ? currentLevel.subtitle : undefined}
        showMenu={gameState.phase !== 'menu'}
        onMenuClick={goToMenu}
        onHelpClick={() => setShowHelp(true)}
        onAccessibilityClick={() => setShowA11yPanel(true)}
        settings={settings}
      />

      <div id="main-content">
        {gameState.phase === 'menu' && (
          <MainMenu
            progress={progress}
            onStartLevel={startLevel}
            onDashboard={goToDashboard}
            onReset={resetProgress}
          />
        )}

        {gameState.phase === 'playing' && currentLevel && (
          <GameBoard
            level={currentLevel}
            currentPacketIndex={gameState.currentPacketIndex}
            selectedPath={gameState.selectedPath}
            deliveredPackets={gameState.deliveredPackets}
            onNodeClick={addNodeToPath}
            onClearPath={clearPath}
            onSubmit={submitPacket}
            onRestart={restartLevel}
          />
        )}

        {gameState.phase === 'dashboard' && (
          <Dashboard progress={progress} onBack={goToMenu} />
        )}

        {gameState.showFeedback && currentLevel && (
          <FeedbackModal
            isCorrect={gameState.feedbackCorrect}
            feedback={getFeedback()}
            packetClue={currentLevel.packets[gameState.currentPacketIndex].clue}
            correctServerName={getCorrectServerName()}
            onContinue={nextPacket}
          />
        )}

        {(gameState.phase === 'levelComplete' || gameState.phase === 'gameComplete') && currentLevel && (
          <LevelComplete
            levelTitle={currentLevel.title}
            correct={gameState.levelCorrect}
            total={currentLevel.packets.length}
            onNextLevel={handleNextLevel}
            onMenu={goToMenu}
            isLastLevel={gameState.phase === 'gameComplete'}
            badgeEarned={progress.badgeEarned}
          />
        )}
      </div>

      {showA11yPanel && (
        <AccessibilityPanel
          settings={settings}
          onToggleHighContrast={toggleHighContrast}
          onToggleReducedMotion={toggleReducedMotion}
          onSetTextScale={setTextScale}
          onToggleScreenReader={toggleScreenReader}
          onClose={() => setShowA11yPanel(false)}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
