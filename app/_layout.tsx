import { Stack } from "expo-router";

export default function LayoutPrincipal() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="auth">
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
