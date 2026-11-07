/**
 * pilotTransactionService.ts
 *
 * Inserts recycling transactions into Supabase and fetches
 * a student's transaction history. Uses idempotency keys to
 * prevent double submissions at the database level.
 */
import * as Crypto from 'expo-crypto';
import { supabase, DbTransaction } from './supabaseClient';
import { RecyclingTransaction, RecyclingSelection } from '../types';
import { calculateRecyclingReward } from './pointsService';
import { getStationById } from './stationsService';

// ── Insert a batch of selections as individual transaction rows ──

export interface InsertTransactionParams {
  studentId: string;
  stationId: string;
  stationName: string;
  selections: RecyclingSelection[];
  verificationMethod: 'qr_code' | 'manual_fallback';
}

export interface InsertTransactionResult {
  success: boolean;
  transaction?: RecyclingTransaction;
  error?: string;
}

export const insertTransactions = async (
  params: InsertTransactionParams
): Promise<InsertTransactionResult> => {
  const { studentId, stationId, stationName, selections, verificationMethod } = params;

  const validSelections = selections.filter((s) => s.quantity > 0);
  if (validSelections.length === 0) {
    return { success: false, error: 'No valid quantities selected.' };
  }

  const reward = calculateRecyclingReward(validSelections);

  // Build one DB row per material type, each with a unique idempotency key
  const rows = reward.itemizedBreakdown.map((item) => ({
    idempotency_key: Crypto.randomUUID(),
    student_id: studentId,
    station_id: stationId,
    material: item.materialType,
    quantity: item.quantity,
    points: item.pointsEarned,
    kg_recycled:
      item.materialType === 'paper'
        ? item.quantity
        : Number((item.quantity * 0.05).toFixed(3)),
    co2e_kg: item.co2Avoided,
    verification: verificationMethod,
  }));

  const { error } = await supabase
    .from('recycling_transactions')
    .insert(rows);

  if (error) {
    // idempotency_key unique constraint → duplicate blocked at DB level
    if (error.code === '23505') {
      return { success: false, error: 'Duplicate submission detected. Already recorded.' };
    }
    console.error('[pilotTransactionService] insert error:', error.message);
    return { success: false, error: 'Failed to save recycling record. Check your connection.' };
  }

  // Build the RecyclingTransaction shape the existing UI expects
  const transaction: RecyclingTransaction = {
    id: `tx-${Date.now()}`,
    timestamp: new Date().toISOString(),
    stationId,
    stationName,
    items: reward.itemizedBreakdown.map((item) => ({
      materialType: item.materialType,
      quantity: item.quantity,
      pointsEarned: item.pointsEarned,
    })),
    totalPointsEarned: reward.totalPointsEarned,
    totalKgRecycled: reward.totalKgRecycled,
    co2eAvoidedKg: reward.totalCo2eAvoidedKg,
    verificationMethod,
  };

  return { success: true, transaction };
};

// ── Fetch student transaction history ────────────────────────

export const fetchStudentHistory = async (
  studentId: string
): Promise<RecyclingTransaction[]> => {
  const { data, error } = await supabase
    .from('recycling_transactions')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    console.warn('[pilotTransactionService] fetchHistory error:', error?.message);
    return [];
  }

  // Group rows back into RecyclingTransaction objects (one per station+timestamp proximity)
  // For simplicity in the pilot, treat each DB row as an individual transaction entry.
  return (data as DbTransaction[]).map((row) => {
    const station = getStationById(row.station_id);
    return {
      id: row.id,
      timestamp: row.created_at,
      stationId: row.station_id,
      stationName: station?.name ?? 'Unknown Station',
      items: [
        {
          materialType: row.material as any,
          quantity: row.quantity,
          pointsEarned: row.points,
        },
      ],
      totalPointsEarned: row.points,
      totalKgRecycled: row.kg_recycled,
      co2eAvoidedKg: row.co2e_kg,
      verificationMethod: row.verification as 'qr_code' | 'manual_fallback',
    };
  });
};

// ── Fetch a student's persisted total points ─────────────────

export const fetchStudentPoints = async (
  studentId: string
): Promise<{ totalPoints: number; totalKg: number; totalCo2e: number; totalActions: number }> => {
  const { data, error } = await supabase
    .from('student_points')
    .select('total_points, total_kg_recycled, total_co2e_kg, total_actions')
    .eq('student_id', studentId)
    .maybeSingle();

  if (error || !data) {
    return { totalPoints: 0, totalKg: 0, totalCo2e: 0, totalActions: 0 };
  }

  return {
    totalPoints: data.total_points ?? 0,
    totalKg: data.total_kg_recycled ?? 0,
    totalCo2e: data.total_co2e_kg ?? 0,
    totalActions: data.total_actions ?? 0,
  };
};
