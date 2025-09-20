import {Image, StyleSheet, Text, TextInput, View} from 'react-native'
import React from 'react'
interface Props {
    placeholder:string;
    onPress? :() => void;
}
const SearchBar = ({placeholder,onPress} : Props ) => {
    return (
        <View className="flex-row items-center bg-bg_gray px-2 py-2
        border border-white35_4bor rounded-lg mx-2 min-h-12s "
              style={{elevation:8,shadowColor:'black',shadowOffset: { width: 8, height: 8 },}} >
            <Image source={require('../images/searchbar.png')} className="h-[24px] w-[24px]" />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                className="text-white text-base ml-2 mt-0.5 h-10"
            />
        </View>
    )
}

export default SearchBar
