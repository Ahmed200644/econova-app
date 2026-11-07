import { RecyclingSelection, RecyclingTransaction } from '../types';
import { calculateRecyclingReward } from './pointsService';
import { getStationById } from './stationsService';

// Set to keep track of processed transaction signatures to prevent duplicate double-clicks
const processedSignatures = new Set<string>();

export interface ProcessRecyclingRequest {
  stationId: string;
  selections: RecyclingSelection[];
  verificationMethod: 'qr_code' | 'manual_fallback';
  requestId?: string;
}

export const processRecyclingSubmission = async (
  req: ProcessRecyclingRequest
): Promise<{ success: boolean; transaction?: RecyclingTransaction; error?: string }> => {
  const station = getStationById(req.stationId);
  if (!station) {
    return { success: false, error: 'Invalid or unknown recycling station.' };
  }

  if (req.selections.length === 0 || req.selections.every((s) => s.quantity <= 0)) {
    return { success: false, error: 'Please select at least one material quantity.' };
  }

  // Deduplication check
  const sig = req.requestId || `${req.stationId}-${JSON.stringify(req.selections)}-${Math.floor(Date.now() / 3000)}`;
  if (processedSignatures.has(sig)) {
    return { success: false, error: 'Duplicate recycling submission detected. Please wait.' };
  }

  processedSignatures.add(sig);

  const reward = calculateRecyclingReward(req.selections);

  const transaction: RecyclingTransaction = {
    id: `tx-${Date.now()}`,
    timestamp: new Date().toISOString(),
    stationId: station.id,
    stationName: station.name,
    items: reward.itemizedBreakdown.map((item) => ({
      materialType: item.materialType,
      quantity: item.quantity,
      pointsEarned: item.pointsEarned,
    })),
    totalPointsEarned: reward.totalPointsEarned,
    totalKgRecycled: reward.totalKgRecycled,
    co2eAvoidedKg: reward.totalCo2eAvoidedKg,
    verificationMethod: req.verificationMethod,
  };

  return { success: true, transaction };
};
