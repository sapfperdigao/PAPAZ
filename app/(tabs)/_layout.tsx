import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { palette } from '@/theme/tokens';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  const active = dark ? palette.accent.dark : palette.accent.light;
  const inactive = dark ? palette.muted.dark : palette.muted.light;
  const surface = dark ? palette.surface.dark : palette.surface.light;
  const base = dark ? palette.base.dark : palette.base.light;
  const ink = dark ? palette.ink.dark : palette.ink.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: base },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: 'Archivo-Bold', color: ink, fontSize: 20 },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: surface,
          borderTopColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,26,63,0.08)',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'My List',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
