import React, { useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

declare interface InputFieldProps extends TextInputProps {
    label: string;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

const InputField = ({
                        label,
                        labelStyle,
                        secureTextEntry = false,
                        containerStyle,
                        inputStyle,
                        className,
                        ...props
                    }: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="my-2 w-full">
                <Text className={`text-white text-sm font-medium mb-2 ml-1 ${labelStyle}`}>
                    {label.toUpperCase()}
                </Text>
                <View className={`flex flex-row items-center justify-start relative bg-transparent
            rounded-lg border pr-4 ${isFocused ? 'border-cyan' : 'border-gray-500'} ${containerStyle}`}>
                    <TextInput
                        className={`flex-1 p-4 text-[15px] text-white ${inputStyle}`}
                        secureTextEntry={secureTextEntry && !showPassword}
                        placeholderTextColor="#9CA3AF"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={{
                            color: '#FFFFFF',
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'left'
                        }}
                        {...props}
                    />

                    {/* Password toggle icon */}
                    {secureTextEntry && (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={{
                                padding: 4,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Email checkmark icon */}
                    {label.toLowerCase().includes('email') && !secureTextEntry && (
                        <TouchableOpacity
                            style={{
                                padding: 4,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons name="checkmark" size={20} color="#22C55E" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default InputField;
