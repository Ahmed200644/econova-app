import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, ChevronRight, GraduationCap } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface UniversitySetupScreenProps {
  onCompleteSetup: () => void;
}

const UNIVERSITIES = [
  'Luxor University',
  'Cairo University',
  'Ain Shams University',
  'Alexandria University',
  'Mansoura University',
];

const FACULTIES = [
  'Faculty of Science',
  'Faculty of Engineering',
  'Faculty of Computer & Information Science',
  'Faculty of Medicine',
  'Faculty of Business',
  'Faculty of Arts',
];

const ACADEMIC_YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate'];

export const UniversitySetupScreen: React.FC<UniversitySetupScreenProps> = ({
  onCompleteSetup,
}) => {
  const { user, updateUniversitySetup } = useEco();
  const [name, setName] = useState(user.name);
  const [selectedUniv, setSelectedUniv] = useState(user.university);
  const [selectedFaculty, setSelectedFaculty] = useState(user.faculty);
  const [selectedYear, setSelectedYear] = useState(user.academicYear);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);
    await updateUniversitySetup(selectedUniv, selectedFaculty, selectedYear, name);
    setIsSaving(false);
    onCompleteSetup();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerArea}>
        <View style={styles.iconBox}>
          <GraduationCap size={32} color={colors.brandPrimary} />
        </View>
        <Text style={styles.title}>Complete Campus Setup</Text>
        <Text style={styles.subtitle}>
          Select your university and faculty so your recycling points count towards your faculty leaderboard!
        </Text>
      </View>

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Your Full Name</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* University Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Select University</Text>
        {UNIVERSITIES.map((univ) => (
          <TouchableOpacity
            key={univ}
            style={[
              styles.optionChip,
              selectedUniv === univ && styles.optionChipSelected,
            ]}
            onPress={() => setSelectedUniv(univ)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.optionText,
                selectedUniv === univ && styles.optionTextSelected,
              ]}
            >
              {univ}
            </Text>
            {selectedUniv === univ && <Check size={18} color={colors.brandPrimary} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Faculty Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Select Faculty</Text>
        {FACULTIES.map((fac) => (
          <TouchableOpacity
            key={fac}
            style={[
              styles.optionChip,
              selectedFaculty === fac && styles.optionChipSelected,
            ]}
            onPress={() => setSelectedFaculty(fac)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.optionText,
                selectedFaculty === fac && styles.optionTextSelected,
              ]}
            >
              {fac}
            </Text>
            {selectedFaculty === fac && <Check size={18} color={colors.brandPrimary} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Academic Year */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Academic Year</Text>
        <View style={styles.yearGrid}>
          {ACADEMIC_YEARS.map((yr) => (
            <TouchableOpacity
              key={yr}
              style={[
                styles.yearChip,
                selectedYear === yr && styles.yearChipSelected,
              ]}
              onPress={() => setSelectedYear(yr)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.yearText,
                  selectedYear === yr && styles.yearTextSelected,
                ]}
              >
                {yr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
        onPress={handleSubmit}
        activeOpacity={0.85}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={colors.textLight} />
        ) : (
          <>
            <Text style={styles.saveButtonText}>Confirm &amp; Continue to Dashboard</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </>
        )}
      </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 50,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  optionChip: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  optionChipSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.cardTintLight,
  },
  optionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearChip: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  yearChipSelected: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  yearText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  yearTextSelected: {
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  saveButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radii.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textLight,
  },
});
