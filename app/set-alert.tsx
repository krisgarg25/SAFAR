import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
    ScrollView,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addBusAlert, getBusData } from '@/utils/busData';

const busNumbers = ['PB2613', 'PB2614', 'PB2615', 'DL8C2341', 'HR26T1234'];
const busStops = [
    'Connaught Place',
    'Rajiv Chowk Stop',
    'India Gate',
    'ITO Metro Station',
    'Dwarka',
    'Gurgaon',
    'Karol Bagh',
    'Chandni Chowk'
];

export default function SetAlertScreen() {
    const [selectedBusNumber, setSelectedBusNumber] = useState<string>('');
    const [selectedStartStop, setSelectedStartStop] = useState<string>('');
    const [selectedAlertStop, setSelectedAlertStop] = useState<string>('');
    const [selectedEndStop, setSelectedEndStop] = useState<string>('');
    const [enableAlert, setEnableAlert] = useState<boolean>(true);
    const [receiveSMS, setReceiveSMS] = useState<boolean>(false);

    // Modal dropdown states
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownData, setDropdownData] = useState<string[]>([]);
    const [dropdownTitle, setDropdownTitle] = useState<string>('');

    const handleSetAlert = () => {
        if (!selectedBusNumber || !selectedStartStop || !selectedAlertStop || !selectedEndStop) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const existingData = getBusData();
        const newId = (Math.max(...existingData.map(bus => parseInt(bus.id))) + 1).toString();

        const newAlert = {
            id: newId,
            routeName: `Bus ${selectedBusNumber.slice(-2)}`,
            busNumber: selectedBusNumber,
            occupancy: Math.floor(Math.random() * 50) + 20,
            startLocation: selectedStartStop,
            endLocation: selectedEndStop,
            currentStop: selectedAlertStop,
            startTime: '16:30',
            endTime: '17:30',
            busType: 'Express',
            fare: 55,
            eta: Math.floor(Math.random() * 15) + 1,
            status: Math.random() > 0.5 ? 'on_time' : 'arriving_shortly',
            latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
            longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
            smsNotification: receiveSMS,
        };

        addBusAlert(newAlert);

        Alert.alert('Success', 'Alert created successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    const openDropdown = (type: string, data: string[], title: string) => {
        setActiveDropdown(type);
        setDropdownData(data);
        setDropdownTitle(title);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
        setDropdownData([]);
        setDropdownTitle('');
    };

    const selectItem = (item: string) => {
        switch (activeDropdown) {
            case 'busNumber':
                setSelectedBusNumber(item);
                break;
            case 'startStop':
                setSelectedStartStop(item);
                break;
            case 'alertStop':
                setSelectedAlertStop(item);
                break;
            case 'endStop':
                setSelectedEndStop(item);
                break;
        }
        closeDropdown();
    };

    const DropdownButton = ({ placeholder, value, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-lg p-4 flex-row items-center justify-between mb-6"
        >
            <Text className={`${value ? 'text-gray-800' : 'text-gray-500'} flex-1`}>
                {value || placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-bg_gray">
            {/* Header */}
            <SafeAreaView className="bg-bg_gray px-4 pt-2 pb-3 border-b border-orange_4bor">
                <View className="flex-row items-center justify-between h-11">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/images/back.png')} className="h-10 w-10" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white text-center tracking-wide">
                        Set Alert
                    </Text>
                    <View className="w-11 h-11" />
                </View>
            </SafeAreaView>

            {/* Content */}
            <ScrollView className="flex-1 px-3 pt-2">
                {/* Bus Number */}
                <Text className="text-white font-medium mb-1">Bus Number</Text>
                <DropdownButton
                    placeholder="Select Bus Number"
                    value={selectedBusNumber}
                    onPress={() => openDropdown('busNumber', busNumbers, 'Select Bus Number')}
                />

                {/* Starting Bus Stop */}
                <Text className="text-white font-medium mb-1">Starting Bus Stop</Text>
                <DropdownButton
                    placeholder="Select Starting Bus Stop"
                    value={selectedStartStop}
                    onPress={() => openDropdown('startStop', busStops, 'Select Starting Bus Stop')}
                />

                {/* Alert Stop */}
                <Text className="text-white font-medium mb-1">Alert me at (Intermediate Stop)</Text>
                <DropdownButton
                    placeholder="Select a stop for alert"
                    value={selectedAlertStop}
                    onPress={() => openDropdown('alertStop', busStops, 'Select Alert Stop')}
                />

                {/* Ending Bus Stop */}
                <Text className="text-white font-medium mb-1">Ending Bus Stop</Text>
                <DropdownButton
                    placeholder="Select Ending Bus Stop"
                    value={selectedEndStop}
                    onPress={() => openDropdown('endStop', busStops, 'Select Ending Bus Stop')}
                />

                {/* Toggles */}
                <View className="bg-white rounded-lg px-3">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-800 font-medium">Enable Mobile Alert</Text>
                        <Switch
                            value={enableAlert}
                            onValueChange={setEnableAlert}
                            trackColor={{ false: '#D1D5DB', true: '#EF6820' }}
                            thumbColor={enableAlert ? '#FFFFFF' : '#F3F4F6'}
                        />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-800 font-medium">Receive Alert via SMS</Text>
                        <Switch
                            value={receiveSMS}
                            onValueChange={setReceiveSMS}
                            trackColor={{ false: '#D1D5DB', true: '#EF6820' }}
                            thumbColor={receiveSMS ? '#FFFFFF' : '#F3F4F6'}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Set Alert Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-bg_gray px-4 pt-4 pb-8 border-t border-gray-700">
                <TouchableOpacity
                    onPress={handleSetAlert}
                    className="bg-orange-500 rounded-xl py-4 items-center"
                    style={{ backgroundColor: '#EF6820' }}
                >
                    <Text className="text-white font-bold text-lg">Set Alert</Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal */}
            <Modal
                visible={activeDropdown !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={closeDropdown}
            >
                <View className="flex-1 bg-black/50 justify-center px-4">
                    <View className="bg-bg_gray rounded-xl max-h-96 border-2 border-gray-600">
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between p-4 border-b-2 border-gray-600">
                            <Text className="text-white font-semibold text-lg">{dropdownTitle}</Text>
                            <TouchableOpacity onPress={closeDropdown}>
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Content */}
                        <ScrollView className="max-h-80">
                            {dropdownData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => selectItem(item)}
                                    className="p-4 border-b border-gray-700/50 active:bg-orange_4bor"
                                >
                                    <Text className="text-white text-base">{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
