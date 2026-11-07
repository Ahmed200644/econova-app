import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Award, CheckCircle2, Lock, Shield, Sparkles } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { AchievementBadge } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface AchievementsScreenProps {
  onBackPress?: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBackPress }) => {
  const { achievements } = useEco();
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const unlockedCount = achievements.filter((b) => b.isUnlocked).length;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.topTitle}>Campus Achievements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.awardBox}>
            <Award size={28} color={colors.brandAccentGreen} />
          </View>
          <Text style={styles.heroTitle}>{unlockedCount} of {achievements.length} Badges Unlocked</Text>
          <Text style={styles.heroSubtitle}>
            Recycle consistently, complete weekly campus challenges, and collect exclusive eco badges!
          </Text>
        </View>

        {/* Badges Grid */}
        <Text style={styles.sectionTitle}>Your Badge Collection</Text>
        <View style={styles.badgeGrid}>
          {achievements.map((badge) => (
            <TouchableOpacity
              key={badge.id}
              style={[styles.badgeCard, !badge.isUnlocked && styles.badgeCardLocked]}
              onPress={() => setSelectedBadge(badge)}
              activeOpacity={0.85}
            >
              <View style={[styles.badgeIconBox, badge.isUnlocked ? styles.iconUnlocked : styles.iconLocked]}>
                {badge.isUnlocked ? (
                  <Sparkles size={24} color={colors.brandPrimary} />
                ) : (
                  <Lock size={22} color={colors.textMuted} />
                )}
              </View>

              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>

              {badge.isUnlocked ? (
                <View style={styles.unlockedTag}>
                  <CheckCircle2 size={12} color={colors.statusOpenText} />
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              ) : (
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${badge.progressPct}%` }]} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <Modal transparent visible animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalIconBox, selectedBadge.isUnlocked ? styles.iconUnlocked : styles.iconLocked]}>
                {selectedBadge.isUnlocked ? (
                  <Award size={36} color={colors.brandPrimary} />
                ) : (
                  <Lock size={32} color={colors.textMuted} />
                )}
              </View>

              <Text style={styles.modalBadgeTitle}>{selectedBadge.title}</Text>
              <Text style={styles.modalBadgeDesc}>{selectedBadge.description}</Text>

              <View style={styles.progressStatusBox}>
                <Text style={styles.progressStatusText}>
                  Progress: {selectedBadge.currentCount} / {selectedBadge.targetCount} ({selectedBadge.progressPct}%)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedBadge(null)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  heroBanner: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    ...shadows.heroCard,
  },
  awardBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(39, 179, 106, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  badgeCardLocked: {
    opacity: 0.7,
  },
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconUnlocked: {
    backgroundColor: colors.cardTintLight,
  },
  iconLocked: {
    backgroundColor: colors.borderLight,
  },
  badgeTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  unlockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusOpenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    gap: 4,
  },
  unlockedText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.statusOpenText,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.cardTintLight,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brandPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalBadgeTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modalBadgeDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  progressStatusBox: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.lg,
    marginBottom: 20,
  },
  progressStatusText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12.5,
    color: colors.brandPrimary,
  },
  closeBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
});
