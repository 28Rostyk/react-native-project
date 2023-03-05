import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import { Fontisto } from "@expo/vector-icons";

import * as Location from "expo-location";

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    const location = await Location.getCurrentPositionAsync();
    console.log(location);
    setPhoto(photo.uri);
  };

  const sendPhoto = () => {
    console.log(navigation);
    navigation.navigate("Публікації", { photo });
    setPhoto("");
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCamera}>
        {photo && (
          <View style={styles.takePhotoContainer}>
            <Image
              source={{ uri: photo }}
              style={{
                height: 239,
                width: 343,
                borderWidth: 1,
                borderColor: "#F6F6F6",
                borderRadius: 8,
              }}
            />
          </View>
        )}
        <TouchableOpacity onPress={takePhoto} style={styles.photoIconContainer}>
          <Fontisto name="camera" size={24} color="#BDBDBD" />
        </TouchableOpacity>
      </Camera>
      <View>
        <Text style={styles.loadFoto}>Завантажити фото</Text>
      </View>

      <View style={styles.photoDescriptionContainer}>
        <TextInput style={styles.photoDescription} placeholder="Назва..." />
      </View>

      <View style={styles.photoLocationContainer}>
        <TextInput style={styles.photoLocation} placeholder="Місцевість..." />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
          <Text style={styles.btnText}>Опублікувати</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  camera: {
    height: 240,
    marginTop: 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },
  photoIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    backgroundColor: "#FFF",
    borderRadius: 50,
  },

  takePhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 1,
    borderColor: "#F6F6F6",
  },

  loadFoto: {
    marginTop: 8,
    marginLeft: 16,
    fontSize: 16,
    color: "#BDBDBD",
  },
  photoDescriptionContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },

  photoDescription: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingBottom: 15,
    paddingTop: 15,
  },

  btnContainer: {
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  photoLocationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },

  photoLocation: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingBottom: 15,
    paddingTop: 15,
  },

  sendBtn: {
    width: 343,
    height: 53,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#FFF",
    fontSize: 16,
  },
});
