import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle2, Minus, Plus, Recycle } from 'lucide-react-native';
import { MaterialType, RecyclingSelection, Station } from '../types';
import { MATERIAL_CATALOG, calculateRecyclingReward } from '../services/pointsService';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface MaterialSelectScreenProps {
  station: Station;
  verificationMethod: 'qr_code' | 'manual_fallback';
  onBackPress: () => void;
  onSubmitSelections: (selections: RecyclingSelection[]) => void;
  isSubmitting: boolean;
}

export const MaterialSelectScreen: React.FC<MaterialSelectScreenProps> = ({
  station,
  verificationMethod,
  onBackPress,
  onSubmitSelections,
  isSubmitting,
}) => {
  const [quantities, setQuantities] = useState<Record<MaterialType, number>>({
    plastic: 1,
    paper: 0,
    metal: 0,
    ewaste: 0,
  });

  const updateQty = (type: MaterialType, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const selections: RecyclingSelection[] = (Object.keys(quantities) as MaterialType[])
    .filter((k) => quantities[k] > 0)
    .map((k) => ({ materialType: k, quantity: quantities[k] }));

  const summary = calculateRecyclingReward(selections);

  const handleSubmit = () => {
    if (selections.length === 0) return;
    onSubmitSelections(selections);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Select Recycled Items</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Verified Station Header Banner */}
        <View style={styles.stationBanner}>
          <View style={styles.bannerIcon}>
            <Recycle size={20} color={colors.brandPrimary} />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.stationTitle}>{station.name}</Text>
            <Text style={styles.verificationTag}>
              {verificationMethod === 'qr_code' ? '✓ QR Verified Location' : '⚠️ Manual Code Fallback'}
            </Text>
          </View>
        </View>

        {/* Materials List */}
        <Text style={styles.sectionTitle}>Quantities Being Recycled</Text>
        <View style={styles.materialsList}>
          {station.acceptedMaterials.map((matType) => {
            const info = MATERIAL_CATALOG[matType];
            const qty = quantities[matType];

            return (
              <View key={matType} style={[styles.matRowCard, qty > 0 && styles.matRowCardSelected]}>
                <View style={styles.matInfoCol}>
                  <Text style={styles.matName}>{info.name}</Text>
                  <Text style={styles.matRate}>+{info.pointsPerUnit} pts / {info.unitLabel}</Text>
                </View>

                <View style={styles.qtyControlRow}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, qty === 0 && styles.qtyBtnDisabled]}
                    onPress={() => updateQty(matType, -1)}
                    disabled={qty === 0}
                  >
                    <Minus size={16} color={qty === 0 ? colors.textMuted : colors.textPrimary} />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{qty}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(matType, 1)}
                  >
                    <Plus size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Reward Summary Preview Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Estimated Points & Impact</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Green Points</Text>
            <Text style={styles.summaryPoints}>+{summary.totalPointsEarned} pts</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>CO2e Avoided</Text>
            <Text style={styles.summaryVal}>{summary.totalCo2eAvoidedKg} kg</Text>
          </View>
        </View>

        {/* Submit Action Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (selections.length === 0 || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={selections.length === 0 || isSubmitting}
          activeOpacity={0.85}
        >
          <CheckCircle2 size={22} color={colors.textLight} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Processing...' : 'Confirm Recycling Action'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.heroPadding,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: colors.cardLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 20,
  },
  stationBanner: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
    ...shadows.card,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextCol: {
    flex: 1,
  },
  stationTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  verificationTag: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11.5,
    color: colors.brandPrimary,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  materialsList: {
    gap: 10,
    marginBottom: 24,
  },
  matRowCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  matRowCardSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.cardTintLight,
  },
  matInfoCol: {
    flex: 1,
  },
  matName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  matRate: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.brandPrimary,
    marginTop: 2,
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 16,
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.xl,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textLight,
  },
  summaryPoints: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.brandAccentGreen,
  },
  summaryVal: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  submitButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
  },
});
