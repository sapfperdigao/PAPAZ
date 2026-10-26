// Jest setup shared across the suite.

// @expo/vector-icons pulls in expo-font's native module, which isn't available
// under jest-expo ("loadedNativeFonts.forEach is not a function"). Mock every
// icon set to a no-op component. (The factory must not require react-native —
// the nativewind babel transform would inject an out-of-scope reference that
// jest.mock rejects.)
jest.mock('@expo/vector-icons', () => {
  const Icon = () => null;
  return new Proxy({}, { get: () => Icon });
});
