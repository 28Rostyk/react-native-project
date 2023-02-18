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
  Image,
} from "react-native";

import { initialState } from "./initialState";

SplashScreen.preventAutoHideAsync();

export default function RegistrationScreen() {
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [state, setState] = useState(initialState);
  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-Regular.ttf"),
  });

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

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeybord(false);
    console.log(state);
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
          source={require("../../assets/image/PhotoBG.png")}
        >
          <View style={styles.formContainer}>
            <View style={styles.imgContainer}>
              <Image
                style={{ borderRadius: 16 }}
                source={require("../../assets/image/userImg.jpg")}
              />
            </View>
            <View>
              <Text
                style={{
                  ...styles.formTitle,
                  fontFamily: "Roboto",
                  fontSize: 30,
                }}
              >
                Регістрація
              </Text>
            </View>
            <View>
              <TextInput
                placeholder="Логін"
                style={{ ...styles.input, fontFamily: "Roboto" }}
                value={state.login}
                onFocus={() => {
                  setIsShowKeybord(true);
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, login: value }))
                }
              />
            </View>
            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Адрес електронної пошти"
                value={state.email}
                style={{ ...styles.input, fontFamily: "Roboto" }}
                onFocus={() => {
                  setIsShowKeybord(true);
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
                style={{ ...styles.input, fontFamily: "Roboto" }}
                onFocus={() => {
                  setIsShowKeybord(true);
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, password: value }))
                }
              />
            </View>
            <TouchableOpacity
              style={styles.formBtn}
              activeOpacity={0.8}
              onPress={keyboardHide}
            >
              <Text
                style={{ color: "#FFFFFF", fontFamily: "Roboto", fontSize: 16 }}
              >
                Зареєструватися
              </Text>
            </TouchableOpacity>
            <View style={{ marginBottom: isShowKeybord ? -115 : 78 }}>
              <Text style={{ textAlign: "center", fontFamily: "Roboto" }}>
                Вже є акаунт? Увійти
              </Text>
            </View>
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

  imgContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    top: -60,
    left: 128,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    zIndex: 10,
  },

  formTitle: {
    textAlign: "center",
    marginTop: 92,
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
