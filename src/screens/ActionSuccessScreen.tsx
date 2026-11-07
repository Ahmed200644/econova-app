import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, Sparkles, ArrowRight } from 'lucide-react-native';
import { RecyclingTransaction } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface ActionSuccessScreenProps {
  transaction: RecyclingTransaction;
  onDone: () => void;
}

export const ActionSuccessScreen: React.FC<ActionSuccessScreenProps> = ({
  transaction,
  onDone,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {/* Animated Green Badge */}
        <View style={styles.badgeRing}>
          <View style={styles.badgeInner}>
            <Check size={48} color={colors.textLight} />
          </View>
        </View>

        <Text style={styles.successTitle}>Recycling Action Confirmed!</Text>
        <Text style={styles.stationSubtitle}>at {transaction.stationName}</Text>

        {/* Hero Points Awarded Card */}
        <View style={styles.rewardCard}>
          <View style={styles.sparkleRow}>
            <Sparkles size={20} color={colors.brandAccentGreen} />
            <Text style={styles.rewardEyebrow}>YOU EARNED</Text>
            <Sparkles size={20} color={colors.brandAccentGreen} />
          </View>

          <Text style={styles.rewardValue}>+{transaction.totalPointsEarned}</Text>
          <Text style={styles.rewardUnit}>GREEN POINTS</Text>

          <View style={styles.impactPill}>
            <Text style={styles.impactPillText}>
              🌱 {transaction.co2eAvoidedKg} kg CO2e Avoided
            </Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Your points have been credited to your balance and added to your faculty on the campus leaderboard.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={onDone}
        activeOpacity={0.85}
      >
        <Text style={styles.doneButtonText}>Back to Dashboard</Text>
        <ArrowRight size={20} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
    paddingHorizontal: spacing.heroPadding,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  contentArea: {
    alignItems: 'center',
    textAlign: 'center',
  },
  badgeRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardTintLight,
    borderWidth: 4,
    borderColor: colors.borderGreenTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  stationSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 28,
  },
  rewardCard: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    ...shadows.heroCard,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rewardEyebrow: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.brandAccentGreen,
    letterSpacing: 1.5,
  },
  rewardValue: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 52,
    color: colors.textLight,
  },
  rewardUnit: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  impactPill: {
    backgroundColor: 'rgba(39, 179, 106, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  impactPillText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.brandAccentGreen,
  },
  footerNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  doneButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  doneButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
  },
});
