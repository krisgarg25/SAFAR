import { Stack } from "expo-router";
import "./globals.css"
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";
import { router } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
}

function InitialLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isLoaded) return;

        console.log("Auth status:", { isLoaded, isSignedIn });

        if (isSignedIn) {
            // User is signed in, go to home
            router.replace("/(tabs)/Home");
        } else {
            // User is not signed in, go to auth
            router.replace("/(auth)/welcome");
        }
    }, [isLoaded, isSignedIn]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="buses/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="track/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="set-alert" options={{ headerShown: false }} />
            <Stack.Screen name="search_buses" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <InitialLayout />
        </ClerkProvider>
    );
}
