import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    View,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        if (!isLoaded) return;

        // Validation
        if (!form.name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }

        if (!form.email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        if (!form.password.trim()) {
            Alert.alert("Error", "Please enter a password");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // Create with firstName and lastName directly
            const firstName = form.name.split(' ')[0] || form.name;
            const lastName = form.name.split(' ').slice(1).join(' ') || '';

            await signUp.create({
                emailAddress: form.email,
                password: form.password,
                firstName: firstName,
                lastName: lastName,
            });

            console.log("✅ Signup created with name:", firstName, lastName);
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setShowVerifyModal(true);

        } catch (err: any) {
            console.log("Sign up error:", err);

            // If firstName/lastName failed, try just email/password
            if (err.errors && err.errors[0]?.code === "form_param_unknown") {
                try {
                    await signUp.create({
                        emailAddress: form.email,
                        password: form.password,
                    });

                    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                    setShowVerifyModal(true);
                    console.log("✅ Signup created without name fields");
                } catch (retryErr: any) {
                    Alert.alert("Error", "Sign up failed. Please try again.");
                }
            } else if (err.status === 429) {
                Alert.alert("Too Many Attempts", "Please wait before trying again.");
            } else {
                Alert.alert("Error", err.errors[0]?.longMessage || "Sign up failed. Please try again.");
            }
        }

        setLoading(false);
    };

    const handleVerify = async () => {
        if (!isLoaded) return;

        if (!code.trim() || code.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: code.trim()
            });

            if (result.status === "complete") {
                console.log("✅ Verification complete");
                await setActive({ session: result.createdSessionId });

                setShowVerifyModal(false);
                setShowSuccessModal(true);
            } else {
                setError("Verification failed. Please try again.");
            }
        } catch (err: any) {
            console.log("Verify error:", err);
            if (err.status === 429) {
                setError("Too many attempts. Please wait.");
            } else {
                setError("Invalid code. Please try again.");
            }
        }

        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#1A202C' }}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 50
                    }}
                >
                    {/* Header */}
                    <View className="pt-8 pb-6 items-center">
                        <Text className="text-2xl text-white font-bold">
                            Lets Get Started
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="px-6 flex-1">
                        <View className="space-y-3 mb-6">
                            <InputField
                                label="NAME"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChangeText={(value) => setForm({ ...form, name: value })}
                                autoCapitalize="words"
                                returnKeyType="next"
                            />

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
                                returnKeyType="next"
                            />

                            <InputField
                                label="CONFIRM PASSWORD"
                                placeholder="Confirm your password"
                                secureTextEntry={true}
                                value={form.confirmPassword}
                                onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
                                returnKeyType="done"
                                onSubmitEditing={handleSignUp}
                            />
                        </View>

                        <CustomButton
                            title={loading ? "Creating Account..." : "Create Account"}
                            onPress={handleSignUp}
                            className="mb-4"
                        />

                        <OAuth />

                        {/* Sign In Link */}
                        <View className="flex-row justify-center items-center mt-4 mb-6">
                            <Text className="text-gray-400 text-base">
                                Already have an account?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/welcome")}>
                                <Text className="text-base font-medium" style={{ color: '#EF6820' }}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Verify Modal */}
            <Modal visible={showVerifyModal} transparent={true}>
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View
                        className="flex-1 justify-center items-center px-6"
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    >
                        <View className="bg-white w-full max-w-sm p-6 rounded-2xl">
                            <Text className="text-xl font-bold mb-4 text-black text-center">
                                Enter Verification Code
                            </Text>

                            <Text className="text-gray-600 mb-6 text-center">
                                Check {form.email} for your 6-digit code
                            </Text>

                            <View className="bg-gray-100 rounded-lg p-4 mb-4">
                                <TextInput
                                    placeholder="000000"
                                    placeholderTextColor="#9CA3AF"
                                    value={code}
                                    onChangeText={(text) => {
                                        setCode(text);
                                        setError("");
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    style={{
                                        fontSize: 18,
                                        textAlign: 'center',
                                        letterSpacing: 8,
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }}
                                    autoFocus={true}
                                />
                            </View>

                            {error ? (
                                <Text className="text-red-500 text-sm mb-4 text-center">
                                    {error}
                                </Text>
                            ) : null}

                            <TouchableOpacity
                                className="rounded-full py-4 mb-4"
                                style={{ backgroundColor: '#EF6820' }}
                                onPress={handleVerify}
                                disabled={loading}
                            >
                                <Text className="text-white text-center font-semibold text-lg">
                                    {loading ? "Verifying..." : "Verify"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="py-3"
                                onPress={() => setShowVerifyModal(false)}
                            >
                                <Text className="text-gray-500 text-center">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Success Modal */}
            <Modal visible={showSuccessModal} transparent={true}>
                <View
                    className="flex-1 justify-center items-center px-6"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                >
                    <View className="bg-white w-full max-w-sm p-8 rounded-2xl items-center">
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mb-6"
                            style={{ backgroundColor: '#22C55E' }}
                        >
                            <Text className="text-white text-2xl font-bold">✓</Text>
                        </View>

                        <Text className="text-xl font-bold text-center text-black mb-3">
                            Welcome!
                        </Text>
                        <Text className="text-gray-500 text-center mb-8">
                            Account created successfully
                        </Text>

                        <TouchableOpacity
                            className="rounded-full py-4 px-8 w-full"
                            style={{ backgroundColor: '#EF6820' }}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace("/(tabs)/Home");
                            }}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                Get Started
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default SignUp;
