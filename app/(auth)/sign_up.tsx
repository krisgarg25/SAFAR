
import {SafeAreaView} from "react-native-safe-area-context";
import {Text} from "react-native";
import {useState} from "react";
import InputField from "@/components/InputField";

const signup = () => {
    const [form, setForm] = useState({
        name:'',
        email:'',
        password:'',
    });
    return(
        <SafeAreaView>
            <InputField
                label="name"
                placeholder="enter your name"
                value={form.name}
                onChangeText={(value) => setForm({...form, name: value})}
            />
        </SafeAreaView>
    )
}

export default signup;