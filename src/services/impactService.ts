import { EnvironmentalImpactMetrics, RecyclingTransaction } from '../types';

export const calculateEnvironmentalImpact = (
  history: RecyclingTransaction[],
  totalKg: number,
  totalCo2e: number,
  totalActions: number
): EnvironmentalImpactMetrics => {
  let plasticKg = 4.2;
  let paperKg = 5.0;
  let metalKg = 2.0;
  let ewasteKg = 1.2;

  // Summarize material breakdown from actual history
  history.forEach((tx) => {
    tx.items.forEach((item) => {
      if (item.materialType === 'plastic') plasticKg += item.quantity * 0.05;
      else if (item.materialType === 'paper') paperKg += item.quantity * 1.0;
      else if (item.materialType === 'metal') metalKg += item.quantity * 0.1;
      else if (item.materialType === 'ewaste') ewasteKg += item.quantity * 0.2;
    });
  });

  // Environmental Equivalency Formulae:
  // 1 kg CO2e avoided ~ 0.05 trees planted equivalent / year
  // 1 kg waste recycled ~ 2.5 kWh energy saved
  // 1 kg CO2e avoided ~ 4.2 km driven by avg passenger car offset
  const treesPlantedEquivalent = Number((totalCo2e * 0.05).toFixed(1));
  const kwhEnergySaved = Math.round(totalKg * 2.5);
  const carKmOffset = Math.round(totalCo2e * 4.2);

  return {
    totalKgRecycled: Number(totalKg.toFixed(1)),
    totalCo2eAvoidedKg: Number(totalCo2e.toFixed(1)),
    totalActionsCount: totalActions,
    plasticKg: Number(plasticKg.toFixed(1)),
    paperKg: Number(paperKg.toFixed(1)),
    metalKg: Number(metalKg.toFixed(1)),
    ewasteKg: Number(ewasteKg.toFixed(1)),
    treesPlantedEquivalent,
    kwhEnergySaved,
    carKmOffset,
  };
};
