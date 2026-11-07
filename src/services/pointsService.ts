import { MaterialInfo, MaterialType, RecyclingSelection } from '../types';

export const MATERIAL_CATALOG: Record<MaterialType, MaterialInfo> = {
  plastic: {
    type: 'plastic',
    name: 'Plastic Bottles',
    unitLabel: 'items',
    pointsPerUnit: 15,
    co2PerUnitKg: 0.25,
    iconName: 'bottle',
    description: 'PET bottles, beverage containers & clean plastics',
  },
  paper: {
    type: 'paper',
    name: 'Paper & Cardboard',
    unitLabel: 'kg',
    pointsPerUnit: 20,
    co2PerUnitKg: 0.8,
    iconName: 'file-text',
    description: 'Notebooks, clean papers & cardboard packaging',
  },
  metal: {
    type: 'metal',
    name: 'Metal Cans',
    unitLabel: 'items',
    pointsPerUnit: 25,
    co2PerUnitKg: 0.45,
    iconName: 'box',
    description: 'Aluminum soda cans & steel food tins',
  },
  ewaste: {
    type: 'ewaste',
    name: 'E-Waste',
    unitLabel: 'items',
    pointsPerUnit: 50,
    co2PerUnitKg: 1.5,
    iconName: 'cpu',
    description: 'Batteries, small cables & electronic components',
  },
};

export interface RecyclingCalculationResult {
  totalPointsEarned: number;
  totalKgRecycled: number;
  totalCo2eAvoidedKg: number;
  itemizedBreakdown: {
    materialType: MaterialType;
    quantity: number;
    pointsEarned: number;
    co2Avoided: number;
  }[];
}

export const calculateRecyclingReward = (
  selections: RecyclingSelection[]
): RecyclingCalculationResult => {
  let totalPointsEarned = 0;
  let totalKgRecycled = 0;
  let totalCo2eAvoidedKg = 0;

  const itemizedBreakdown = selections.map((sel) => {
    const info = MATERIAL_CATALOG[sel.materialType];
    const pointsEarned = Math.round(sel.quantity * info.pointsPerUnit);
    const co2Avoided = Number((sel.quantity * info.co2PerUnitKg).toFixed(2));
    
    // Approximate weight calculation
    const weightKg = sel.materialType === 'paper' 
      ? sel.quantity 
      : Number((sel.quantity * 0.05).toFixed(2));

    totalPointsEarned += pointsEarned;
    totalCo2eAvoidedKg += co2Avoided;
    totalKgRecycled += weightKg;

    return {
      materialType: sel.materialType,
      quantity: sel.quantity,
      pointsEarned,
      co2Avoided,
    };
  });

  return {
    totalPointsEarned,
    totalKgRecycled: Number(totalKgRecycled.toFixed(2)),
    totalCo2eAvoidedKg: Number(totalCo2eAvoidedKg.toFixed(2)),
    itemizedBreakdown,
  };
};

export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Eco Starter', minPoints: 0 },
  { level: 2, name: 'Green Recruit', minPoints: 200 },
  { level: 3, name: 'Eco Explorer', minPoints: 500 },
  { level: 4, name: 'Recycling Champion', minPoints: 700 },
  { level: 5, name: 'Sustainability Hero', minPoints: 1000 },
];

export const calculateLevelInfo = (points: number) => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
    }
  }

  const range = nextLevel.minPoints - currentLevel.minPoints;
  const progressInLevel = points - currentLevel.minPoints;
  const pct = range > 0 ? Math.min(100, Math.round((progressInLevel / range) * 100)) : 100;
  const pointsToNext = Math.max(0, nextLevel.minPoints - points);

  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    pointsToNextLevel: pointsToNext,
    nextLevelThreshold: nextLevel.minPoints,
    currentLevelProgressPct: pct,
  };
};
