import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Gift, ShoppingBag, QrCode, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { RewardItem, UserReward } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface RewardsScreenProps {
  onBackPress?: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ onBackPress }) => {
  const { user, rewardsCatalog, userRewards, redeemReward, markRewardAsUsed } = useEco();
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_rewards'>('catalog');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [activeClaimedModal, setActiveClaimedModal] = useState<UserReward | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;
    const res = await redeemReward(selectedReward.id);
    if (res.success && res.reward) {
      setFeedbackMsg({ success: true, text: `Successfully redeemed "${res.reward.title}"!` });
      setSelectedReward(null);
      setActiveClaimedModal(res.reward);
    } else {
      setFeedbackMsg({ success: false, text: res.error || 'Redemption failed.' });
    }
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
        <Text style={styles.topTitle}>Student Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'catalog' && styles.tabBtnActive]}
          onPress={() => setActiveTab('catalog')}
          activeOpacity={0.8}
        >
          <Gift size={18} color={activeTab === 'catalog' ? colors.brandPrimary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>
            Rewards Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'my_rewards' && styles.tabBtnActive]}
          onPress={() => setActiveTab('my_rewards')}
          activeOpacity={0.8}
        >
          <ShoppingBag size={18} color={activeTab === 'my_rewards' ? colors.brandPrimary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'my_rewards' && styles.tabTextActive]}>
            My Vouchers ({userRewards.filter((u) => u.status === 'active').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Points Banner */}
        <View style={styles.balanceBanner}>
          <Text style={styles.balanceEyebrow}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceVal}>{user.greenPointsBalance} Green Points</Text>
        </View>

        {feedbackMsg && (
          <View style={[styles.alertBox, feedbackMsg.success ? styles.alertSuccess : styles.alertError]}>
            {feedbackMsg.success ? (
              <CheckCircle2 size={18} color={colors.statusOpenText} />
            ) : (
              <AlertCircle size={18} color={colors.statusClosedText} />
            )}
            <Text style={[styles.alertText, feedbackMsg.success ? styles.alertTextSuccess : styles.alertTextError]}>
              {feedbackMsg.text}
            </Text>
          </View>
        )}

        {activeTab === 'catalog' ? (
          <View style={styles.catalogGrid}>
            {rewardsCatalog.map((item) => (
              <View key={item.id} style={styles.rewardCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.vendorBadge}>
                    <Text style={styles.vendorText}>{item.vendor}</Text>
                  </View>
                  <Text style={styles.origValue}>{item.originalValue}</Text>
                </View>

                <Text style={styles.rewardTitle}>{item.title}</Text>
                <Text style={styles.rewardDesc}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.costBox}>
                    <Text style={styles.costPoints}>{item.pointsCost} pts</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.redeemBtn,
                      user.greenPointsBalance < item.pointsCost && styles.redeemBtnDisabled,
                    ]}
                    onPress={() => setSelectedReward(item)}
                    disabled={user.greenPointsBalance < item.pointsCost}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.redeemBtnText}>
                      {user.greenPointsBalance >= item.pointsCost ? 'Redeem' : 'Need Points'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* My Claimed Vouchers */
          <View style={styles.vouchersList}>
            {userRewards.length === 0 ? (
              <View style={styles.emptyVoucherCard}>
                <Text style={styles.emptyVoucherText}>No active vouchers yet.</Text>
                <Text style={styles.emptyVoucherSub}>Redeem rewards from the catalog using your Green Points!</Text>
              </View>
            ) : (
              userRewards.map((ur) => (
                <TouchableOpacity
                  key={ur.id}
                  style={[styles.voucherCard, ur.status === 'used' && styles.voucherCardUsed]}
                  onPress={() => setActiveClaimedModal(ur)}
                  activeOpacity={0.85}
                >
                  <View style={styles.voucherHeader}>
                    <Text style={styles.voucherVendor}>{ur.vendor}</Text>
                    <View style={[styles.statusBadge, ur.status === 'active' ? styles.bgActive : styles.bgUsed]}>
                      <Text style={[styles.statusText, ur.status === 'active' ? styles.textActive : styles.textUsed]}>
                        {ur.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.voucherTitle}>{ur.title}</Text>
                  
                  <View style={styles.codeRow}>
                    <QrCode size={18} color={colors.brandPrimary} />
                    <Text style={styles.codeText}>{ur.code}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <Modal transparent visible animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Redemption</Text>
              <Text style={styles.modalSubTitle}>
                Are you sure you want to spend {selectedReward.pointsCost} Green Points to redeem:
              </Text>
              <Text style={styles.rewardNameHighlight}>{selectedReward.title}</Text>

              <Text style={styles.termsLabel}>Terms & Conditions:</Text>
              <Text style={styles.termsText}>{selectedReward.terms}</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.confirmRedeemBtn}
                  onPress={handleRedeemConfirm}
                >
                  <Text style={styles.confirmRedeemText}>Confirm & Redeem ({selectedReward.pointsCost} pts)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setSelectedReward(null)}
                >
                  <Text style={styles.cancelModalText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Claimed Voucher QR Modal */}
      {activeClaimedModal && (
        <Modal transparent visible animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeClaimedModal.title}</Text>
              <Text style={styles.modalSubTitle}>Show this voucher code at {activeClaimedModal.vendor}</Text>

              <View style={styles.qrDisplayBox}>
                <QrCode size={120} color={colors.textPrimary} />
                <Text style={styles.displayCodeText}>{activeClaimedModal.code}</Text>
              </View>

              {activeClaimedModal.status === 'active' && (
                <TouchableOpacity
                  style={styles.markUsedBtn}
                  onPress={() => {
                    markRewardAsUsed(activeClaimedModal.id);
                    setActiveClaimedModal(null);
                  }}
                >
                  <Text style={styles.markUsedText}>Mark as Used</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setActiveClaimedModal(null)}
              >
                <Text style={styles.cancelModalText}>Close</Text>
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
  tabBar: {
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
  balanceBanner: {
    backgroundColor: colors.bgHeroDark,
    borderRadius: radii.xl,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceEyebrow: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  balanceVal: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.brandAccentGreen,
    marginTop: 2,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radii.lg,
    gap: 8,
    marginBottom: 16,
  },
  alertSuccess: {
    backgroundColor: colors.statusOpenBg,
  },
  alertError: {
    backgroundColor: colors.statusClosedBg,
  },
  alertText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    flex: 1,
  },
  alertTextSuccess: {
    color: colors.statusOpenText,
  },
  alertTextError: {
    color: colors.statusClosedText,
  },
  catalogGrid: {
    gap: 14,
  },
  rewardCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorBadge: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  vendorText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.brandPrimary,
  },
  origValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  rewardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  rewardDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  costBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  costPoints: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 17,
    color: colors.brandPrimary,
  },
  redeemBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  redeemBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  redeemBtnText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.textLight,
  },
  vouchersList: {
    gap: 12,
  },
  emptyVoucherCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 24,
    alignItems: 'center',
  },
  emptyVoucherText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  emptyVoucherSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  voucherCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  voucherCardUsed: {
    opacity: 0.6,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  voucherVendor: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.brandPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  bgActive: {
    backgroundColor: colors.statusOpenBg,
  },
  bgUsed: {
    backgroundColor: colors.borderLight,
  },
  statusText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
  },
  textActive: {
    color: colors.statusOpenText,
  },
  textUsed: {
    color: colors.textSecondary,
  },
  voucherTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardTintLight,
    padding: 10,
    borderRadius: radii.lg,
    gap: 8,
  },
  codeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.brandPrimary,
    letterSpacing: 1,
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
  modalTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modalSubTitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardNameHighlight: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.brandPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  termsLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  termsText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  qrDisplayBox: {
    backgroundColor: colors.cardTintLight,
    borderRadius: radii.xl,
    padding: 20,
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  displayCodeText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.brandPrimary,
    letterSpacing: 2,
    marginTop: 12,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  confirmRedeemBtn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmRedeemText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  markUsedBtn: {
    backgroundColor: colors.cardTintLight,
    borderRadius: radii.lg,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  markUsedText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13.5,
    color: colors.brandPrimary,
  },
  cancelModalBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  cancelModalText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
