import BusCard from '@/components/businfo';
import { getBusData } from '@/utils/busData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchBus() {
    const router = useRouter();
    const allBuses = getBusData();

    const [start, setStart] = useState('');
    const [destination, setDestination] = useState('');
    const [editing, setEditing] = useState<'start' | 'end' | null>(null);

    const locationSuggestions = useMemo(() => {
        const starts = allBuses.map(b => b.startLocation);
        const ends = allBuses.map(b => b.endLocation);
        return Array.from(new Set([...starts, ...ends]));
    }, [allBuses]);

    const currentInput = editing === 'start' ? start : destination;

    const filteredSuggestions = useMemo(() =>
            currentInput.length > 0
                ? locationSuggestions.filter(loc =>
                    loc.toLowerCase().includes(currentInput.toLowerCase())
                )
                : [],
        [currentInput, locationSuggestions]
    );

    const filteredBuses = useMemo(() => {
        if (!start.trim() || !destination.trim()) return [];
        return allBuses.filter(bus =>
            bus.startLocation.toLowerCase() === start.toLowerCase() &&
            bus.endLocation.toLowerCase() === destination.toLowerCase()
        );
    }, [start, destination, allBuses]);

    const renderBus = ({ item }) => (
        <BusCard
            routeName={item.routeName}
            busNumber={item.busNumber}
            occupancy={item.occupancy}
            startLocation={item.startLocation}
            endLocation={item.endLocation}
            startTime={item.startTime}
            endTime={item.endTime}
            busType={item.busType}
            fare={item.fare}
            eta={item.eta}
            isLive={true}
        />
    );

    const applySuggestion = (value: string) => {
        if (editing === 'start') setStart(value);
        else setDestination(value);
        setEditing(null);
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView className="flex-1 bg-bg_gray px-6 pt-2">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-5">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="justify-center items-center"
                    activeOpacity={0.7}
                >
                    <Image source={require('@/images/back.png')} className="h-7 w-7" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-cyan_4txt font-semibold text-lg">Select Route</Text>
                </View>
                <View className="w-6">{/* Empty right placeholder */}</View>
            </View>

            {/* Route Visualization Card */}
            <View className="bg-card rounded-2xl border-2 border-card_bor p-6 mb-6" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
            }}>
                {/* Current Location */}
                <View className="flex-row items-center">
                    <View className="w-5 h-5 bg-green-500 rounded-full items-center justify-center mr-4">
                        <View className="w-2 h-2 bg-white rounded-full" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-sm font-medium">Current Location</Text>
                        <TextInput
                            value={start}
                            onChangeText={text => {
                                setStart(text);
                                setEditing('start');
                            }}
                            placeholder="Your current location"
                            placeholderTextColor="#9CA3AF"
                            className="text-white text-base font-medium"
                            style={{
                                borderBottomWidth: start ? 0 : 1,
                                borderColor: '#E5E7EB',
                                paddingVertical: 4,
                            }}
                            autoCapitalize="words"
                            onFocus={() => setEditing('start')}
                            onBlur={() => {
                                // Keep dropdown open briefly for selection
                                setTimeout(() => setEditing(null), 150);
                            }}
                        />
                    </View>
                </View>

                {/* Connecting Line */}
                <View className="ml-2 mb-3 items-start">
                    {Array.from({length: 4}).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 2,
                                height: 2,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 1,
                                marginVertical: 4,
                                opacity: 0.6,
                            }}
                        />
                    ))}
                </View>
                {/* Destination */}
                <View className="flex-row items-center mb-2">
                    <View className="w-5 h-5 bg-orange-500 rounded-full items-center justify-center mr-4">
                        <View className="w-2 h-2 bg-white rounded-full" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-sm font-medium ">Drop Location</Text>
                        <TextInput
                            value={destination}
                            onChangeText={text => {
                                setDestination(text);
                                setEditing('end');
                            }}
                            placeholder="Where to?"
                            placeholderTextColor="#9CA3AF"
                            className="text-white text-base font-medium"
                            style={{
                                borderBottomWidth: destination ? 0 : 1,
                                borderColor: '#E5E7EB',
                                paddingVertical: 4,
                            }}
                            autoCapitalize="words"
                            onFocus={() => setEditing('end')}
                            onBlur={() => {
                                // Keep dropdown open briefly for selection
                                setTimeout(() => setEditing(null), 150);
                            }}
                        />
                    </View>
                </View>

                {/* Suggestions Dropdown */}
                {editing && filteredSuggestions.length > 0 && (
                    <View
                        className="absolute bg-card rounded-xl border border-cyan_4bor max-h-[180px] shadow-lg"
                        style={{
                            top: editing === 'start' ? 85 : 165,
                            left: 24,
                            right: 24,
                            zIndex: 1000,
                        }}
                    >

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredSuggestions.map((suggestion, index) => (
                                <TouchableOpacity
                                    key={suggestion}
                                    onPress={() => applySuggestion(suggestion)}
                                    style={{
                                        padding: 16,
                                        borderBottomWidth: index < filteredSuggestions.length - 1 ? 1 : 0,
                                        borderColor: '#F3F4F6',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="location-outline"
                                        size={16}
                                        color="#9CA3AF"
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text className="text-white text-base flex-1">{suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Results Section */}
            {!start || !destination ? (
                <View className="flex-1 justify-center items-center">
                    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="location-outline" size={32} color="#9CA3AF" />
                    </View>
                    <Text className="text-white text-base text-center">
                        Select your pickup and drop locations{'\n'}to find available buses
                    </Text>
                </View>
            ) : filteredBuses.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="bus-outline" size={32} color="#9CA3AF" />
                    </View>
                    <Text className="text-white text-base text-center">
                        No buses available for this route{'\n'}Please try different locations
                    </Text>
                </View>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg font-semibold mb-4">Available Buses</Text>
                    <FlatList
                        data={filteredBuses}
                        keyExtractor={item => item.id}
                        renderItem={renderBus}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View className="h-1" />}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}