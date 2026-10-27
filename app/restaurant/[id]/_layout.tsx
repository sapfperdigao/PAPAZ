import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from 'nativewind';
import { palette } from '@/theme/tokens';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

// Detail tabs (spec §7.4). Reviews is deferred to Slice 2 (needs live
// Google/Reddit); the four offline tabs ship here. Themed to the palette.
export default function RestaurantDetailLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12, textTransform: 'none', fontFamily: 'Inter-SemiBold' },
        tabBarItemStyle: { width: 'auto' },
        tabBarActiveTintColor: dark ? palette.accent.dark : palette.accent.light,
        tabBarInactiveTintColor: dark ? palette.muted.dark : palette.muted.light,
        tabBarStyle: { backgroundColor: dark ? palette.surface.dark : palette.surface.light },
        tabBarIndicatorStyle: {
          backgroundColor: dark ? palette.accent.dark : palette.accent.light,
        },
      }}
    >
      <MaterialTopTabs.Screen name="overview" options={{ title: 'Overview' }} />
      <MaterialTopTabs.Screen name="dishes" options={{ title: 'Dishes' }} />
      <MaterialTopTabs.Screen name="wine" options={{ title: 'Wine' }} />
      <MaterialTopTabs.Screen name="my-notes" options={{ title: 'Notes' }} />
    </MaterialTopTabs>
  );
}
