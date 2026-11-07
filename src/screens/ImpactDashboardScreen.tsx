import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Share2, TreePine, Zap, Car, Check, ShieldCheck } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { calculateEnvironmentalImpact } from '../services/impactService';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface ImpactDashboardScreenProps {
  onBackPress?: () => void;
}

export const ImpactDashboardScreen: React.FC<ImpactDashboardScreenProps> = ({ onBackPress }) => {
  const { user, history } = useEco();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const impact = calculateEnvironmentalImpact(
    history,
    user.totalKgRecycled,
    user.totalCo2eAvoidedKg,
    user.totalActionsCount
  );

  const handleCopyShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.topTitle}>Environmental Impact</Text>
        <TouchableOpacity style={styles.shareIconBtn} onPress={() => setShowShareModal(true)}>
          <Share2 size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Main Impact Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEyebrow}>YOUR CO2E FOOTPRINT OFFSET</Text>
          <Text style={styles.heroValue}>{impact.totalCo2eAvoidedKg} kg</Text>
          <Text style={styles.heroSubText}>CO2e emissions prevented through your campus recycling</Text>

          <View style={styles.kgBadge}>
            <ShieldCheck size={16} color={colors.brandAccentGreen} />
            <Text style={styles.kgBadgeText}>{impact.totalKgRecycled} kg Total Recycled</Text>
          </View>
        </View>

        {/* Equivalencies Section */}
        <Text style={styles.sectionTitle}>Real-World Equivalencies</Text>
        <View style={styles.eqGrid}>
          {/* Trees Equivalent */}
          <View style={styles.eqCard}>
            <View style={styles.eqIconBox}>
              <TreePine size={24} color={colors.brandPrimary} />
            </View>
            <Text style={styles.eqValue}>{impact.treesPlantedEquivalent}</Text>
            <Text style={styles.eqLabel}>Trees Planted</Text>
            <Text style={styles.eqSub}>Annual CO2 absorption equivalent</Text>
          </View>

          {/* Energy Saved */}
          <View style={styles.eqCard}>
            <View style={styles.eqIconBox}>
              <Zap size={24} color={colors.brandPrimary} />
            </View>
            <Text style={styles.eqValue}>{impact.kwhEnergySaved} kWh</Text>
            <Text style={styles.eqLabel}>Energy Saved</Text>
            <Text style={styles.eqSub}>Enough to power a lamp for 150h</Text>
          </View>

          {/* Car Distance Offset */}
          <View style={styles.eqCard}>
            <View style={styles.eqIconBox}>
              <Car size={24} color={colors.brandPrimary} />
            </View>
            <Text style={styles.eqValue}>{impact.carKmOffset} km</Text>
            <Text style={styles.eqLabel}>Car Distance Offset</Text>
            <Text style={styles.eqSub}>Avoided passenger car driving</Text>
          </View>
        </View>

        {/* Material Composition Breakdown */}
        <Text style={styles.sectionTitle}>Material Composition</Text>
        <View style={styles.compositionCard}>
          <View style={styles.compRow}>
            <Text style={styles.compName}>Plastic Bottles</Text>
            <Text style={styles.compVal}>{impact.plasticKg} kg</Text>
          </View>
          <View style={styles.compBarTrack}>
            <View style={[styles.compBarFill, { width: '40%', backgroundColor: colors.brandPrimary }]} />
          </View>

          <View style={styles.compRow}>
            <Text style={styles.compName}>Paper & Notebooks</Text>
            <Text style={styles.compVal}>{impact.paperKg} kg</Text>
          </View>
          <View style={styles.compBarTrack}>
            <View style={[styles.compBarFill, { width: '35%', backgroundColor: colors.brandAccentGreen }]} />
          </View>

          <View style={styles.compRow}>
            <Text style={styles.compName}>Metal Cans</Text>
            <Text style={styles.compVal}>{impact.metalKg} kg</Text>
          </View>
          <View style={styles.compBarTrack}>
            <View style={[styles.compBarFill, { width: '15%', backgroundColor: '#EAB308' }]} />
          </View>

          <View style={styles.compRow}>
            <Text style={styles.compName}>E-Waste & Electronics</Text>
            <Text style={styles.compVal}>{impact.ewasteKg} kg</Text>
          </View>
          <View style={styles.compBarTrack}>
            <View style={[styles.compBarFill, { width: '10%', backgroundColor: '#3B82F6' }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.shareCtaButton}
          onPress={() => setShowShareModal(true)}
          activeOpacity={0.85}
        >
          <Share2 size={20} color={colors.textLight} />
          <Text style={styles.shareCtaText}>Share My Environmental Impact</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Share Impact Modal */}
      <Modal transparent visible={showShareModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Your Impact Card</Text>
            <Text style={styles.modalSub}>Inspire fellow Luxor University students to recycle!</Text>

            <View style={styles.shareCardPreview}>
              <Text style={styles.sharePreviewTitle}>🌱 Ahmed's EcoNova Impact</Text>
              <Text style={styles.sharePreviewVal}>{impact.totalCo2eAvoidedKg} kg CO2e Avoided</Text>
              <Text style={styles.sharePreviewSub}>
                {impact.totalKgRecycled} kg recycled across {impact.totalActionsCount} actions on campus.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.copyLinkBtn}
              onPress={handleCopyShare}
              activeOpacity={0.8}
            >
              {copiedLink ? (
                <>
                  <Check size={18} color={colors.textLight} />
                  <Text style={styles.copyLinkText}>Impact Card Link Copied!</Text>
                </>
              ) : (
                <>
                  <Share2 size={18} color={colors.textLight} />
                  <Text style={styles.copyLinkText}>Copy Impact Card Link</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  shareIconBtn: {
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
  heroBanner: {
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
    fontSize: 44,
    color: colors.brandAccentGreen,
  },
  heroSubText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  kgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 179, 106, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 8,
  },
  kgBadgeText: {
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
  eqGrid: {
    gap: 12,
    marginBottom: 24,
  },
  eqCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  eqIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  eqValue: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.brandPrimary,
    marginRight: 8,
  },
  eqLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  eqSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  compositionCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
    ...shadows.card,
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  compVal: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13.5,
    color: colors.brandPrimary,
  },
  compBarTrack: {
    height: 6,
    backgroundColor: colors.cardTintLight,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: 14,
  },
  compBarFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  shareCtaButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  shareCtaText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  shareCardPreview: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.xl,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sharePreviewTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  sharePreviewVal: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.brandAccentGreen,
    marginBottom: 6,
  },
  sharePreviewSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  copyLinkBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
    marginBottom: 10,
  },
  copyLinkText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  closeModalBtn: {
    paddingVertical: 10,
  },
  closeModalText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
