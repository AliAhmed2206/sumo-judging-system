// Cloud Realtime State Synchronizer & Multi-Referee Consensus Engine
// Unifies all referees, arenas, and spectator devices into ONE single live authoritative tournament system

const DEFAULT_SYNC_URL = 'https://kvdb.io/4cR4WT9tG8R6LjTMaf9zAp/tournament_state';
const ROLE_STORAGE_KEY = 'sumo_user_role_ejust_v3';
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
    if (params.get('role') === 'spectator' || params.get('view') === '1') {
      localStorage.setItem(ROLE_STORAGE_KEY, UserRole.SPECTATOR);
      return UserRole.SPECTATOR;
    }
  } catch {}

  const saved = localStorage.getItem(ROLE_STORAGE_KEY);
  // Default to JUDGE so all referee devices have editing enabled by default
  return saved === UserRole.SPECTATOR ? UserRole.SPECTATOR : UserRole.JUDGE;
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

// Single Source of Truth Consensus Merger
// Guarantees all devices synchronize onto the exact same live ledger
export function mergeTournamentStates(local, remote, lastLocalEditTimestamp = 0) {
  if (!remote) return local;
  if (!local) return remote;

  const now = Date.now();
  const hasRecentPendingLocalEdit = (now - lastLocalEditTimestamp) < 3000;

  // Normal case: Device has no pending unpushed local click in the last 3s.
  // The cloud is the 100% authoritative truth!
  if (!hasRecentPendingLocalEdit) {
    return remote;
  }

  // Rare case: user tapped a score or homologation button within the last 3s
  // and a background poll ticked before the push completed.
  // Overlay only the freshly edited local entity on top of remote, bump revision, and return.
  const mergedMatches = remote.matches.map(rm => {
    const lm = local.matches.find(m => m.id === rm.id);
    if (!lm) return rm;
    if (lm.updatedAt && (now - new Date(lm.updatedAt).getTime()) < 3000) {
      return lm;
    }
    return rm;
  });

  const mergedTeams = remote.teams.map(rt => {
    const lt = local.teams.find(t => t.id === rt.id);
    if (!lt) return rt;
    if (lt.updatedAt && (now - new Date(lt.updatedAt).getTime()) < 3000) {
      return lt;
    }
    return rt;
  });

  return {
    ...remote,
    matches: mergedMatches,
    teams: mergedTeams,
    prizeEvaluations: {
      ...(remote.prizeEvaluations || {}),
      ...(local.prizeEvaluations || {})
    },
    revision: Math.max(local.revision || 0, remote.revision || 0) + 1,
    lastUpdated: new Date().toISOString(),
    lastEditor: getClientId()
  };
}
