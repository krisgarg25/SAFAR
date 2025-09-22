import { Stack } from "expo-router";
import "./globals.css"
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from "@clerk/clerk-expo/token-cache";

// Get the publishable key from environment variables
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="buses/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="track/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="set-alert" options={{ headerShown: false }} />
                <Stack.Screen name="search_buses" options={{ headerShown: false }} />
            </Stack>
        </ClerkProvider>
    );
}
