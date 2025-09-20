import { Stack } from "expo-router";
import "./globals.css"


export default function RootLayout() {
  return <Stack >
      <Stack.Screen name="(tabs)"  options={{ headerShown :false}} />
      <Stack.Screen name="buses/[id]"  options={{ headerShown :false}} />
      <Stack.Screen name="track/[id]"  options={{ headerShown :false}} />
      <Stack.Screen name="set-alert"  options={{ headerShown :false}} />
      <Stack.Screen name="search_buses"  options={{ headerShown :false}} />
  </Stack>;
}
