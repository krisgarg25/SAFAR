import React, { useState, useMemo } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getBusData } from '@/utils/busData';
import BusCard from '@/components/businfo';
import {SafeAreaView} from "react-native-safe-area-context";

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
    const filteredSuggestions = useMemo(
        () =>
            currentInput
                ? locationSuggestions.filter(loc =>
                    loc.toLowerCase().includes(currentInput.toLowerCase())
                )
                : [],
        [currentInput, locationSuggestions]
    );

    const filteredBuses = useMemo(() => {
        if (!start.trim() || !destination.trim()) return [];
        return allBuses.filter(
            bus =>
                bus.startLocation.toLowerCase() === start.toLowerCase() &&
                bus.endLocation.toLowerCase() === destination.toLowerCase()
        );
    }, [start, destination, allBuses]);

    const applySuggestion = (value: string) => {
        if (editing === 'start') setStart(value);
        else setDestination(value);
        setEditing(null);
        Keyboard.dismiss();
    };

    const renderBus = ({ item }) => <BusCard {...item} isLive />;

    return (
        <SafeAreaView className="flex-1 bg-bg_gray p-4">
            {/* Header */}
            <View className="flex-row items-center justify-center mb-4">
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.titleWrap}>
                    <Text style={styles.title}>Track Bus</Text>
                    <Text style={styles.sub}>{`${start} → ${destination}`}</Text>
                </View>
            </View>

            {/* Inputs & Markers */}
            <View style={styles.row}>
                <View style={styles.markers}>
                    <View style={styles.circle} />
                    <View style={styles.line} />
                    <View style={styles.square} />
                </View>
                <View style={styles.fields}>
                    {[
                        {
                            label: 'Start',
                            value: start,
                            setValue: setStart,
                            icon: 'navigate',
                            field: 'start',
                            placeholder: 'Type starting location...',
                        },
                        {
                            label: 'Destination',
                            value: destination,
                            setValue: setDestination,
                            icon: 'location',
                            field: 'end',
                            placeholder: 'Type destination...',
                        },
                    ].map(({ label, value, setValue, icon, field, placeholder }) => (
                        <View key={field} style={[styles.fieldGroup, { overflow: 'visible' }]}>
                            <Text style={styles.label}>{label}</Text>
                            <View
                                style={[
                                    styles.inputBox,
                                    { borderColor: value ? '#EF6820' : '#343A46' },
                                ]}
                            >
                                <Ionicons name={icon} size={18} color="#EF6820" />
                                <TextInput
                                    value={value}
                                    onChangeText={text => {
                                        setValue(text);
                                        setEditing(field as any);
                                    }}
                                    placeholder={placeholder}
                                    placeholderTextColor="#8B949E"
                                    style={styles.input}
                                    onFocus={() => setEditing(field as any)}
                                    clearButtonMode="while-editing"
                                />
                            </View>
                            {editing === field && filteredSuggestions.length > 0 && (
                                <View style={styles.suggestions}>
                                    {filteredSuggestions.map((s, i) => (
                                        <TouchableOpacity
                                            key={s}
                                            onPress={() => applySuggestion(s)}
                                            style={[
                                                styles.suggItem,
                                                i === filteredSuggestions.length - 1 && styles.suggLast,
                                            ]}
                                        >
                                            <Text style={styles.suggText}>{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.divider} />

            {/* Results */}
            {!start || !destination ? (
                <View style={styles.empty}>
                    <Ionicons name="search-outline" size={48} color="#6B7280" />
                    <Text style={styles.emptyText}>
                        Enter start and destination to see buses.
                    </Text>
                </View>
            ) : filteredBuses.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="bus-outline" size={48} color="#6B7280" />
                    <Text style={styles.emptyText}>No buses found for this route.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredBuses}
                    keyExtractor={item => item.id}
                    renderItem={renderBus}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
        backBtn: { padding: 8 },
    titleWrap: { flex: 1, alignItems: 'center' },
    title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    sub: { color: '#EF6820', fontSize: 12, marginTop: 2 },

    row: { flexDirection: 'row', marginBottom: 16 },
    markers: { width: 24, alignItems: 'center' },
    circle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF6820' },
    line: { flex: 1, width: 2, backgroundColor: '#343A46', marginVertical: 4 },
    square: { width: 10, height: 10, backgroundColor: '#EF6820' },

    fields: { flex: 1, paddingLeft: 12 },
    fieldGroup: { marginBottom: 12 },
    label: { color: '#8B949E', marginBottom: 4, fontSize: 12 },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#23272e',
        borderRadius: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        height: 44,
    },
    input: { flex: 1, marginLeft: 8, color: '#FFF', fontSize: 16 },

    suggestions: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: '#23272e',
        borderRadius: 10,
        zIndex: 100,
        elevation: 10,
    },
    suggItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#343A46',
    },
    suggLast: {
        borderBottomWidth: 0,
    },
    suggText: { color: '#FFF' },

    divider: { height: 2, backgroundColor: '#2e2e2e', marginVertical: 12, borderRadius: 1 },

    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    emptyText: { color: '#8B949E', marginTop: 12, fontSize: 16, textAlign: 'center' },

    list: { paddingBottom: 24 },
});
