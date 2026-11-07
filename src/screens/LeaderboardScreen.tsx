import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Crown, Award, TrendingUp, Users } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface LeaderboardScreenProps {
  onBackPress?: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBackPress }) => {
  const { studentLeaderboard, facultyLeaderboard } = useEco();
  const [activeTab, setActiveTab] = useState<'students' | 'faculties'>('students');

  // Top 3 Podium Students
  const top1 = studentLeaderboard[0];
  const top2 = studentLeaderboard[1];
  const top3 = studentLeaderboard[2];

  const remainingStudents = studentLeaderboard.slice(3);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.topTitle}>Campus Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'students' && styles.tabBtnActive]}
          onPress={() => setActiveTab('students')}
          activeOpacity={0.8}
        >
          <Award size={18} color={activeTab === 'students' ? colors.brandPrimary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>
            Top Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'faculties' && styles.tabBtnActive]}
          onPress={() => setActiveTab('faculties')}
          activeOpacity={0.8}
        >
          <Users size={18} color={activeTab === 'faculties' ? colors.brandPrimary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'faculties' && styles.tabTextActive]}>
            Faculties Cup
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'students' ? (
          <>
            {/* Top 3 Podium */}
            <View style={styles.podiumArea}>
              {/* 2nd Place */}
              {top2 && (
                <View style={[styles.podiumCol, styles.podium2nd]}>
                  <View style={styles.avatarCircleSilver}>
                    <Text style={styles.avatarText}>{top2.avatarInitial}</Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{top2.name.split(' ')[0]}</Text>
                  <Text style={styles.podiumPoints}>{top2.greenPoints} pts</Text>
                  <View style={styles.podiumStep2}>
                    <Text style={styles.stepRankText}>2</Text>
                  </View>
                </View>
              )}

              {/* 1st Place (Gold Crown) */}
              {top1 && (
                <View style={[styles.podiumCol, styles.podium1st]}>
                  <Crown size={22} color="#EAB308" style={styles.crownIcon} />
                  <View style={styles.avatarCircleGold}>
                    <Text style={styles.avatarTextGold}>{top1.avatarInitial}</Text>
                  </View>
                  <Text style={styles.podiumNameGold} numberOfLines={1}>{top1.name.split(' ')[0]}</Text>
                  <Text style={styles.podiumPointsGold}>{top1.greenPoints} pts</Text>
                  <View style={styles.podiumStep1}>
                    <Text style={styles.stepRankTextGold}>1</Text>
                  </View>
                </View>
              )}

              {/* 3rd Place */}
              {top3 && (
                <View style={[styles.podiumCol, styles.podium3rd]}>
                  <View style={styles.avatarCircleBronze}>
                    <Text style={styles.avatarText}>{top3.avatarInitial}</Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{top3.name.split(' ')[0]}</Text>
                  <Text style={styles.podiumPoints}>{top3.greenPoints} pts</Text>
                  <View style={styles.podiumStep3}>
                    <Text style={styles.stepRankText}>3</Text>
                  </View>
                </View>
              )}
            </View>

            {/* List Rankings */}
            <Text style={styles.sectionHeader}>Campus Rankings</Text>
            <View style={styles.rankingsList}>
              {remainingStudents.map((st) => (
                <View
                  key={st.id}
                  style={[styles.rankRow, st.isCurrentUser && styles.currentUserRow]}
                >
                  <Text style={[styles.rankNumber, st.isCurrentUser && styles.currentUserText]}>
                    #{st.rank}
                  </Text>

                  <View style={styles.userAvatarBox}>
                    <Text style={styles.userAvatarText}>{st.avatarInitial}</Text>
                  </View>

                  <View style={styles.userInfoCol}>
                    <Text style={[styles.userName, st.isCurrentUser && styles.currentUserText]}>
                      {st.name} {st.isCurrentUser && '(You)'}
                    </Text>
                    <Text style={styles.userFaculty}>{st.faculty}</Text>
                  </View>

                  <View style={styles.pointsCol}>
                    <Text style={[styles.pointsText, st.isCurrentUser && styles.currentUserText]}>
                      {st.greenPoints} pts
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Inter-Faculty Leaderboard */
          <View style={styles.facultyList}>
            <View style={styles.facultyHeaderBanner}>
              <TrendingUp size={24} color={colors.brandAccentGreen} />
              <Text style={styles.facultyHeaderTitle}>Inter-Faculty Sustainability Cup</Text>
              <Text style={styles.facultyHeaderSub}>
                Combined Green Points earned by all active students per faculty.
              </Text>
            </View>

            {facultyLeaderboard.map((fac) => (
              <View key={fac.rank} style={styles.facultyCard}>
                <View style={styles.facRankBadge}>
                  <Text style={styles.facRankText}>#{fac.rank}</Text>
                </View>

                <View style={styles.facIconBox}>
                  <Text style={styles.facAvatarText}>{fac.avatarInitial}</Text>
                </View>

                <View style={styles.facInfoCol}>
                  <Text style={styles.facName}>{fac.facultyName}</Text>
                  <Text style={styles.facMeta}>
                    {fac.activeStudents} active students recycling
                  </Text>
                </View>

                <View style={styles.facPointsCol}>
                  <Text style={styles.facPointsVal}>{fac.totalPoints.toLocaleString()} pts</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardLight,
    paddingHorizontal: spacing.heroPadding,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.bgCanvas,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabBtnActive: {
    backgroundColor: colors.cardTintLight,
    borderColor: colors.brandPrimary,
  },
  tabText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 20,
  },
  podiumArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 28,
  },
  podiumCol: {
    alignItems: 'center',
    width: 96,
  },
  podium1st: {
    marginBottom: 0,
  },
  podium2nd: {
    marginBottom: 0,
  },
  podium3rd: {
    marginBottom: 0,
  },
  crownIcon: {
    marginBottom: -6,
    zIndex: 2,
  },
  avatarCircleGold: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF08A',
    borderWidth: 3,
    borderColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarTextGold: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: '#854D0E',
  },
  avatarCircleSilver: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarCircleBronze: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEDD5',
    borderWidth: 2,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  podiumName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12.5,
    color: colors.textPrimary,
  },
  podiumNameGold: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  podiumPoints: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
    color: colors.brandPrimary,
    marginBottom: 6,
  },
  podiumPointsGold: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.brandPrimary,
    marginBottom: 6,
  },
  podiumStep1: {
    width: '100%',
    height: 90,
    backgroundColor: colors.bgHeroDark,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumStep2: {
    width: '100%',
    height: 68,
    backgroundColor: colors.brandPrimary,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumStep3: {
    width: '100%',
    height: 52,
    backgroundColor: colors.cardTintLight,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stepRankTextGold: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 24,
    color: colors.brandAccentGreen,
  },
  stepRankText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.textLight,
  },
  sectionHeader: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  rankingsList: {
    gap: 10,
  },
  rankRow: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  currentUserRow: {
    backgroundColor: colors.bgHeroDark,
    borderColor: colors.brandAccentGreen,
  },
  rankNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textSecondary,
    width: 30,
  },
  currentUserText: {
    color: colors.textLight,
  },
  userAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.brandPrimary,
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  userFaculty: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  pointsCol: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: colors.brandPrimary,
  },
  facultyList: {
    gap: 12,
  },
  facultyHeaderBanner: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.hero,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  facultyHeaderTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 17,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  facultyHeaderSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  facultyCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  facRankBadge: {
    width: 32,
  },
  facRankText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.brandPrimary,
  },
  facIconBox: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  facAvatarText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 16,
    color: colors.brandPrimary,
  },
  facInfoCol: {
    flex: 1,
  },
  facName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  facMeta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  facPointsCol: {
    alignItems: 'flex-end',
  },
  facPointsVal: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: colors.brandPrimary,
  },
});
