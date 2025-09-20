import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch, Image,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BusAlertCardProps {
    id: string;
    routeName: string;
    startLocation: string;
    endLocation: string;
    currentStop: string;
    eta: number;
    status: 'arriving_shortly' | 'on_time' | 'at_stop';
    smsNotification: boolean;
    busNumber: string;
    onToggleSMS: (id: string, enabled: boolean) => void;
}

const BusAlertCard: React.FC<BusAlertCardProps> = ({
                                                       id,
                                                       routeName,
                                                       startLocation,
                                                       endLocation,
                                                       currentStop,
                                                       eta,
                                                       status,
                                                       smsNotification,
                                                       busNumber,
                                                       onToggleSMS,
                                                   }) => {
    const [smsEnabled, setSmsEnabled] = useState(smsNotification);

    const getStatusConfig = () => {
        switch (status) {
            case 'arriving_shortly':
                return {
                    icon: 'time-outline',
                    text: 'Arriving Shortly',
                    subText: 'Bus will be here soon',
                    dotColor: 'bg-yellow-300',
                    iconColor: '#F59E0B',
                    bgColor: 'bg-yellow-300/10',
                };
            case 'on_time':
                return {
                    icon: 'checkmark-circle-outline',
                    text: `${eta} Minutes`,
                    subText: 'Expected arrival time',
                    dotColor: 'bg-green-300',
                    iconColor: '#10B981',
                    bgColor: 'bg-green-300/10',
                };
            case 'at_stop':
                return {
                    icon: 'location-outline',
                    text: 'Now Boarding',
                    subText: 'Bus is at the stop',
                    dotColor: 'bg-blue-300',
                    iconColor: '#3B82F6',
                    bgColor: 'bg-blue-300/10',
                };
            default:
                return {
                    icon: 'help-circle-outline',
                    text: 'Status Unknown',
                    subText: 'Unable to get bus status',
                    dotColor: 'bg-gray-300',
                    iconColor: '#6B7280',
                    bgColor: 'bg-gray-300/10',
                };
        }
    };

    const statusConfig = getStatusConfig();

    const handleToggleSMS = (value: boolean) => {
        setSmsEnabled(value);
        onToggleSMS(id, value);
    };

    return (
        <View className="bg-bg_gray rounded-2xl mx-4 mb-4 border border-white90_4txt overflow-hidden"
              style={{
                  shadowColor: '#EFs6820',
                  shadowOffset: {
                      width: 0,
                      height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                  elevation: 8,
              }}>
            {/* Header Section */}
            <View className="px-5 pt-2 border-b border-white35_4bor">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                                <Image source={require('../images/view_buses.png')}  className='h-7 w-7 mr-3'/>
                            <Text className="text-white font-bold text-lg">
                                {routeName}
                            </Text>
                        </View>
                        <Text className="text-gray-400 text-sm ml-9">
                            {startLocation} → {endLocation}
                        </Text>
                    </View>

                    <View className="items-center">
                        <Text className="text-gray-500 text-xs ">SMS</Text>
                        <Switch
                            value={smsEnabled}
                            onValueChange={handleToggleSMS}
                            trackColor={{ false: '#374151', true: '#EF6820' }}
                            thumbColor={smsEnabled ? '#FFFFFF' : '#9CA3AF'}
                            style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                        />
                    </View>
                </View>
            </View>

            {/* Status Section */}
            <View className={`px-5 py-3 ${statusConfig.bgColor}`}>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className={`w-3 h-3 ${statusConfig.dotColor} rounded-full mr-3`} />
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">
                                {statusConfig.text}
                            </Text>
                            <Text className="text-gray-400 text-xs mt-0.5">
                                {statusConfig.subText}
                            </Text>
                        </View>
                    </View>

                    <Ionicons
                        name={statusConfig.icon}
                        size={28}
                        color={statusConfig.iconColor}
                    />
                </View>
            </View>

            {/* Location & Action Section */}
            <View className="px-5 py-4 border-t border-white35_4bor">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <Ionicons name="location" size={16} color="#DC2626" />
                        <Text className="text-gray-300 text-sm font-medium ml-2 flex-1">
                            {currentStop}
                        </Text>
                    </View>

                    <Link href={`../track/${busNumber}`} asChild>
                        <TouchableOpacity
                            className="px-6 py-2 rounded-full flex-row items-center ml-4"
                            style={{ backgroundColor: 'rgba(239, 104, 32, 0.85)', opacity: 0.95 }}
                            activeOpacity={0.5}
                        >
                            <Text className="text-white font-semibold mr-2">Track</Text>
                            <Ionicons name="location" size={16} color="white" />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
};

export default BusAlertCard;
