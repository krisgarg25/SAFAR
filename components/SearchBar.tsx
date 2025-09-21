import {Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

interface Props {
    placeholder:string;
    onPress? :() => void;
}
const SearchBar = ({placeholder,onPress} : Props ) => {
    return (
        // <View className="flex-row items-center bg-bg_gray px-2 py-2
        // border border-white35_4bor rounded-lg mx-2 min-h-12s "
        //       style={{elevation:8,shadowColor:'black',shadowOffset: { width: 8, height: 8 },}} >
        //     <Image source={require('../images/searchbar.png')} className="h-[24px] w-[24px]" />
        //     <TextInput
        //         onPress={onPress}
        //         placeholder={placeholder}
        //         placeholderTextColor="rgba(255, 255, 255, 0.6)"
        //         className="text-white text-base ml-2 mt-0.5 h-10"
        //     />
        // </View>
        <View className="mx-4 min-h-12">
                    {/* Outer glow container */}
                    <View
                        className="absolute inset-0 rounded-xl"
                        style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            shadowColor: '#8B5CF6',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.7,
                            shadowRadius: 15,
                            elevation: 10,
                        }}
                    />

                    {/* Main search bar */}
                    <View className="flex-row items-center bg-bg_gray px-4 py-3 border-2 rounded-xl"
                          style={{
                              borderColor: '#8B5CF6',
                              elevation: 4,
                              shadowColor: '#8B5CF6',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.5,
                              shadowRadius: 10,
                          }}>

                        <View className="w-6 h-6 rounded-full bg-bg_gray items-center justify-center mr-3">
                            <Image
                                source={require('../images/searchbar.png')}
                                className="h-[14px] w-[14px]"
                                tintColor="white"
                            />
                        </View>

                        <TextInput
                            onPress={onPress}
                            placeholder={placeholder}
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            className="text-white text-base font-medium flex-1 h-10"
                        />
                    </View>
                </View>


    )
}

export default SearchBar
