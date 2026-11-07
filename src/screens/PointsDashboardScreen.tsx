import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Clock, Award, ShieldCheck } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface PointsDashboardScreenProps {
  onBackPress?: () => void;
}

export const PointsDashboardScreen: React.FC<PointsDashboardScreenProps> = ({
  onBackPress,
}) => {
  const { user, history } = useEco();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.topTitle}>Green Points & History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Balance Overview Hero Card */}
        <View style={styles.balanceHeroCard}>
          <Text style={styles.heroEyebrow}>CURRENT BALANCE</Text>
          <Text style={styles.heroValue}>{user.greenPointsBalance}</Text>
          <Text style={styles.heroSubText}>Points available to redeem</Text>

          <View style={styles.levelRow}>
            <Award size={18} color={colors.brandAccentGreen} />
            <Text style={styles.levelText}>
              Level {user.level} · {user.levelName}
            </Text>
          </View>
        </View>

        {/* Activity Log Section */}
        <Text style={styles.sectionTitle}>Recent Recycling Transactions</Text>

        <View style={styles.historyList}>
          {history.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No recycling transactions recorded yet.</Text>
            </View>
          ) : (
            history.map((tx) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txIconBox}>
                  <ShieldCheck size={20} color={colors.brandPrimary} />
                </View>

                <View style={styles.txDetails}>
                  <Text style={styles.txStationName}>{tx.stationName}</Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.timestamp).toLocaleDateString()} · {tx.verificationMethod === 'qr_code' ? 'QR Verified' : 'Manual Code'}
                  </Text>
                </View>

                <View style={styles.txPointsCol}>
                  <Text style={styles.txPoints}>+{tx.totalPointsEarned} pts</Text>
                  <Text style={styles.txKg}>{tx.totalKgRecycled} kg</Text>
                </View>
              </View>
            ))
          )}
        </View>
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
  balanceHeroCard: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...shadows.heroCard,
  },
  heroEyebrow: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroValue: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 48,
    color: colors.textLight,
  },
  heroSubText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 179, 106, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 8,
  },
  levelText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.brandAccentGreen,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  historyList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  txCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txStationName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  txDate: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txPointsCol: {
    alignItems: 'flex-end',
  },
  txPoints: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: colors.brandPrimary,
  },
  txKg: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
