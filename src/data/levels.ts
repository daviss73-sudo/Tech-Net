import { LevelData, FeedbackData } from '../types/game';

export const feedbackDatabase: Record<string, FeedbackData> = {
  'tech-requirements': {
    successMessage: 'Correct! The Technology Requirements Server handles device and internet readiness for online learning.',
    learningTip: 'You need a laptop or desktop computer with a supported browser and reliable internet. Consider using an Ethernet cable for tests.',
    learnMoreUrl: '#',
    learnMoreLabel: 'How to Prepare for Online Learning',
  },
  'blackboard-ultra': {
    successMessage: 'Correct! Blackboard Ultra is where students access assignments, grades, announcements, and course content.',
    learningTip: 'Log into Blackboard several times per week to stay current with announcements and due dates.',
    learnMoreUrl: '#',
    learnMoreLabel: 'Blackboard Ultra Tutorials',
  },
  'attendance': {
    successMessage: 'Correct! The Attendance Expectations Server tracks online participation requirements.',
    learningTip: 'Your completion of weekly activities on time counts as attendance!',
    learnMoreUrl: '#',
    learnMoreLabel: 'Attendance Information',
  },
  'academic-support': {
    successMessage: 'Correct! Academic Support connects you to tutoring, advising, and success coaching services.',
    learningTip: 'Free tutoring is available including walk-in, embedded, and online 24/7 options.',
    learnMoreUrl: '#',
    learnMoreLabel: 'Academic Support Resources',
  },
  'online-support': {
    successMessage: 'Correct! Student Online Support provides technical assistance and troubleshooting resources.',
    learningTip: 'If you cannot log into Blackboard, use the Online Password Manager or contact the Help Desk.',
    learnMoreUrl: '#',
    learnMoreLabel: 'Student Online Support',
  },
  'online-tests': {
    successMessage: 'Correct! The Online Tests Server handles assessment preparation and test-taking procedures.',
    learningTip: 'Wait for questions to load, monitor the status bar, and click Submit only once.',
    learnMoreUrl: '#',
    learnMoreLabel: 'Taking Tests Guide',
  },
  'yuja': {
    successMessage: 'Correct! YuJa is the video platform for viewing lectures and submitting video assignments.',
    learningTip: 'Access YuJa through Blackboard or at the YuJa website. The mobile app works for recordings too.',
    learnMoreUrl: '#',
    learnMoreLabel: 'YuJa Video Platform',
  },
  'online-textbooks': {
    successMessage: 'Correct! The Online Textbooks Server manages access to digital course materials and eBook platforms.',
    learningTip: 'Visit the Bookstore website to see required books. Your syllabus lists specific materials.',
    learnMoreUrl: '#',
    learnMoreLabel: 'Online Textbooks & Publisher Content',
  },
  'faqs': {
    successMessage: 'Correct! The FAQ Server addresses common questions about online learning procedures.',
    learningTip: 'New course enrollments appear in Blackboard within 24 hours.',
    learnMoreUrl: '#',
    learnMoreLabel: 'FAQs & Workarounds',
  },
};

// Grid is 6 rows x 4 cols.
// Col 0 = packet start nodes, Cols 1-2 = middle routing nodes, Col 3 = server nodes
// Players navigate from col 0 through cols 1-2 to reach col 3.

function createGridNodes(
  rows: number,
  cols: number,
  offlineIds: string[] = [],
  firewallIds: string[] = []
) {
  const nodes = [];
  const types: Array<'router' | 'switch' | 'hub'> = ['router', 'switch', 'hub'];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `node-${row}-${col}`;
      let status: 'online' | 'offline' | 'firewall' | 'disconnected' = 'online';
      if (offlineIds.includes(id)) status = 'offline';
      if (firewallIds.includes(id)) status = 'firewall';
      nodes.push({ id, row, col, status, type: types[(row + col) % 3] });
    }
  }
  return nodes;
}

function createGridConnections(
  rows: number,
  cols: number,
  disabledPairs: string[] = []
) {
  const connections = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const fromId = `node-${row}-${col}`;
      // Connect right
      if (col < cols - 1) {
        const toId = `node-${row}-${col + 1}`;
        const key = `${fromId}->${toId}`;
        connections.push({ from: fromId, to: toId, active: !disabledPairs.includes(key) });
      }
      // Connect down
      if (row < rows - 1) {
        const toId = `node-${row + 1}-${col}`;
        const key = `${fromId}->${toId}`;
        connections.push({ from: fromId, to: toId, active: !disabledPairs.includes(key) });
      }
    }
  }
  return connections;
}

export const levels: LevelData[] = [
  {
    id: 1,
    title: 'Network Startup',
    subtitle: 'Level 1',
    description: 'Route each data packet to the correct server. Bring the basic network online.',
    topicFocus: ['Technology Requirements', 'Student Online Support'],
    packets: [
      { id: 'p1-1', clue: 'I need a device that meets the minimum requirements.', correctServerId: 'tech-requirements', topic: 'Technology Requirements', startNodeId: 'node-0-0' },
      { id: 'p1-2', clue: 'Where can I watch lectures or course videos?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-1-0' },
      { id: 'p1-3', clue: 'How do I access my courses and assignments?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-2-0' },
      { id: 'p1-4', clue: 'What do I need to do to stay on track in my online class?', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-3-0' },
      { id: 'p1-5', clue: 'Where can I get help if I have questions?', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-4-0' },
      { id: 'p1-6', clue: 'What should I check before taking an online test?', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'attendance', name: 'Attendance Expectations Server', topic: 'Attendance', nodeId: 'node-2-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-3-3' },
      { id: 'yuja', name: 'YuJa Video Server', topic: 'YuJa', nodeId: 'node-4-3' },
      { id: 'online-tests', name: 'Online Tests Server', topic: 'Online Tests', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-1-2', 'node-4-1'], []),
    connections: createGridConnections(6, 4, ['node-1-2->node-1-3', 'node-1-2->node-2-2', 'node-4-1->node-4-2', 'node-4-1->node-5-1']),
  },
  {
    id: 2,
    title: 'Blackboard Connection',
    subtitle: 'Level 2',
    description: 'Connect course systems. Master Blackboard Ultra navigation.',
    topicFocus: ['Blackboard Ultra'],
    packets: [
      { id: 'p2-1', clue: 'Where do I submit my assignments online?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-0-0' },
      { id: 'p2-2', clue: 'How can I check my grades for the semester?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-1-0' },
      { id: 'p2-3', clue: 'Where do instructor announcements appear?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-2-0' },
      { id: 'p2-4', clue: 'I need to participate in a class discussion online.', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-3-0' },
      { id: 'p2-5', clue: 'How do I set up my profile picture and pronouns?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-4-0' },
      { id: 'p2-6', clue: 'My new class is not showing up after I registered.', correctServerId: 'faqs', topic: 'FAQs', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-0-3' },
      { id: 'faqs', name: 'FAQ & Troubleshooting Server', topic: 'FAQs', nodeId: 'node-1-3' },
      { id: 'online-support', name: 'Student Online Support Server', topic: 'Online Support', nodeId: 'node-2-3' },
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-3-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-4-3' },
      { id: 'yuja', name: 'YuJa Video Server', topic: 'YuJa', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-2-1', 'node-3-2'], ['node-0-2']),
    connections: createGridConnections(6, 4, ['node-2-1->node-2-2', 'node-2-1->node-3-1', 'node-0-2->node-0-3', 'node-0-2->node-1-2']),
  },
  {
    id: 3,
    title: 'Staying Connected',
    subtitle: 'Level 3',
    description: 'Maintain active participation pathways. Learn attendance expectations.',
    topicFocus: ['Attendance Expectations', 'Student Engagement'],
    packets: [
      { id: 'p3-1', clue: 'How often should I log into my online course each week?', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-0-0' },
      { id: 'p3-2', clue: 'What happens if I don\'t participate in the first two weeks?', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-1-0' },
      { id: 'p3-3', clue: 'What counts as attendance in an online class?', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-2-0' },
      { id: 'p3-4', clue: 'I lost access to my course and have been absent.', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-3-0' },
      { id: 'p3-5', clue: 'Where do I find due dates and participation guidelines?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-4-0' },
      { id: 'p3-6', clue: 'I need to discuss an absence with my instructor.', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'attendance', name: 'Attendance Expectations Server', topic: 'Attendance', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'online-support', name: 'Student Online Support Server', topic: 'Online Support', nodeId: 'node-2-3' },
      { id: 'faqs', name: 'FAQ Server', topic: 'FAQs', nodeId: 'node-3-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-4-3' },
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-0-2', 'node-3-1', 'node-5-1'], []),
    connections: createGridConnections(6, 4, ['node-0-2->node-0-3', 'node-0-2->node-1-2', 'node-3-1->node-3-2', 'node-3-1->node-4-1', 'node-5-1->node-5-2']),
  },
  {
    id: 4,
    title: 'Learning Support Network',
    subtitle: 'Level 4',
    description: 'Connect students to available help. Discover academic support and FAQs.',
    topicFocus: ['Academic Support', 'FAQs'],
    packets: [
      { id: 'p4-1', clue: 'Where can I get free tutoring for my courses?', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-0-0' },
      { id: 'p4-2', clue: 'Is there online tutoring available late at night?', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-1-0' },
      { id: 'p4-3', clue: 'I cannot log into Blackboard. What should I do?', correctServerId: 'faqs', topic: 'FAQs', startNodeId: 'node-2-0' },
      { id: 'p4-4', clue: 'I need help with writing for my English class.', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-3-0' },
      { id: 'p4-5', clue: 'Why does my course show "Access Denied" when I click content?', correctServerId: 'faqs', topic: 'FAQs', startNodeId: 'node-4-0' },
      { id: 'p4-6', clue: 'I need academic advising to plan my course schedule.', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-0-3' },
      { id: 'faqs', name: 'FAQ & Troubleshooting Server', topic: 'FAQs', nodeId: 'node-1-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-2-3' },
      { id: 'online-support', name: 'Student Online Support Server', topic: 'Online Support', nodeId: 'node-3-3' },
      { id: 'attendance', name: 'Attendance Expectations Server', topic: 'Attendance', nodeId: 'node-4-3' },
      { id: 'yuja', name: 'YuJa Video Server', topic: 'YuJa', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-1-1', 'node-4-2'], ['node-2-2']),
    connections: createGridConnections(6, 4, ['node-1-1->node-1-2', 'node-1-1->node-2-1', 'node-4-2->node-4-3', 'node-4-2->node-5-2', 'node-2-2->node-2-3']),
  },
  {
    id: 5,
    title: 'Digital Coursework',
    subtitle: 'Level 5',
    description: 'Enable access to course content. Navigate online textbooks and assignments.',
    topicFocus: ['Online Textbooks', 'Online Assignments'],
    packets: [
      { id: 'p5-1', clue: 'Where do I find my required textbook online?', correctServerId: 'online-textbooks', topic: 'Online Textbooks', startNodeId: 'node-0-0' },
      { id: 'p5-2', clue: 'How do I access publisher content like MyLab or Connect?', correctServerId: 'online-textbooks', topic: 'Online Textbooks', startNodeId: 'node-1-0' },
      { id: 'p5-3', clue: 'I need to submit a Word document for my assignment.', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-2-0' },
      { id: 'p5-4', clue: 'What file types does Blackboard accept for uploads?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-3-0' },
      { id: 'p5-5', clue: 'My file is too large to upload. What is the size limit?', correctServerId: 'faqs', topic: 'FAQs', startNodeId: 'node-4-0' },
      { id: 'p5-6', clue: 'How do I download a Google Doc as a PDF to submit?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'online-textbooks', name: 'Online Textbooks Server', topic: 'Online Textbooks', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'faqs', name: 'FAQ & Troubleshooting Server', topic: 'FAQs', nodeId: 'node-2-3' },
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-3-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-4-3' },
      { id: 'online-tests', name: 'Online Tests Server', topic: 'Online Tests', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-0-1', 'node-3-2', 'node-5-2'], ['node-4-1']),
    connections: createGridConnections(6, 4, ['node-0-1->node-0-2', 'node-0-1->node-1-1', 'node-3-2->node-3-3', 'node-3-2->node-4-2', 'node-4-1->node-4-2', 'node-5-2->node-5-3']),
  },
  {
    id: 6,
    title: 'Media Network',
    subtitle: 'Level 6',
    description: 'Connect instructional media systems. Master the YuJa video platform.',
    topicFocus: ['YuJa'],
    packets: [
      { id: 'p6-1', clue: 'How do I watch my instructor\'s recorded lectures?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-0-0' },
      { id: 'p6-2', clue: 'I need to record and submit a video assignment.', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-1-0' },
      { id: 'p6-3', clue: 'Where do I access the video platform inside Blackboard?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-2-0' },
      { id: 'p6-4', clue: 'Can I use a mobile app to record my class presentation?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-3-0' },
      { id: 'p6-5', clue: 'I keep getting email notifications from the video system.', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-4-0' },
      { id: 'p6-6', clue: 'Where do I go for help with video platform technical issues?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'yuja', name: 'YuJa Video Server', topic: 'YuJa', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'online-support', name: 'Student Online Support Server', topic: 'Online Support', nodeId: 'node-2-3' },
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-3-3' },
      { id: 'faqs', name: 'FAQ Server', topic: 'FAQs', nodeId: 'node-4-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-2-2', 'node-4-1'], ['node-1-1', 'node-5-2']),
    connections: createGridConnections(6, 4, ['node-2-2->node-2-3', 'node-2-2->node-3-2', 'node-1-1->node-1-2', 'node-1-1->node-2-1', 'node-4-1->node-4-2', 'node-5-2->node-5-3']),
  },
  {
    id: 7,
    title: 'Testing Center',
    subtitle: 'Level 7',
    description: 'Ensure assessment readiness. Prepare for online tests.',
    topicFocus: ['Online Tests'],
    packets: [
      { id: 'p7-1', clue: 'What should I do before starting a timed online exam?', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-0-0' },
      { id: 'p7-2', clue: 'My test questions are still loading. What should I do?', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-1-0' },
      { id: 'p7-3', clue: 'How do I know my test was submitted successfully?', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-2-0' },
      { id: 'p7-4', clue: 'My instructor requires proctoring for the final exam.', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-3-0' },
      { id: 'p7-5', clue: 'Should I use Wi-Fi or Ethernet for a high-stakes test?', correctServerId: 'tech-requirements', topic: 'Technology Requirements', startNodeId: 'node-4-0' },
      { id: 'p7-6', clue: 'Where do I check if my test grade was recorded?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'online-tests', name: 'Online Tests Server', topic: 'Online Tests', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-2-3' },
      { id: 'faqs', name: 'FAQ Server', topic: 'FAQs', nodeId: 'node-3-3' },
      { id: 'online-support', name: 'Student Online Support Server', topic: 'Online Support', nodeId: 'node-4-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-5-3' },
    ],
    nodes: createGridNodes(6, 4, ['node-0-1', 'node-2-2', 'node-5-1'], ['node-3-1', 'node-4-2']),
    connections: createGridConnections(6, 4, ['node-0-1->node-0-2', 'node-0-1->node-1-1', 'node-2-2->node-2-3', 'node-2-2->node-3-2', 'node-3-1->node-3-2', 'node-3-1->node-4-1', 'node-5-1->node-5-2']),
  },
  {
    id: 8,
    title: 'Full Network Online',
    subtitle: 'Level 8',
    description: 'Build a fully operational online learning network. All topics combined!',
    topicFocus: ['All Categories'],
    packets: [
      { id: 'p8-1', clue: 'I need to know what computer and internet I need for classes.', correctServerId: 'tech-requirements', topic: 'Technology Requirements', startNodeId: 'node-0-0' },
      { id: 'p8-2', clue: 'Where do I submit work and check my grades each week?', correctServerId: 'blackboard-ultra', topic: 'Blackboard Ultra', startNodeId: 'node-1-0' },
      { id: 'p8-3', clue: 'What happens if I stop participating in my online course?', correctServerId: 'attendance', topic: 'Attendance', startNodeId: 'node-2-0' },
      { id: 'p8-4', clue: 'I need free tutoring help with my math course.', correctServerId: 'academic-support', topic: 'Academic Support', startNodeId: 'node-3-0' },
      { id: 'p8-5', clue: 'How do I record a video presentation for my class?', correctServerId: 'yuja', topic: 'YuJa', startNodeId: 'node-4-0' },
      { id: 'p8-6', clue: 'I want to make sure my computer is ready before my online exam.', correctServerId: 'online-tests', topic: 'Online Tests', startNodeId: 'node-5-0' },
    ],
    servers: [
      { id: 'tech-requirements', name: 'Technology Requirements Server', topic: 'Technology Requirements', nodeId: 'node-0-3' },
      { id: 'blackboard-ultra', name: 'Blackboard Ultra Server', topic: 'Blackboard Ultra', nodeId: 'node-1-3' },
      { id: 'attendance', name: 'Attendance Expectations Server', topic: 'Attendance', nodeId: 'node-2-3' },
      { id: 'academic-support', name: 'Academic Support Server', topic: 'Academic Support', nodeId: 'node-3-3' },
      { id: 'yuja', name: 'YuJa Video Server', topic: 'YuJa', nodeId: 'node-4-3' },
      { id: 'online-tests', name: 'Online Tests Server', topic: 'Online Tests', nodeId: 'node-5-3' },
    ],
    // Offline: node-1-2, node-4-1. Firewall: node-3-2
    // Path analysis:
    //   Row 0: 0-0 → 0-1 → 0-2 → 0-3 (tech-requirements) ✓
    //   Row 0 alt: 0-0 → 1-0 → 2-0 → 2-1 → 2-2 → 2-3 (attendance) ✓
    //   Row 1: 1-0 → 2-0 → 2-1 → 2-2 → 1-2 OFFLINE, so 2-2 → 2-3 ✓
    //   Row 2: 2-0 → 2-1 → 2-2 → 2-3 ✓
    //   Row 3: 3-0 → 3-1 → 3-2 FIREWALL, so 3-0 → 4-0 → 5-0 → 5-1 → 5-2 → 5-3 ✓
    //   Row 4: 4-0 → 4-1 OFFLINE, so 4-0 → 5-0 → 5-1 → 5-2 → 5-3 ✓
    //   or 4-0 → 3-0 → 3-1 → 2-1 → 2-2 → 2-3 ✓
    //   Row 5: 5-0 → 5-1 → 5-2 → 5-3 ✓
    nodes: createGridNodes(6, 4, ['node-1-2', 'node-4-1'], ['node-3-2']),
    connections: createGridConnections(6, 4, ['node-1-2->node-1-3', 'node-1-2->node-2-2', 'node-3-2->node-3-3', 'node-3-2->node-4-2']),
  },
];
