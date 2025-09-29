import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router' // Add this import

const { width, height } = Dimensions.get('window')

const Profile = () => {
    const navigation = useNavigation()
    const router = useRouter() // Add this hook

    const handleMenuItemPress = (screenName: string) => {
        // Handle different navigation based on screen
        switch (screenName) {
            case 'Settings':
                router.push('/profile_components/settings')
                break
            case 'Notifications':
                // Add your notification route
                router.push('/profile_components/notifications')
                break
            case 'Language':
                // Add your language route
                router.push('/profile_components/language')
                break
            case 'HelpSupport':
                // Add your help & support route
                router.push('/profile_components/help-support')
                break
            case 'About':
                // Add your about route
                router.push('/profile_components/about')
                break
            default:
                // Fallback to React Navigation if needed
                navigation.navigate(screenName as never)
        }
    }

    // Add this function to handle edit profile navigation
    const handleEditProfile = () => {
        router.push('/profile_components/editprofile')
    }

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logout pressed')
        // You might want to navigate to login screen after logout
        // router.replace('/auth/login')
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('@/images/back.png')} className="h-10 w-10" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120x120/FFB6C1/000000?text=User' }}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditProfile}
                        activeOpacity={0.7}
                    >
                        <Image source={require('@/images/pencil.png')} className="h-5 w-5" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>Gopal </Text>
                <Text style={styles.userId}>user id: 247682</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress('Settings')}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="settings-outline" size={22} color="#666" />
                        <Text style={styles.menuItemText}>Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress('Notifications')}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="notifications-outline" size={22} color="#666" />
                        <Text style={styles.menuItemText}>Notification</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress('Language')}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="language-outline" size={22} color="#666" />
                        <Text style={styles.menuItemText}>Language</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress('HelpSupport')}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="help-circle-outline" size={22} color="#666" />
                        <Text style={styles.menuItemText}>Help & Support</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress('About')}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="information-circle-outline" size={22} color="#666" />
                        <Text style={styles.menuItemText}>About</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
            >
                <Image source={require('@/images/logout.profile.png')} className="h-5 w-5" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a202c',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05, // Responsive padding
        paddingVertical: height * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: '#4A5568',
        borderRadius: 25,
        marginHorizontal: width * 0.025,
        marginTop: height * 0.025,
    },
    backButton: {
        padding: 0,
    },
    headerTitle: {
        fontSize: width * 0.05, // Responsive font size
        fontWeight: '600',
        color: 'white',
    },
    placeholder: {
        width: 30,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: height * 0.04,
        marginTop: height * 0.015,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: height * 0.025,
    },
    profileImage: {
        width: width * 0.3, // Responsive image size
        height: width * 0.3,
        borderRadius: width * 0.15,
        backgroundColor: '#FFB6C1',
    },
    editButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#3182CE',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: width * 0.06, // Responsive font size
        fontWeight: '600',
        color: 'white',
        marginBottom: 5,
    },
    userId: {
        fontSize: width * 0.035,
        color: '#A0AEC0',
    },
    menuContainer: {
        backgroundColor: '#1f2937e6',
        borderWidth: 1,
        borderColor: '#4A5568',
        marginHorizontal: width * 0.05,
        borderRadius: 15,
        paddingVertical: 0,
        marginBottom: height * 0.01,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: width * 0.04,
        color: 'white',
        marginLeft: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#4A5568',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#06b6d4',
        marginHorizontal: width * 0.05,
        marginTop: height * 0.01,
        paddingVertical: height * 0.02,
        borderRadius: 15,
    },
    logoutText: {
        fontSize: width * 0.04,
        color: '#Ffffff',
        fontWeight: '600',
        marginLeft: 4,
    },
})
