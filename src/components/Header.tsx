import { AccessibilitySettings } from '../types/game';

interface HeaderProps {
  levelTitle?: string;
  levelSubtitle?: string;
  showMenu: boolean;
  onMenuClick: () => void;
  onHelpClick: () => void;
  onAccessibilityClick: () => void;
  settings: AccessibilitySettings;
}

export function Header({
  levelTitle,
  levelSubtitle,
  showMenu,
  onMenuClick,
  onHelpClick,
  onAccessibilityClick,
}: HeaderProps) {
  return (
    <header className="game-header" role="banner">
      <div className="header-brand">
        <div className="header-logo" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
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
        <div className="header-text">
          <h1 className="header-title">Tech Net</h1>
          <p className="header-tagline">Student's Network for Online Learning Success.</p>
        </div>
      </div>

      {levelTitle && (
        <div className="header-level" aria-live="polite">
          <span className="level-subtitle">{levelSubtitle}:</span>{' '}
          <span className="level-title">{levelTitle}</span>
        </div>
      )}

      <nav className="header-controls" aria-label="Game controls">
        <button
          className="header-btn"
          onClick={onHelpClick}
          aria-label="Help"
          title="Help"
        >
          <span aria-hidden="true">?</span>
        </button>
        <button
          className="header-btn"
          onClick={onAccessibilityClick}
          aria-label="Accessibility settings"
          title="Accessibility"
        >
          <span aria-hidden="true">&#9881;</span>
        </button>
        {showMenu && (
          <button
            className="header-btn"
            onClick={onMenuClick}
            aria-label="Main menu"
            title="Menu"
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
        )}
      </nav>
    </header>
  );
}
