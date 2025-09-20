// app/track/[id].tsx
import React, { useEffect, useState, useRef } from 'react';
import {View, Text, ScrollView, ActivityIndicator, Image, StyleSheet} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { getBusById } from '@/utils/busData';

// Fixed styles - REMOVED zIndex to prevent insert view error
const markerStyles = StyleSheet.create({
    busMarkerContainer: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#EF6820',
        shadowColor: '#EF6820',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 8,
    },
        stopMarkerCompleted: {
            width: 28,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            borderWidth: 2,
            borderColor: '#16A34A',
            shadowColor: '#16A34A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
        },
        stopMarkerIncomplete: {
        flex: 1,
            width: 28,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            borderWidth: 2,
            borderColor: '#7D848D',
            shadowColor: '#6B7280',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
        },
        // Fixed callout container with proper sizing
        calloutContainer: {
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 8,
            minWidth: 140,
            maxWidth: 200,
            minHeight: 60,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        calloutText: {
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center',
            color: '#1F2937',
        },
});

// Smooth layout styles with fixed floating button alignment
const layoutStyles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30, // Adjusted for better alignment
        right: 20,
        backgroundColor: '#EF6820',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF6820',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
});

// Define interfaces
interface BusData {
    id: string;
    routeName: string;
    busNumber: string;
    occupancy: number;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    busType: 'AC' | 'Non-AC' | 'Express' | 'Local';
    fare: number;
    eta: number;
    latitude: number;
    longitude: number;
}

interface RouteStop {
    name: string;
    latitude: number;
    longitude: number;
    completed: boolean;
}

const getRouteStops = (): RouteStop[] => [
    { name: 'Rajpura Bus Stand', latitude: 30.4821, longitude: 76.3911, completed: true },
    { name: 'Sirhind', latitude: 30.6434, longitude: 76.3819, completed: true },
    { name: 'Morinda', latitude: 30.7904, longitude: 76.4985, completed: true },
    { name: 'Kurali', latitude: 30.8764, longitude: 76.7300, completed: false },
    { name: 'Kharar', latitude: 30.7445, longitude: 76.6477, completed: false },
    { name: 'Mohali', latitude: 30.7046, longitude: 76.7179, completed: false },
    { name: 'Chandigarh Bus Stand', latitude: 30.7333, longitude: 76.7794, completed: false },
];

const TrackBus = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [busData, setBusData] = useState<BusData | null>(null);
    const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef<MapView>(null); // Add map ref for reload functionality

    // Reload map function
    const reloadMap = () => {
        if (mapRef.current && busData) {
            // Animate to the initial region to "reload" the view
            mapRef.current.animateToRegion({
                latitude: busData.latitude,
                longitude: busData.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }, 1000);

            // Optionally reload the data as well
            const stops = getRouteStops();
            setRouteStops(stops);
        }
    };

    useEffect(() => {
        const loadBusData = async () => {
            try {
                setIsLoading(true);
                const routeId = 'example';
                const selectedBus = getBusById(id as string, routeId);
                if (selectedBus) {
                    setBusData(selectedBus);
                } else {
                    setBusData(null);
                }
                const stops = getRouteStops();
                setRouteStops(stops);
            } catch (error) {
                console.error('Error loading bus data:', error);
                setBusData(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadBusData();
    }, [id]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-bg_gray">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#EF6820" />
                    <Text className="text-white mt-4">Loading bus location...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!busData) {
        return (
            <SafeAreaView className="flex-1 bg-bg_gray">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">Bus not found</Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-4 bg-orange-500 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Split route for different colored lines
    const completedStops = routeStops.filter(stop => stop.completed);
    const allStops = routeStops;

    const completedCoordinates = completedStops.map(stop => ({
        latitude: stop.latitude,
        longitude: stop.longitude
    }));

    const allCoordinates = allStops.map(stop => ({
        latitude: stop.latitude,
        longitude: stop.longitude
    }));

    return (
        <SafeAreaView className="flex-1 bg-bg_gray">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-orange_4bor">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="justify-center items-center"
                    activeOpacity={0.7}
                >
                    <Image source={require('../../images/back.png')} className="h-10 w-10" />
                </TouchableOpacity>
                <View className="flex-1  items-center justify-center">
                    <Text className="text-white font-bold text-lg">Track Bus</Text>
                    <Text className="text-accent text-sm">{busData.busNumber}</Text>
                </View>
                <View className="px-4 ml-3 pl-2"></View>
            </View>

            {/* Smooth Map Container */}
            <View style={[layoutStyles.mapContainer, { height: '65%' }]}>
                <MapView
                    ref={mapRef} // Add ref for reload functionality
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: busData.latitude,
                        longitude: busData.longitude,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.5,
                    }}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                >
                    {/* Route Stops - Render first (lower layer) */}
                    {routeStops.map((stop, index) => (
                        <Marker
                            key={`stop-${index}`}
                            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                            anchor={{ x: 0.6, y: 0.6 }}
                        >
                            <View style={stop.completed ? markerStyles.stopMarkerCompleted : markerStyles.stopMarkerIncomplete}>
                                <Image
                                    source={stop.completed
                                        ? require('../../images/reach_stop.png')
                                        : require('../../images/not_reach_stop.png')
                                    }
                                    className="h-7 w-7"
                                />
                            </View>
                            <Callout>
                                <View style={markerStyles.calloutContainer}>
                                    <Text style={[markerStyles.calloutText, {
                                        color: stop.completed ? '#10B981' : '#6B7280'
                                    }]}>
                                        {stop.name.replace('Bus Stand', '').replace('Stand', '').trim()}
                                    </Text>
                                    <Text style={[markerStyles.calloutText, {
                                        fontSize: 10,
                                        color: stop.completed ? '#10B981' : '#6B7280'
                                    }]}>
                                        {stop.completed ? 'Completed' : 'Upcoming'}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    {/* Bus Location - Render last (top layer) */}
                    <Marker
                        key="bus-marker"
                        coordinate={{
                            latitude: busData.latitude,
                            longitude: busData.longitude
                        }}
                        title={`Bus ${busData.busNumber}`}
                        description="Live Location"
                        anchor={{ x: 0.5, y: 1.2 }}
                    >
                        <View style={markerStyles.busMarkerContainer}>
                            <Image source={require('../../images/bus_loc.png')} className="h-7 w-7"  />
                        </View>
                    </Marker>

                    {/* Route Lines */}
                    {completedCoordinates.length > 1 && (
                        <Polyline
                            coordinates={completedCoordinates}
                            strokeColor="#10B981"
                            strokeWidth={6}
                        />
                    )}
                    <Polyline
                        coordinates={allCoordinates}
                        strokeColor="#6B7280"
                        strokeWidth={4}
                        lineDashPattern={[8, 4]}
                    />
                </MapView>

                {/* Fixed Floating Action Button with Reload Functionality */}
                <TouchableOpacity
                    style={layoutStyles.floatingButton}
                    activeOpacity={0.8}
                    onPress={reloadMap} // Use reload function
                >
                    <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Smooth Bottom Container */}
            <View style={[{ height: '38%' }]} className="bg-bg_gray pt-2">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 30,
                        paddingTop: 5
                    }}
                >
                    {/* Bus Info Card with smooth styling */}
                    <View className="bg-bg_gray mx-4 mb-3 rounded-2xl p-4 border border-orange_4bor" style={{
                        shadowColor: '#EF6820',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                    }}>
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg">{busData.routeName}</Text>
                                <Text className="text-gray-400 text-sm">{busData.busNumber}</Text>
                            </View>
                            <View className="bg-green-500/20 px-3 py-1.5 rounded-full">
                                <Text className="text-green-400 font-semibold text-sm">Live</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 items-center">
                                <Text className="text-orange-400 font-bold text-base">{busData.eta} mins</Text>
                                <Text className="text-gray-400 text-xs">ETA</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-orange-400 font-bold text-base">{busData.busType}</Text>
                                <Text className="text-gray-400 text-xs">Type</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-orange-400 font-bold text-base">{busData.occupancy}%</Text>
                                <Text className="text-gray-400 text-xs">Occupancy</Text>
                            </View>
                        </View>
                    </View>

                    {/* Route Progress */}
                    <View className="px-4 mb-4">
                        <Text className="text-white font-bold text-lg mb-3">Route Progress</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                        >
                            {routeStops.map((stop, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className={`mr-3 px-4 py-2.5 rounded-full border-2 ${
                                        stop.completed
                                            ? 'bg-green-500 border-green-400'
                                            : 'bg-transparent border-gray-600'
                                    }`}
                                    style={{
                                        minWidth: 110,
                                        shadowColor: stop.completed ? '#10B981' : 'transparent',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        elevation: stop.completed ? 3 : 0,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row items-center justify-center">
                                        <Ionicons
                                            name={stop.completed ? "checkmark-circle" : "radio-button-off"}
                                            size={16}
                                            color={stop.completed ? "white" : "#9CA3AF"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            className={`text-sm font-semibold ${
                                                stop.completed ? 'text-white' : 'text-gray-400'
                                            }`}
                                            numberOfLines={1}
                                        >
                                            {stop.name.replace('Bus Stand', '').replace('Stand', '').trim()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Next Stop Info */}
                    <View className="bg-bg_gray mx-4 rounded-xl p-4 border border-orange_4bor" style={{
                        shadowColor: '#EF6820',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                    }}>
                        <View className="flex-row items-center">
                            {/*<Ionicons name="location" size={22} color="#EF6820" />*/}
                            <Image source={require('@/images/route.png')} className="w-8 h-8"/>

                            <View className="ml-3 flex-1">
                                <Text className="text-orange-400 font-bold text-base">Next Stop</Text>
                                <Text className="text-white text-base font-medium mt-1">
                                    {routeStops.find(stop => !stop.completed)?.name || 'Final Destination'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default TrackBus;
