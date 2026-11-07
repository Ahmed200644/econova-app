export const colors = {
  // App Canvas Background
  bgCanvas: '#F7F9F5',

  // Dark Emerald Hero Card
  bgHeroDark: '#0E2D1C',
  bgHeroDarkSecondary: '#0D3823',

  // Primary Brand Accent (Green)
  brandPrimary: '#0F6D43',
  brandPrimaryDark: '#0A4B2D',
  brandPrimaryLight: '#126B45',
  brandAccentGreen: '#27B36A',
  brandLightGreen: '#E6F4EA',

  // Cards & Containers
  cardLight: '#FFFFFF',
  cardTintLight: '#EEF3EE',

  // Typography Colors
  textPrimary: '#17231D',
  textSecondary: '#6B7E74',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',

  // Borders & Dividers
  borderLight: '#E2E8F0',
  borderGreenTint: 'rgba(39, 179, 106, 0.35)',
  borderHeroRing: 'rgba(39, 179, 106, 0.15)',

  // Status Badges
  statusOpenBg: '#E6F4EA',
  statusOpenText: '#0F6D43',
  statusClosedBg: '#FCE8E6',
  statusClosedText: '#C5221F',
  statusClosingSoonBg: '#FEF3C7',
  statusClosingSoonText: '#D97706',
};

export const typography = {
  fontFamily: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 44,
  },
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  hero: 26.8,
  pill: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  heroPadding: 24.7,
};

export const shadows = {
  heroCard: {
    shadowColor: '#0E2D1C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dock: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
};
