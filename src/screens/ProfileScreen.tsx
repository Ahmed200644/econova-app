import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Award,
  ChevronRight,
  GraduationCap,
  Leaf,
  LogOut,
  Settings,
  ShieldCheck,
  Trophy,
  UserCheck,
} from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface ProfileScreenProps {
  onNavigateToEditProfile: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToImpact: () => void;
  onNavigateToLeaderboard?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToEditProfile,
  onNavigateToSettings,
  onNavigateToAchievements,
  onNavigateToImpact,
  onNavigateToLeaderboard,
}) => {
  const { user } = useEco();

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topHeader}>
        <Text style={styles.topTitle}>Student Profile</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={onNavigateToSettings}>
          <Settings size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitial}</Text>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.metaBadgeRow}>
            <View style={styles.facultyChip}>
              <GraduationCap size={14} color={colors.brandPrimary} />
              <Text style={styles.facultyChipText}>{user.faculty}</Text>
            </View>

            <View style={styles.levelChip}>
              <Award size={14} color={colors.brandAccentGreen} />
              <Text style={styles.levelChipText}>Lvl {user.level} · {user.levelName}</Text>
            </View>
          </View>
        </View>

        {/* Impact Snapshot Metrics */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{user.greenPointsBalance}</Text>
            <Text style={styles.statLabel}>Green Points</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statVal}>{user.totalKgRecycled} kg</Text>
            <Text style={styles.statLabel}>Waste Recycled</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statVal}>{user.totalActionsCount}</Text>
            <Text style={styles.statLabel}>Total Actions</Text>
          </View>
        </View>

        {/* Navigation Menu */}
        <Text style={styles.sectionTitle}>Account & Settings</Text>
        <View style={styles.menuContainer}>
          {onNavigateToLeaderboard && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onNavigateToLeaderboard}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconBox}>
                <Trophy size={20} color={colors.brandPrimary} />
              </View>
              <Text style={styles.menuText}>Campus Leaderboard & Cup</Text>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNavigateToImpact}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconBox}>
              <Leaf size={20} color={colors.brandPrimary} />
            </View>
            <Text style={styles.menuText}>Environmental Impact Analytics</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNavigateToAchievements}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconBox}>
              <Award size={20} color={colors.brandPrimary} />
            </View>
            <Text style={styles.menuText}>Campus Achievements & Badges</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNavigateToEditProfile}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconBox}>
              <UserCheck size={20} color={colors.brandPrimary} />
            </View>
            <Text style={styles.menuText}>University & Faculty Setup</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNavigateToSettings}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconBox}>
              <Settings size={20} color={colors.brandPrimary} />
            </View>
            <Text style={styles.menuText}>Settings & Preferences</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
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
  topTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 20,
  },
  profileCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
    ...shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.borderGreenTint,
  },
  avatarText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 28,
    color: colors.textLight,
  },
  userName: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  userEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  facultyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 6,
  },
  facultyChipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11.5,
    color: colors.brandPrimary,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusOpenBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 6,
  },
  levelChipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11.5,
    color: colors.statusOpenText,
  },
  statsCard: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.xl,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    ...shadows.heroCard,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textLight,
  },
  statLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  menuContainer: {
    gap: 10,
  },
  menuItem: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
});
