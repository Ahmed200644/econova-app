import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRight, MapPin, Search, Filter } from 'lucide-react-native';
import { useEco } from '../context/EcoContext';
import { Station } from '../types';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

interface NearbyStationsScreenProps {
  onSelectStation: (station: Station) => void;
  onBackPress?: () => void;
}

export const NearbyStationsScreen: React.FC<NearbyStationsScreenProps> = ({
  onSelectStation,
}) => {
  const { stations } = useEco();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'plastic' | 'ewaste'>('all');

  const filteredStations = stations.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || s.acceptedMaterials.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recycling Stations</Text>
        <Text style={styles.subtitle}>Discover campus hubs near you</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by faculty, building or code..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              All Hubs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'plastic' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('plastic')}
          >
            <Text style={[styles.filterText, selectedFilter === 'plastic' && styles.filterTextActive]}>
              Plastic & Paper
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'ewaste' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('ewaste')}
          >
            <Text style={[styles.filterText, selectedFilter === 'ewaste' && styles.filterTextActive]}>
              E-Waste
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stations List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredStations.map((station) => (
          <TouchableOpacity
            key={station.id}
            style={styles.stationCard}
            onPress={() => onSelectStation(station)}
            activeOpacity={0.85}
          >
            <View style={styles.iconBox}>
              <MapPin size={22} color={colors.brandPrimary} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.stationName}>{station.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    station.status === 'open' ? styles.statusOpen : styles.statusClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      station.status === 'open' ? styles.statusTextOpen : styles.statusTextClosed,
                    ]}
                  >
                    {station.status === 'open' ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>

              <Text style={styles.locationText} numberOfLines={1}>
                {station.locationName}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.codeText}>Code: {station.code}</Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.distanceText}>{station.distanceMeters} m away</Text>
              </View>

              {/* Accepted materials tags */}
              <View style={styles.tagsRow}>
                {station.acceptedMaterials.map((mat) => (
                  <View key={mat} style={styles.matTag}>
                    <Text style={styles.matTagText}>{mat.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>

            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
  },
  header: {
    paddingHorizontal: spacing.heroPadding,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: colors.cardLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: colors.bgCanvas,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: typography.fontFamily.medium,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.bgCanvas,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  filterText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterTextActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  listContainer: {
    paddingHorizontal: spacing.heroPadding,
    paddingVertical: 16,
    gap: 12,
  },
  stationCard: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.cardTintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  statusOpen: {
    backgroundColor: colors.statusOpenBg,
  },
  statusClosed: {
    backgroundColor: colors.statusClosedBg,
  },
  statusText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 10,
  },
  statusTextOpen: {
    color: colors.statusOpenText,
  },
  statusTextClosed: {
    color: colors.statusClosedText,
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  codeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.brandPrimary,
  },
  dotSeparator: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  distanceText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  matTag: {
    backgroundColor: colors.cardTintLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matTagText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    color: colors.brandPrimary,
  },
});
