import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {Link} from "expo-router";

// Types
interface RouteCardProps {
    routeNumber: string | number;
    startDestination: string;
    stopDestination: string;
    onPress?: () => void;
    estimatedTime?: string;
    distance?: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
                                                 routeNumber,
                                                 startDestination,
                                                 stopDestination,
                                                 onPress,
                                                 estimatedTime,
                                                 distance,
                                             }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`mx-4 mb-3  rounded-2xl p-5 shadow-lg bg-bg_gray border border-white35_4bor`}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                        <Image source={require('../images/route.png')} className="h-8 w-8 mb-1 mr-1" />
                    <Text className="text-white font-bold text-lg">Route {routeNumber}</Text>
                </View>
                <Link href={`../buses/${routeNumber}`} asChild>
                    <TouchableOpacity
                        onPress={() => {/* Handle navigation */}}
                        className="flex-row items-center justify-between rounded-xl px-2 py-2.5 border"
                        style={{
                            backgroundColor: '#2d2e2f',
                            borderColor: 'rgba(239, 104, 32, 0.3)',
                            shadowColor: '#EF6820',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 6,
                            width: 90, // Keeping it compact
                        }}
                        activeOpacity={0.85}
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="rounded-lg p-1 mr-1.5 mb-0.5" >
                                <Image
                                    source={require('../images/view_buses.png')}
                                    className="h-3.5 w-3.5"
                                    // style={{ tintColor: '#EF6820' }}
                                />
                            </View>
                            <Text className="text-white font-semibold text-sm flex-1">Buses</Text>
                        </View>

                        <View className="rounded-full p-0.5" style={{ backgroundColor: 'rgba(239, 104, 32, 0.2)' }}>
                            <Ionicons name="chevron-forward" size={9} color="#EF6820" />
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Route Path */}
            <View className="mb-0 px-4">
                {/* Labels */}
                <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-400 text-xs uppercase tracking-widest">Departure</Text>
                    <Text className="text-gray-400 text-xs uppercase tracking-widest">Arrival</Text>
                </View>

                {/* Visual */}
                <View style={{ position: 'relative', height: 20 }}>
                    {/* Simple Line with Arrow (absolutely centered) */}
                    <View style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 80,
                        transform: [{ translateX: -40 }, { translateY: -8 }],
                    }}>
                        <View className="flex-row items-center justify-center w-full">
                            <View className="flex-1 h-0.5 bg-white" />
                            <View className="mx-2">
                                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                            </View>
                            <View className="flex-1 h-0.5 bg-white" />
                        </View>
                    </View>

                    {/* Start & End */}
                    <View className="flex-row items-center justify-between">
                        {/* Start */}
                        <View className="flex-row items-center min-w-0">
                            <View className="w-5 h-5 bg-green-600 rounded-full mr-3 shadow-md border border-white" />
                            <Text
                                className="text-white font-bold text-base"
                                numberOfLines={1}
                                style={{ flexShrink: 1 }}
                            >
                                {startDestination}
                            </Text>
                        </View>

                        {/* End */}
                        <View className="flex-row items-center min-w-0">
                            <Text
                                className="text-white font-bold text-base"
                                numberOfLines={1}
                                style={{ textAlign: 'right', flexShrink: 1 }}
                            >
                                {stopDestination}
                            </Text>
                            <View className="w-5 h-5 bg-red-600 rounded-full ml-3 shadow-md border border-white" />
                        </View>
                    </View>
                </View>
            </View>


            {/* Footer */}
            {(estimatedTime || distance) && (
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-700">
                    <View className="flex-row items-center space-x-4">
                        {distance && (
                            <View className="flex-row items-center">
                                <Ionicons name="speedometer-outline" size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-sm ml-1 font-medium">{distance}</Text>
                            </View>
                        )}
                        {estimatedTime && (
                            <View className="flex-row items-center">
                                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-sm ml-1 font-medium">{estimatedTime}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default RouteCard;