import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import {router} from "expo-router";
import RouteCard from '@/components/saved_route_card';
import {SafeAreaView} from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";

const profile = () => {
    const { user } = useUser();

    const getDisplayName = () => {
        if (!user) return "USER";

        // Fallback to email prefix
        if (user.emailAddresses?.[0]) {
            return user.emailAddresses[0].emailAddress.split('@')[0].toUpperCase();
        }

        return "USER";
    };

    return (
        <SafeAreaView className='flex-1 bg-bg_gray'>
            <View className="flex-row justify-between items-center px-4 py-4">
                <View className="flex-row items-center">
                    <Text className="text-white text-lg mr-2">Welcome,</Text>
                    <View className="bg-bg_gray px-3 py-1 rounded-full border border-cyan_4bor">
                        <Text className="text-white font-medium">
                            {getDisplayName()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity className="p-2">
                    <Ionicons name="menu" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="mb-3">
                <SearchBar
                    onPress={() => router.push('/search')}
                    placeholder="Search"
                />
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{minHeight:"100%"}}>
                <View className="mt-4">
                    <RouteCard
                        routeNumber="a"
                        startDestination="Rajpura"
                        stopDestination="Rajpura"
                        onPress={() => console.log('Card pressed')}
                    />
                    <RouteCard
                        routeNumber="101"
                        startDestination="Rajpura"
                        stopDestination="Rajpura"
                        onPress={() => console.log('Card pressed')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default profile
