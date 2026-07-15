import { useMemo } from 'react';
import { LevelData, NetworkNode, NetworkConnection } from '../types/game';

interface GameBoardProps {
  level: LevelData;
  currentPacketIndex: number;
  selectedPath: string[];
  deliveredPackets: number;
  onNodeClick: (nodeId: string) => void;
  onClearPath: () => void;
  onSubmit: () => void;
  onRestart: () => void;
}

// Build adjacency map from connections (bidirectional for online nodes)
function buildAdjacency(connections: NetworkConnection[]) {
  const adj: Record<string, Set<string>> = {};
  for (const conn of connections) {
    if (!conn.active) continue;
    if (!adj[conn.from]) adj[conn.from] = new Set();
    if (!adj[conn.to]) adj[conn.to] = new Set();
    adj[conn.from].add(conn.to);
    adj[conn.to].add(conn.from);
  }
  return adj;
}

export function GameBoard({
  level,
  currentPacketIndex,
  selectedPath,
  deliveredPackets,
  onNodeClick,
  onClearPath,
  onSubmit,
  onRestart,
}: GameBoardProps) {
  const currentPacket = level.packets[currentPacketIndex];
  const totalPackets = level.packets.length;

  // Build adjacency and node lookup
  const adjacency = useMemo(() => buildAdjacency(level.connections), [level.connections]);
  const nodeMap = useMemo(() => {
    const map: Record<string, NetworkNode> = {};
    for (const n of level.nodes) map[n.id] = n;
    return map;
  }, [level.nodes]);

  // The path always starts at the packet's start node
  const fullPath = useMemo(() => {
    if (selectedPath.length === 0) return [currentPacket.startNodeId];
    return [currentPacket.startNodeId, ...selectedPath];
  }, [selectedPath, currentPacket.startNodeId]);

  const lastInPath = fullPath[fullPath.length - 1];

  // Determine which nodes are clickable (adjacent to last node, online, not already in path)
  const clickableNodes = useMemo(() => {
    const neighbors = adjacency[lastInPath] || new Set<string>();
    const clickable = new Set<string>();
    for (const nId of neighbors) {
      const node = nodeMap[nId];
      if (!node) continue;
      if (node.status !== 'online') continue;
      if (fullPath.includes(nId)) continue;
      clickable.add(nId);
    }
    return clickable;
  }, [adjacency, lastInPath, nodeMap, fullPath]);

  // Check if path has reached a server node (col 3)
  const reachedServer = useMemo(() => {
    return level.servers.find(s => s.nodeId === lastInPath) || null;
  }, [level.servers, lastInPath]);

  // Can submit if we reached any server node
  const canSubmit = reachedServer !== null;

  // Helper: get server attached to a node
  const getServerForNode = (nodeId: string) => {
    return level.servers.find(s => s.nodeId === nodeId);
  };

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    // If clicking a node already in path, allow backtracking
    if (fullPath.includes(nodeId)) {
      // Trim path back to this node (remove everything after)
      const idx = fullPath.indexOf(nodeId);
      // If it's the start node, clear the user path
      if (idx === 0) {
        onClearPath();
      } else {
        // We need to set selectedPath to fullPath[1..idx]
        // Since fullPath = [startNode, ...selectedPath], selectedPath portion is fullPath[1:]
        // Trimming to idx means selectedPath becomes fullPath[1..idx]
        // But we can only call onNodeClick which appends - so use clear and rebuild
        // Actually, let's just call onNodeClick which handles trim internally
        onNodeClick(nodeId);
      }
      return;
    }
    // Only allow clicking adjacent online nodes
    if (clickableNodes.has(nodeId)) {
      onNodeClick(nodeId);
    }
  };

  // Determine if a connection is part of the current path
  const isConnectionInPath = (from: string, to: string) => {
    for (let i = 0; i < fullPath.length - 1; i++) {
      if (
        (fullPath[i] === from && fullPath[i + 1] === to) ||
        (fullPath[i] === to && fullPath[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="game-board" role="main" aria-label={`${level.subtitle}: ${level.title}`}>
      {/* Left sidebar */}
      <aside className="game-sidebar" aria-label="Game information">
        <div className="how-to-play">
          <h2 className="sidebar-heading">How to Play</h2>
          <p className="sidebar-text">
            Click through network nodes to build a path from your packet to the correct server.
            Avoid offline and firewall-blocked nodes. Click a previous node to backtrack.
          </p>
        </div>

        <div className="progress-tracker" aria-live="polite">
          <h3 className="progress-heading">Progress</h3>
          <p className="progress-count">{deliveredPackets} / {totalPackets} delivered</p>
          <div className="progress-dots" aria-label={`${deliveredPackets} of ${totalPackets} packets delivered`}>
            {level.packets.map((_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < deliveredPackets ? 'delivered' : i === currentPacketIndex ? 'current' : ''}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="tip-box" role="note">
          <h3 className="tip-heading">Tip</h3>
          <p className="tip-text">
            Not all paths are available! Look for working connections and avoid down nodes
            to deliver each packet successfully.
          </p>
        </div>

        <div className="legend-box">
          <h3 className="legend-heading">Network Legend</h3>
          <div className="legend-item">
            <span className="legend-swatch swatch-online" aria-hidden="true"></span>
            <span>Online Node (clickable)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch swatch-offline" aria-hidden="true"></span>
            <span>Offline Node (blocked)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch swatch-firewall" aria-hidden="true"></span>
            <span>Firewall Block</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch swatch-path" aria-hidden="true"></span>
            <span>Your Route</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch swatch-clickable" aria-hidden="true"></span>
            <span>Available Next Step</span>
          </div>
        </div>
      </aside>

      {/* Center - Network visualization */}
      <section className="network-area" aria-label="Network routing area">
        {/* Packet display */}
        <div className="packet-display" role="region" aria-label="Current data packet" aria-live="assertive">
          <div className="packet-card">
            <div className="packet-label">Data Packet {currentPacketIndex + 1} of {totalPackets}</div>
            <p className="packet-clue">"{currentPacket.clue}"</p>
          </div>
        </div>

        {/* Network grid - SVG based for proper connections */}
        <div className="network-container">
          <svg
            className="network-svg"
            viewBox="0 0 700 540"
            aria-label="Network grid with nodes and connections"
            role="img"
          >
            {/* Draw connections first (behind nodes) */}
            {level.connections.map(conn => {
              const fromNode = nodeMap[conn.from];
              const toNode = nodeMap[conn.to];
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.col * 175 + 75;
              const y1 = fromNode.row * 90 + 45;
              const x2 = toNode.col * 175 + 75;
              const y2 = toNode.row * 90 + 45;
              const inPath = isConnectionInPath(conn.from, conn.to);
              return (
                <line
                  key={`${conn.from}-${conn.to}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={`conn-line ${conn.active ? 'conn-active' : 'conn-inactive'} ${inPath ? 'conn-in-path' : ''}`}
                  strokeWidth={inPath ? 4 : 2}
                />
              );
            })}

            {/* Draw nodes */}
            {level.nodes.map(node => {
              const cx = node.col * 175 + 75;
              const cy = node.row * 90 + 45;
              const isInPath = fullPath.includes(node.id);
              const isClickable = clickableNodes.has(node.id);
              const isStart = node.id === currentPacket.startNodeId;
              const server = getServerForNode(node.id);
              const isServerNode = !!server;
              const isLast = node.id === lastInPath;

              let nodeClass = 'net-node';
              if (node.status === 'offline') nodeClass += ' net-node-offline';
              else if (node.status === 'firewall') nodeClass += ' net-node-firewall';
              else if (isInPath) nodeClass += ' net-node-in-path';
              else if (isClickable) nodeClass += ' net-node-clickable';

              const canClick = node.status === 'online' && (isClickable || isInPath);

              return (
                <g
                  key={node.id}
                  className={nodeClass}
                  onClick={() => canClick ? handleNodeClick(node.id) : undefined}
                  style={{ cursor: canClick ? 'pointer' : 'default' }}
                  role="button"
                  aria-label={`${node.type} node at row ${node.row + 1}, column ${node.col + 1} - ${node.status}${isServerNode ? ` (${server.name})` : ''}${isStart ? ' (packet start)' : ''}${isClickable ? ' - click to route here' : ''}`}
                  tabIndex={canClick ? 0 : -1}
                  onKeyDown={(e) => { if (canClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleNodeClick(node.id); }}}
                >
                  {/* Node background */}
                  <rect
                    x={cx - 28} y={cy - 28}
                    width={56} height={56}
                    rx={8}
                    className="node-rect"
                  />
                  {/* Node icon */}
                  {node.status === 'online' && (
                    <>
                      <rect x={cx - 16} y={cy - 8} width={32} height={16} rx={3} fill="#1565C0" stroke="#0D47A1" strokeWidth="1"/>
                      <circle cx={cx - 8} cy={cy} r={2} fill="#4CAF50"/>
                      <circle cx={cx} cy={cy} r={2} fill="#4CAF50"/>
                      <circle cx={cx + 8} cy={cy} r={2} fill="#4CAF50"/>
                    </>
                  )}
                  {node.status === 'offline' && (
                    <>
                      <rect x={cx - 16} y={cy - 8} width={32} height={16} rx={3} fill="#9E9E9E" stroke="#616161" strokeWidth="1"/>
                      <circle cx={cx - 8} cy={cy} r={2} fill="#F44336"/>
                      <circle cx={cx} cy={cy} r={2} fill="#F44336"/>
                      <circle cx={cx + 8} cy={cy} r={2} fill="#F44336"/>
                      <line x1={cx - 12} y1={cy - 12} x2={cx + 12} y2={cy + 12} stroke="#F44336" strokeWidth="2"/>
                    </>
                  )}
                  {node.status === 'firewall' && (
                    <>
                      <rect x={cx - 16} y={cy - 8} width={32} height={16} rx={3} fill="#FF6F00" stroke="#E65100" strokeWidth="1"/>
                      <line x1={cx - 16} y1={cy - 14} x2={cx + 16} y2={cy - 14} stroke="#F44336" strokeWidth="3"/>
                      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="#fff">X</text>
                    </>
                  )}
                  {/* Start indicator */}
                  {isStart && (
                    <circle cx={cx} cy={cy + 24} r={4} fill="#FF8F00" stroke="#E65100" strokeWidth="1"/>
                  )}
                  {/* Last in path indicator */}
                  {isLast && node.status === 'online' && (
                    <circle cx={cx} cy={cy - 24} r={5} fill="#FF8F00" className="pulse-dot"/>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Server labels on the right side */}
          <div className="server-labels">
            {level.servers.map(server => {
              const serverNode = nodeMap[server.nodeId];
              if (!serverNode) return null;
              const isReached = server.nodeId === lastInPath;
              return (
                <div
                  key={server.id}
                  className={`server-label ${isReached ? 'server-reached' : ''}`}
                  style={{ top: `${(serverNode.row / 5) * 83 + 3}%` }}
                >
                  <span className="server-label-name">{server.name}</span>
                </div>
              );
            })}
          </div>

          {/* Packet start labels on the left side */}
          <div className="packet-start-label">
            {(() => {
              const startNode = nodeMap[currentPacket.startNodeId];
              if (!startNode) return null;
              return (
                <div
                  className="start-indicator"
                  style={{ top: `${(startNode.row / 5) * 83 + 3}%` }}
                >
                  <span className="start-badge">PACKET</span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Status and guidance */}
        <div className="game-guidance" role="status" aria-live="polite">
          {reachedServer ? (
            <p><strong>Route complete!</strong> You reached: <strong>{reachedServer.name}</strong>. Click Submit to deliver.</p>
          ) : (
            <p><strong>Game Guidance:</strong> Click adjacent green nodes to build your route to the correct server.</p>
          )}
        </div>
      </section>

      {/* Bottom actions */}
      <footer className="game-actions" role="toolbar" aria-label="Game actions">
        <button
          className="btn btn-restart"
          onClick={onRestart}
          aria-label="Restart this level"
        >
          Restart Level
        </button>
        <button
          className="btn btn-secondary"
          onClick={onClearPath}
          aria-label="Clear current route"
        >
          Clear Route
        </button>
        <button
          className="btn btn-submit"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label={canSubmit ? `Submit packet to ${reachedServer?.name}` : 'Build a route to a server first'}
        >
          Submit Network →
        </button>
      </footer>
    </div>
  );
}
