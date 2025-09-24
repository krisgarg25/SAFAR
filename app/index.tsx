import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        // Show loading screen while checking auth
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/(tabs)/Home" />;
    }

    return <Redirect href="/(auth)/welcome" />;
}
