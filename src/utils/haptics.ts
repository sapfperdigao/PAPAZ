import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Tactile feedback for key actions (DESIGN_PLAN §6 polish). No-op on web and
// fully defensive — haptics are a nicety, never a dependency of the action, so
// a missing/unavailable module must never break the handler.
export function selectionFeedback(): void {
  if (Platform.OS === 'web') return;
  try {
    Haptics.selectionAsync().catch(() => {});
  } catch {
    /* haptics unavailable — ignore */
  }
}

export function successFeedback(): void {
  if (Platform.OS === 'web') return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  } catch {
    /* haptics unavailable — ignore */
  }
}
