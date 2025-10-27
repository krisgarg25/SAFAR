import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

const EditProfile = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('Ansh');
    const [lastName, setLastName] = useState('Bhardwaj');
    const [email, setEmail] = useState('anshrbhardwaj1@gmail.com');
    const [phoneNumber, setPhoneNumber] = useState('+91 73411 33040');

    const handleGoBack = () => {
        router.back();
    };

    const handleDone = () => {
        // Handle save logic
        console.log('Profile updated');
        router.back();
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1 bg-gray-900">
                <StatusBar barStyle="light-content" backgroundColor="#111827" />

                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Header */}
                    <View className="flex-row items-center px-4 py-4">
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
                        <View className="flex-1 items-center">
                            <Text className="text-white text-xl font-semibold">
                                Edit Profile
                            </Text>
                        </View>

                        {/* Right Section - Done Button */}
                        <View className="flex-1 items-end">
                            <TouchableOpacity
                                onPress={handleDone}
                                activeOpacity={0.7}
                            >
                                <Text className="text-cyan text-base font-medium">
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1 px-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {/* Profile Picture Section */}
                        <View className="items-center mt-6 mb-8">
                            <TouchableOpacity activeOpacity={0.8}>
                                <View className="w-24 h-24 rounded-full bg-pink-300 items-center justify-center mb-3">
                                    {/* Avatar Image - You can replace with actual image */}
                                    <Image
                                        source={{ uri: 'https://via.placeholder.com/96x96/FFB6C1/000000?text=L' }}
                                        className="w-24 h-24 rounded-full"
                                    />
                                </View>
                            </TouchableOpacity>

                            <Text className="text-white text-xl font-semibold mb-1">
                                Ansh
                            </Text>

                            <TouchableOpacity activeOpacity={0.7}>
                                <Text className="text-cyan text-sm font-medium">
                                    Change Profile Picture
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Fields */}
                        <View className="space-y-6">
                            {/* First Name */}
                            <View>
                                <Text className="text-white text-base font-medium mb-2">
                                    First Name
                                </Text>
                                <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
                                    <TextInput
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="First Name"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <Ionicons name="chevron-down" size={16} color="#06b6d4" />
                                </View>
                            </View>

                            {/* Last Name */}
                            <View>
                                <Text className="text-white text-base font-medium mb-2">
                                    Last Name
                                </Text>
                                <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
                                    <TextInput
                                        value={lastName}
                                        onChangeText={setLastName}
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="Last Name"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <Ionicons name="chevron-down" size={16} color="#06b6d4" />
                                </View>
                            </View>

                            {/* Email */}
                            <View>
                                <Text className="text-white text-base font-medium mb-2">
                                    EMAIL
                                </Text>
                                <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="Email"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <Ionicons name="chevron-down" size={16} color="#06b6d4" />
                                </View>
                            </View>

                            {/* Mobile Number */}
                            <View>
                                <Text className="text-white text-base font-medium mb-2">
                                    Mobile Number
                                </Text>
                                <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Text className="text-gray-900 text-base mr-2">+88</Text>
                                        <View className="w-px h-4 bg-gray-400 mr-2" />
                                        <TextInput
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            className="flex-1 text-gray-900 text-base"
                                            placeholder="Phone Number"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <Ionicons name="chevron-down" size={16} color="#06b6d4" />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default EditProfile;
