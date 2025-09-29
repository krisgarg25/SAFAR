import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const onSignInPress = async () => {
        if (!isLoaded) return;

        // Basic validation
        if (!form.email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        if (!form.password.trim()) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        setLoading(true);

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });

                // Success feedback
                Alert.alert("Welcome back!", "You have been signed in successfully.", [
                    {
                        text: "Continue",
                        onPress: () => router.replace("/(tabs)/Home")
                    }
                ]);
            } else {
                console.log("Sign in incomplete:", JSON.stringify(signInAttempt, null, 2));
                Alert.alert("Error", "Sign in incomplete. Please try again.");
            }
        } catch (err: any) {
            console.log("Sign in error:", JSON.stringify(err, null, 2));

            let errorMessage = "Invalid email or password";

            if (err.status === 429) {
                errorMessage = "Too many attempts. Please wait before trying again.";
            } else if (err.errors && err.errors[0]?.longMessage) {
                errorMessage = err.errors[0].longMessage;
            }

            Alert.alert("Sign In Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            "Forgot Password",
            "Password reset functionality will be implemented soon!",
            [{ text: "OK" }]
        );
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#1A202C' }}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Header */}
                <View className="pt-16 pb-10 items-center">
                    <Text className="text-3xl text-white font-bold">
                        Welcome Back 👋
                    </Text>
                    <Text className="text-gray-400 text-base mt-2">
                        Sign in to continue to Bus Buddy
                    </Text>
                </View>

                {/* Form */}
                <View className="px-6 flex-1">
                    <View className="space-y-4 mb-6">
                        <InputField
                            label="EMAIL ID"
                            placeholder="Enter your email"
                            value={form.email}
                            onChangeText={(value) => setForm({ ...form, email: value })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                        />

                        <InputField
                            label="PASSWORD"
                            placeholder="Enter your password"
                            secureTextEntry={true}
                            value={form.password}
                            onChangeText={(value) => setForm({ ...form, password: value })}
                            returnKeyType="done"
                            onSubmitEditing={onSignInPress}
                        />
                    </View>

                    {/* Forgot Password Link */}
                    <View className="items-end mb-8">
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text
                                className="text-base font-medium"
                                style={{ color: '#06b6d4' }}
                            >
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <CustomButton
                        title={loading ? "Signing In..." : "Sign In"}
                        onPress={onSignInPress}
                        className="mb-6"
                        bgVariant={loading ? "secondary" : "primary"}

                    />


                    <OAuth />

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center items-center mt-6 mb-8">
                        <Text className="text-gray-400 text-base">
                            Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/sign_up")}>
                            <Text
                                className="text-base font-medium"
                                style={{ color: '#06b6d4' }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
