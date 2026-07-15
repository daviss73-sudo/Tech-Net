import { PlayerProgress } from '../types/game';
import { levels } from '../data/levels';

interface MainMenuProps {
  progress: PlayerProgress;
  onStartLevel: (levelId: number) => void;
  onDashboard: () => void;
  onReset: () => void;
}

export function MainMenu({ progress, onStartLevel, onDashboard, onReset }: MainMenuProps) {
  const overallAccuracy = progress.totalAttempts > 0
    ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100)
    : 0;

  return (
    <div className="main-menu" role="main" aria-label="Tech Net main menu">
      <div className="menu-hero">
        <div className="menu-logo" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="8" fill="#1565C0"/>
            <circle cx="32" cy="32" r="8" fill="#FF8F00" stroke="#fff" strokeWidth="2"/>
            <circle cx="16" cy="16" r="4" fill="#fff"/>
            <circle cx="48" cy="16" r="4" fill="#fff"/>
            <circle cx="16" cy="48" r="4" fill="#fff"/>
            <circle cx="48" cy="48" r="4" fill="#fff"/>
            <line x1="20" y1="16" x2="28" y2="28" stroke="#fff" strokeWidth="1.5"/>
            <line x1="44" y1="16" x2="36" y2="28" stroke="#fff" strokeWidth="1.5"/>
            <line x1="20" y1="48" x2="28" y2="36" stroke="#fff" strokeWidth="1.5"/>
            <line x1="44" y1="48" x2="36" y2="36" stroke="#fff" strokeWidth="1.5"/>
          </svg>
        </div>
        <h2 className="menu-title">Tech Net</h2>
        <p className="menu-tagline">Student's Network for Online Learning Success</p>
        <p className="menu-description">
          Route information packets through the network to build your online learning knowledge.
          Complete all levels to earn your Tech Net Certified badge!
        </p>
      </div>

      {progress.totalAttempts > 0 && (
        <div className="menu-stats" aria-label="Your progress">
          <div className="stat-item">
            <span className="stat-value">{progress.completedLevels.length}/{levels.length}</span>
            <span className="stat-label">Levels Complete</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{overallAccuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          {progress.badgeEarned && (
            <div className="stat-item badge-earned">
              <span className="stat-value" aria-label="Badge earned">&#127942;</span>
              <span className="stat-label">Badge Earned!</span>
            </div>
          )}
        </div>
      )}

      <div className="level-select" role="list" aria-label="Select a level">
        <h3 className="level-select-heading">Select Level</h3>
        {levels.map(level => {
          const isCompleted = progress.completedLevels.includes(level.id);
          const isUnlocked = level.id === 1 || progress.completedLevels.includes(level.id - 1) || isCompleted;
          const score = progress.levelScores[level.id];

          return (
            <button
              key={level.id}
              className={`level-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => isUnlocked && onStartLevel(level.id)}
              disabled={!isUnlocked}
              role="listitem"
              aria-label={`${level.subtitle}: ${level.title}${isCompleted ? ' - completed' : ''}${!isUnlocked ? ' - locked' : ''}`}
            >
              <div className="level-card-header">
                <span className="level-number">{level.subtitle}</span>
                {isCompleted && <span className="level-check" aria-hidden="true">&#10003;</span>}
                {!isUnlocked && <span className="level-lock" aria-hidden="true">&#128274;</span>}
              </div>
              <h4 className="level-card-title">{level.title}</h4>
              <p className="level-card-topics">{level.topicFocus.join(', ')}</p>
              {score && (
                <p className="level-card-score">Score: {score.correct}/{score.total}</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="menu-footer-actions">
        <button className="btn btn-secondary" onClick={onDashboard} aria-label="View analytics dashboard">
          &#128202; Dashboard
        </button>
        <button className="btn btn-danger" onClick={onReset} aria-label="Reset all progress">
          Reset Progress
        </button>
      </div>
    </div>
  );
}
