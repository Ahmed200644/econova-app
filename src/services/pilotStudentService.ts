/**
 * pilotStudentService.ts
 *
 * Handles student registration and loading using device ID as the
 * persistent identifier. No passwords, no OAuth — suitable for a
 * 5-10 student controlled pilot.
 */
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase, DbStudent } from './supabaseClient';
import { UserProfile } from '../types';
import { calculateLevelInfo } from './pointsService';

// ── Device ID ────────────────────────────────────────────────

/**
 * Returns a stable device identifier.
 * Android: androidId (persists across app installs unless factory reset).
 * iOS: uses identifierForVendor.
 * Falls back to a combination of device model + OS for simulators.
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    if (Platform.OS === 'android') {
      const id = await Application.getAndroidId();
      if (id) return `android_${id}`;
    }
    if (Platform.OS === 'ios') {
      const id = await Application.getIosIdForVendorAsync();
      if (id) return `ios_${id}`;
    }
    // Simulator / web fallback
    const model = Device.modelName ?? 'unknown';
    const os = Platform.OS;
    const osVersion = Device.osVersion ?? '0';
    return `dev_${os}_${model}_${osVersion}`.replace(/\s+/g, '_');
  } catch (e) {
    return `fallback_${Date.now()}`;
  }
};

// ── DB → App type mapper ─────────────────────────────────────

export const dbStudentToProfile = (
  db: DbStudent,
  totalPoints: number,
  totalKgRecycled: number,
  totalCo2eAvoidedKg: number,
  totalActionsCount: number
): UserProfile => {
  const levelInfo = calculateLevelInfo(totalPoints);
  return {
    id: db.id,
    name: db.name,
    email: '',
    university: db.university,
    faculty: db.faculty,
    academicYear: db.academic_year,
    avatarInitial: db.name ? db.name.charAt(0).toUpperCase() : '?',
    greenPointsBalance: totalPoints,
    level: levelInfo.level,
    levelName: levelInfo.levelName,
    pointsToNextLevel: levelInfo.pointsToNextLevel,
    nextLevelThreshold: levelInfo.nextLevelThreshold,
    currentLevelProgressPct: levelInfo.currentLevelProgressPct,
    totalKgRecycled,
    totalActionsCount,
    totalCo2eAvoidedKg,
    isProfileComplete: Boolean(db.name && db.university && db.faculty),
  };
};

// ── Load student ─────────────────────────────────────────────

export interface LoadStudentResult {
  student: DbStudent | null;
  totalPoints: number;
  totalKgRecycled: number;
  totalCo2eKg: number;
  totalActions: number;
}

export const loadStudentByDeviceId = async (
  deviceId: string
): Promise<LoadStudentResult> => {
  // Fetch student row
  const { data: student, error: sErr } = await supabase
    .from('students')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (sErr) {
    console.error('[pilotStudentService] loadStudent error:', sErr.message);
    return { student: null, totalPoints: 0, totalKgRecycled: 0, totalCo2eKg: 0, totalActions: 0 };
  }

  if (!student) {
    return { student: null, totalPoints: 0, totalKgRecycled: 0, totalCo2eKg: 0, totalActions: 0 };
  }

  // Fetch aggregated stats from the student_points view
  const { data: pts } = await supabase
    .from('student_points')
    .select('total_points, total_kg_recycled, total_co2e_kg, total_actions')
    .eq('student_id', student.id)
    .maybeSingle();

  return {
    student,
    totalPoints: pts?.total_points ?? 0,
    totalKgRecycled: pts?.total_kg_recycled ?? 0,
    totalCo2eKg: pts?.total_co2e_kg ?? 0,
    totalActions: pts?.total_actions ?? 0,
  };
};

// ── Register / update student ────────────────────────────────

export const upsertStudent = async (params: {
  deviceId: string;
  name: string;
  university: string;
  faculty: string;
  academicYear: string;
}): Promise<DbStudent | null> => {
  const { data, error } = await supabase
    .from('students')
    .upsert(
      {
        device_id: params.deviceId,
        name: params.name,
        university: params.university,
        faculty: params.faculty,
        academic_year: params.academicYear,
      },
      { onConflict: 'device_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('[pilotStudentService] upsertStudent error:', error.message);
    return null;
  }

  return data as DbStudent;
};
