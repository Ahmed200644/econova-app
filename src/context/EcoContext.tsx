import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AchievementBadge,
  Challenge,
  FacultyLeaderboardEntry,
  LeaderboardEntry,
  RecyclingSelection,
  RecyclingTransaction,
  RewardItem,
  Station,
  UserProfile,
  UserReward,
} from '../types';
import { MOCK_STATIONS } from '../services/stationsService';
import { calculateLevelInfo } from '../services/pointsService';
import { MOCK_CHALLENGES } from '../services/challengesService';
import {
  INITIAL_USER_REWARDS,
  MOCK_REWARDS_CATALOG,
} from '../services/rewardsService';
import { getCalculatedAchievements } from '../services/achievementsService';
import {
  MOCK_FACULTY_LEADERBOARD,
  MOCK_STUDENT_LEADERBOARD,
} from '../services/leaderboardService';

// ── Pilot services ───────────────────────────────────────────
import {
  getDeviceId,
  loadStudentByDeviceId,
  upsertStudent,
  dbStudentToProfile,
} from '../services/pilotStudentService';
import { getAllActiveStations } from '../services/pilotStationService';
import {
  insertTransactions,
  fetchStudentHistory,
  fetchStudentPoints,
} from '../services/pilotTransactionService';
import {
  fetchStudentLeaderboard,
  fetchFacultyLeaderboard,
} from '../services/pilotLeaderboardService';

// ── Context type ─────────────────────────────────────────────

interface EcoContextType {
  user: UserProfile;
  stations: Station[];
  history: RecyclingTransaction[];
  activeStation: Station | null;
  setActiveStation: (station: Station | null) => void;
  isLoadingProfile: boolean;
  updateUniversitySetup: (
    university: string,
    faculty: string,
    academicYear: string,
    name?: string
  ) => Promise<void>;
  submitRecycling: (
    stationId: string,
    stationName: string,
    selections: RecyclingSelection[],
    verificationMethod: 'qr_code' | 'manual_fallback'
  ) => Promise<{ success: boolean; transaction?: RecyclingTransaction; error?: string }>;
  isSubmitting: boolean;

  // Gamification state
  challenges: Challenge[];
  joinChallenge: (challengeId: string) => void;
  studentLeaderboard: LeaderboardEntry[];
  facultyLeaderboard: FacultyLeaderboardEntry[];
  achievements: AchievementBadge[];
  rewardsCatalog: RewardItem[];
  userRewards: UserReward[];
  redeemReward: (
    rewardId: string
  ) => Promise<{ success: boolean; reward?: UserReward; error?: string }>;
  markRewardAsUsed: (userRewardId: string) => void;
}

// ── Offline/loading placeholder user ────────────────────────

const LOADING_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  university: '',
  faculty: '',
  academicYear: '',
  avatarInitial: '?',
  greenPointsBalance: 0,
  level: 1,
  levelName: 'Eco Starter',
  pointsToNextLevel: 200,
  nextLevelThreshold: 200,
  currentLevelProgressPct: 0,
  totalKgRecycled: 0,
  totalActionsCount: 0,
  totalCo2eAvoidedKg: 0,
  isProfileComplete: false,
};

// ── Context ──────────────────────────────────────────────────

const EcoContext = createContext<EcoContextType | undefined>(undefined);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(LOADING_USER);
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [history, setHistory] = useState<RecyclingTransaction[]>([]);
  const [activeStation, setActiveStation] = useState<Station | null>(MOCK_STATIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Gamification — local for pilot
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [studentLeaderboard, setStudentLeaderboard] = useState<LeaderboardEntry[]>(
    MOCK_STUDENT_LEADERBOARD
  );
  const [facultyLeaderboard, setFacultyLeaderboard] = useState<FacultyLeaderboardEntry[]>(
    MOCK_FACULTY_LEADERBOARD
  );
  const [rewardsCatalog] = useState<RewardItem[]>(MOCK_REWARDS_CATALOG);
  const [userRewards, setUserRewards] = useState<UserReward[]>(INITIAL_USER_REWARDS);

  // Hold device ID in a ref so it's always accessible in callbacks
  const deviceIdRef = useRef<string>('');
  const studentDbIdRef = useRef<string>('');

  // Derived achievements
  const achievements = getCalculatedAchievements(user, history);

  // ── Bootstrap: load student + stations from Supabase on mount ──

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoadingProfile(true);

      // 1. Get stable device ID
      const deviceId = await getDeviceId();
      deviceIdRef.current = deviceId;

      // 2. Load student from Supabase (or stay on LOADING_USER if new device)
      const result = await loadStudentByDeviceId(deviceId);
      if (!cancelled && result.student) {
        studentDbIdRef.current = result.student.id;
        const profile = dbStudentToProfile(
          result.student,
          result.totalPoints,
          result.totalKgRecycled,
          result.totalCo2eKg,
          result.totalActions
        );
        setUser({ ...profile, deviceId });

        // 3. Load persisted transaction history
        const txHistory = await fetchStudentHistory(result.student.id);
        if (!cancelled) setHistory(txHistory);
      }

      // 4. Load real stations from Supabase
      const liveStations = await getAllActiveStations();
      if (!cancelled && liveStations.length > 0) {
        setStations(liveStations);
        setActiveStation(liveStations[0]);
      }

      // 5. Load real leaderboard
      const lb = await fetchStudentLeaderboard(studentDbIdRef.current || undefined);
      if (!cancelled && lb.length > 0) setStudentLeaderboard(lb);

      const flb = await fetchFacultyLeaderboard();
      if (!cancelled && flb.length > 0) setFacultyLeaderboard(flb);

      if (!cancelled) setIsLoadingProfile(false);
    };

    bootstrap();
    return () => { cancelled = true; };
  }, []);

  // ── Update / save profile ────────────────────────────────────

  const updateUniversitySetup = async (
    university: string,
    faculty: string,
    academicYear: string,
    name?: string
  ): Promise<void> => {
    const updatedName = name || user.name;
    const deviceId = deviceIdRef.current || (await getDeviceId());
    deviceIdRef.current = deviceId;

    // Persist to Supabase
    const saved = await upsertStudent({
      deviceId,
      name: updatedName,
      university,
      faculty,
      academicYear,
    });

    if (saved) {
      studentDbIdRef.current = saved.id;
    }

    // Update local state immediately (optimistic)
    setUser((prev) => ({
      ...prev,
      name: updatedName,
      university,
      faculty,
      academicYear,
      avatarInitial: updatedName.charAt(0).toUpperCase(),
      isProfileComplete: true,
      deviceId,
    }));

    // Refresh leaderboard with new student in it
    const lb = await fetchStudentLeaderboard(studentDbIdRef.current || undefined);
    if (lb.length > 0) setStudentLeaderboard(lb);
  };

  // ── Submit recycling ─────────────────────────────────────────

  const submitRecycling = async (
    stationId: string,
    stationName: string,
    selections: RecyclingSelection[],
    verificationMethod: 'qr_code' | 'manual_fallback'
  ) => {
    if (isSubmitting) {
      return { success: false, error: 'A submission is currently being processed.' };
    }

    // Require a persisted student record
    if (!studentDbIdRef.current) {
      return { success: false, error: 'Please complete your profile setup first.' };
    }

    setIsSubmitting(true);
    try {
      // Insert into Supabase with idempotency key
      const res = await insertTransactions({
        studentId: studentDbIdRef.current,
        stationId,
        stationName,
        selections,
        verificationMethod,
      });

      if (!res.success || !res.transaction) {
        return { success: false, error: res.error };
      }

      const tx = { ...res.transaction, studentId: studentDbIdRef.current };

      // Re-fetch totals from DB (source of truth — avoids desync)
      const pts = await fetchStudentPoints(studentDbIdRef.current);
      const levelInfo = calculateLevelInfo(pts.totalPoints);

      setUser((prev) => ({
        ...prev,
        greenPointsBalance: pts.totalPoints,
        totalKgRecycled: Number(pts.totalKg.toFixed(2)),
        totalActionsCount: pts.totalActions,
        totalCo2eAvoidedKg: Number(pts.totalCo2e.toFixed(2)),
        level: levelInfo.level,
        levelName: levelInfo.levelName,
        pointsToNextLevel: levelInfo.pointsToNextLevel,
        nextLevelThreshold: levelInfo.nextLevelThreshold,
        currentLevelProgressPct: levelInfo.currentLevelProgressPct,
      }));

      // Prepend to local history cache
      setHistory((prev) => [tx, ...prev]);

      // Refresh real leaderboard from DB
      const lb = await fetchStudentLeaderboard(studentDbIdRef.current);
      if (lb.length > 0) setStudentLeaderboard(lb);

      const flb = await fetchFacultyLeaderboard();
      if (flb.length > 0) setFacultyLeaderboard(flb);

      // Advance joined challenges
      setChallenges((prev) =>
        prev.map((ch) => {
          if (!ch.isJoined || ch.isCompleted) return ch;
          const newCount = ch.currentCount + 1;
          const newPct = Math.min(100, Math.round((newCount / ch.targetCount) * 100));
          return { ...ch, currentCount: newCount, progressPct: newPct, isCompleted: newCount >= ch.targetCount };
        })
      );

      return { success: true, transaction: tx };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Gamification — local ─────────────────────────────────────

  const joinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch.id === challengeId ? { ...ch, isJoined: true } : ch))
    );
  };

  const redeemReward = async (rewardId: string) => {
    const rwd = rewardsCatalog.find((r) => r.id === rewardId);
    if (!rwd) return { success: false, error: 'Reward item not found.' };

    if (user.greenPointsBalance < rwd.pointsCost) {
      return {
        success: false,
        error: `Insufficient Green Points. You need ${rwd.pointsCost - user.greenPointsBalance} more points.`,
      };
    }

    const newBalance = user.greenPointsBalance - rwd.pointsCost;
    const levelInfo = calculateLevelInfo(newBalance);

    setUser((prev) => ({
      ...prev,
      greenPointsBalance: newBalance,
      level: levelInfo.level,
      levelName: levelInfo.levelName,
      pointsToNextLevel: levelInfo.pointsToNextLevel,
      nextLevelThreshold: levelInfo.nextLevelThreshold,
      currentLevelProgressPct: levelInfo.currentLevelProgressPct,
    }));

    setStudentLeaderboard((lb) => {
      const updated = lb.map((e) =>
        e.isCurrentUser ? { ...e, greenPoints: newBalance } : e
      );
      updated.sort((a, b) => b.greenPoints - a.greenPoints);
      return updated.map((e, idx) => ({ ...e, rank: idx + 1 }));
    });

    const newUserReward: UserReward = {
      id: `urwd-${Date.now()}`,
      rewardId: rwd.id,
      title: rwd.title,
      vendor: rwd.vendor,
      pointsCost: rwd.pointsCost,
      code: `ECO-${Math.floor(1000 + Math.random() * 9000)}`,
      claimedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
      status: 'active',
    };

    setUserRewards((prev) => [newUserReward, ...prev]);
    return { success: true, reward: newUserReward };
  };

  const markRewardAsUsed = (userRewardId: string) => {
    setUserRewards((prev) =>
      prev.map((ur) => (ur.id === userRewardId ? { ...ur, status: 'used' } : ur))
    );
  };

  // ── Provider ─────────────────────────────────────────────────

  return (
    <EcoContext.Provider
      value={{
        user,
        stations,
        history,
        activeStation,
        setActiveStation,
        isLoadingProfile,
        updateUniversitySetup,
        submitRecycling,
        isSubmitting,
        challenges,
        joinChallenge,
        studentLeaderboard,
        facultyLeaderboard,
        achievements,
        rewardsCatalog,
        userRewards,
        redeemReward,
        markRewardAsUsed,
      }}
    >
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => {
  const context = useContext(EcoContext);
  if (!context) {
    throw new Error('useEco must be used within an EcoProvider');
  }
  return context;
};
