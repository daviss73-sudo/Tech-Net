import { FeedbackData } from '../types/game';

interface FeedbackModalProps {
  isCorrect: boolean;
  feedback: FeedbackData | null;
  packetClue: string;
  correctServerName: string;
  onContinue: () => void;
}

export function FeedbackModal({
  isCorrect,
  feedback,
  packetClue,
  correctServerName,
  onContinue,
}: FeedbackModalProps) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isCorrect ? 'Packet delivered successfully' : 'Incorrect destination'}
    >
      <div className={`modal-content feedback-modal ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="feedback-icon" aria-hidden="true">
          {isCorrect ? '✓' : '✗'}
        </div>

        <h2 className="feedback-title">
          {isCorrect ? 'Packet Delivered!' : 'Wrong Destination'}
        </h2>

        <div className="feedback-packet">
          <p className="feedback-clue">"{packetClue}"</p>
          {!isCorrect && (
            <p className="feedback-correct-answer">
              The correct destination was: <strong>{correctServerName}</strong>
            </p>
          )}
        </div>

        {feedback && (
          <div className="feedback-learning">
            <p className="feedback-message">{feedback.successMessage}</p>

            <div className="learning-tip">
              <span className="tip-label" aria-hidden="true">&#128161; Learning Tip:</span>
              <p>{feedback.learningTip}</p>
            </div>

            <a
              href={feedback.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-learn-more"
              aria-label={`Learn more: ${feedback.learnMoreLabel} (opens in new tab)`}
            >
              Learn More: {feedback.learnMoreLabel}
              <span aria-hidden="true"> &#8599;</span>
            </a>
          </div>
        )}

        <button
          className="btn btn-continue"
          onClick={onContinue}
          autoFocus
          aria-label="Continue to next packet"
        >
          Continue <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </div>
  );
}
