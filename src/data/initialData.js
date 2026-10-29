// Official Sumo Robot Competition Data — E-JUST HQ (October 30, 2026)
// Issued by IEEE Robotics & Automation Society E-JUST Student Branch Chapter (IEEE RAS E-JUST SBC)
// EXACT REVISED DRAW & SCHEDULE FOR 22 TEAMS (Sections 3, 8 & 13)

export const TOURNAMENT_METADATA = {
  title: 'SUMO ROBOT COMPETITION',
  subtitle: 'Official Tournament Management & Judging System',
  edition: '2026 Championship Edition',
  host: 'E-JUST HQ',
  date: 'October 30, 2026',
  organizer: 'IEEE Robotics & Automation Society E-JUST SBC',
  totalTeams: 22,
  totalMatches: 22,
  byesToR16: 10,
  playInTeams: 12,
  plannedMinutes: 120,
  bufferMinutes: 30,
  scheduleWindow: '15:30 – 17:30',
  bufferWindow: '17:30 – 18:00',
  contacts: [
    { name: 'Omar Ahmed Ibrahim', email: 'omarahmedibrahim@ieee.org', phone: '01004245642', role: 'Organizing Lead' },
    { name: 'Ahmed Tamer', email: 'ahmed.120230252@ejust.edu.eg', phone: '01090180017', role: 'Technical Head' }
  ],
  refereeCommittee: {
    principalReferee: 'Principal Referee (Head of Safety & Rules)',
    assistantReferee1: 'Assistant Referee 1 (Dohyo Line Judge)',
    assistantReferee2: 'Assistant Referee 2 (Safety & Timer Judge)'
  }
};

export const UNIVERSITIES = [
  { id: 'E-JUST', count: 7, name: 'Egypt-Japan University of Science & Technology (E-JUST)' },
  { id: 'CUC', count: 4, name: 'City University of Cairo' },
  { id: 'HTI', count: 2, name: 'Higher Technological Institute' },
  { id: 'SCU', count: 2, name: 'Suez Canal University' },
  { id: 'Horus', count: 2, name: 'Horus University' },
  { id: 'ANU', count: 1, name: 'Alexandria National University' },
  { id: 'Robotica', count: 1, name: 'Robotica' },
  { id: 'Zagazig', count: 1, name: 'Zagazig University' },
  { id: 'AIU', count: 1, name: 'Al Alamein International University' },
  { id: 'TBC', count: 1, name: 'To be confirmed (Robotronics)' },
];

// 22 TEAMS (Exact data from updated SECTION 3: TEAMS & DRAW)
export const INITIAL_TEAMS = [
  {
    id: 'T-0010',
    name: 'wahy zekrayat',
    nameEn: 'Wahy Zekrayat',
    university: 'E-JUST',
    members: 5,
    entry: 'PLAY-IN',
    firstMatch: 'M01',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 10,
    robotName: 'Nostalgia Ram',
    controlMode: 'Autonomous',
    weightGrams: 2920,
    dimensionsCm: '19.5 x 19.8',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0004',
    name: 'G3far El3omda',
    nameEn: 'G3far El3omda',
    university: 'SCU',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M01',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 4,
    robotName: 'El-Omda Crusher',
    controlMode: 'Autonomous',
    weightGrams: 2970,
    dimensionsCm: '19.8 x 19.6',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0013',
    name: 'VENOM',
    university: 'City University of Cairo',
    members: 5,
    entry: 'PLAY-IN',
    firstMatch: 'M02',
    bracketQuarter: 'Q4 · bottom half',
    robotNumber: 13,
    robotName: 'Venom Sting',
    controlMode: 'Manual (Wireless)',
    weightGrams: 2980,
    dimensionsCm: '19.7 x 19.7',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0021',
    name: 'BuildX Gang',
    university: 'Horus University',
    members: 6,
    entry: 'PLAY-IN',
    firstMatch: 'M02',
    bracketQuarter: 'Q4 · bottom half',
    robotNumber: 21,
    robotName: 'Titan Blade v2',
    controlMode: 'Autonomous',
    weightGrams: 2850,
    dimensionsCm: '19.4 x 19.8',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0003',
    name: 'TITAN-X',
    university: 'E-JUST FOE',
    members: 5,
    entry: 'PLAY-IN',
    firstMatch: 'M03',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 3,
    robotName: 'Titan Force',
    controlMode: 'Autonomous',
    weightGrams: 2990,
    dimensionsCm: '19.9 x 19.8',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0022',
    name: 'Buildx&GRNX',
    university: 'Horus University',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M03',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 22,
    robotName: 'Green X',
    controlMode: 'Autonomous',
    weightGrams: 2910,
    dimensionsCm: '19.2 x 19.6',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0008',
    name: 'HTI Alsiddiq Robotics Team',
    university: 'HTI',
    members: 4,
    entry: 'BYE - R16',
    firstMatch: 'M04',
    bracketQuarter: 'Q2 · top half',
    robotNumber: 8,
    robotName: 'Alsiddiq Charger',
    controlMode: 'Autonomous',
    weightGrams: 2920,
    dimensionsCm: '19.3 x 19.5',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0002',
    name: 'ZERO',
    university: 'EJUST',
    members: 4,
    entry: 'BYE - R16',
    firstMatch: 'M04',
    bracketQuarter: 'Q2 · top half',
    robotNumber: 2,
    robotName: 'Absolute Zero',
    controlMode: 'Autonomous',
    weightGrams: 2990,
    dimensionsCm: '19.8 x 19.9',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0007',
    name: 'Roxers',
    university: 'RAS E-JUST',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M05',
    bracketQuarter: 'Q2 · top half',
    robotNumber: 7,
    robotName: 'Roxer Supreme',
    controlMode: 'Autonomous',
    weightGrams: 2990,
    dimensionsCm: '19.9 x 19.9',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0005',
    name: 'GAME OF HORUS',
    university: 'Alexandria National University',
    members: 6,
    entry: 'PLAY-IN',
    firstMatch: 'M05',
    bracketQuarter: 'Q2 · top half',
    robotNumber: 5,
    robotName: 'Eye of Horus',
    controlMode: 'Autonomous',
    weightGrams: 2930,
    dimensionsCm: '19.6 x 19.5',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0014',
    name: 'Spark cuc',
    university: 'City University of Cairo',
    members: 4,
    entry: 'BYE - R16',
    firstMatch: 'M06',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 14,
    robotName: 'Spark-01',
    controlMode: 'Manual (Wireless)',
    weightGrams: 2810,
    dimensionsCm: '19.0 x 19.0',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0009',
    name: 'Alsiddiqe - Elite',
    university: 'HTI',
    members: 5,
    entry: 'BYE - R16',
    firstMatch: 'M07',
    bracketQuarter: 'Q4 · bottom half',
    robotNumber: 9,
    robotName: 'Siddiq Elite',
    controlMode: 'Autonomous',
    weightGrams: 2960,
    dimensionsCm: '19.7 x 19.8',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0012',
    name: 'FURIOUS',
    university: 'SCU',
    members: 5,
    entry: 'BYE - R16',
    firstMatch: 'M08',
    bracketQuarter: 'Q4 · bottom half',
    robotNumber: 12,
    robotName: 'Furious Fury',
    controlMode: 'Autonomous',
    weightGrams: 2910,
    dimensionsCm: '19.5 x 19.4',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0011',
    name: 'هشيلك من عالارض',
    nameEn: 'Hashilak Men 3al-Ard',
    university: 'E-JUST',
    members: 6,
    entry: 'BYE - R16',
    firstMatch: 'M08',
    bracketQuarter: 'Q4 · bottom half',
    robotNumber: 11,
    robotName: 'Al-Raffaa',
    controlMode: 'Autonomous',
    weightGrams: 3000,
    dimensionsCm: '20.0 x 19.9',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0016',
    name: 'Raiden',
    university: 'City University of Cairo',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M09',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 16,
    robotName: 'Raiden Shogun',
    controlMode: 'Autonomous',
    weightGrams: 2880,
    dimensionsCm: '18.9 x 19.3',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0015',
    name: 'Robotica YAAO',
    university: 'Robotica',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M09',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 15,
    robotName: 'YAAO Juggernaut',
    controlMode: 'Autonomous',
    weightGrams: 2890,
    dimensionsCm: '19.1 x 19.4',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0019',
    name: 'Mechapex Team',
    university: 'AIU',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M10',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 19,
    robotName: 'Apex Predator',
    controlMode: 'Autonomous',
    weightGrams: 2870,
    dimensionsCm: '19.4 x 19.2',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0023',
    name: 'Robotronics',
    university: 'To be confirmed',
    members: 4,
    entry: 'PLAY-IN',
    firstMatch: 'M10',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 23,
    robotName: 'Tronix Sumo Mk1',
    controlMode: 'Autonomous',
    weightGrams: 2940,
    dimensionsCm: '19.8 x 19.5',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0020',
    name: 'Nexus',
    university: 'City University of Cairo',
    members: 6,
    entry: 'BYE - R16',
    firstMatch: 'M11',
    bracketQuarter: 'Q2 · top half',
    robotNumber: 20,
    robotName: 'Nexus Prime',
    controlMode: 'Autonomous',
    weightGrams: 2950,
    dimensionsCm: '19.5 x 19.6',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0017',
    name: 'الفرنجه',
    nameEn: 'Al-Faranjah',
    university: 'Zagazig',
    members: 6,
    entry: 'BYE - R16',
    firstMatch: 'M12',
    bracketQuarter: 'Q3 · bottom half',
    robotNumber: 17,
    robotName: 'Frankish Knight',
    controlMode: 'Autonomous',
    weightGrams: 2980,
    dimensionsCm: '19.8 x 19.7',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0006',
    name: 'Ctrl Alt Defeat',
    university: 'E-JUST',
    members: 4,
    entry: 'BYE - R16',
    firstMatch: 'M13',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 6,
    robotName: 'BlueScreen',
    controlMode: 'Autonomous',
    weightGrams: 2960,
    dimensionsCm: '19.7 x 19.8',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  },
  {
    id: 'T-0018',
    name: 'RAID',
    university: 'E-JUST',
    members: 4,
    entry: 'BYE - R16',
    firstMatch: 'M14',
    bracketQuarter: 'Q1 · top half',
    robotNumber: 18,
    robotName: 'Raid Alpha',
    controlMode: 'Manual (Wireless)',
    weightGrams: 2950,
    dimensionsCm: '19.9 x 19.5',
    homologation: { status: 'PASSED', massChecked: true, dimensionsChecked: true, emergencyStopTested: true, batteryInspected: true, a4PaperTractionPassed: true, durabilityCheckPassed: true, numberDisplayed: true }
  }
];

// EXACT 22 MATCHES SCHEDULE & BRACKET PROGRESSIONS (Updated Images 1 & 2)
export const INITIAL_MATCHES = [
  // --- SLOT 01 (15:30) ---
  {
    id: 'M01',
    code: 'M01',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 1',
    scheduledTime: '15:30',
    slot: 'Slot 01',
    teamAId: 'T-0010', // wahy zekrayat (E-JUST)
    teamBId: 'T-0004', // G3far El3omda (SCU)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M06',
    nextMatchSlot: 'teamB',
    quarter: 'Q3'
  },
  {
    id: 'M02',
    code: 'M02',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 2',
    scheduledTime: '15:30',
    slot: 'Slot 01',
    teamAId: 'T-0013', // VENOM (CUC)
    teamBId: 'T-0021', // BuildX Gang (HORUS)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M07',
    nextMatchSlot: 'teamB',
    quarter: 'Q4'
  },

  // --- SLOT 02 (15:40) ---
  {
    id: 'M03',
    code: 'M03',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 1',
    scheduledTime: '15:40',
    slot: 'Slot 02',
    teamAId: 'T-0003', // TITAN-X (E-JUST)
    teamBId: 'T-0022', // Buildx&GRNX (HORUS)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M12',
    nextMatchSlot: 'teamB',
    quarter: 'Q3'
  },
  {
    id: 'M04',
    code: 'M04',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 2',
    scheduledTime: '15:40',
    slot: 'Slot 02',
    teamAId: 'T-0008', // HTI Alsiddiq Robotics Team (HTI)
    teamBId: 'T-0002', // ZERO (E-JUST)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M15',
    nextMatchSlot: 'teamA',
    quarter: 'Q2'
  },

  // --- SLOT 03 (15:50) ---
  {
    id: 'M05',
    code: 'M05',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 1',
    scheduledTime: '15:50',
    slot: 'Slot 03',
    teamAId: 'T-0007', // Roxers (E-JUST)
    teamBId: 'T-0005', // GAME OF HORUS (ANU)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M11',
    nextMatchSlot: 'teamB',
    quarter: 'Q2'
  },
  {
    id: 'M06',
    code: 'M06',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 2',
    scheduledTime: '15:50',
    slot: 'Slot 03',
    teamAId: 'T-0014', // Spark cuc (CUC)
    teamBId: null, // Winner of M01
    sourceMatchB: 'M01',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M16',
    nextMatchSlot: 'teamA',
    quarter: 'Q3'
  },

  // --- SLOT 04 (16:00) ---
  {
    id: 'M07',
    code: 'M07',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 1',
    scheduledTime: '16:00',
    slot: 'Slot 04',
    teamAId: 'T-0009', // Alsiddiqe - Elite (HTI)
    teamBId: null, // Winner of M02
    sourceMatchB: 'M02',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M18',
    nextMatchSlot: 'teamA',
    quarter: 'Q4'
  },
  {
    id: 'M08',
    code: 'M08',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 2',
    scheduledTime: '16:00',
    slot: 'Slot 04',
    teamAId: 'T-0012', // FURIOUS (SCU)
    teamBId: 'T-0011', // هشيلك من عالارض (E-JUST)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M18',
    nextMatchSlot: 'teamB',
    quarter: 'Q4'
  },

  // --- SLOT 05 (16:10) ---
  {
    id: 'M09',
    code: 'M09',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 1',
    scheduledTime: '16:10',
    slot: 'Slot 05',
    teamAId: 'T-0016', // Raiden (CUC)
    teamBId: 'T-0015', // Robotica YAAO (ROBOTICA)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M13',
    nextMatchSlot: 'teamB',
    quarter: 'Q1'
  },
  {
    id: 'M10',
    code: 'M10',
    round: 'PLAY_IN',
    roundLabel: 'Play-In',
    arena: 'Arena 2',
    scheduledTime: '16:10',
    slot: 'Slot 05',
    teamAId: 'T-0019', // Mechapex Team (AIU)
    teamBId: 'T-0023', // Robotronics (TBC)
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M14',
    nextMatchSlot: 'teamB',
    quarter: 'Q1'
  },

  // --- SLOT 06 (16:20) ---
  {
    id: 'M11',
    code: 'M11',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 1',
    scheduledTime: '16:20',
    slot: 'Slot 06',
    teamAId: 'T-0020', // Nexus (CUC)
    teamBId: null, // Winner of M05
    sourceMatchB: 'M05',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M15',
    nextMatchSlot: 'teamB',
    quarter: 'Q2'
  },
  {
    id: 'M12',
    code: 'M12',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 2',
    scheduledTime: '16:20',
    slot: 'Slot 06',
    teamAId: 'T-0017', // الفرنجه (ZAGAZIG)
    teamBId: null, // Winner of M03
    sourceMatchB: 'M03',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M16',
    nextMatchSlot: 'teamB',
    quarter: 'Q3'
  },

  // --- SLOT 07 (16:30) ---
  {
    id: 'M13',
    code: 'M13',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 1',
    scheduledTime: '16:30',
    slot: 'Slot 07',
    teamAId: 'T-0006', // Ctrl Alt Defeat (E-JUST)
    teamBId: null, // Winner of M09
    sourceMatchB: 'M09',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M17',
    nextMatchSlot: 'teamA',
    quarter: 'Q1'
  },
  {
    id: 'M14',
    code: 'M14',
    round: 'R16',
    roundLabel: 'Round of 16',
    arena: 'Arena 2',
    scheduledTime: '16:30',
    slot: 'Slot 07',
    teamAId: 'T-0018', // RAID (E-JUST)
    teamBId: null, // Winner of M10
    sourceMatchB: 'M10',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M17',
    nextMatchSlot: 'teamB',
    quarter: 'Q1'
  },

  // --- SLOT 08 (16:40) - QUARTER-FINALS ---
  {
    id: 'M15',
    code: 'M15',
    round: 'QUARTER',
    roundLabel: 'Quarter-Final',
    arena: 'Arena 1',
    scheduledTime: '16:40',
    slot: 'Slot 08',
    teamAId: null, // Winner of M04
    teamBId: null, // Winner of M11
    sourceMatchA: 'M04',
    sourceMatchB: 'M11',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M19',
    nextMatchSlot: 'teamB',
    quarter: 'Q2'
  },
  {
    id: 'M16',
    code: 'M16',
    round: 'QUARTER',
    roundLabel: 'Quarter-Final',
    arena: 'Arena 2',
    scheduledTime: '16:40',
    slot: 'Slot 08',
    teamAId: null, // Winner of M06
    teamBId: null, // Winner of M12
    sourceMatchA: 'M06',
    sourceMatchB: 'M12',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M20',
    nextMatchSlot: 'teamA',
    quarter: 'Q3'
  },

  // --- SLOT 09 (16:50) - QUARTER-FINALS ---
  {
    id: 'M17',
    code: 'M17',
    round: 'QUARTER',
    roundLabel: 'Quarter-Final',
    arena: 'Arena 1',
    scheduledTime: '16:50',
    slot: 'Slot 09',
    teamAId: null, // Winner of M13
    teamBId: null, // Winner of M14
    sourceMatchA: 'M13',
    sourceMatchB: 'M14',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M19',
    nextMatchSlot: 'teamA',
    quarter: 'Q1'
  },
  {
    id: 'M18',
    code: 'M18',
    round: 'QUARTER',
    roundLabel: 'Quarter-Final',
    arena: 'Arena 2',
    scheduledTime: '16:50',
    slot: 'Slot 09',
    teamAId: null, // Winner of M07
    teamBId: null, // Winner of M08
    sourceMatchA: 'M07',
    sourceMatchB: 'M08',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M20',
    nextMatchSlot: 'teamB',
    quarter: 'Q4'
  },

  // --- SLOT 10 (17:00) - SEMI-FINALS ---
  {
    id: 'M19',
    code: 'M19',
    round: 'SEMI',
    roundLabel: 'Semi-Final',
    arena: 'Arena 1',
    scheduledTime: '17:00',
    slot: 'Slot 10',
    teamAId: null, // Winner of M17
    teamBId: null, // Winner of M15
    sourceMatchA: 'M17',
    sourceMatchB: 'M15',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    loserId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M22', // The Final
    nextMatchSlot: 'teamA',
    consolationMatchId: 'M21', // 3rd Place Match
    consolationSlot: 'teamA',
    isB2B: true
  },
  {
    id: 'M20',
    code: 'M20',
    round: 'SEMI',
    roundLabel: 'Semi-Final',
    arena: 'Arena 2',
    scheduledTime: '17:00',
    slot: 'Slot 10',
    teamAId: null, // Winner of M16
    teamBId: null, // Winner of M18
    sourceMatchA: 'M16',
    sourceMatchB: 'M18',
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    loserId: null,
    status: 'SCHEDULED',
    nextMatchId: 'M22', // The Final
    nextMatchSlot: 'teamB',
    consolationMatchId: 'M21', // 3rd Place Match
    consolationSlot: 'teamB',
    isB2B: true
  },

  // --- SLOT 11 (17:10): ARENA FREE THIS SLOT (10-min Rest Buffer before Finals) ---

  // --- SLOT 12 (17:20) - FINALS & 3RD PLACE ---
  {
    id: 'M21',
    code: 'M21',
    round: 'THIRD_PLACE',
    roundLabel: '3rd-Place Match',
    arena: 'Arena 2',
    scheduledTime: '17:20',
    slot: 'Slot 12',
    teamAId: null, // Loser of M19
    teamBId: null, // Loser of M20
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    notes: 'Arena 2 hosts the 3rd-place match'
  },
  {
    id: 'M22',
    code: 'M22',
    round: 'FINAL',
    roundLabel: 'The Final',
    arena: 'Arena 1',
    scheduledTime: '17:20',
    slot: 'Slot 12',
    teamAId: null, // Winner of M19
    teamBId: null, // Winner of M20
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    status: 'SCHEDULED',
    notes: 'Arena 1 main arena hosts the championship final'
  }
];

// Special Prizes (Section 14 of Handbook) — 100 Points Total, Evaluated by 3 Independent Judges
export const SPECIAL_PRIZES = [
  {
    id: 'SP-1',
    title: 'Best Mechanical Design',
    maxPoints: 25,
    rubric: 'Overall mechanical engineering, chassis structure, weight distribution, stability, traction, and efficient use of dimensions/materials. Judged through physical design.'
  },
  {
    id: 'SP-2',
    title: 'Most Competitive Robot',
    maxPoints: 25,
    rubric: 'Strongest fighting performance: aggressive engagement, pushing power, recovery from difficult positions, and consistent operation based on match evidence.'
  },
  {
    id: 'SP-3',
    title: 'Best Engineering Innovation',
    maxPoints: 25,
    rubric: 'Clever, original technical solution in mechanical design, sensing, control, electronics, or integration. Prioritizes usefulness and execution over complexity.'
  },
  {
    id: 'SP-4',
    title: 'Sportsmanship Award',
    maxPoints: 25,
    rubric: 'Respect toward opponents, referees, and organizers, adhering to rules with a positive attitude in victory and defeat.'
  }
];

export const DEFAULT_JUDGES = [
  { id: 'J1', name: 'Lead Judge 1 (Mechanical Engineering)' },
  { id: 'J2', name: 'Lead Judge 2 (Control & Electronics)' },
  { id: 'J3', name: 'Lead Judge 3 (Rules & Sportsmanship)' }
];

export const WIN_CONDITIONS = [
  { id: 'OUT_FORCED', code: 'YUKO-1', label: 'Opponent Legally Forced Out of Dohyo', ref: 'Handbook §9.1' },
  { id: 'OUT_UNFORCED', code: 'YUKO-2', label: 'Opponent Touched Outside Dohyo Unforced (Drove or Fell Out)', ref: 'Handbook §9.1' },
  { id: 'WHEEL_OFF_3S', code: 'YUKO-3', label: 'Opponent Wheel Over Edge (Referee Count of 3 Seconds Expired)', ref: 'Handbook §9.1' },
  { id: 'SELF_DAMAGED', code: 'YUKO-4', label: 'Opponent Damaged by Itself / Forfeit Announced by Team', ref: 'Handbook §9.1' },
  { id: 'BOTTLE_TIME', code: 'YUKO-5', label: 'Won via Bottle Tiebreaker Challenge (Shortest Elapsed Time)', ref: 'Handbook §10.2' },
  { id: 'LATENESS_WALKOVER', code: 'WALKOVER', label: 'Opponent Did Not Arrive Within 5 Minutes of Call', ref: 'Handbook §3.2' },
  { id: 'DISQUALIFIED', code: 'HANSOKU', label: 'Opponent Disqualified (Prohibited Device / Safety Stoppage)', ref: 'Handbook §4 / §12' }
];
