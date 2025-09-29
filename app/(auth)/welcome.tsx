import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";

const Welcome: React.FC = () => {
    const handlePhoneLogin = () => {
        router.push('/(auth)/log_in/phone_number');
    };

    const handleEmailContinue = () => {
        router.push('/(auth)/log_in/email');
    };

    const handleCreateAccount = () => {
        router.push('/(auth)/sign_up');
    };

    return (
        <SafeAreaView className="flex-1 bg-bg_gray">
            <View className="flex-[0.6] justify-center items-center px-5 border-cyan">
                <Image
                    source={require('@/images/Welcome_IMG.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            <View className="items-center">
                <Text className="text-3xl font-bold text-white text-center">
                    Welcome
                </Text>
            </View>

            <View className="flex-[0.4] px-5 pb-12 justify-center">
                <TouchableOpacity
                    className="bg-cyan py-4 px-5 rounded-3xl flex-row items-center justify-center shadow-lg"
                    onPress={handlePhoneLogin}
                    activeOpacity={0.8}
                >
                    <Ionicons name="call" size={20} color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">
                        Login with phone number
                    </Text>
                </TouchableOpacity>

                <View className="flex-row items-center my-5">
                    <View className="flex-1 h-px bg-white35_4bor" />
                    <Text className="text-white60_4txt px-4 text-sm font-medium">OR</Text>
                    <View className="flex-1 h-px bg-white35_4bor" />
                </View>

                <TouchableOpacity
                    className="bg-white py-4 px-5 rounded-3xl flex-row items-center justify-center mb-8 shadow-lg border-cyan"
                    onPress={handleEmailContinue}
                    activeOpacity={0.8}
                >
                    <Ionicons name="mail" size={18} color="#06b6d4" />
                    <Text className="text-cyan_4txt text-base font-semibold ml-2">
                        Continue with Email
                    </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center">
                    <Text className="text-white60_4txt text-sm">Don't have account? </Text>
                    <TouchableOpacity onPress={handleCreateAccount}>
                        <Text className="text-cyan_4txt text-sm font-semibold ml-1">
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Welcome;
