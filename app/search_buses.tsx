import BusCard from '@/components/businfo';
import { getBusData } from '@/utils/busData';

import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchBus() {
    const router = useRouter();
    const allBuses = getBusData();

    // State Management
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [activeInput, setActiveInput] = useState(null); // 'start' | 'destination' | null
    const [showDropdown, setShowDropdown] = useState(false);

    // Location suggestions from bus data
    const locationSuggestions = useMemo(() => {
        const startLocations = allBuses.map(bus => bus.startLocation);
        const endLocations = allBuses.map(bus => bus.endLocation);
        const allLocations = [...startLocations, ...endLocations];
        return [...new Set(allLocations)].sort();
    }, [allBuses]);

    // Filter suggestions based on active input
    const filteredSuggestions = useMemo(() => {
        const inputValue = activeInput === 'start' ? startLocation : destination;

        if (!inputValue.trim() || !activeInput) return [];

        return locationSuggestions.filter(location =>
            location.toLowerCase().includes(inputValue.toLowerCase().trim())
        );
    }, [activeInput, startLocation, destination, locationSuggestions]);

    // Filter buses based on selected locations
    const availableBuses = useMemo(() => {
        if (!startLocation.trim() || !destination.trim()) return [];

        return allBuses.filter(bus =>
            bus.startLocation.toLowerCase() === startLocation.toLowerCase().trim() &&
            bus.endLocation.toLowerCase() === destination.toLowerCase().trim()
        );
    }, [startLocation, destination, allBuses]);

    // Handle input focus
    const handleInputFocus = (inputType) => {
        setActiveInput(inputType);
        setShowDropdown(true);
    };

    // Handle input change
    const handleInputChange = (text, inputType) => {
        if (inputType === 'start') {
            setStartLocation(text);
        } else {
            setDestination(text);
        }
        setActiveInput(inputType);
        setShowDropdown(true);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion) => {
        if (activeInput === 'start') {
            setStartLocation(suggestion);
        } else {
            setDestination(suggestion);
        }
        setActiveInput(null);
        setShowDropdown(false);
        Keyboard.dismiss();
    };

    // Close dropdown
    const closeDropdown = () => {
        setActiveInput(null);
        setShowDropdown(false);
    };

    // Render bus item
    const renderBusItem = ({ item }) => (
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

    // Render suggestion item
    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={() => handleSuggestionSelect(item)}
            activeOpacity={0.7}
        >
            <Image source={require('@/images/location-pin.png')} className="h-6 w-6" />
            <Text className="text-white text-base ml-3 flex-1">{item}</Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={closeDropdown}>
            <SafeAreaView className="flex-1 bg-bg_gray">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pb-5 mr-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                        activeOpacity={0.7}
                    >
                        <Image source={require('@/images/back.png')} className="h-9 w-9" />
                    </TouchableOpacity>

                    <Text className="text-cyan_4txt font-semibold text-lg">Select Route</Text>

                    <View className="w-10" />
                </View>

                {/* Route Selection Card */}
                <View className="mx-6 mb-6">
                    <View
                        className="bg-card rounded-2xl border-2 border-cyan_4bor p-6">

                        {/* Start Location Input */}
                        <View className="flex-row items-center mb-6">
                            <View className="w-5 h-5  items-center justify-center mr-4">
                                <Image source={require('@/images/currentloc_sign.png')} className="h-6 w-6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-sm font-medium mb-2">
                                    Current Location
                                </Text>
                                <TextInput
                                    value={startLocation}
                                    onChangeText={(text) => handleInputChange(text, 'start')}
                                    onFocus={() => handleInputFocus('start')}
                                    placeholder="Your current location"
                                    placeholderTextColor="#9CA3AF"
                                    className="text-white text-base font-medium py-1 border-b border-gray4bor"
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                        {/* Destination Input */}
                        <View className="flex-row items-center mb-1.5">
                            <View className="w-5 h-5  rounded-full items-center justify-center mr-4">
                                <Image source={require('@/images/drop_sign.png')} className="h-6 w-6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-sm font-medium mb-2">
                                    Drop Location
                                </Text>
                                <TextInput
                                    value={destination}
                                    onChangeText={(text) => handleInputChange(text, 'destination')}
                                    onFocus={() => handleInputFocus('destination')}
                                    placeholder="Where to?"
                                    placeholderTextColor="#9CA3AF"
                                    className="text-white text-base font-medium py-2 border-b border-gray4bor"
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dropdown Suggestions */}
                {showDropdown && activeInput && filteredSuggestions.length > 0 && (
                    <View className="mx-6 mb-6">
                        <View
                            className="bg-dropdown rounded-xl border border-cyan_4bor max-h-48"
                        >
                            <FlatList
                                data={filteredSuggestions}
                                renderItem={renderSuggestion}
                                keyExtractor={(item) => item}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                ItemSeparatorComponent={() => (
                                    <View className="h-px bg-gray4bor mx-4" />
                                )}
                            />
                        </View>
                    </View>
                )}

                {/* Results Section */}
                <View className="flex-1 px-2">
                    {!startLocation.trim() || !destination.trim() ? (
                        <View className="flex-1 justify-center items-center">
                            <Image
                                source={require('@/images/location.png')}
                                className="h-12 w-12 mb-4"
                            />
                            <Text className="text-white text-base text-center">
                                Select your pickup and drop locations{'\n'}to find available buses
                            </Text>
                        </View>
                    ) : availableBuses.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Image
                                source={require('@/images/view_buses.png')}
                                className="h-12 w-12 mb-4"
                            />
                            <Text className="text-white text-base text-center">
                                No buses available for this route{'\n'}Please try different locations
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-white text-lg font-semibold  mb-4">
                                Available Buses ({availableBuses.length})
                            </Text>
                            <FlatList
                                data={availableBuses}
                                renderItem={renderBusItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                ItemSeparatorComponent={() => <View className="h-3" />}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
