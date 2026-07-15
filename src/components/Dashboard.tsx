import { PlayerProgress } from '../types/game';
import { levels } from '../data/levels';

interface DashboardProps {
  progress: PlayerProgress;
  onBack: () => void;
}

export function Dashboard({ progress, onBack }: DashboardProps) {
  const overallAccuracy = progress.totalAttempts > 0
    ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100)
    : 0;

  // Calculate topic accuracy from level scores
  const topicStats: Record<string, { correct: number; total: number }> = {};
  levels.forEach(level => {
    const score = progress.levelScores[level.id];
    if (score) {
      level.topicFocus.forEach(topic => {
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
        topicStats[topic].correct += score.correct;
        topicStats[topic].total += score.total;
      });
    }
  });

  return (
    <div className="dashboard" role="main" aria-label="OCC Specialty Coach Analytics Dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">OCC Specialty Coach Dashboard</h2>
        <p className="dashboard-subtitle">Student Engagement & Topic Mastery Analytics</p>
        <button className="btn btn-secondary" onClick={onBack} aria-label="Back to menu">
          &#8592; Back to Menu
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Engagement Metrics */}
        <section className="dashboard-card" aria-label="Engagement metrics">
          <h3 className="card-title">Student Engagement</h3>
          <div className="metric-grid">
            <div className="metric">
              <span className="metric-value">{progress.completedLevels.length}</span>
              <span className="metric-label">Levels Completed</span>
            </div>
            <div className="metric">
              <span className="metric-value">{progress.totalAttempts}</span>
              <span className="metric-label">Total Packets Routed</span>
            </div>
            <div className="metric">
              <span className="metric-value">{overallAccuracy}%</span>
              <span className="metric-label">Overall Accuracy</span>
            </div>
            <div className="metric">
              <span className="metric-value">{progress.badgeEarned ? 'Yes' : 'No'}</span>
              <span className="metric-label">Badge Earned</span>
            </div>
          </div>
        </section>

        {/* Level Performance */}
        <section className="dashboard-card" aria-label="Level performance">
          <h3 className="card-title">Level Performance</h3>
          <table className="dashboard-table" aria-label="Score per level">
            <thead>
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Score</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {levels.map(level => {
                const score = progress.levelScores[level.id];
                const isComplete = progress.completedLevels.includes(level.id);
                return (
                  <tr key={level.id}>
                    <td>{level.subtitle}: {level.title}</td>
                    <td>{score ? `${score.correct}/${score.total}` : '—'}</td>
                    <td>{score ? `${Math.round((score.correct / score.total) * 100)}%` : '—'}</td>
                    <td>
                      <span className={`status-badge ${isComplete ? 'complete' : 'pending'}`}>
                        {isComplete ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Topic Mastery */}
        <section className="dashboard-card" aria-label="Topic mastery">
          <h3 className="card-title">Topic Mastery</h3>
          {Object.keys(topicStats).length > 0 ? (
            <div className="topic-bars">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={topic} className="topic-bar-row">
                    <span className="topic-name">{topic}</span>
                    <div className="topic-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${topic}: ${pct}%`}>
                      <div className="topic-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="topic-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No data yet. Complete levels to see topic mastery.</p>
          )}
        </section>

        {/* Knowledge Gaps */}
        <section className="dashboard-card" aria-label="Knowledge gap reporting">
          <h3 className="card-title">Knowledge Gap Reporting</h3>
          <p className="card-description">
            Topics below 70% accuracy may indicate areas where additional support communication is needed.
          </p>
          {Object.entries(topicStats).filter(([, s]) => (s.correct / s.total) < 0.7).length > 0 ? (
            <ul className="gap-list">
              {Object.entries(topicStats)
                .filter(([, s]) => (s.correct / s.total) < 0.7)
                .map(([topic, stats]) => (
                  <li key={topic} className="gap-item">
                    <span className="gap-topic">{topic}</span>
                    <span className="gap-accuracy">{Math.round((stats.correct / stats.total) * 100)}%</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="no-data">
              {progress.totalAttempts > 0
                ? 'Great work! All topics are at 70% or above.'
                : 'No data yet.'}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
