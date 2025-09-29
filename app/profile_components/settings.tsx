import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    StatusBar, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

const Settings = () => {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(true);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1 bg-gray-900">
                <StatusBar barStyle="light-content" backgroundColor="#111827" />

                {/* Header with Equal Sections */}
                <View className="flex-row items-center px-4 py-9 mt-2">
                    {/* Left Section - Back Button */}
                    <View className="flex-1 items-start">
                        <TouchableOpacity
                            onPress={handleGoBack}
                            className="w-10 h-10 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Image source={require('@/images/back.png')} className="h-10 w-10" />
                        </TouchableOpacity>
                    </View>

                    {/* Center Section - Title */}
                    <View className="flex-1 items-center justify-between">
                        <Text className="text-white text-xl font-semibold">
                            Settings
                        </Text>
                    </View>

                    {/* Right Section - Empty for balance */}
                    <View className="flex-1 items-end">
                        {/* Empty space to balance the layout */}
                    </View>
                </View>

                {/* Settings Items Container */}
                <View className="px-4 mt-4">
                    {/* Dark Mode Setting */}
                    <View className="bg-white rounded-2xl p-2 px-4 mb-4 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            {/* Half Moon Icon */}
                            <View className="w-8 h-8 mr-4">
                                <Ionicons name="moon" size={24} color="#6B7280" />
                            </View>
                            {/* Text */}
                            <Text className="text-gray-900 text-base font-normal">
                                Dark Mode
                            </Text>
                        </View>

                        {/* Toggle Switch */}
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#E5E7EB', true: '#06b6d4' }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#E5E7EB"
                            style={{
                                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
                            }}
                        />
                    </View>

                    {/* Manage Saved Routes */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center flex-1">
                            {/* Location Pin Icon */}
                            <View className="w-8 h-8 mr-4">
                                <Ionicons name="location-outline" size={24} color="#6B7280" />
                            </View>
                            {/* Text */}
                            <Text className="text-gray-900 text-base font-normal">
                                Manage Saved Routes
                            </Text>
                        </View>

                        {/* Arrow */}
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Account Security */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center flex-1">
                            {/* Shield Icon */}
                            <View className="w-8 h-8 mr-4">
                                <Ionicons name="shield-checkmark-outline" size={24} color="#6B7280" />
                            </View>
                            {/* Text */}
                            <Text className="text-gray-900 text-base font-normal">
                                Account Security
                            </Text>
                        </View>

                        {/* Arrow */}
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Settings;
