import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bell, ChevronRight, MapPin, QrCode, ArrowRight } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface HomeScreenProps {
  onNavigateToScan: () => void;
  onNavigateToStations: () => void;
  onNavigateToPoints: () => void;
  onNavigateToLeaderboard?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToScan,
  onNavigateToStations,
  onNavigateToPoints,
  onNavigateToLeaderboard,
}) => {
  const { user, activeStation, challenges } = useEco();
  const activeChallenge = challenges.find((c) => c.isJoined && !c.isCompleted) || challenges[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.greetingText}>
            Good morning, {user.name} 👋
          </Text>
          <TouchableOpacity onPress={onNavigateToLeaderboard} activeOpacity={0.7}>
            <Text style={styles.subGreetingText}>
              {user.faculty} · {user.university} 🏆
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Bell size={18} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileAvatar} activeOpacity={0.7}>
            <Text style={styles.avatarText}>{user.avatarInitial}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Points Hero Card */}
      <TouchableOpacity
        style={styles.heroCard}
        onPress={onNavigateToPoints}
        activeOpacity={0.9}
      >
        {/* Background Decorative Rings */}
        <View style={styles.decorRingOuter} />
        <View style={styles.decorRingInner} />

        <View style={styles.heroHeaderRow}>
          <View style={styles.levelBadge}>
            <View style={styles.levelBadgeDot} />
            <Text style={styles.levelBadgeText}>Level {user.level}</Text>
          </View>
        </View>

        <Text style={styles.eyebrowText}>GREEN POINTS</Text>

        <View style={styles.pointsRow}>
          <Text style={styles.pointsValue}>{user.greenPointsBalance}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${user.currentLevelProgressPct}%` },
            ]}
          />
        </View>

        <Text style={styles.remainingText}>
          {user.pointsToNextLevel} pts to Level {user.level + 1}
        </Text>
      </TouchableOpacity>

      {/* 3. Take Action Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Take action</Text>
      </View>

      {/* Scan & Earn Card */}
      <TouchableOpacity
        style={styles.actionCardPrimary}
        onPress={onNavigateToScan}
        activeOpacity={0.85}
      >
        <View style={styles.actionIconBoxPrimary}>
          <QrCode size={22} color={colors.textLight} />
        </View>
        <View style={styles.actionTextCol}>
          <Text style={styles.actionTitlePrimary}>Scan & Earn</Text>
          <Text style={styles.actionSubPrimary}>
            Turn your next recycle into points.
          </Text>
        </View>
        <ChevronRight size={20} color={colors.textLight} />
      </TouchableOpacity>

      {/* Find a Station Card */}
      <TouchableOpacity
        style={styles.actionCardSecondary}
        onPress={onNavigateToStations}
        activeOpacity={0.85}
      >
        <View style={styles.actionIconBoxSecondary}>
          <MapPin size={22} color={colors.brandPrimary} />
        </View>
        <View style={styles.actionTextCol}>
          <Text style={styles.actionTitleSecondary}>Find a Station</Text>
          <Text style={styles.actionSubSecondary}>
            Discover nearby recycling points.
          </Text>
        </View>
        <ChevronRight size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* 4. Your Impact Section */}
      <View style={styles.sectionHeaderBetween}>
        <Text style={styles.sectionTitle}>Your impact</Text>
        <TouchableOpacity onPress={onNavigateToPoints}>
          <Text style={styles.seeAllText}>See all →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.impactGridCard}>
        <View style={styles.impactCol}>
          <Text style={styles.impactValue}>{user.totalKgRecycled} kg</Text>
          <Text style={styles.impactLabel}>Recycled</Text>
        </View>

        <View style={styles.impactDivider} />

        <View style={styles.impactCol}>
          <Text style={styles.impactValue}>{user.totalActionsCount}</Text>
          <Text style={styles.impactLabel}>Actions</Text>
        </View>

        <View style={styles.impactDivider} />

        <View style={styles.impactCol}>
          <Text style={styles.impactValue}>{user.totalCo2eAvoidedKg} kg</Text>
          <Text style={styles.impactLabel}>CO2e avoided</Text>
        </View>
      </View>

      {/* 5. Keep the streak going */}
      <View style={styles.sectionHeaderBetween}>
        <Text style={styles.sectionTitle}>Keep the streak going</Text>
        {onNavigateToLeaderboard && (
          <TouchableOpacity onPress={onNavigateToLeaderboard}>
            <Text style={styles.seeAllText}>Leaderboard →</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.challengeCard}>
        <View style={styles.challengeProgressCircle}>
          <Text style={styles.challengePctText}>{activeChallenge.progressPct}%</Text>
        </View>
        <View style={styles.challengeTextCol}>
          <Text style={styles.challengeTitle}>{activeChallenge.title}</Text>
          <Text style={styles.challengeSub}>
            {activeChallenge.description}
          </Text>
          {onNavigateToLeaderboard && (
            <TouchableOpacity style={styles.continueLink} onPress={onNavigateToLeaderboard}>
              <Text style={styles.continueLinkText}>Check Leaderboard Rank →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 6. Around you */}
      <View style={styles.sectionHeaderBetween}>
        <Text style={styles.sectionTitle}>Around you</Text>
        <TouchableOpacity onPress={onNavigateToStations}>
          <Text style={styles.seeAllText}>View stations →</Text>
        </TouchableOpacity>
      </View>

      {activeStation && (
        <TouchableOpacity
          style={styles.aroundStationCard}
          onPress={onNavigateToStations}
          activeOpacity={0.85}
        >
          <View style={styles.aroundIconBox}>
            <MapPin size={20} color={colors.brandPrimary} />
          </View>
          <View style={styles.aroundTextCol}>
            <View style={styles.aroundTitleRow}>
              <Text style={styles.aroundStationName}>{activeStation.name}</Text>
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>Open</Text>
              </View>
            </View>
            <Text style={styles.aroundDistanceText}>
              {activeStation.distanceMeters} m away
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
  },
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingTop: 54,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTextCol: {
    flex: 1,
  },
  greetingText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18.5,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subGreetingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.4,
    color: colors.textSecondary,
    marginTop: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 39,
    height: 39,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 39,
    height: 39,
    borderRadius: radii.pill,
    backgroundColor: colors.brandPrimaryLight,
    borderWidth: 2,
    borderColor: colors.borderGreenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 14.5,
    color: colors.textLight,
  },

  // Hero Card
  heroCard: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    padding: 22,
    height: 222,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
    ...shadows.heroCard,
  },
  decorRingOuter: {
    position: 'absolute',
    width: 185,
    height: 185,
    borderRadius: 92,
    borderWidth: 1,
    borderColor: colors.borderHeroRing,
    left: -40,
    top: 80,
  },
  decorRingInner: {
    position: 'absolute',
    width: 103,
    height: 103,
    borderRadius: 51,
    borderWidth: 1,
    borderColor: colors.borderHeroRing,
    left: -10,
    top: 130,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 179, 106, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    gap: 6,
  },
  levelBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandAccentGreen,
  },
  levelBadgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
    color: colors.brandAccentGreen,
  },
  eyebrowText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  pointsValue: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.hero,
    color: colors.textLight,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brandAccentGreen,
    borderRadius: radii.pill,
  },
  remainingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Sections
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.brandPrimary,
  },

  // Action Cards
  actionCardPrimary: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconBoxPrimary: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTitlePrimary: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15.5,
    color: colors.textLight,
  },
  actionSubPrimary: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },

  actionCardSecondary: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  actionIconBoxSecondary: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitleSecondary: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15.5,
    color: colors.textPrimary,
  },
  actionSubSecondary: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Impact Grid
  impactGridCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  impactCol: {
    flex: 1,
    alignItems: 'center',
  },
  impactValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  impactLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  impactDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },

  // Challenge Card
  challengeCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  challengeProgressCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: colors.brandAccentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  challengePctText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  challengeTextCol: {
    flex: 1,
  },
  challengeTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  challengeSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  continueLink: {
    marginTop: 6,
  },
  continueLinkText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.brandPrimary,
  },

  // Around You
  aroundStationCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  aroundIconBox: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aroundTextCol: {
    flex: 1,
  },
  aroundTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aroundStationName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  openBadge: {
    backgroundColor: colors.statusOpenBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  openBadgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 10,
    color: colors.statusOpenText,
  },
  aroundDistanceText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
