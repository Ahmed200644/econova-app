import { AchievementBadge, RecyclingTransaction, UserProfile } from '../types';

export const MOCK_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-001',
    title: 'Eco Starter',
    description: 'Complete your first recycling action at any campus hub.',
    iconName: 'leaf',
    category: 'recycling',
    isUnlocked: true,
    unlockedAt: '2026-09-15',
    progressPct: 100,
    currentCount: 1,
    targetCount: 1,
  },
  {
    id: 'ach-002',
    title: 'Recycling Champion',
    description: 'Reach 500 Green Points balance and achieve Level 4 status.',
    iconName: 'award',
    category: 'impact',
    isUnlocked: true,
    unlockedAt: '2026-10-01',
    progressPct: 100,
    currentCount: 720,
    targetCount: 500,
  },
  {
    id: 'ach-003',
    title: 'Carbon Buster',
    description: 'Avoid over 10 kg of CO2e emissions through active recycling.',
    iconName: 'shield',
    category: 'impact',
    isUnlocked: false,
    progressPct: 80,
    currentCount: 8,
    targetCount: 10,
  },
  {
    id: 'ach-004',
    title: 'E-Waste Guardian',
    description: 'Recycle at least 3 electronic or battery items at campus hubs.',
    iconName: 'cpu',
    category: 'recycling',
    isUnlocked: false,
    progressPct: 33,
    currentCount: 1,
    targetCount: 3,
  },
  {
    id: 'ach-005',
    title: 'Streak Master',
    description: 'Recycle on 5 consecutive days without breaking your streak.',
    iconName: 'flame',
    category: 'streak',
    isUnlocked: false,
    progressPct: 60,
    currentCount: 3,
    targetCount: 5,
  },
];

export const getCalculatedAchievements = (
  user: UserProfile,
  history: RecyclingTransaction[]
): AchievementBadge[] => {
  const actionsCount = user.totalActionsCount;
  const ach1Unlocked = actionsCount >= 1;

  const points = user.greenPointsBalance;
  const level = user.level;
  const ach2Unlocked = points >= 500 && level >= 4;
  const ach2Pct = Math.min(100, Math.round((points / 500) * 100));

  const co2e = user.totalCo2eAvoidedKg;
  const ach3Unlocked = co2e >= 10;
  const ach3Pct = Math.min(100, Math.round((co2e / 10) * 100));

  let ewasteCount = 1;
  history.forEach((tx) => {
    tx.items.forEach((item) => {
      if (item.materialType === 'ewaste') {
        ewasteCount += item.quantity;
      }
    });
  });
  const ach4Unlocked = ewasteCount >= 3;
  const ach4Pct = Math.min(100, Math.round((ewasteCount / 3) * 100));

  const streakCount = Math.min(5, Math.max(3, history.length + 1));
  const ach5Unlocked = streakCount >= 5;
  const ach5Pct = Math.min(100, Math.round((streakCount / 5) * 100));

  return [
    {
      id: 'ach-001',
      title: 'Eco Starter',
      description: 'Complete your first recycling action at any campus hub.',
      iconName: 'leaf',
      category: 'recycling',
      isUnlocked: ach1Unlocked,
      unlockedAt: ach1Unlocked ? '2026-09-15' : undefined,
      progressPct: ach1Unlocked ? 100 : Math.min(100, actionsCount * 100),
      currentCount: actionsCount,
      targetCount: 1,
    },
    {
      id: 'ach-002',
      title: 'Recycling Champion',
      description: 'Reach 500 Green Points balance and achieve Level 4 status.',
      iconName: 'award',
      category: 'impact',
      isUnlocked: ach2Unlocked,
      unlockedAt: ach2Unlocked ? '2026-10-01' : undefined,
      progressPct: ach2Pct,
      currentCount: points,
      targetCount: 500,
    },
    {
      id: 'ach-003',
      title: 'Carbon Buster',
      description: 'Avoid over 10 kg of CO2e emissions through active recycling.',
      iconName: 'shield',
      category: 'impact',
      isUnlocked: ach3Unlocked,
      unlockedAt: ach3Unlocked ? new Date().toISOString().split('T')[0] : undefined,
      progressPct: ach3Pct,
      currentCount: Number(co2e.toFixed(1)),
      targetCount: 10,
    },
    {
      id: 'ach-004',
      title: 'E-Waste Guardian',
      description: 'Recycle at least 3 electronic or battery items at campus hubs.',
      iconName: 'cpu',
      category: 'recycling',
      isUnlocked: ach4Unlocked,
      unlockedAt: ach4Unlocked ? new Date().toISOString().split('T')[0] : undefined,
      progressPct: ach4Pct,
      currentCount: ewasteCount,
      targetCount: 3,
    },
    {
      id: 'ach-005',
      title: 'Streak Master',
      description: 'Recycle on 5 consecutive days without breaking your streak.',
      iconName: 'flame',
      category: 'streak',
      isUnlocked: ach5Unlocked,
      unlockedAt: ach5Unlocked ? new Date().toISOString().split('T')[0] : undefined,
      progressPct: ach5Pct,
      currentCount: streakCount,
      targetCount: 5,
    },
  ];
};

