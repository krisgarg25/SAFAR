import {Redirect} from 'expo-router';
import {useAuth} from "@clerk/clerk-expo";

const start = () => {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/(tabs)/Home'} />
    }

    return <Redirect href={'/(auth)/welcome'}/>
};

export default start;