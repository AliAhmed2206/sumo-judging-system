// Cloud Realtime State Synchronizer for Sumo Competition
// Enables instant live sync across referee deck and spectator devices worldwide

const DEFAULT_SYNC_URL = 'https://kvdb.io/4cR4WT9tG8R6LjTMaf9zAp/tournament_state';
const ROLE_STORAGE_KEY = 'sumo_user_role_ejust';

export const UserRole = {
  JUDGE: 'JUDGE',
  SPECTATOR: 'SPECTATOR'
};

export const getStoredUserRole = () => {
  // Check URL param first (e.g. ?role=judge)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'judge' || params.get('admin') === 'true') {
      localStorage.setItem(ROLE_STORAGE_KEY, UserRole.JUDGE);
      return UserRole.JUDGE;
    }
  } catch {}

  const saved = localStorage.getItem(ROLE_STORAGE_KEY);
  return saved === UserRole.JUDGE ? UserRole.JUDGE : UserRole.SPECTATOR;
};

export const setStoredUserRole = (role) => {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {}
};

// Fetch latest tournament state from cloud
export async function fetchRemoteState(url = DEFAULT_SYNC_URL) {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.teams && data.matches) {
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
      lastSyncedAt: new Date().toISOString()
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
