import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Leaf, ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLoginPress: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLoginPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Visual Top Decorative Illustration Box */}
      <View style={styles.heroIllustrationArea}>
        <View style={styles.circleBgLarge}>
          <Leaf size={64} color={colors.brandPrimary} />
        </View>
      </View>

      {/* Copy Content */}
      <View style={styles.contentArea}>
        <Text style={styles.tagline}>RECYCLE · EARN · IMPACT</Text>
        <Text style={styles.mainTitle}>Turn your recycling into real campus rewards</Text>
        <Text style={styles.description}>
          Discover nearby recycling stations, scan station QR codes, earn Green Points, and boost your faculty on the leaderboard.
        </Text>
      </View>

      {/* Bottom CTA Actions */}
      <View style={styles.actionsArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onLoginPress}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
    paddingHorizontal: spacing.heroPadding,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  heroIllustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  circleBgLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.cardTintLight,
    borderWidth: 2,
    borderColor: colors.borderGreenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  tagline: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.brandPrimary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  mainTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsArea: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13.5,
    color: colors.brandPrimary,
  },
});
