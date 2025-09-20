import {create} from "zustand";
declare interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
}
declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}
declare interface BusStore {
    drivers: MarkerData[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: MarkerData[]) => void;
    clearSelectedDriver: () => void;
}
export const useLocationStore = create<LocationStore>((set) => ({
    userAddress:null,
    userLatitude:null,
    userLongitude:null,
    destinationLongitude:null,
    destinationAddress:null,
    destinationLatitude:null,
    setUserLocation:({latitude,longitude,address} :{latitude:number ;longitude:number;address:string}) => {
        set(() => ({
            userLatitude:latitude,
            userLongitude:longitude,
            userAddress:address,
        }));
},
    setDestinationLocation:({latitude,longitude,address} :{latitude:number;longitude:number;address:string}) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address,
        }));
    },
}));

export const useBusStore = create<BusStore>((set) => ({
     drivers:[] as MarkerData[],
    selectedDriver:null,
    setSelectedDriver:(driverId : number) => set(() => ({selectedDriver:driverId})),
    setDrivers:(drivers:MarkerData[]) => set(() => ({drivers:drivers})),
    clearSelectedDriver:() => set(() => ({selectedDriver:null})),
}));