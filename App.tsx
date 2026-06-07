import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { theme } from './src/theme';
import { Loader } from './src/components/ui';
import { TabBar, TabKey } from './src/components/TabBar';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SessionLogScreen } from './src/screens/SessionLogScreen';
import { PBScreen } from './src/screens/PBScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function Root() {
  const { ready } = useStore();
  const [tab, setTab] = useState<TabKey>('dashboard');

  if (!ready) return <Loader />;

  return (
    <View style={styles.app}>
      <View style={styles.content}>
        {tab === 'dashboard' && <DashboardScreen />}
        {tab === 'log' && <SessionLogScreen />}
        {tab === 'pb' && <PBScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </View>
      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.colors.bg },
  content: { flex: 1 },
});
