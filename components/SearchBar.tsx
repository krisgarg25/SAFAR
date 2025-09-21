import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ placeholder, onPress }) => {
    return (
        <View className="mx-4">
            <Pressable
                onPress={onPress}
                className="flex-row bg-card items-center px-5 py-3 rounded-2xl border-2 border-card_bor"
            >
                {/* Glowing Search Icon */}
                <View
                    className="w-8 h-8 items-center justify-center mr-4 rounded-xl"
                >
                    <Image source={require('@/images/search_icon.png')} className="h-7 w-7" />
                </View>

                {/* Placeholder Text */}
                <Text
                    className="flex-1 text-base font-medium tracking-wide text-white60_4txt"
                >
                    {placeholder}
                </Text>
            </Pressable>
        </View>
    );
};

export default SearchBar;