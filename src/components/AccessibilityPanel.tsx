import { AccessibilitySettings } from '../types/game';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onToggleHighContrast: () => void;
  onToggleReducedMotion: () => void;
  onSetTextScale: (scale: number) => void;
  onToggleScreenReader: () => void;
  onClose: () => void;
}

export function AccessibilityPanel({
  settings,
  onToggleHighContrast,
  onToggleReducedMotion,
  onSetTextScale,
  onToggleScreenReader,
  onClose,
}: AccessibilityPanelProps) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility settings"
    >
      <div className="modal-content accessibility-modal">
        <h2 className="modal-title">Accessibility Settings</h2>

        <div className="a11y-options">
          <label className="a11y-toggle">
            <span className="a11y-label">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={onToggleHighContrast}
              aria-describedby="hc-desc"
            />
            <span className="toggle-switch" aria-hidden="true"></span>
          </label>
          <p id="hc-desc" className="a11y-description">
            Increases color contrast for better visibility.
          </p>

          <label className="a11y-toggle">
            <span className="a11y-label">Reduced Motion</span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={onToggleReducedMotion}
              aria-describedby="rm-desc"
            />
            <span className="toggle-switch" aria-hidden="true"></span>
          </label>
          <p id="rm-desc" className="a11y-description">
            Disables animations and transitions.
          </p>

          <label className="a11y-toggle">
            <span className="a11y-label">Screen Reader Optimized</span>
            <input
              type="checkbox"
              checked={settings.screenReaderMode}
              onChange={onToggleScreenReader}
              aria-describedby="sr-desc"
            />
            <span className="toggle-switch" aria-hidden="true"></span>
          </label>
          <p id="sr-desc" className="a11y-description">
            Provides additional descriptive text for screen readers.
          </p>

          <div className="a11y-scale">
            <label htmlFor="text-scale" className="a11y-label">Text Size</label>
            <div className="scale-controls">
              <button
                className="btn-icon"
                onClick={() => onSetTextScale(settings.textScale - 0.1)}
                aria-label="Decrease text size"
                disabled={settings.textScale <= 0.8}
              >
                A-
              </button>
              <input
                id="text-scale"
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={settings.textScale}
                onChange={e => onSetTextScale(parseFloat(e.target.value))}
                aria-label={`Text scale: ${Math.round(settings.textScale * 100)}%`}
              />
              <button
                className="btn-icon"
                onClick={() => onSetTextScale(settings.textScale + 0.1)}
                aria-label="Increase text size"
                disabled={settings.textScale >= 1.5}
              >
                A+
              </button>
            </div>
            <span className="scale-value">{Math.round(settings.textScale * 100)}%</span>
          </div>
        </div>

        <button
          className="btn btn-submit"
          onClick={onClose}
          autoFocus
        >
          Done
        </button>
      </div>
    </div>
  );
}
