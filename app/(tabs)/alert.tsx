import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BusAlertCard from '../../components/BusAlertCard';
import { getBusData, updateBusAlert } from '@/utils/busData';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AlertScreen() {
    const [buses, setBuses] = useState(() => getBusData());
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const handleToggleSMS = (busId, enabled) => { // Removed TS annotation
        setBuses(prevBuses =>
            prevBuses.map(bus =>
                bus.id === busId
                    ? { ...bus, smsNotification: enabled }
                    : bus
            )
        );

        updateBusAlert(busId, { smsNotification: enabled });
        console.log(`SMS notification ${enabled ? 'enabled' : 'disabled'} for bus ${busId}`);
    };

    const refreshData = () => {
        setBuses(getBusData());
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refreshData();
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    // Fixed interval effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBuses(prevBuses => {
                let hasChanges = false;
                const updatedBuses = prevBuses.map(bus => {
                    if (bus.status === 'arriving_shortly' && Math.random() > 0.9) {
                        hasChanges = true;
                        const updatedBus = { ...bus, status: 'at_stop', eta: 0 };
                        updateBusAlert(bus.id, { status: 'at_stop', eta: 0 });
                        return updatedBus;
                    }
                    if (bus.status === 'on_time' && bus.eta > 0 && Math.random() > 0.7) {
                        hasChanges = true;
                        const newEta = Math.max(0, bus.eta - 1);
                        const updatedBus = { ...bus, eta: newEta };
                        updateBusAlert(bus.id, { eta: newEta });
                        return updatedBus;
                    }
                    return bus;
                });

                return hasChanges ? updatedBuses : prevBuses;
            });
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // Fixed focus effect - use useFocusEffect instead
    useFocusEffect(
        React.useCallback(() => {
            refreshData();
        }, [])
    );

    const renderBusCard = ({ item: bus }) => (
        <BusAlertCard
            id={bus.id}
            routeName={bus.routeName}
            startLocation={bus.startLocation}
            endLocation={bus.endLocation}
            currentStop={bus.currentStop}
            eta={bus.eta}
            status={bus.status}
            smsNotification={bus.smsNotification}
            onToggleSMS={handleToggleSMS}
            busNumber={bus.busNumber}
        />
    );

    return (
        <View className="flex-1 bg-bg_gray">
            <SafeAreaView className="bg-bg_gray px-4 pt-2 pb-3 border-b border-orange_4bor">
                <View className="flex-row items-center justify-between h-11">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/images/back.png')} className="h-10 w-10" />
                    </TouchableOpacity>

                    <Text className="text-2xl font-bold text-white text-center tracking-wide">
                        Alert
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/set-alert')}
                        className="w-11 h-11 items-center justify-center"
                    >
                        <Ionicons name="add" size={28} color="#EF6820" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <FlatList
                data={buses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBusCard}
                contentContainerStyle={{
                    paddingTop: 12,
                    paddingBottom: insets.bottom + 80
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#EF6820"
                        colors={['#EF6820']}
                    />
                }
                showsVerticalScrollIndicator={false}
                bounces={true}
            />
        </View>
    );
}
