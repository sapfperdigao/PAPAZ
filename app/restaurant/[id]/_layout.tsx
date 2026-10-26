import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

// Detail tabs (spec §7.4). Reviews is deferred to Slice 2 (needs live
// Google/Reddit); the four offline tabs ship here.
export default function RestaurantDetailLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12, textTransform: 'none' },
        tabBarItemStyle: { width: 'auto' },
      }}
    >
      <MaterialTopTabs.Screen name="overview" options={{ title: 'Overview' }} />
      <MaterialTopTabs.Screen name="dishes" options={{ title: 'Dishes' }} />
      <MaterialTopTabs.Screen name="wine" options={{ title: 'Wine' }} />
      <MaterialTopTabs.Screen name="my-notes" options={{ title: 'Notes' }} />
    </MaterialTopTabs>
  );
}
