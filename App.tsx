import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { EcoProvider, useEco } from './src/context/EcoContext';
import { BottomNavDock, TabType } from './src/components/layout/BottomNavDock';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { UniversitySetupScreen } from './src/screens/UniversitySetupScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { NearbyStationsScreen } from './src/screens/NearbyStationsScreen';
import { StationDetailsScreen } from './src/screens/StationDetailsScreen';
import { QRScannerScreen } from './src/screens/QRScannerScreen';
import { MaterialSelectScreen } from './src/screens/MaterialSelectScreen';
import { ActionSuccessScreen } from './src/screens/ActionSuccessScreen';
import { PointsDashboardScreen } from './src/screens/PointsDashboardScreen';
import { ChallengesScreen } from './src/screens/ChallengesScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { ImpactDashboardScreen } from './src/screens/ImpactDashboardScreen';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RecyclingSelection, RecyclingTransaction, Station } from './src/types';
import { colors } from './src/theme/tokens';

type RootFlow = 'welcome' | 'university_setup' | 'main_app';
type ActiveSubView = 
  | 'dashboard'
  | 'stations_list'
  | 'station_details'
  | 'qr_scanner'
  | 'material_select'
  | 'action_success'
  | 'points_dashboard'
  | 'leaderboard'
  | 'impact'
  | 'achievements'
  | 'settings'
  | 'edit_profile';

function MainAppContent({ onResetFlow }: { onResetFlow: () => void }) {
  const { stations, submitRecycling, isSubmitting, isLoadingProfile } = useEco();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSubView, setActiveSubView] = useState<ActiveSubView>('dashboard');
  
  const [selectedStation, setSelectedStation] = useState<Station>(stations[0]);
  const [verificationMethod, setVerificationMethod] = useState<'qr_code' | 'manual_fallback'>('qr_code');
  const [lastTransaction, setLastTransaction] = useState<RecyclingTransaction | null>(null);

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setActiveSubView('dashboard');
    } else if (tab === 'scan') {
      setActiveSubView('qr_scanner');
    } else {
      setActiveSubView('dashboard');
    }
  };

  const handleStationDetected = (station: Station, method: 'qr_code' | 'manual_fallback') => {
    setSelectedStation(station);
    setVerificationMethod(method);
    setActiveSubView('material_select');
  };

  const handleSubmitSelections = async (selections: RecyclingSelection[]) => {
    const res = await submitRecycling(
      selectedStation.id,
      selectedStation.name,
      selections,
      verificationMethod
    );
    if (res.success && res.transaction) {
      setLastTransaction(res.transaction);
      setActiveSubView('action_success');
    }
  };

  return (
    <View style={styles.appWrapper}>
      <StatusBar style="dark" />

      {/* Main Viewport Router */}
      <View style={styles.mainContainer}>
        {activeTab === 'home' && (
          <>
            {activeSubView === 'dashboard' && (
              <HomeScreen
                onNavigateToScan={() => setActiveSubView('qr_scanner')}
                onNavigateToStations={() => setActiveSubView('stations_list')}
                onNavigateToPoints={() => setActiveSubView('points_dashboard')}
                onNavigateToLeaderboard={() => setActiveSubView('leaderboard')}
              />
            )}

            {activeSubView === 'stations_list' && (
              <NearbyStationsScreen
                onSelectStation={(st) => {
                  setSelectedStation(st);
                  setActiveSubView('station_details');
                }}
                onBackPress={() => setActiveSubView('dashboard')}
              />
            )}

            {activeSubView === 'station_details' && (
              <StationDetailsScreen
                station={selectedStation}
                onBackPress={() => setActiveSubView('stations_list')}
                onStartScan={(st) => {
                  setSelectedStation(st);
                  setActiveSubView('qr_scanner');
                }}
              />
            )}

            {activeSubView === 'points_dashboard' && (
              <PointsDashboardScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            )}

            {activeSubView === 'leaderboard' && (
              <LeaderboardScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            )}

            {activeSubView === 'impact' && (
              <ImpactDashboardScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            )}

            {activeSubView === 'achievements' && (
              <AchievementsScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            )}

            {activeSubView === 'settings' && (
              <SettingsScreen
                onBackPress={() => setActiveSubView('dashboard')}
                onLogout={onResetFlow}
              />
            )}
          </>
        )}

        {activeTab === 'challenges' && (
          <ChallengesScreen
            onNavigateToLeaderboard={() => {
              setActiveTab('home');
              setActiveSubView('leaderboard');
            }}
          />
        )}

        {activeTab === 'rewards' && <RewardsScreen />}

        {activeTab === 'profile' && (
          <>
            {activeSubView === 'edit_profile' ? (
              <UniversitySetupScreen
                onCompleteSetup={() => setActiveSubView('dashboard')}
              />
            ) : activeSubView === 'leaderboard' ? (
              <LeaderboardScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            ) : activeSubView === 'impact' ? (
              <ImpactDashboardScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            ) : activeSubView === 'achievements' ? (
              <AchievementsScreen
                onBackPress={() => setActiveSubView('dashboard')}
              />
            ) : activeSubView === 'settings' ? (
              <SettingsScreen
                onBackPress={() => setActiveSubView('dashboard')}
                onLogout={onResetFlow}
              />
            ) : (
              <ProfileScreen
                onNavigateToEditProfile={() => setActiveSubView('edit_profile')}
                onNavigateToSettings={() => setActiveSubView('settings')}
                onNavigateToAchievements={() => setActiveSubView('achievements')}
                onNavigateToImpact={() => setActiveSubView('impact')}
                onNavigateToLeaderboard={() => setActiveSubView('leaderboard')}
              />
            )}
          </>
        )}

        {/* Modal Overlay Screens */}
        {activeSubView === 'qr_scanner' && (
          <QRScannerScreen
            onStationDetected={handleStationDetected}
            onClose={() => setActiveSubView('dashboard')}
          />
        )}

        {activeSubView === 'material_select' && (
          <MaterialSelectScreen
            station={selectedStation}
            verificationMethod={verificationMethod}
            onBackPress={() => setActiveSubView('qr_scanner')}
            onSubmitSelections={handleSubmitSelections}
            isSubmitting={isSubmitting}
          />
        )}

        {activeSubView === 'action_success' && lastTransaction && (
          <ActionSuccessScreen
            transaction={lastTransaction}
            onDone={() => {
              setActiveTab('home');
              setActiveSubView('dashboard');
            }}
          />
        )}
      </View>

      {/* Bottom Navigation Dock */}
      {activeSubView !== 'qr_scanner' && activeSubView !== 'action_success' && (
        <BottomNavDock activeTab={activeTab} onTabSelect={handleTabSelect} />
      )}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [flow, setFlow] = useState<RootFlow>('welcome');

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return (
    <EcoProvider>
      <View style={styles.appWrapper}>
        {flow === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setFlow('university_setup')}
            onLoginPress={() => setFlow('university_setup')}
          />
        )}

        {flow === 'university_setup' && (
          <UniversitySetupScreen
            onCompleteSetup={() => setFlow('main_app')}
          />
        )}

        {flow === 'main_app' && (
          <MainAppContent onResetFlow={() => setFlow('welcome')} />
        )}
      </View>
    </EcoProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
  },
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCanvas,
  },
});
