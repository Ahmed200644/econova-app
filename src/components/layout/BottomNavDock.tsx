import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QrCode, Home, Trophy, Star, User } from 'lucide-react-native';
import { colors, radii, typography } from '../../theme/tokens';

export type TabType = 'home' | 'scan' | 'challenges' | 'rewards' | 'profile';

interface BottomNavDockProps {
  activeTab: TabType;
  onTabSelect: (tab: TabType) => void;
}

export const BottomNavDock: React.FC<BottomNavDockProps> = ({ activeTab, onTabSelect }) => {
  return (
    <View style={styles.dockContainer}>
      {/* Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('home')}
        activeOpacity={0.7}
      >
        <Home
          size={22}
          color={activeTab === 'home' ? colors.brandPrimary : colors.textSecondary}
        />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Prominent Scan & Earn Middle Button */}
      <View style={styles.scanButtonWrapper}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => onTabSelect('scan')}
          activeOpacity={0.85}
        >
          <QrCode size={24} color={colors.textLight} />
          <Text style={styles.scanButtonLabel}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Challenges */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('challenges')}
        activeOpacity={0.7}
      >
        <Trophy
          size={22}
          color={activeTab === 'challenges' ? colors.brandPrimary : colors.textSecondary}
        />
        <Text style={[styles.tabLabel, activeTab === 'challenges' && styles.tabLabelActive]}>
          Challenges
        </Text>
      </TouchableOpacity>

      {/* Rewards */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('rewards')}
        activeOpacity={0.7}
      >
        <Star
          size={22}
          color={activeTab === 'rewards' ? colors.brandPrimary : colors.textSecondary}
        />
        <Text style={[styles.tabLabel, activeTab === 'rewards' && styles.tabLabelActive]}>
          Rewards
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('profile')}
        activeOpacity={0.7}
      >
        <User
          size={22}
          color={activeTab === 'profile' ? colors.brandPrimary : colors.textSecondary}
        />
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 84,
    backgroundColor: colors.cardLight,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabLabelActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  scanButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    paddingHorizontal: 6,
  },
  scanButton: {
    backgroundColor: colors.brandPrimary,
    width: 62,
    height: 62,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  scanButtonLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.textLight,
    marginTop: 1,
  },
});
