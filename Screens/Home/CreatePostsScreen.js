import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { Fontisto } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

const CreatePostsScreen = () => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();
    setPhoto(photo.uri);
    console.log(camera.takePictureAsync());
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
    borderRadius: 8,
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
});
