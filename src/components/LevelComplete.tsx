interface LevelCompleteProps {
  levelTitle: string;
  correct: number;
  total: number;
  onNextLevel: () => void;
  onMenu: () => void;
  isLastLevel: boolean;
  badgeEarned: boolean;
}

export function LevelComplete({
  levelTitle,
  correct,
  total,
  onNextLevel,
  onMenu,
  isLastLevel,
  badgeEarned,
}: LevelCompleteProps) {
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= 70;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Level complete"
    >
      <div className="modal-content level-complete-modal">
        <div className="level-complete-icon" aria-hidden="true">
          {passed ? '&#127881;' : '&#128170;'}
        </div>

        <h2 className="level-complete-title">
          {isLastLevel ? 'Network Complete!' : 'Level Complete!'}
        </h2>

        <p className="level-complete-subtitle">{levelTitle}</p>

        <div className="level-score-display" aria-label={`Score: ${correct} out of ${total}, ${percentage} percent`}>
          <div className="score-circle">
            <span className="score-number">{percentage}%</span>
          </div>
          <p className="score-detail">{correct}/{total} packets correctly delivered</p>
        </div>

        {badgeEarned && (
          <div className="badge-display" role="alert">
            <div className="badge-icon" aria-hidden="true">&#127942;</div>
            <h3 className="badge-title">Tech Net Certified!</h3>
            <p className="badge-subtitle">Student's Network for Online Learning Success</p>
            <p className="badge-description">
              You've completed all levels with 70%+ accuracy. Congratulations!
            </p>
          </div>
        )}

        <div className="level-complete-actions">
          {!isLastLevel && (
            <button
              className="btn btn-submit"
              onClick={onNextLevel}
              autoFocus
            >
              Next Level <span aria-hidden="true">&#8594;</span>
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onMenu}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
