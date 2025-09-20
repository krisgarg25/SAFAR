// Store bus data in a mutable array
let busDataArray = [
    {
        id: '1',
        routeName: 'Bus 42',
        busNumber: 'PB2613',
        occupancy: 25,
        startLocation: 'Connaught Place',
        endLocation: 'Dwarka',
        currentStop: 'Rajiv Chowk Stop',
        startTime: '16:30',
        endTime: '17:30',
        busType: 'Express',
        fare: 55,
        eta: 0,
        status: 'arriving_shortly',
        latitude: 30.7904,
        longitude: 76.4985,
        smsNotification: true
    },
    {
        id: '2',
        routeName: 'Bus 42',
        busNumber: 'PB2614',
        occupancy: 30,
        startLocation: 'Connaught Place',
        endLocation: 'Dwarka',
        currentStop: 'Rajiv Chowk Stop',
        startTime: '17:00',
        endTime: '18:00',
        busType: 'Express',
        fare: 55,
        eta: 5,
        status: 'on_time',
        latitude: 30.7904,
        longitude: 76.4985,
        smsNotification: false
    },
    {
        id: '3',
        routeName: 'Bus 42',
        busNumber: 'PB2615',
        occupancy: 35,
        startLocation: 'Connaught Place',
        endLocation: 'Dwarka',
        currentStop: 'Rajiv Chowk Stop',
        startTime: '17:30',
        endTime: '18:30',
        busType: 'Express',
        fare: 55,
        eta: 0,
        status: 'at_stop',
        latitude: 30.7904,
        longitude: 76.4985,
        smsNotification: true
    },
    {
        id: '4',
        routeName: 'Bus 25',
        busNumber: 'DL8C2341',
        occupancy: 45,
        startLocation: 'India Gate',
        endLocation: 'Gurgaon',
        currentStop: 'ITO Metro Station',
        startTime: '18:00',
        endTime: '19:15',
        busType: 'AC',
        fare: 75,
        eta: 8,
        status: 'on_time',
        latitude: 28.6282,
        longitude: 77.2420,
        smsNotification: true
    }
];

// Your existing functions
export const getBusData = (routeId) => {
    return busDataArray;
};

export const getBusById = (busId, routeId) => {
    const buses = getBusData(routeId);
    return buses.find(bus => bus.busNumber === busId);
};

// New functions for alert management
export const addBusAlert = (newAlert) => {
    busDataArray.push(newAlert);
    console.log('New alert added:', newAlert);
    return busDataArray;
};

export const removeBusAlert = (alertId) => {
    const index = busDataArray.findIndex(bus => bus.id === alertId);
    if (index > -1) {
        busDataArray.splice(index, 1);
    }
    return busDataArray;
};

export const updateBusAlert = (alertId, updates) => {
    const index = busDataArray.findIndex(bus => bus.id === alertId);
    if (index > -1) {
        busDataArray[index] = { ...busDataArray[index], ...updates };
    }
    return busDataArray;
};
