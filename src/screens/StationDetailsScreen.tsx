import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle2, MapPin, QrCode } from 'lucide-react-native';
import { Station } from '../types';
import { MATERIAL_CATALOG } from '../services/pointsService';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface StationDetailsScreenProps {
  station: Station;
  onBackPress: () => void;
  onStartScan: (station: Station) => void;
}

export const StationDetailsScreen: React.FC<StationDetailsScreenProps> = ({
  station,
  onBackPress,
  onStartScan,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Station Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <MapPin size={32} color={colors.brandPrimary} />
          </View>
          <Text style={styles.stationTitle}>{station.name}</Text>
          <Text style={styles.stationLocation}>{station.locationName}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, station.status === 'open' ? styles.bgOpen : styles.bgClosed]}>
              <Text style={[styles.statusText, station.status === 'open' ? styles.textOpen : styles.textClosed]}>
                {station.status === 'open' ? '● Station Open' : '● Station Closed'}
              </Text>
            </View>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>Code: {station.code}</Text>
            </View>
          </View>
        </View>

        {/* Accepted Materials Section */}
        <Text style={styles.sectionHeader}>Accepted Materials & Rates</Text>
        <View style={styles.materialsGrid}>
          {station.acceptedMaterials.map((matKey) => {
            const matInfo = MATERIAL_CATALOG[matKey];
            return (
              <View key={matKey} style={styles.materialCard}>
                <View style={styles.matHeader}>
                  <CheckCircle2 size={18} color={colors.brandPrimary} />
                  <Text style={styles.matName}>{matInfo.name}</Text>
                </View>
                <Text style={styles.matDesc}>{matInfo.description}</Text>
                <View style={styles.rateRow}>
                  <Text style={styles.ratePoints}>+{matInfo.pointsPerUnit} Green Points</Text>
                  <Text style={styles.rateUnit}>/ {matInfo.unitLabel}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.scanCtaButton, !station.isAvailable && styles.scanCtaDisabled]}
          onPress={() => onStartScan(station)}
          disabled={!station.isAvailable}
          activeOpacity={0.85}
        >
          <QrCode size={22} color={colors.textLight} />
          <Text style={styles.scanCtaText}>
            {station.isAvailable ? 'Scan Station QR Code' : 'Station Currently Unavailable'}
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
  topBar: {
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 20,
  },
  heroCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
    ...shadows.card,
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stationTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  stationLocation: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  bgOpen: {
    backgroundColor: colors.statusOpenBg,
  },
  bgClosed: {
    backgroundColor: colors.statusClosedBg,
  },
  statusText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
  },
  textOpen: {
    color: colors.statusOpenText,
  },
  textClosed: {
    color: colors.statusClosedText,
  },
  codeBadge: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderGreenTint,
  },
  codeBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.brandPrimary,
  },
  sectionHeader: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  materialsGrid: {
    gap: 12,
    marginBottom: 28,
  },
  materialCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  matHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  matName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  matDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratePoints: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.brandPrimary,
  },
  rateUnit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  scanCtaButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  scanCtaDisabled: {
    backgroundColor: colors.textMuted,
  },
  scanCtaText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
  },
});
