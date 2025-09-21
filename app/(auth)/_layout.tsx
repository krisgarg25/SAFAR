import { Stack } from "expo-router";
import "../globals.css"


const Layout =() => {
    return <Stack >
        <Stack.Screen name="welcome"  options={{ headerShown :false}} />
        <Stack.Screen name="log_in/email"  options={{ headerShown :false}} />
        <Stack.Screen name="log_in/phone_number"  options={{ headerShown :false}} />
        <Stack.Screen name="sign_up"  options={{ headerShown :false}} />
    </Stack>;
}
export default Layout;