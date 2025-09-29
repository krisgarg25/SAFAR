import
{ Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BusCard from '../../components/businfo';
import { getBusData } from '../../utils/busData';

const buses = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Modal and sorting state
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [sortBy, setSortBy] = useState('none'); // 'eta', 'occupancy', 'busType', 'none'

    // Your bus data (fetch from API using the id)
    const busData = getBusData(id);

    // Sorting function
    const getSortedBusData = () => {
        let sortedData = [...busData];

        switch (sortBy) {
            case 'eta':
                sortedData.sort((a, b) => a.eta - b.eta);
                break;
            case 'occupancy':
                sortedData.sort((a, b) => a.occupancy - b.occupancy);
                break;
            case 'busType':
                const typeOrder = { 'Express': 1, 'AC': 2, 'Non-AC': 3, 'Local': 4 };
                sortedData.sort((a, b) => typeOrder[a.busType] - typeOrder[b.busType]);
                break;
            default:
                return sortedData;
        }

        return sortedData;
    };

    const handleSortSelection = (sortType) => {
        setSortBy(sortType);
        setIsFilterModalVisible(false);
    };

    const renderBusItem = ({ item }) => (
        <BusCard
            routeName={item.routeName}
            busNumber={item.busNumber}
            occupancy={item.occupancy}
            startLocation={item.startLocation}
            endLocation={item.endLocation}
            startTime={item.startTime}
            endTime={item.endTime}
            busType={item.busType as "AC" | "Non-AC" | "Express" | "Local"}
            fare={item.fare}
            eta={item.eta} // Pass the actual ETA value
            onTrackPress={() => {/* Handle tracking */}}
            onCardPress={() => {/* Handle card press */}}
        />
    );


    const FilterOption = ({ icon, title, description, isSelected, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center p-4 rounded-2xl mb-3 ${
                isSelected ? 'bg-cyan_4bor_transparent border border-cyan_4txt' : 'bg-gray-800'
            }`}
            activeOpacity={0.8}
        >
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                isSelected ? 'bg-cyan_4txt' : 'bg-gray-700'
            }`}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={isSelected ? 'white' : '#9CA3AF'}
                />
            </View>

            <View className="flex-1">
                <Text className={`font-semibold text-base mb-1 ${
                    isSelected ? 'text-cyan_4txt' : 'text-white'
                }`}>
                    {title}
                </Text>
                <Text className="text-gray-400 text-sm">
                    {description}
                </Text>
            </View>

            {isSelected && (
                <View className="w-6 h-6 bg-cyan_4txt rounded-full items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="white" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-bg_gray">
            {/* Header */}
            <View className="mx-2 flex-row items-center justify-between h-[54px] rounded-full px-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="justify-center items-center "
                    activeOpacity={0.7}
                >
                    <Image source={require('../../images/back.png')} className="h-10 w-10 " />
                </TouchableOpacity>
                <Text className="text-center">
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: '#D1D5DB',
                        letterSpacing: 0.5,
                    }}>
                        Buses of{' '}
                    </Text>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: 'white',
                        letterSpacing: 0.5,
                    }}>
                        Route {id}
                    </Text>
                </Text>

                <TouchableOpacity
                    onPress={() => setIsFilterModalVisible(true)}
                    className="p-2"
                    activeOpacity={0.7}
                >
                    <Image source={require('../../images/filter.png')} className="h-[22px] w-[22px] mt-1" />
                </TouchableOpacity>
            </View>

            {/* Stepped Line Pattern */}
            {/* Card-style Separator */}
            <View className="mx-4 my-3">
                <LinearGradient
                    colors={['transparent', 'rgba(256,256,256,0.7)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 2, borderRadius: 0.5 }}
                />
            </View>






            {/* FlatList */}
            <FlatList
                data={getSortedBusData()}
                renderItem={renderBusItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 5,
                    paddingBottom: 20,
                    gap: 1,
                }}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-400 text-lg">No buses available</Text>
                    </View>
                )}
            />
            {/* Modern Filter Modal */}
            <Modal
                visible={isFilterModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsFilterModalVisible(false)}
            >
                <View className="flex-1 bg-bg_gray">
                    {/* Modal Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-cyan_4bor">
                        <View>
                            <Text className="text-white text-xl font-bold">Sort & Filter</Text>
                            <Text className="text-gray-400 text-sm mt-1">Choose how to sort your results</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setIsFilterModalVisible(false)}
                            className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Filter Options */}
                    <View className="flex-1 p-6">
                        <Text className="text-white text-lg font-semibold mb-6">Sort by</Text>

                        <FilterOption
                            icon="time-outline"
                            title="Estimated Arrival Time"
                            description="Show buses arriving sooner first"
                            isSelected={sortBy === 'eta'}
                            onPress={() => handleSortSelection('eta')}
                        />

                        <FilterOption
                            icon="people-outline"
                            title="Occupancy Level"
                            description="Show buses with lower occupancy first"
                            isSelected={sortBy === 'occupancy'}
                            onPress={() => handleSortSelection('occupancy')}
                        />

                        <FilterOption
                            icon="bus-outline"
                            title="Bus Type"
                            description="Sort by Express, AC, Non-AC, Local"
                            isSelected={sortBy === 'busType'}
                            onPress={() => handleSortSelection('busType')}
                        />

                        <FilterOption
                            icon="refresh-outline"
                            title="Default Order"
                            description="Show original bus order"
                            isSelected={sortBy === 'none'}
                            onPress={() => handleSortSelection('none')}
                        />
                    </View>

                    {/* Bottom Actions */}
                    <View className="p-6 border-t border-gray-700">
                        <TouchableOpacity
                            onPress={() => {
                                setSortBy('none');
                                setIsFilterModalVisible(false);
                            }}
                            className="bg-cyan py-4 rounded-2xl items-center mb-3"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold text-lg">Clear All Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default buses;
