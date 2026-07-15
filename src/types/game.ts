export type NodeStatus = 'online' | 'offline' | 'firewall' | 'disconnected';

export interface NetworkNode {
  id: string;
  row: number;
  col: number;
  status: NodeStatus;
  type: 'router' | 'switch' | 'hub';
}

export interface NetworkConnection {
  from: string;
  to: string;
  active: boolean;
}

export interface Packet {
  id: string;
  clue: string;
  correctServerId: string;
  topic: string;
  startNodeId: string; // which node the packet starts at (left side)
}

export interface Server {
  id: string;
  name: string;
  topic: string;
  nodeId: string; // which node this server is attached to (right side)
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  topicFocus: string[];
  packets: Packet[];
  servers: Server[];
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}

export interface FeedbackData {
  successMessage: string;
  learningTip: string;
  learnMoreUrl: string;
  learnMoreLabel: string;
}

export interface PlayerProgress {
  currentLevel: number;
  completedLevels: number[];
  totalCorrect: number;
  totalAttempts: number;
  levelScores: Record<number, { correct: number; total: number }>;
  badgeEarned: boolean;
}

export type GamePhase = 'menu' | 'playing' | 'feedback' | 'levelComplete' | 'gameComplete' | 'dashboard';

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  currentPacketIndex: number;
  selectedPath: string[]; // node IDs forming the path
  deliveredPackets: number;
  levelCorrect: number;
  levelTotal: number;
  showFeedback: boolean;
  feedbackCorrect: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  textScale: number;
  screenReaderMode: boolean;
}
