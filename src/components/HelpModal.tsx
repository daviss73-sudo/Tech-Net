interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="How to play Tech Net"
    >
      <div className="modal-content help-modal">
        <h2 className="modal-title">How to Play Tech Net</h2>

        <div className="help-sections">
          <section className="help-section">
            <h3>Objective</h3>
            <p>
              Route each information packet to the correct destination server.
              Each packet contains a clue about online learning. Read the clue and decide
              which server should receive it.
            </p>
          </section>

          <section className="help-section">
            <h3>How to Route</h3>
            <ol>
              <li>Read the orange data packet clue on the left</li>
              <li>Look at the available destination servers on the right</li>
              <li>Click on the server you think is correct</li>
              <li>Click "Submit Network" to deliver the packet</li>
            </ol>
          </section>

          <section className="help-section">
            <h3>Network Obstacles</h3>
            <ul>
              <li><strong>Offline Nodes</strong> (red) — these network points are down</li>
              <li><strong>Firewall Blocks</strong> (orange) — path is unavailable</li>
              <li><strong>Disconnected Routes</strong> — look for alternate paths</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>Scoring</h3>
            <p>
              Complete all 8 levels with 70% or higher overall accuracy to earn the
              <strong> Tech Net Certified</strong> badge!
            </p>
          </section>

          <section className="help-section">
            <h3>Keyboard Navigation</h3>
            <ul>
              <li><kbd>Tab</kbd> — Move between elements</li>
              <li><kbd>Enter</kbd> or <kbd>Space</kbd> — Select/activate</li>
              <li><kbd>Escape</kbd> — Close dialogs</li>
            </ul>
          </section>
        </div>

        <button
          className="btn btn-submit"
          onClick={onClose}
          autoFocus
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
