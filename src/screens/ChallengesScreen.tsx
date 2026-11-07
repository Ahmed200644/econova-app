import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle2, Shield, Trophy, Zap, ChevronRight } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { Challenge } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface ChallengesScreenProps {
  onBackPress?: () => void;
  onNavigateToLeaderboard?: () => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  onBackPress,
  onNavigateToLeaderboard,
}) => {
  const { challenges, joinChallenge } = useEco();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'weekly' | 'daily'>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const filteredChallenges = challenges.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.topTitle}>Campus Challenges</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.trophyBox}>
            <Trophy size={28} color={colors.brandAccentGreen} />
          </View>
          <Text style={styles.heroTitle}>Join Weekly Campus Sprints</Text>
          <Text style={styles.heroSubtitle}>
            Complete recycling targets, unlock Green Points bonuses & boost your faculty on the leaderboard.
          </Text>
          {onNavigateToLeaderboard && (
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={onNavigateToLeaderboard}
            >
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 13, color: colors.brandAccentGreen }}>
                View Campus Leaderboard →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              All Challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'weekly' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('weekly')}
          >
            <Text style={[styles.filterText, selectedFilter === 'weekly' && styles.filterTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'daily' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('daily')}
          >
            <Text style={[styles.filterText, selectedFilter === 'daily' && styles.filterTextActive]}>
              Daily Streaks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Challenge Cards List */}
        <View style={styles.challengesList}>
          {filteredChallenges.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.challengeCard}
              onPress={() => setSelectedChallenge(item)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                </View>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>+{item.rewardPoints} pts</Text>
                </View>
              </View>

              <Text style={styles.challengeTitle}>{item.title}</Text>
              <Text style={styles.challengeDesc}>{item.description}</Text>

              {/* Progress Track if joined */}
              {item.isJoined ? (
                <View style={styles.progressArea}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {item.isCompleted ? '✓ Completed' : `Day ${item.currentDay} of ${item.durationDays}`}
                    </Text>
                    <Text style={styles.progressPctText}>{item.progressPct}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${item.progressPct}%` }]} />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => joinChallenge(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                  <ChevronRight size={16} color={colors.textLight} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Challenge Rules Modal */}
      {selectedChallenge && (
        <Modal transparent visible animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
              <Text style={styles.modalDesc}>{selectedChallenge.description}</Text>

              <View style={styles.bonusRow}>
                <Zap size={18} color={colors.brandPrimary} />
                <Text style={styles.bonusText}>
                  Completion Bonus: +{selectedChallenge.rewardPoints} Green Points
                </Text>
              </View>

              <Text style={styles.rulesHeader}>Challenge Rules & Guidelines:</Text>
              {selectedChallenge.rules.map((rule, idx) => (
                <View key={idx} style={styles.ruleItem}>
                  <CheckCircle2 size={16} color={colors.brandPrimary} />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}

              <View style={styles.modalActions}>
                {!selectedChallenge.isJoined && (
                  <TouchableOpacity
                    style={styles.modalJoinBtn}
                    onPress={() => {
                      joinChallenge(selectedChallenge.id);
                      setSelectedChallenge(null);
                    }}
                  >
                    <Text style={styles.modalJoinText}>Join Challenge Now</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedChallenge(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
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
  trophyBox: {
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.cardLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  filterText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterTextActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  challengesList: {
    gap: 14,
  },
  challengeCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  categoryText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.brandPrimary,
  },
  rewardBadge: {
    backgroundColor: colors.statusOpenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  rewardBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.statusOpenText,
  },
  challengeTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  challengeDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  progressArea: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.brandPrimary,
  },
  progressPctText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.cardTintLight,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brandAccentGreen,
    borderRadius: radii.pill,
  },
  joinButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  joinButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13.5,
    color: colors.textLight,
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
  },
  modalTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modalDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardTintLight,
    padding: 12,
    borderRadius: radii.lg,
    gap: 8,
    marginBottom: 16,
  },
  bonusText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.brandPrimary,
  },
  rulesHeader: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13.5,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  ruleText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    flex: 1,
  },
  modalActions: {
    gap: 8,
    marginTop: 16,
  },
  modalJoinBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalJoinText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  modalCloseBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
