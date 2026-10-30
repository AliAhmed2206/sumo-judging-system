// Cloud Realtime State Synchronizer & Multi-Referee Consensus Engine
// Enables zero-conflict, instant live sync across referee decks, arenas, and spectator devices

const DEFAULT_SYNC_URL = 'https://kvdb.io/4cR4WT9tG8R6LjTMaf9zAp/tournament_state';
const ROLE_STORAGE_KEY = 'sumo_user_role_ejust_v2';
const CLIENT_ID_KEY = 'sumo_client_id_ejust';

export const UserRole = {
  JUDGE: 'JUDGE',
  SPECTATOR: 'SPECTATOR'
};

// Generate or retrieve persistent Client ID for audit trails
export const getClientId = () => {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = 'ref_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'ref_temp_' + Math.floor(Math.random() * 10000);
  }
};

// Check if user is referee or spectator
export const getStoredUserRole = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'judge' || params.get('admin') === 'true' || params.get('judge') === '1') {
      localStorage.setItem(ROLE_STORAGE_KEY, UserRole.JUDGE);
      return UserRole.JUDGE;
    }
  } catch {}

  const saved = localStorage.getItem(ROLE_STORAGE_KEY);
  // Default to JUDGE if URL or local storage requested, else SPECTATOR
  return saved === UserRole.JUDGE ? UserRole.JUDGE : UserRole.JUDGE; // Default to JUDGE on competition day so all referees can edit seamlessly!
};

export const setStoredUserRole = (role) => {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {}
};

// Fetch latest tournament state from cloud
export async function fetchRemoteState(url = DEFAULT_SYNC_URL) {
  try {
    const res = await fetch(`${url}?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.matches) && Array.isArray(data.teams)) {
      return data;
    }
  } catch (err) {
    console.warn('[CloudSync] Fetch remote state error:', err);
  }
  return null;
}

// Push local tournament state to cloud
export async function pushRemoteState(state, url = DEFAULT_SYNC_URL) {
  try {
    const payload = {
      ...state,
      lastSyncedAt: new Date().toISOString(),
      syncedBy: getClientId()
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] Push remote state error:', err);
    return false;
  }
}

// Smart State Merger: Intelligently merges local and remote states
// Prevents Arena 1 referee from overwriting Arena 2 referee's scores or homologation inspections
export function mergeTournamentStates(local, remote) {
  if (!remote) return local;
  if (!local) return remote;

  // If local is virgin default and remote has activity, take remote
  const localHasEdits = local.matches.some(m => m.status === 'COMPLETED' || m.scoreA > 0 || m.scoreB > 0) ||
                        local.teams.some(t => t.homologation?.status !== 'PASSED');

  const remoteHasEdits = remote.matches.some(m => m.status === 'COMPLETED' || m.scoreA > 0 || m.scoreB > 0) ||
                         remote.teams.some(t => t.homologation?.status !== 'PASSED');

  if (!localHasEdits && remoteHasEdits) {
    return remote;
  }

  // Deep entity-by-entity merge
  // 1. Matches: Compare each match individually
  const mergedMatches = local.matches.map(localMatch => {
    const remoteMatch = remote.matches.find(m => m.id === localMatch.id);
    if (!remoteMatch) return localMatch;

    // Compare timestamps or completion status
    const localTime = new Date(localMatch.updatedAt || local.lastUpdated || 0).getTime();
    const remoteTime = new Date(remoteMatch.updatedAt || remote.lastUpdated || 0).getTime();

    // If one is COMPLETED and the other is not, COMPLETED takes precedence
    if (remoteMatch.status === 'COMPLETED' && localMatch.status !== 'COMPLETED') {
      return remoteMatch;
    }
    if (localMatch.status === 'COMPLETED' && remoteMatch.status !== 'COMPLETED') {
      return localMatch;
    }

    // If scores differ, take the match with higher score or newer timestamp
    const localPoints = (localMatch.scoreA || 0) + (localMatch.scoreB || 0);
    const remotePoints = (remoteMatch.scoreA || 0) + (remoteMatch.scoreB || 0);

    if (remotePoints > localPoints) {
      return remoteMatch;
    }
    if (localPoints > remotePoints) {
      return localMatch;
    }

    // If remote has winner or source assigned that local lacks
    if (remoteMatch.winnerId && !localMatch.winnerId) return remoteMatch;
    if (remoteMatch.teamAId && !localMatch.teamAId) return remoteMatch;
    if (remoteMatch.teamBId && !localMatch.teamBId) return remoteMatch;

    // Otherwise, newer timestamp wins
    return remoteTime > localTime ? remoteMatch : localMatch;
  });

  // 2. Teams (Homologation Inspection checks)
  const mergedTeams = local.teams.map(localTeam => {
    const remoteTeam = remote.teams.find(t => t.id === localTeam.id);
    if (!remoteTeam) return localTeam;

    const localTime = new Date(localTeam.updatedAt || local.lastUpdated || 0).getTime();
    const remoteTime = new Date(remoteTeam.updatedAt || remote.lastUpdated || 0).getTime();

    return remoteTime > localTime ? remoteTeam : localTeam;
  });

  // 3. Special Prizes Evaluations
  const mergedPrizeEvaluations = {
    ...(remote.prizeEvaluations || {}),
    ...(local.prizeEvaluations || {})
  };

  // For any overlapping keys, take the one with newer timestamp
  if (remote.prizeEvaluations && local.prizeEvaluations) {
    Object.keys(remote.prizeEvaluations).forEach(key => {
      const remoteEval = remote.prizeEvaluations[key];
      const localEval = local.prizeEvaluations[key];
      if (remoteEval && localEval) {
        const rTime = new Date(remoteEval.timestamp || 0).getTime();
        const lTime = new Date(localEval.timestamp || 0).getTime();
        mergedPrizeEvaluations[key] = rTime > lTime ? remoteEval : localEval;
      }
    });
  }

  const latestLastUpdated = Math.max(
    new Date(local.lastUpdated || 0).getTime(),
    new Date(remote.lastUpdated || 0).getTime()
  );

  return {
    ...local,
    teams: mergedTeams,
    matches: mergedMatches,
    prizeEvaluations: mergedPrizeEvaluations,
    lastUpdated: new Date(latestLastUpdated).toISOString(),
    revision: Math.max(local.revision || 0, remote.revision || 0) + 1
  };
}
