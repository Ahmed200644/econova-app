/**
 * pilotStationService.ts
 *
 * Fetches station data from Supabase instead of the hardcoded
 * MOCK_STATIONS array. Used by both the QR scanner and manual
 * code entry paths.
 */
import { supabase, DbStation } from './supabaseClient';
import { Station, MaterialType } from '../types';
import { MOCK_STATIONS } from './stationsService'; // offline fallback

// ── DB → App type mapper ─────────────────────────────────────

export const dbStationToStation = (db: DbStation): Station => ({
  id: db.id,
  name: db.name,
  code: db.code,
  distanceMeters: 0,              // not stored in pilot DB — set 0
  status: db.active ? 'open' : 'closed',
  locationName: db.location,
  acceptedMaterials: db.accepted_materials as MaterialType[],
  isAvailable: db.active,
});

// ── Lookup by code ───────────────────────────────────────────

/**
 * Look up a station by its QR/manual code (e.g. "ST-101").
 * Case-insensitive. Returns null if not found or inactive.
 *
 * Falls back to MOCK_STATIONS if Supabase is unreachable (offline pilot).
 */
export const getStationByCodeRemote = async (
  code: string
): Promise<Station | null> => {
  const normalized = code.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .ilike('code', normalized)
      .eq('active', true)
      .maybeSingle();

    if (error) {
      console.warn('[pilotStationService] Supabase error:', error.message);
      return offlineFallback(normalized);
    }

    if (!data) return null;
    return dbStationToStation(data as DbStation);
  } catch (e) {
    console.warn('[pilotStationService] Network error, using offline fallback');
    return offlineFallback(normalized);
  }
};

/**
 * Fetch all active stations (for the Nearby Stations list).
 */
export const getAllActiveStations = async (): Promise<Station[]> => {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .eq('active', true)
      .order('code');

    if (error || !data) {
      console.warn('[pilotStationService] getAllActiveStations error:', error?.message);
      return MOCK_STATIONS;
    }

    return (data as DbStation[]).map(dbStationToStation);
  } catch {
    return MOCK_STATIONS;
  }
};

// ── Offline fallback ─────────────────────────────────────────

const offlineFallback = (normalizedCode: string): Station | null => {
  const found = MOCK_STATIONS.find(
    (s) => s.code.toUpperCase() === normalizedCode
  );
  return found ?? null;
};
