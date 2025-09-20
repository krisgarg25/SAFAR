import { Tabs } from "expo-router";
import React from 'react';
import {Image, ImageBackground, Text, TouchableWithoutFeedback, View} from 'react-native';
import {black} from "nativewind/src/metro/picocolors";
import { Pressable } from 'react-native';


const Tabicon = ({ focused, icon,title }: any) => {

   if(focused) {
       return (
               <TouchableWithoutFeedback>
           <ImageBackground source={require('../../images/icon_bg.png')}
                            className=' flex flex-col w-full flex-1 min-w-[80px] min-h-14 mt-4 mb-0.5 rounded-full overflow-hidden justify-center items-center '>

               <Image source={icon} className="mb-0.5 w-6 h-6"/>
               <Text className='text-black font-semibold'>{title}</Text>
           </ImageBackground>
               </TouchableWithoutFeedback>
       )
   }
   else{
       return (

               <View
                   className=' flex flex-col w-full flex-1 min-w-[112px] min-h-14 mt-4 rounded-full overflow-hidden justify-center items-center '>
                   <Image source={icon} className="mb-0.5 w-6 h-6 tint-black"/>
                   <Text className='text-black font-semibold '>{title}</Text>
               </View>

       )
   }
}
const _layout = () => {
  return (
      <Tabs 
      screenOptions={{
          animation:"none",
        tabBarShowLabel:false,
        tabBarItemStyle:
        {
            width:'100%',
            height:"100%",
            justifyContent:"center",
            alignItems:"center",
            marginTop:4

        },
        tabBarStyle:{
            height:60,
            backgroundColor:"white",
            borderRadius:25,
            marginHorizontal:10,
            marginBottom:15,
            position:'absolute',
            overflow:'hidden',
            borderWidth:1.5,
            borderTopWidth:2,
            borderColor:"#EF6820",
        },
          tabBarLabelStyle:{
            color:'#070707',
              fontSize:12,
              fontFamily:'noto sans',
              marginTop:1,
              overflow:'hidden',
          }
      }}>
          <Tabs.Screen name="index"
                       options={{ title: "Your Bus",
                           headerShown: false,
                           tabBarButton
                               :(props) =>
                               <Pressable {...props}
                                          android_ripple={null} />,
          tabBarIcon: ({ focused }) => (
              <Tabicon
              focused={focused}
              icon={require("../../images/Home.png")}
              title={"Your Bus"}
              />
          )
                  }}
                       />
          <Tabs.Screen name="search"
                       options={{ title: "search" ,
                           headerShown: false ,
                           tabBarButton
                               :(props) =>
                               <Pressable {...props}
                                          android_ripple={null} />,
                           tabBarIcon: ({ focused }) => (
                               <Tabicon
                                   focused={focused}
                                   icon={require("../../images/search.png")}
                                   title={"Search"}
                               />
                           )     }} />
          <Tabs.Screen name="alert"
                       options={{ title: "alert" ,
                           headerShown: false,
                           tabBarButton
                               :(props) =>
                               <Pressable {...props}
                                          android_ripple={null} />,
                           tabBarIcon: ({ focused }) => (
                               <Tabicon
                                   focused={focused}
                                   icon={require("../../images/Bell.png")}
                                   title={"Alert"}
                               />
                           )     }} />
          <Tabs.Screen name="profile"
                       options={{ title: "profile" ,
                           headerShown: false,
                           tabBarButton
                               :(props) =>
                               <Pressable {...props}
                                          android_ripple={null} />,
                           tabBarIcon: ({ focused }) => (
                               <Tabicon
                                   focused={focused}
                                   icon={require("../../images/profile.png")}
                                   title={"Profile"}
                               />
                           )
          }} />
      </Tabs>

  )
}

export default _layout