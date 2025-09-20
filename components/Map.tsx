import MapView, {Marker, PROVIDER_DEFAULT} from "react-native-maps";
import {useBusStore, useLocationStore} from "@/store";
import {calculateRegion, generateMarkersFromData} from "@/utils/map";
import {useEffect, useRef, useState} from "react";
import { getBusData } from '@/utils/busData';
import {View,Image} from "react-native";

// Remove any old MarkerData interfaces and keep only this one
declare interface MarkerData {
    latitude: number;
    longitude: number;
    id: string;
    title: string;
    routeName: string;
    busNumber: string;
    occupancy: number;
    startLocation: string;
    endLocation: string;
    currentStop: string;
    startTime: string;
    endTime: string;
    busType: string;
    fare: number;
    eta: number;
    status: 'arriving_shortly' | 'on_time' | 'at_stop';
    smsNotification: boolean;
}


interface MapProps {
    userLatitude?: number;
    userLongitude?: number;
}

const Map = ({ userLatitude: propUserLat, userLongitude: propUserLng }: MapProps) => {
    const{userLongitude: storeLng, userLatitude: storeLat, destinationLatitude, destinationLongitude} = useLocationStore();
    const {selectedDriver, setDrivers} = useBusStore();
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const buses = getBusData();

    // Use props first, fallback to store
    const userLatitude = propUserLat || storeLat;
    const userLongitude = propUserLng || storeLng;

    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
    });

    useEffect(() => {
        if(Array.isArray(buses)) {
            if(!userLongitude || !userLatitude) {
                console.log('Missing coordinates:', { userLatitude, userLongitude });
                return;
            }

            const newMarkers = generateMarkersFromData({
                data: buses,
                userLatitude,
                userLongitude,
            });

            console.log('Generated markers:', newMarkers.length);
            setMarkers(newMarkers);
        }
    }, [buses, userLatitude, userLongitude]);
    const mapRef = useRef(null);

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            style={{flex: 1}}
            mapType="standard"
            showsPointsOfInterest={false}
            initialRegion={region}
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    title={marker.title}
                >
                    <View className="w-10 h-10 bg-white rounded-full border-2 border-orange-500 items-center justify-center shadow-lg">
                        <Image
                            source={require('../images/bus_loc.png')}
                            className="w-8 h-8"
                            style={{ tintColor: '#EF6820' }}
                        />
                    </View>
                </Marker>
            ))}
        </MapView>
    );
};

export default Map;