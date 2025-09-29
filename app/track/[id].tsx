import React, { useEffect, useState, useRef } from 'react';
import {View, Text, ScrollView, ActivityIndicator, Image, StyleSheet, Alert, Platform} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import { getBusById } from '@/utils/busData';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from "expo-file-system"

// Fixed styles - REMOVED zIndex to prevent insert view error
const markerStyles = StyleSheet.create({
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

interface UserLocation {
    latitude: number;
    longitude: number;
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
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationPermission, setLocationPermission] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    // Load Asset for sharing - based on extracted code
    useEffect(() => {
        const loadAsset = async () => {
            try {
                // You can replace this with any image from your assets folder
                // For example: require('../../assets/bus_location_share.jpg')
                const asset = Asset.fromModule(require('../../images/liveshare image.jpg'));
                await asset.downloadAsync();
                setImageUri(asset.localUri || null);
            } catch (error) {
                console.error('Error loading asset:', error);
            }
        };

        loadAsset();
    }, []);

    // Share image function - based on extracted code
    const shareImage = async () => {
        try {
            if (imageUri) {
                await Sharing.shareAsync(imageUri);
            } else {
                console.log("image uri is not set");
                Alert.alert(
                    'Share Error',
                    'Image not loaded yet. Please try again in a moment.'
                );
            }
        } catch (error) {
            console.error("oops, failed to share image", error);
            Alert.alert(
                'Share Error',
                'Failed to share location image. Please try again.'
            );
        }
    };

    // Request location permission and get user location
    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                getUserLocation();
            } else {
                setLocationPermission(false);
                Alert.alert(
                    'Location Permission',
                    'Location permission is required to show your current position on the map.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
            setLocationPermission(false);
        }
    };

    // Get current user location
    const getUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 10000,
            });
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error('Error getting user location:', error);
            // Try to get last known location as fallback
            try {
                const lastLocation = await Location.getLastKnownPositionAsync({
                    maxAge: 60000, // 1 minute
                });
                if (lastLocation) {
                    setUserLocation({
                        latitude: lastLocation.coords.latitude,
                        longitude: lastLocation.coords.longitude,
                    });
                }
            } catch (lastLocationError) {
                console.error('Error getting last known location:', lastLocationError);
            }
        }
    };

    // Reload map function
    const reloadMap = () => {
        if (mapRef.current && busData) {
            mapRef.current.animateToRegion({
                latitude: busData.latitude,
                longitude: busData.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }, 1000);

            const stops = getRouteStops();
            setRouteStops(stops);

            // Also refresh user location
            if (locationPermission) {
                getUserLocation();
            }
        }
    };

    // Updated handleShareLocation to use the shareImage function
    const handleShareLocation = () => {
        shareImage();
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

        // Request location permission on component mount
        requestLocationPermission();
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
            {/* Header with Centered Title */}
            <View className="flex-row items-center px-4 py-3 border-b border-cyan_4bor" style={{ position: 'relative' }}>
                {/* Back Button - Absolute Left */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="justify-center items-center"
                    activeOpacity={0.7}
                    style={{ position: 'absolute', left: 16, zIndex: 1 }}
                >
                    <Image source={require('../../images/back.png')} className="h-10 w-10" />
                </TouchableOpacity>

                {/* Centered Title */}
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white font-bold text-lg">Track Bus</Text>
                    <Text className="text-cyan text-sm">{busData.busNumber}</Text>
                </View>

                {/* Share Live Location Button - Absolute Right */}
                <TouchableOpacity
                    onPress={handleShareLocation}
                    className="bg-green-500 px-3 py-3 rounded-lg flex-row items-center"
                    activeOpacity={0.8}
                    style={{
                        position: 'absolute',
                        right: 16,
                        zIndex: 1,
                        shadowColor: '#22C55E',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                >
                    <Ionicons name="location" size={16} color="white" />
                    <Text className="text-white text-xs font-medium ml-1"> Live Share</Text>
                </TouchableOpacity>
            </View>

            {/* Smooth Map Container */}
            <View
                className="flex-1 rounded-bl-[20px] rounded-br-[20px]  rounded-tl-[20px]  rounded-tr-[20px] overflow-hidden mb-[10px] border-2 border-cyan"
                style={{ height: '65%' }}>
                <MapView
                    ref={mapRef}
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
                    {/* User Location Marker - Custom Blue Marker */}
                    {userLocation && (
                        <Marker
                            coordinate={userLocation}
                            title="Your Location"
                            description="You are here"
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View className="items-center justify-center">
                                {/* Outer ring */}
                                <View className="w-12 h-12 bg-blue-400 rounded-full opacity-20 absolute" />
                                {/* Inner ring */}
                                <View className="w-8 h-8 bg-blue-500 rounded-full opacity-40 absolute" />
                                {/* Main location dot */}
                                <View className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white" />
                            </View>
                        </Marker>
                    )}

                    {/* Route Stops - Render first (lower layer) */}
                    {routeStops.map((stop, index) => (
                        <Marker
                            key={`stop-${index}`}
                            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                            anchor={{ x: 0.6, y: 0.6 }}
                            title={stop.name}
                            description="Bus Stop"
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
                        description="Live Bus Location"
                        anchor={{ x: 0.5, y: 1.2 }}
                    >
                        <View className="w-[35px] h-[35px] justify-center items-center bg-white rounded-[25px] border-2 border-[#06b6d4]"
                              style={{
                                  shadowColor: '#06b6d4',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.8,
                                  shadowRadius: 4,
                                  elevation: 8,
                              }}>
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
                    className="absolute bottom-[30px] left-[20px] bg-[#06B6D4] w-[56px] h-[56px] rounded-[28px] justify-center items-center z-[1000]"
                    style={{
                        shadowColor: '#06b6d4',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={reloadMap}
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
                    <View className="bg-bg_gray mx-4 mb-3 rounded-2xl p-4 border border-cyan_4bor" style={{
                        shadowColor: 'rgba(6, 182 , 212 ,0.5)',
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
                                <Text className="text-cyan font-bold text-base">{busData.eta} mins</Text>
                                <Text className="text-gray-400 text-xs">ETA</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-cyan font-bold text-base">{busData.busType}</Text>
                                <Text className="text-gray-400 text-xs">Type</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-cyan font-bold text-base">{busData.occupancy}%</Text>
                                <Text className="text-gray-400 text-xs">Occupancy</Text>
                            </View>
                        </View>
                    </View>

                    {/* Route Progress */}
                    <View className="px-4 mb-4">
                        <Text className="text-white font-bold text-lg mb-4">Route Progress</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                        >
                            <View className="flex-row items-center">
                                {routeStops.map((stop, index) => (
                                    <React.Fragment key={index}>
                                        <TouchableOpacity
                                            className="items-center"
                                            activeOpacity={0.8}
                                            style={{ minWidth: 80 }}
                                        >
                                            {/* Smaller Circular Progress Indicator */}
                                            <View
                                                className={`w-6 h-6 rounded-full border-2 items-center justify-center mb-2 ${
                                                    stop.completed
                                                        ? 'bg-cyan_4txt border-cyan_4bor'
                                                        : 'bg-gray-700 border-gray-600'
                                                }`}
                                                style={{
                                                    shadowColor: stop.completed ? '#10B981' : 'transparent',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 4,
                                                    elevation: stop.completed ? 3 : 0,
                                                }}
                                            >
                                                <Ionicons
                                                    name={stop.completed ? "checkmark" : "radio-button-off"}
                                                    size={14}
                                                    color={stop.completed ? "white" : "#9CA3AF"}
                                                />
                                            </View>

                                            {/* Stop Name */}
                                            <Text
                                                className={`text-xs font-medium text-center ${
                                                    stop.completed ? 'text-white' : 'text-gray-400'
                                                }`}
                                                numberOfLines={2}
                                                style={{ maxWidth: 70 }}
                                            >
                                                {stop.name.replace('Bus Stand', '').replace('Stand', '').trim()}
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Properly Connected Line */}
                                        {index < routeStops.length - 1 && (
                                            <View
                                                className={`h-0.5 ${
                                                    stop.completed
                                                        ? 'bg-cyan'
                                                        : 'bg-gray-600'
                                                }`}
                                                style={{
                                                    width: 40,
                                                    marginTop: -22, // Align with circle center
                                                    marginHorizontal: -20, // Overlap to connect properly
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        </ScrollView>
                    </View>


                    {/* Next Stop Info */}
                    <View className="bg-bg_gray mx-4 rounded-xl p-4 border border-cyan_4bor" style={{
                        shadowColor: 'rgba(6, 182 , 212 ,1)',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                    }}>
                        <View className="flex-row items-center">
                            <Image source={require('@/images/route.png')} className="w-8 h-8"/>

                            <View className="ml-3 flex-1">
                                <Text className="text-cyan font-bold text-base">Next Stop</Text>
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
