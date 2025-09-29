import {Text, View, FlatList, Image} from 'react-native';
import * as Location from 'expo-location';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocationStore} from "@/store";
import Map from "@/components/Map";
import BusCard from "@/components/businfo";
import { getBusData } from '@/utils/busData';

import SearchBar from "@/components/SearchBar";
import {useRouter} from "expo-router";


export default function search() {
    const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
    const [loading, setLoading] = useState(true);
    const buses = getBusData();
    const router = useRouter();

    useEffect(() => {
        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission denied');
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});

                const address = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    address: `${address[0]?.name || ''}, ${address[0]?.region || ''}`,
                });

                setLoading(false);
            } catch (error) {
                console.log('Location error:', error);
                setLoading(false);
            }
        };

        getLocation();
    }, [setUserLocation]);

    const renderBusCard = ({ item: bus }) => (
        <BusCard
            routeName={bus.routeName}
            busNumber={bus.busNumber}
            occupancy={bus.occupancy}
            startLocation={bus.startLocation}
            endLocation={bus.endLocation}
            startTime={bus.startTime}
            endTime={bus.endTime}
            busType={bus.busType}
            fare={bus.fare}
            eta={bus.eta}
            isLive={true}
        />
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-bg_gray justify-center items-center">
                <Text className="text-white">Getting location...</Text>
            </SafeAreaView>
        );
    }

    if (!userLatitude || !userLongitude) {
        return (
            <SafeAreaView className="flex-1 bg-bg_gray justify-center items-center">
                <Text className="text-white">Location not available</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg_gray pt-2">
            <SearchBar
                placeholder="Search for destination..."
                onPress={() => router.push('/search_buses')}
            />
            {/* Map Section - Smaller 40% */}
            <View style={{ height: '40%' }} className="border- border-cyan_4bor pt-4">
                <Map />
            </View>

            {/* Nearby Buses Section - Larger 60% */}
            <View className="flex-1">
                {/* Section Header with Better Design */}
                <View className="px-4 py-4 bg-gradient-to-r from-white to-black  border-b border-gray4bor">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 items-center justify-center mr-3">

                                <Image source={require('../../images/view_buses.png')} className="h-[24px] w-[24px]" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold">Nearby Buses</Text>
                            </View>
                        </View>
                        <View className="bg-[rgba(6,182,212,0.2)] px-5 py-2 rounded-full">
                            <Text className="text-cyan text-2xl font-bold">
                                {buses?.length || 0}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bus List with Better Spacing */}
                <FlatList
                    data={buses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBusCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 12,
                        paddingBottom: 90
                    }}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-12">
                            <View className="w-16 h-16 bg-gray-700/50 rounded-full items-center justify-center mb-4">
                                <Image
                                    source={require('@/images/view_buses.png')}
                                    className="h-12 w-12 mb-4"
                                />
                            </View>
                            <Text className="text-gray-400 text-lg font-semibold mb-2">No buses nearby</Text>
                            <Text className="text-gray-500 text-sm text-center px-8">
                                We'll show buses as they become available in your area
                            </Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
