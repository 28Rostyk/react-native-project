import { useState, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignInUser } from "../../../redux/auth/auth-operations";

import { initialState } from "./initialState";

SplashScreen.preventAutoHideAsync();

export default function LoginScreen({ navigation }) {
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [state, setState] = useState(initialState);
  const [focused, setFocused] = useState("");
  const [fontsLoaded] = useFonts({
    Roboto: require("../../../assets/fonts/Roboto-Regular.ttf"),
  });

  const dispatch = useDispatch();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const touchableHide = () => {
    Keyboard.dismiss();
    setIsShowKeybord(false);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setIsShowKeybord(false);
    dispatch(authSignInUser(state));
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={touchableHide}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "height" : "padding"}
        onLayout={onLayoutRootView}
      >
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/image/PhotoBG.png")}
        >
          <View style={styles.formContainer}>
            <View>
              <Text
                style={{
                  ...styles.formTitle,
                  fontFamily: "Roboto",
                  fontSize: 30,
                }}
              >
                Увійти
              </Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Адрес електронної пошти"
                value={state.email}
                style={{
                  ...styles.input,
                  fontFamily: "Roboto",
                  borderWidth: 1,
                  borderColor: focused === "email" ? "#FF6C00" : "#FFF",
                }}
                onFocus={() => {
                  setIsShowKeybord(true);
                  setFocused("email");
                }}
                onBlur={() => {
                  setFocused("");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
              />
            </View>
            <View style={{ marginTop: 16, marginBottom: 43 }}>
              <TextInput
                secureTextEntry={true}
                placeholder="Пароль"
                value={state.password}
                style={{
                  ...styles.input,
                  fontFamily: "Roboto",
                  borderWidth: 1,
                  borderColor: focused === "password" ? "#FF6C00" : "#FFF",
                }}
                onFocus={() => {
                  setIsShowKeybord(true);
                  setFocused("password");
                }}
                onBlur={() => {
                  setFocused("");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
              />
            </View>
            <TouchableOpacity
              style={styles.formBtn}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text
                style={{ color: "#FFFFFF", fontFamily: "Roboto", fontSize: 16 }}
              >
                Увійти
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginBottom: isShowKeybord ? -115 : 144,
                alignSelf: "center",
              }}
              onPress={() => navigation.navigate("Registration")}
            >
              <Text>
                Немає акаунта?{" "}
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Roboto",
                    color: "#1B4371",
                    marginLeft: 5,
                  }}
                >
                  Зареєструватися
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  formTitle: {
    textAlign: "center",
    marginTop: 32,
    marginBottom: 32,
    color: "#212121",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    marginHorizontal: 16,
    height: 50,
    borderRadius: 8,
    padding: 16,
    color: "#212121",
    fontSize: 16,
  },

  formBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6C00",
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 100,
  },
});
