/**
 * pilotLeaderboardService.ts
 *
 * Fetches real leaderboard data from the student_points view in
 * Supabase. Returns LeaderboardEntry and FacultyLeaderboardEntry
 * shapes that the existing LeaderboardScreen expects.
 */
import { supabase, DbStudentPoints } from './supabaseClient';
import { FacultyLeaderboardEntry, LeaderboardEntry } from '../types';

// ── Student leaderboard ──────────────────────────────────────

export const fetchStudentLeaderboard = async (
  currentStudentId?: string
): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('student_points')
    .select('*')
    .order('total_points', { ascending: false })
    .limit(20);

  if (error || !data) {
    console.warn('[pilotLeaderboardService] fetchStudentLeaderboard error:', error?.message);
    return [];
  }

  return (data as DbStudentPoints[]).map((row, idx) => ({
    rank: idx + 1,
    id: row.student_id,
    name: row.name || 'Pilot Student',
    faculty: row.faculty || '',
    avatarInitial: row.name ? row.name.charAt(0).toUpperCase() : '?',
    greenPoints: row.total_points,
    isCurrentUser: row.student_id === currentStudentId,
    trend: 'same' as const,
  }));
};

// ── Faculty leaderboard ──────────────────────────────────────

export const fetchFacultyLeaderboard = async (): Promise<FacultyLeaderboardEntry[]> => {
  // Aggregate by faculty from the student_points view
  const { data, error } = await supabase
    .from('student_points')
    .select('faculty, total_points, student_id');

  if (error || !data) {
    console.warn('[pilotLeaderboardService] fetchFacultyLeaderboard error:', error?.message);
    return [];
  }

  // Group by faculty in JS
  const facultyMap = new Map<
    string,
    { totalPoints: number; activeStudents: number }
  >();

  for (const row of data as { faculty: string; total_points: number; student_id: string }[]) {
    const faculty = row.faculty || 'Unknown Faculty';
    const existing = facultyMap.get(faculty) ?? { totalPoints: 0, activeStudents: 0 };
    facultyMap.set(faculty, {
      totalPoints: existing.totalPoints + (row.total_points ?? 0),
      activeStudents: existing.activeStudents + (row.total_points > 0 ? 1 : 0),
    });
  }

  const entries: FacultyLeaderboardEntry[] = Array.from(facultyMap.entries())
    .map(([facultyName, stats]) => ({
      rank: 0, // assigned below
      facultyName,
      totalPoints: stats.totalPoints,
      activeStudents: stats.activeStudents,
      avatarInitial: facultyName.charAt(0).toUpperCase(),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return entries;
};
