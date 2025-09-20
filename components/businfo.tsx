import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Link} from "expo-router";

// Types
interface BusCardProps {
    routeName: string;
    busNumber: string;
    occupancy: number;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    onTrackPress?: () => void;
    onCardPress?: () => void;
    isLive?: boolean;
    busType?: 'AC' | 'Non-AC' | 'Express' | 'Local';
    fare?: number;
    eta?: number; // Add ETA prop (in minutes)
}

const BusCard: React.FC<BusCardProps> = ({
                                             routeName,
                                             busNumber,
                                             occupancy,
                                             startLocation,
                                             endLocation,
                                             startTime,
                                             endTime,
                                             onTrackPress,
                                             onCardPress,
                                             isLive = true,
                                             busType = 'Local',
                                             fare,
                                             eta, // Add ETA to parameters
                                         }) => {
    const getOccupancyColor = () => {
        if (occupancy <= 40) return 'bg-green-500/60';
        if (occupancy <= 70) return 'bg-yellow-500/80';
        return 'bg-red-500/70';
    };

    return (
        <TouchableOpacity
            onPress={onCardPress}
            activeOpacity={0.8}
            className="mx-4 mb-1.5 bg-bg_gray rounded-2xl overflow-hidden mt-2"
            style={{
                shadowColor: '#EF6820',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 4.5,
            }}
        >
            {/* Header Section */}
            <View className="bg-bg_gray px-4 py-1.5 border-2 border-white35_4bor rounded-t-2xl">
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                        <Text className="text-white font-bold text-lg mb-2" numberOfLines={1}>
                            {routeName}
                        </Text>
                        <View className="flex-row items-center flex-wrap">
                            <View className="bg-gray-600 px-2 py-1 rounded flex-row items-center mr-2 mb-1">
                                <Ionicons name="bus-outline" size={12} color="white" />
                                <Text className="text-white text-xs font-medium ml-1">{busNumber}</Text>
                            </View>
                            <View className="bg-gray-600 px-2 py-1 rounded mr-2 mb-1">
                                <Text className="text-white text-xs font-medium">{busType}</Text>
                            </View>
                            {isLive && (
                                <View className="bg-green-500/60 px-2 py-1 rounded flex-row items-center mb-1">
                                    <View className="w-1.5 h-1.5 bg-white rounded-full mr-1" />
                                    <Text className="text-white text-xs font-medium">LIVE</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Occupancy Badge */}
                    <View className="items-center">
                        <Text className="text-gray-300 text-xs pt-2 mb-1">Occupancy</Text>
                        <View className={`${getOccupancyColor()} px-3 py-1 rounded-full`}>
                            <Text className="text-white text-sm font-bold">{occupancy}%</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Route Section - Horizontal Layout */}
            <View className="px-4 py-3.5 border-l-2 border-r-2 border-b-2 border-white35_4bor rounded-b-2xl">
                {/* Route Timeline - Horizontal with Inline Gradient */}
                <View className="mb-2">
                    {/* Top Row - Labels and Dots */}
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                            <View className="w-3 h-3 bg-green-500/80 rounded-full mr-2" />
                            <Text className="text-green-400/80 text-xs font-medium">START</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="text-red-400/80 text-xs font-medium">END</Text>
                            <View className="w-3 h-3 bg-red-500/80 rounded-full ml-2" />
                        </View>
                    </View>

                    {/* Middle Row - Location Names with Line and Arrow */}
                    <View className="flex-row items-center mb-3">
                        {/* Start Location */}
                        <View style={{ width: '35%' }}>
                            <Text className="text-white font-semibold text-sm" numberOfLines={3}>
                                {startLocation}
                            </Text>
                        </View>

                        {/* Simple Line with Arrow */}
                        <View style={{ width: '30%' }} className="items-center px-4">
                            <View className="flex-row items-center justify-center w-full">
                                <View className="flex-1 h-0.5 bg-white" />
                                <View className="mx-2">
                                    <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                                </View>
                                <View className="flex-1 h-0.5 bg-white" />
                            </View>
                        </View>

                        {/* End Location */}
                        <View style={{ width: '35%' }}>
                            <Text className="text-white font-semibold text-sm text-right" numberOfLines={3}>
                                {endLocation}
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Row - Times */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-400 text-xs" style={{ width: '35%' }}>
                            {startTime}
                        </Text>

                        <Text className="text-gray-400 text-xs text-right" style={{ width: '35%' }}>
                            {endTime}
                        </Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View className="flex-row items-center justify-between pt-2 border-t border-gray-700">
                    {/* Left Side Info */}
                    <View className="flex-row items-center flex-1">
                        {fare && (
                            <View className="flex-row items-center mr-4">
                                <Ionicons name="card-outline" size={16} color="#9CA3AF" />
                                <Text className="text-gray-300 ml-1 font-medium">₹{fare}</Text>
                            </View>
                        )}

                        {/* ETA - Now uses prop instead of random */}
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                            <Text className="text-gray-300 ml-1 text-sm">
                                {eta ? `${eta} mins away` : 'ETA unavailable'}
                            </Text>
                        </View>
                    </View>

                    {/* Track Button */}
                    <Link href={`../track/${busNumber}`} asChild>
                    <TouchableOpacity
                        className="px-6 py-2 rounded-full flex-row items-center"
                        style={{ backgroundColor: 'rgba(239, 104, 32, 0.85)', opacity: 0.95 }}
                        activeOpacity={0.5}
                    >
                        <Text className="text-white font-semibold mr-2">Track</Text>
                        <Ionicons name="location" size={16} color="white" />
                    </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BusCard;
