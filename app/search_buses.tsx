import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, TextInput, FlatList, Text, TouchableOpacity, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getBusData } from '@/utils/busData';
import BusCard from '@/components/businfo';

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
        <SafeAreaView className="flex-1 bg-bg_gray px-4 pt-4">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-orange_4bor">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="justify-center items-center"
                    activeOpacity={0.7}
                >
                    <Image source={require('@/images/back.png')} className="h-10 w-10" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white font-bold text-lg">Track Bus</Text>
                    <Text className="text-accent text-sm">{`${start} → ${destination}`}</Text>
                </View>
                <View className="px-4 ml-3 pl-2">{/* Empty right placeholder */}</View>
            </View>
            {/* Start Input */}
            <View className="mb-3">
                <Text className="text-gray-400 mb-1">Start Position</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#23272e',
                    borderRadius: 12,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: start ? '#EF6820' : '#343A46',
                }}>
                    <Ionicons name="navigate" size={18} color="#EF6820" />
                    <TextInput
                        value={start}
                        onChangeText={text => {
                            setStart(text);
                            setEditing('start');
                        }}
                        placeholder="Type starting location..."
                        placeholderTextColor="#8B949E"
                        className="flex-1 ml-2 text-white text-base"
                        style={{ height: 44 }}
                        autoCapitalize="words"
                        clearButtonMode="while-editing"
                        onFocus={() => setEditing('start')}
                    />
                </View>
                {editing === 'start' && filteredSuggestions.length > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: 54,
                        left: 0, right: 0,
                        backgroundColor: '#23272e',
                        borderRadius: 10,
                        zIndex: 10,
                        elevation: 20,
                    }}>
                        {filteredSuggestions.map(suggestion => (
                            <TouchableOpacity
                                key={suggestion}
                                onPress={() => applySuggestion(suggestion)}
                                style={{
                                    padding: 14,
                                    borderBottomWidth: 1,
                                    borderColor: '#343A46',
                                }}
                            >
                                <Text style={{ color: '#fff' }}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Destination Input */}
            <View className="mb-3">
                <Text className="text-gray-400 mb-1">Destination</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#23272e',
                    borderRadius: 12,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: destination ? '#EF6820' : '#343A46',
                }}>
                    <Ionicons name="location" size={19} color="#EF6820" />
                    <TextInput
                        value={destination}
                        onChangeText={text => {
                            setDestination(text);
                            setEditing('end');
                        }}
                        placeholder="Type destination..."
                        placeholderTextColor="#8B949E"
                        className="flex-1 ml-2 text-white text-base"
                        style={{ height: 44 }}
                        autoCapitalize="words"
                        clearButtonMode="while-editing"
                        onFocus={() => setEditing('end')}
                    />
                </View>
                {editing === 'end' && filteredSuggestions.length > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: 54,
                        left: 0, right: 0,
                        backgroundColor: '#23272e',
                        borderRadius: 10,
                        zIndex: 10,
                        elevation: 20,
                    }}>
                        {filteredSuggestions.map(suggestion => (
                            <TouchableOpacity
                                key={suggestion}
                                onPress={() => applySuggestion(suggestion)}
                                style={{
                                    padding: 14,
                                    borderBottomWidth: 1,
                                    borderColor: '#343A46',
                                }}
                            >
                                <Text style={{ color: '#fff' }}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Divider */}
            <View style={{ height: 2, backgroundColor: '#2e2e2e', marginVertical: 6, borderRadius: 999 }} />

            {/* Results */}
            {!start || !destination ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="search-outline" size={48} color="#6B7280" />
                    <Text className="text-gray-400 mt-4 text-lg text-center">
                        Enter a start and destination to see available buses.
                    </Text>
                </View>
            ) : filteredBuses.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="bus-outline" size={48} color="#6B7280" />
                    <Text className="text-gray-400 mt-4 text-lg text-center">
                        No buses found for this route.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredBuses}
                    keyExtractor={item => item.id}
                    renderItem={renderBus}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
        </SafeAreaView>
    );
}
