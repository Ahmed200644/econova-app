export type MaterialType = 'plastic' | 'paper' | 'metal' | 'ewaste';

export interface MaterialInfo {
  type: MaterialType;
  name: string;
  unitLabel: string;
  pointsPerUnit: number;
  co2PerUnitKg: number;
  iconName: string;
  description: string;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  distanceMeters: number;
  status: 'open' | 'closed' | 'offline';
  closingTime?: string;
  locationName: string;
  acceptedMaterials: MaterialType[];
  isAvailable: boolean;
}

export interface RecyclingSelection {
  materialType: MaterialType;
  quantity: number;
}

export interface RecyclingTransaction {
  id: string;
  timestamp: string;
  studentId?: string;           // pilot: links to students.id in Supabase
  stationId: string;
  stationName: string;
  items: {
    materialType: MaterialType;
    quantity: number;
    pointsEarned: number;
  }[];
  totalPointsEarned: number;
  totalKgRecycled: number;
  co2eAvoidedKg: number;
  verificationMethod: 'qr_code' | 'manual_fallback';
}

export interface UserProfile {
  id: string;
  deviceId?: string;            // pilot: expo-device unique ID
  name: string;
  email: string;
  university: string;
  faculty: string;
  academicYear: string;
  avatarInitial: string;
  greenPointsBalance: number;
  level: number;
  levelName: string;
  pointsToNextLevel: number;
  nextLevelThreshold: number;
  currentLevelProgressPct: number;
  totalKgRecycled: number;
  totalActionsCount: number;
  totalCo2eAvoidedKg: number;
  isProfileComplete: boolean;
}

// Milestone 2 Gamification Models
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'weekly' | 'daily' | 'faculty';
  durationDays: number;
  currentDay: number;
  progressPct: number;
  rewardPoints: number;
  isJoined: boolean;
  isCompleted: boolean;
  iconName: string;
  rules: string[];
  targetCount: number;
  currentCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  faculty: string;
  avatarInitial: string;
  greenPoints: number;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down' | 'same';
}

export interface FacultyLeaderboardEntry {
  rank: number;
  facultyName: string;
  totalPoints: number;
  activeStudents: number;
  avatarInitial: string;
}

export interface RewardItem {
  id: string;
  title: string;
  vendor: string;
  category: 'food' | 'prints' | 'eco_gear' | 'voucher';
  pointsCost: number;
  originalValue: string;
  iconName: string;
  description: string;
  terms: string;
  availableStock: number;
}

export interface UserReward {
  id: string;
  rewardId: string;
  title: string;
  vendor: string;
  pointsCost: number;
  code: string;
  claimedAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
}

// Milestone 3 Analytics & Achievement Models
export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'recycling' | 'streak' | 'impact' | 'social';
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPct: number;
  currentCount: number;
  targetCount: number;
}

export interface EnvironmentalImpactMetrics {
  totalKgRecycled: number;
  totalCo2eAvoidedKg: number;
  totalActionsCount: number;
  plasticKg: number;
  paperKg: number;
  metalKg: number;
  ewasteKg: number;
  treesPlantedEquivalent: number;
  kwhEnergySaved: number;
  carKmOffset: number;
}
