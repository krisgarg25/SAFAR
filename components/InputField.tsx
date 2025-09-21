import {KeyboardAvoidingView, Text, TouchableWithoutFeedback, View} from "react-native";

const InputField=(label,
                  labelStyle,
                  secureTextEntry =false,
                  containerStyle,
                  inputStyle,
                  className,
                  ...props) =>{
    <KeyboardAvoidingView>
        <TouchableWithoutFeedback>
            <View className="my-2 w-full">
                <Text className={`mb-3 ${labelStyle}`}>
                    {label}
                </Text>
                <View>

                </View>

            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

}
export default InputField;