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
            activeOpacity={0.95}
            className="mx-3 mb-3 bg-card border-card_bor rounded-[20px] border-2 "
        >
            {/* Header Row - Route Badge + View Buses Button */}
            <View className="flex-row items-center justify-between p-3 pb-4">
                {/* Route Badge */}
                <View className="flex-row items-center rounded-2xl px-4 py-2.5 ">
                    <Image source={require('../images/route.png')} className="h-5 w-5 mr-2.5" />
                    <Text className="text-white font-bold text-lg">Route {routeNumber}</Text>
                </View>

                {/* View Buses Button */}
                <Link href={`../buses/${routeNumber}`} asChild>
                    <TouchableOpacity
                        className="flex-row items-center rounded-xl px-4 py-3 bg-cyan_4txt"
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../images/view_buses.png')}
                            className="h-5 w-5 mr-2"
                        />
                        <Text className="text-white font-bold text-sm">Buses</Text>
                        <Ionicons name="arrow-forward" size={12} color="white" className="ml-1" />
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Journey Section */}
            <View className="px-5 pb-4">
                {/* Journey Visualization */}
                <View className="bg-card rounded-2xl p-4 border-white35_4bor ">
                    {/* Route Connection Line */}
                    <View className="flex-row items-center mb-4">
                        {/* Start Dot */}
                        <View className="w-3 h-3 bg-emerald-500 rounded-full"
                        />

                        {/* Connection Line with Bus */}
                        <View className="flex-1 mx-3">
                            <View className="flex-row items-center">
                                <View className="flex-1 h-0.5 bg-cyan" />
                                <View className=" mx-2 ">
                                    <Image
                                        source={require('../images/view_buses.png')}
                                        className="h-5 w-5"
                                    />
                                </View>
                                <View className="flex-1 h-0.5 bg-cyan" />
                            </View>
                        </View>

                        {/* End Dot */}
                        <View className="w-3 h-3 bg-red-500 rounded-full"
                        />
                    </View>

                    {/* Destination Labels and Names */}
                    <View className="flex-row justify-between">
                        {/* Departure */}
                        <View className="flex-1 mr-4">
                            <Text className="text-white35_4bor text-xs font-semibold uppercase tracking-wide mb-1">
                                FROM
                            </Text>
                            <Text className="text-white90_4txt font-bold text-lg leading-tight">
                                {startDestination}
                            </Text>
                        </View>

                        {/* Arrival */}
                        <View className="flex-1 ml-4">
                            <Text className="text-white35_4bor text-xs font-semibold uppercase tracking-wide mb-1 text-right">
                                TO
                            </Text>
                            <Text className="text-white90_4txt font-bold text-lg leading-tight text-right">
                                {stopDestination}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RouteCard;
