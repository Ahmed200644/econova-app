import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { ArrowLeft, Keyboard, QrCode, Zap } from 'lucide-react-native';
import { Station } from '../types';
import { getStationByCodeRemote } from '../services/pilotStationService';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface QRScannerScreenProps {
  onStationDetected: (station: Station, method: 'qr_code' | 'manual_fallback') => void;
  onClose: () => void;
}

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({
  onStationDetected,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const scanCooldown = useRef(false);  // prevent rapid double-scans

  // Request camera permission on mount
  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  // ── Real QR scan handler ─────────────────────────────────────
  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanCooldown.current || isLookingUp) return;
    scanCooldown.current = true;

    setIsLookingUp(true);
    setErrorMessage('');

    const station = await getStationByCodeRemote(data.trim());

    if (station) {
      onStationDetected(station, 'qr_code');
    } else {
      setErrorMessage(`No active station found for code "${data}". Try manual entry.`);
      // Allow re-scan after 2.5 s
      setTimeout(() => { scanCooldown.current = false; }, 2500);
    }

    setIsLookingUp(false);
  };

  // ── Manual code handler (unchanged behaviour, now DB-backed) ──
  const handleManualSubmit = async () => {
    if (!manualCode.trim()) return;
    setErrorMessage('');
    setIsLookingUp(true);

    const found = await getStationByCodeRemote(manualCode.trim());

    setIsLookingUp(false);
    if (found) {
      setShowManualModal(false);
      onStationDetected(found, 'manual_fallback');
    } else {
      setErrorMessage(`Station "${manualCode.toUpperCase()}" not found. Check the code and try again.`);
    }
  };

  // ── Permission states ────────────────────────────────────────
  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centred]}>
        <ActivityIndicator size="large" color={colors.brandAccentGreen} />
        <Text style={styles.permissionText}>Requesting camera access…</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centred]}>
        <QrCode size={48} color="rgba(255,255,255,0.4)" />
        <Text style={styles.permissionText}>Camera permission denied.</Text>
        <Text style={styles.permissionSub}>
          Enable camera access in device settings, or use manual code entry below.
        </Text>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualModal(true)}
        >
          <Keyboard size={20} color={colors.textLight} />
          <Text style={styles.manualButtonText}>Enter Code Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Live camera view ─────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
          <ArrowLeft size={20} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan Station QR Code</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Zap size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinderArea}>
        <View style={styles.scanTargetBox}>
          {/* Corner guides */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={isLookingUp ? undefined : handleBarCodeScanned}
          />

          {isLookingUp && (
            <View style={styles.lookupOverlay}>
              <ActivityIndicator size="large" color={colors.brandAccentGreen} />
              <Text style={styles.lookupText}>Looking up station…</Text>
            </View>
          )}
        </View>

        <Text style={styles.instructionText}>
          Align the station QR code within the frame to verify location &amp; earn points
        </Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualModal(true)}
          activeOpacity={0.85}
        >
          <Keyboard size={20} color={colors.textLight} />
          <Text style={styles.manualButtonText}>Enter Code Manually (Fallback)</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Station Code Modal */}
      <Modal visible={showManualModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manual Station Code</Text>
            <Text style={styles.modalSubtitle}>
              Enter the code printed on the physical station bin (e.g., ST-101).
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="e.g. ST-101"
              placeholderTextColor={colors.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              editable={!isLookingUp}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => { setShowManualModal(false); setErrorMessage(''); }}
                disabled={isLookingUp}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmModalBtn, isLookingUp && { opacity: 0.6 }]}
                onPress={handleManualSubmit}
                disabled={isLookingUp}
              >
                {isLookingUp
                  ? <ActivityIndicator size="small" color={colors.textLight} />
                  : <Text style={styles.confirmModalText}>Verify Code</Text>}
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
    backgroundColor: '#0A1A12',
  },
  centred: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  permissionSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.heroPadding,
    paddingTop: 54,
    paddingBottom: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16.5,
    color: colors.textLight,
  },
  viewfinderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  scanTargetBox: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.brandAccentGreen,
    zIndex: 10,
  },
  topLeft: {
    top: -2, left: -2,
    borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16,
  },
  topRight: {
    top: -2, right: -2,
    borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: -2, left: -2,
    borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: -2, right: -2,
    borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16,
  },
  lookupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    gap: 12,
  },
  lookupText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  instructionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 28,
    lineHeight: 20,
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: '#F87171',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  bottomArea: {
    paddingHorizontal: spacing.heroPadding,
    paddingBottom: 40,
  },
  manualButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  manualButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14.5,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
  modalSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  codeInput: {
    backgroundColor: colors.bgCanvas,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.bgCanvas,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cancelModalText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmModalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
  },
  confirmModalText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
});
