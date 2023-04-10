import { useState, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../../redux/auth/auth-operations";

import { initialState } from "./initialState";

SplashScreen.preventAutoHideAsync();

export default function RegistrationScreen({ navigation }) {
  const [securePassword, setSecurePassword] = useState(true);
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [state, setState] = useState(initialState);
  const [focused, setFocused] = useState("");
  // const [userImage, setUserImage] = useState(null);
  // console.log(userImage);

  const [fontsLoaded] = useFonts({
    Roboto: require("../../../assets/fonts/Roboto-Regular.ttf"),
  });
  const dispatch = useDispatch();

  const toShowPassword = securePassword ? "Показать" : "Скрыть";

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
    // console.log(state);
    dispatch(authSignUpUser(state));
    setState(initialState);
  };

  // const clickOnBackground = () => {
  //   setIsShowKeyboard(false);
  //   Keyboard.dismiss();
  // };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // setUserImage(result.assets[0].uri);
    setState((prevState) => ({
      ...prevState,
      userImage: result.assets[0].uri,
    }));
  };

  const removeImage = () => {
    setState(null);
  };

  return (
    <TouchableWithoutFeedback onPress={touchableHide}>
      <View style={styles.container}>
        <Image
          style={styles.imageBg}
          source={require("../../../assets/image/PhotoBG.png")}
        />
        <KeyboardAvoidingView
          // behavior={Platform.OS === "android" ? "height" : "padding"}
          behavior={Platform.OS == "ios" ? "padding" : ""}
          onLayout={onLayoutRootView}
        >
          <View
            style={{
              ...styles.form,
              marginBottom: isShowKeybord ? -200 : 0,
            }}
          >
            <View style={styles.fotoUser}>
              <TouchableOpacity
                style={styles.btnAddOrClose}
                onPress={state.userImage ? removeImage : pickImage}
              >
                {!state.userImage ? (
                  <AntDesign name="pluscircleo" size={24} color="#FF6C00" />
                ) : (
                  <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
                )}
              </TouchableOpacity>
              {state.userImage && (
                <Image
                  source={{ uri: state.userImage }}
                  style={{ width: 120, height: 120, borderRadius: 16 }}
                />
              )}
            </View>
            {/* <View style={styles.imgContainer}>
              <Image
                style={{ borderRadius: 16 }}
                source={require("../../../assets/image/userImg.jpg")}
              />
            </View> */}
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
                style={{
                  ...styles.input,
                  fontFamily: "Roboto",
                  borderWidth: 1,
                  borderColor: focused === "login" ? "#FF6C00" : "#FFF",
                }}
                value={state.nickname}
                onFocus={() => {
                  setIsShowKeybord(true);
                  setFocused("login");
                }}
                onBlur={() => {
                  setFocused("");
                }}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, nickname: value }))
                }
              />
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
                placeholderTextColor="#BDBDBD"
                value={state.password}
                style={{
                  ...styles.input,
                  fontFamily: "Roboto",
                  borderWidth: 1,
                  borderColor: focused === "password" ? "#FF6C00" : "#FFF",
                }}
                secureTextEntry={securePassword}
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

              <TouchableOpacity
                style={styles.btnInInput}
                onPress={() => {
                  setSecurePassword(!securePassword);
                }}
              >
                <Text style={styles.showPassword}>{toShowPassword}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.formBtn}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Roboto",
                  fontSize: 16,
                }}
              >
                Зареєструватися
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "center",
              }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text>
                Вже є акаунт?{" "}
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Roboto",
                    color: "#1B4371",
                  }}
                >
                  Увійти
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },

  imageBg: {
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    width: "100%",
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },

  form: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFFFFF",
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 78,
  },

  // imgContainer: {
  //   position: "absolute",
  //   width: 120,
  //   height: 120,
  //   top: -60,
  //   left: 128,
  //   backgroundColor: "#F6F6F6",
  //   borderRadius: 16,
  //   zIndex: 10,
  // },

  fotoUser: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    position: "absolute",
    transform: [{ translateX: -50 }, { translateY: -60 }],
    left: "50%",
    zIndex: 5,
  },
  btnAddOrClose: {
    position: "absolute",
    right: 0,
    transform: [{ translateX: 12 }],
    bottom: 10,
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

  btnInInput: {
    position: "absolute",
    top: "50%",
    right: 30,
    transform: [{ translateY: -10 }],
  },
  showPassword: {
    color: "#1B4371",
  },
});
