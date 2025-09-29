import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

interface Props {
    onSendOTP?: (phoneNumber: string, countryCode: string) => void;
}

const LoginWithOTP: React.FC<Props> = ({ onSendOTP }) => {
    const navigation = useNavigation();

    // Phone input states
    const [countryCode, setCountryCode] = useState<string>('+91');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);

    // Modal and verification states
    const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Generated OTP state
    const [generatedOTP, setGeneratedOTP] = useState<string>('');

    const countryCodes = [
        { code: '+62', country: 'ID', digits: 10 },
        { code: '+91', country: 'IN', digits: 10 },
        { code: '+1', country: 'US', digits: 10 },
        { code: '+44', country: 'UK', digits: 11 },
        { code: '+86', country: 'CN', digits: 11 },
    ];

    // Generate random 6-digit OTP
    const generateOTP = (): string => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    const handleSendOTP = (): void => {
        const selectedCountry = countryCodes.find(c => c.code === countryCode);
        const requiredDigits = selectedCountry?.digits || 10;

        if (phoneNumber.trim() && phoneNumber.length >= requiredDigits) {
            // Generate random OTP
            const newOTP = generateOTP();
            setGeneratedOTP(newOTP);

            // Log OTP to console (not shown to user)
            console.log('🔑 Generated OTP for', countryCode + phoneNumber, ':', newOTP);

            onSendOTP?.(phoneNumber, countryCode);

            // Show verification modal
            setShowVerifyModal(true);
            setError('');
            setCode('');
        }
    };

    const handleVerify = async (): Promise<void> => {
        if (!code || code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verify against generated OTP
            if (code === generatedOTP) {
                console.log('✅ OTP verified successfully for:', countryCode + phoneNumber);
                setLoading(false);
                setShowVerifyModal(false);
                setShowSuccessModal(true);
            } else {
                setLoading(false);
                setError('Invalid OTP. Please try again.');
                console.log('❌ Invalid OTP. Expected:', generatedOTP, 'Got:', code);
            }

        } catch (err) {
            setLoading(false);
            setError('Verification failed. Please try again.');
            console.error('Verification error:', err);
        }
    };

    const handleCountrySelect = (code: string): void => {
        setCountryCode(code);
        setShowCountryPicker(false);
        setPhoneNumber(''); // Reset phone number when country changes
    };

    const getMaxLength = (): number => {
        const selectedCountry = countryCodes.find(c => c.code === countryCode);
        return selectedCountry?.digits || 10;
    };

    const isPhoneValid = (): boolean => {
        const selectedCountry = countryCodes.find(c => c.code === countryCode);
        const requiredDigits = selectedCountry?.digits || 10;
        return phoneNumber.trim().length >= requiredDigits;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-800">
            <StatusBar barStyle="light-content" backgroundColor="#374151" />

            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity
                    onPress={handleBack}
                    className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-8 pt-8">
                {/* Title */}
                <Text className="text-white text-2xl font-semibold mb-12">
                    Enter Your Mobile Number
                </Text>

                {/* Phone Input Container */}
                <View className="flex-row mb-8">
                    {/* Country Code Picker */}
                    <TouchableOpacity
                        onPress={() => setShowCountryPicker(!showCountryPicker)}
                        className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 mr-3 flex-row items-center justify-center min-w-[80px]"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-medium">
                            {countryCode}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={16}
                            color="white"
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>

                    {/* Phone Number Input */}
                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder={`Enter ${getMaxLength()}-digit number`}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 text-white text-lg"
                        maxLength={getMaxLength()}
                    />
                </View>

                {/* Country Code Dropdown */}
                {showCountryPicker && (
                    <View className="bg-gray-700 border border-gray-600 rounded-xl mb-8 overflow-hidden">
                        {countryCodes.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleCountrySelect(item.code)}
                                className="px-4 py-3 border-b border-gray-600 last:border-b-0"
                                activeOpacity={0.7}
                            >
                                <Text className="text-white text-lg">
                                    {item.country} ({item.code}) - {item.digits} digits
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Generate OTP Button */}
                <TouchableOpacity
                    onPress={handleSendOTP}
                    className={`rounded-2xl py-4 items-center justify-center ${
                        isPhoneValid() ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                    activeOpacity={0.9}
                    disabled={!isPhoneValid()}
                >
                    <Text className="text-white text-lg font-semibold">
                        Generate OTP
                    </Text>
                </TouchableOpacity>

                {/* Phone validation hint */}
                {!isPhoneValid() && phoneNumber.length > 0 && (
                    <Text className="text-red-400 text-sm mt-2 text-center">
                        Please enter at least {getMaxLength()} digits
                    </Text>
                )}
            </View>

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
                                Enter the 6-digit code for {countryCode}{phoneNumber}
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
                                style={{ backgroundColor: '#06b6d4' }}
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
                            style={{ backgroundColor: '#06b6d4' }}
                        >
                            <Text className="text-white text-2xl font-bold">✓</Text>
                        </View>

                        <Text className="text-xl font-bold text-center text-black mb-3">
                            Welcome!
                        </Text>
                        <Text className="text-gray-500 text-center mb-8">
                            Phone number verified successfully
                        </Text>

                        <TouchableOpacity
                            className="rounded-full py-4 px-8 w-full"
                            style={{ backgroundColor: '#06b6d4' }}
                            onPress={() => {
                                setShowSuccessModal(false);
                                // Navigate to Home using Expo Router
                                router.replace('/(tabs)/Home');
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

export default LoginWithOTP;
