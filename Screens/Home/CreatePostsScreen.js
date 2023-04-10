import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as Location from "expo-location";
import { storage, database } from "../../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { getDatabase, set, ref as ref2 } from "firebase/database";

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const [comment, setComment] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [location, setLocation] = useState(null);
  console.log(comment);
  console.log(photo);
  const commentHandler = (text) => setComment(text);
  const locationHandler = (text) => setPhotoLocation(text);

  const { userId, nickName } = useSelector((state) => state.auth);

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const keyboardHide = () => {
    Keyboard.dismiss();
  };
  const keyboardHideInput = () => {
    Keyboard.dismiss();
    setComment("");
    setPhotoLocation("");
  };

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setPhoto(photo.uri);
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const sendPhoto = () => {
    uploadPostToServer();
    navigation.navigate("Публікації");
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const db = getDatabase();
    const postId = Date.now().toString();
    set(ref2(db, "posts/" + postId), {
      photo,
      comment,
      photoLocation,
      location: location.coords,
      userId,
      nickName,
      postId,
    });
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.containerPermission}>
        <Text style={styles.textPermission}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const uploadPhotoToServer = async () => {
    if (!photo) return;

    try {
      const response = await fetch(photo);
      const file = await response.blob();

      const uniquePostId = Date.now();

      const reference = ref(storage, `image/${uniquePostId}`);
      const result = await uploadBytesResumable(reference, file);
      const processedPhoto = await getDownloadURL(result.ref);
      console.log(processedPhoto);
      return processedPhoto;
    } catch (err) {}
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const deleteAll = () => {
    setComment("");
    setPhotoLocation("");
    setPhoto("");
    setLocation(null);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} ref={setCamera} type={type}>
            {photo && (
              <View style={styles.takePhotoContainer}>
                <Image source={{ uri: photo }} style={styles.image} />
              </View>
            )}
            <View style={styles.buttonIconContainer}>
              <TouchableOpacity onPress={takePhoto} activeOpacity={0.9}>
                <View style={styles.backIcon}>
                  <Ionicons name="camera" size={24} color="#BDBDBD" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <MaterialCommunityIcons
                  name="camera-flip-outline"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Завантажте фото</Text>

          <View style={styles.form}>
            <TextInput
              value={comment}
              onChangeText={commentHandler}
              placeholder="Назва..."
              placeholderTextColor="#BDBDBD"
              style={styles.input}
            />

            <View style={styles.locationContainer}>
              <TextInput
                value={photoLocation}
                onChangeText={locationHandler}
                placeholder="Місцевість"
                placeholderTextColor="#BDBDBD"
                style={styles.locationPlaceholder}
              />
              <Ionicons
                style={styles.locationIcon}
                name="location-outline"
                size={24}
                color="#BDBDBD"
              />
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor:
                  !photo || !comment || !photoLocation ? "#F6F6F6" : "#FF6C00",
              }}
              onPress={() => {
                sendPhoto();
                keyboardHideInput();
              }}
              disabled={!photo && true}
              activeOpacity={photo ? 1 : 0.7}
            >
              <Text style={{ ...styles.btnTitle }}>Опублікувати</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 120,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              style={{
                width: 70,
                height: 40,
                borderRadius: 50,
                backgroundColor: "#F6F6F6",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => deleteAll()}
            >
              <AntDesign name="delete" size={32} color="#DADADA" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};
export default CreatePostsScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  cameraContainer: {
    marginHorizontal: 16,
  },
  camera: {
    height: 240,
    marginTop: 32,
    marginBottom: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  takePhotoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    height: 130,
    width: 130,
    borderRadius: 8,
  },
  buttonIconContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backIcon: {
    backgroundColor: "#FFFFFF",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  dataContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  dataLabel: {
    fontSize: 20,
    marginBottom: 35,
    color: "#BDBDBD",
  },

  form: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    fontSize: 20,
    color: "#212121",
    width: "100%",
    height: 50,
    marginBottom: 16,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  locationContainer: {
    width: "100%",
  },
  locationPlaceholder: {
    height: 50,
    paddingLeft: 30,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  locationIcon: {
    position: "absolute",
    top: 11,
  },

  btnContainer: {
    alignItems: "center",
  },
  btn: {
    width: 343,
    height: 51,
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    marginHorizontal: 16,
    borderRadius: 100,
    marginTop: 27,
    // marginBottom: 120,

    ...Platform.select({
      ios: {
        backgroundColor: "transparent",
        borderColor: "#f0f8ff",
      },
      android: {
        backgroundColor: "#FF6C00",
        borderColor: "transparent",
      },
    }),
  },
  btnTitle: {
    color: "#fff",
    fontSize: 20,
  },
});
