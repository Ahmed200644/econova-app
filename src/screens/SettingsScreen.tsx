import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Bell, Globe, Info, Lock, LogOut, Moon, Shield } from 'lucide-react-native';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface SettingsScreenProps {
  onBackPress: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackPress, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Arabic'>('English');

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Settings & Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* App Preferences Section */}
        <Text style={styles.sectionTitle}>App Preferences</Text>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.rowIconBox}>
              <Bell size={20} color={colors.brandPrimary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSub}>Reminders for weekly challenges & point rewards</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.borderLight, true: colors.brandPrimary }}
              thumbColor={colors.cardLight}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.rowIconBox}>
              <Moon size={20} color={colors.brandPrimary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Dark Mode</Text>
              <Text style={styles.rowSub}>Sleek dark theme UI</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: colors.borderLight, true: colors.brandPrimary }}
              thumbColor={colors.cardLight}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.rowIconBox}>
              <Globe size={20} color={colors.brandPrimary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Language / اللغة</Text>
              <Text style={styles.rowSub}>English / العربية</Text>
            </View>
            <TouchableOpacity
              style={styles.langToggleBtn}
              onPress={() => setSelectedLanguage(selectedLanguage === 'English' ? 'Arabic' : 'English')}
            >
              <Text style={styles.langToggleText}>{selectedLanguage}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Info */}
        <Text style={styles.sectionTitle}>About & Legal</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.rowIconBox}>
              <Info size={20} color={colors.brandPrimary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>About EcoNova App</Text>
              <Text style={styles.rowSub}>Version 1.0.0 (Campus MVP)</Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.rowIconBox}>
              <Lock size={20} color={colors.brandPrimary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Privacy Policy</Text>
              <Text style={styles.rowSub}>Data collection & student privacy terms</Text>
            </View>
          </View>
        </View>

        {/* Log Out Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.85}
        >
          <LogOut size={20} color={colors.statusClosedText} />
          <Text style={styles.logoutButtonText}>Log Out Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal transparent visible={showLogoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Out of EcoNova?</Text>
            <Text style={styles.modalSub}>
              You can log back in anytime to access your Green Points balance and recycling history.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.confirmLogoutBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
              >
                <Text style={styles.confirmLogoutText}>Yes, Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  contentContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
    overflow: 'hidden',
    ...shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowIconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rowSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  langToggleBtn: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  langToggleText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.brandPrimary,
  },
  logoutButton: {
    backgroundColor: colors.statusClosedBg,
    borderRadius: radii.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  logoutButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.statusClosedText,
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
  modalSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
  confirmLogoutBtn: {
    backgroundColor: colors.statusClosedBg,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmLogoutText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.statusClosedText,
  },
  cancelModalBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelModalText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
