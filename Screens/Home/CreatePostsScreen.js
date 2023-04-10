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
import { Camera, CameraType } from "expo-camera";
// import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as Location from "expo-location";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
const storage = getStorage();

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const [comment, setComment] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [location, setLocation] = useState(null);

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

      // let location = await Location.getCurrentPositionAsync({});
      // // const coords = {
      // //   latitude: location.coords.latitude,
      // //   longitude: location.coords.longitude,
      // // };
      // setLocation(location);
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
    // console.log(location);
  };

  const sendPhoto = () => {
    uploadPostToServer();
    // uploadPhotoToServer();
    navigation.navigate("Публікації");

    //  setPhoto("");
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();

    const docRef = await addDoc(collection(db, "posts"), {
      photo,
      comment,
      photoLocation,
      location: location.coords,
      userId,
      nickName,
    });
    // console.log("Document written with ID: ", docRef.id);
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

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.cameraContainer}>
          {/* Додаємо камеру */}
          <Camera style={styles.camera} ref={setCamera} type={type}>
            {/* відображаємо прев'юшку фото поверх екрану камери */}
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
              style={styles.btn}
              activeOpacity={0.8}
              onPress={() => {
                sendPhoto();
                keyboardHideInput();
              }}
            >
              <Text style={styles.btnTitle}>Опублікувати</Text>
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
    // marginBottom: 45,
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
    marginBottom: 16,

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
    // fontFamily: "Roboto-Regular",
    fontSize: 20,
  },

  containerPermission: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  textPermission: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

// return (
//   <View style={styles.container}>
//     <Camera style={styles.camera} ref={setCamera}>
//       {photo && (
//         <View style={styles.takePhotoContainer}>
//           <Image
//             source={{ uri: photo }}
//             style={{
//               height: 100,
//               width: 100,
//               borderWidth: 1,
//               borderColor: "#F6F6F6",
//               borderRadius: 8,
//             }}
//           />
//         </View>
//       )}
//       <TouchableOpacity onPress={takePhoto} style={styles.photoIconContainer}>
//         <Fontisto name="camera" size={24} color="#BDBDBD" />
//       </TouchableOpacity>
//     </Camera>
//     <View>
//       <Text style={styles.loadFoto}>Завантажити фото</Text>
//     </View>

//     <View style={styles.photoDescriptionContainer}>
//       <TextInput
//         style={styles.photoDescription}
//         placeholder="Назва..."
//         onChangeText={setComment}
//       />
//     </View>

//     <View style={styles.photoLocationContainer}>
//       <TextInput
//         style={styles.photoLocation}
//         placeholder="Місцевість..."
//         onChangeText={setPhotoLocation}
//       />
//     </View>

//     <View style={styles.btnContainer}>
//       <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
//         <Text style={styles.btnText}>Опублікувати</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

//   return (
//     <TouchableWithoutFeedback onPress={keyboardHide}>
//       <View
//         style={{
//           ...styles.container,
//         }}
//       >
//         <ScrollView contentContainerStyle={styles.scroll}>
//           <View style={styles.contentWrap}>
//             <View>
//               <View style={styles.cameraContainer}>
//                 <View style={styles.cameraWrap}>
//                   {state.img && (
//                     <View style={styles.photoWrap}>
//                       <Image source={{ uri: state.img }} style={styles.photo} />
//                     </View>
//                   )}
//                   {isFocused && (
//                     <Camera type={type} ref={setCamera} style={styles.camera}>
//                       <TouchableOpacity
//                         onPress={takePhoto}
//                         style={styles.takePhotoBtn}
//                       >
//                         <FontAwesome name="camera" size={24} color="#ffffff" />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={toggleCameraType}
//                         style={styles.toggleCameraBtn}
//                       >
//                         <MaterialIcons
//                           name="flip-camera-android"
//                           size={24}
//                           color="#ffffff"
//                         />
//                       </TouchableOpacity>
//                     </Camera>
//                   )}
//                 </View>
//                 {state.img && (
//                   <TouchableOpacity
//                     onPress={() =>
//                       setState((prevState) => ({ ...prevState, img: null }))
//                     }
//                   >
//                     <Text
//                       style={{ marginTop: 8, fontSize: 16, color: "#BDBDBD" }}
//                     >
//                       Edit photo
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//                 {!state.img && (
//                   <TouchableOpacity onPress={uploadPhotoFromGallery}>
//                     <Text
//                       style={{
//                         marginLeft: "auto",
//                         marginTop: 8,
//                         fontSize: 16,
//                         color: "#BDBDBD",
//                       }}
//                     >
//                       Upload photo
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={styles.inputsContainer}>
//                 <View style={styles.inputWrap}>
//                   <TextInput
//                     style={{ ...styles.input, marginTop: 32 }}
//                     placeholder={"Name..."}
//                     placeholderTextColor={"#BDBDBD"}
//                     value={state.title}
//                     onChange={({ nativeEvent: { text } }) =>
//                       setState((prevState) => ({
//                         ...prevState,
//                         title: text,
//                       }))
//                     }
//                   />
//                 </View>
//                 <View style={styles.inputWrap}>
//                   <TextInput
//                     style={{ ...styles.input, marginTop: 16 }}
//                     placeholderTextColor={"#BDBDBD"}
//                     value={state.location}
//                     onChange={({ nativeEvent: { text } }) =>
//                       setState((prevState) => ({
//                         ...prevState,
//                         location: text,
//                       }))
//                     }
//                   />
//                   <View
//                     style={{
//                       ...styles.locationPlaceholderWrap,
//                       display: state.location.length ? "none" : "flex",
//                     }}
//                   >
//                     <Feather name="map-pin" size={24} color="#BDBDBD" />
//                     <Text style={styles.locationPlaceholderText}>
//                       Location...
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//               <TouchableOpacity
//                 style={{
//                   ...styles.formBtn,
//                   backgroundColor:
//                     state.title.length === 0 ||
//                     state.location.length === 0 ||
//                     state.img == null
//                       ? "#F6F6F6"
//                       : "#FF6C00",
//                 }}
//                 activeOpacity={0.7}
//                 onPress={onSubmit}
//               >
//                 <Text
//                   style={{
//                     ...styles.formBtnText,
//                     color:
//                       state.title.length === 0 ||
//                       state.location.length === 0 ||
//                       state.img == null
//                         ? "#BDBDBD"
//                         : "#FFFFFF",
//                   }}
//                 >
//                   Publish
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View
//               style={{
//                 alignItems: "center",
//                 marginTop: 20,
//               }}
//             >
//               <TouchableOpacity
//                 style={{ ...styles.clearAllBtn }}
//                 onPress={clearAllFields}
//               >
//                 <AntDesign name="delete" size={24} color="#DADADA" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingRight: 16,
//     paddingLeft: 16,
//     paddingTop: 32,
//     backgroundColor: "#ffffff",
//   },
//   cameraContainer: {
//     height: 240,
//     backgroundColor: "#E8E8E8",
//     borderRadius: 8,
//   },
//   cameraWrap: {
//     height: 240,
//     borderRadius: 8,
//     overflow: "hidden",
//     position: "relative",
//   },
//   photoWrap: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     borderWidth: 1,
//     zIndex: 1,
//     width: "100%",
//   },
//   photo: {
//     height: 240,
//     width: "100%",
//   },
//   camera: {
//     position: "relative",
//     height: 240,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   takePhotoBtn: {
//     width: 60,
//     height: 60,
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   toggleCameraBtn: {
//     position: "absolute",
//     top: 15,
//     right: 15,
//   },
//   scroll: {
//     flexGrow: 1,
//   },
//   contentWrap: {
//     justifyContent: "space-between",
//     flex: 1,
//   },
//   imgWrap: {},
//   imgContainer: {
//     overflow: "hidden",
//     width: "100%",
//     height: 240,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     borderRadius: 8,
//   },
//   img: {
//     width: "100%",
//     flex: 1,
//     resizeMode: "cover",
//   },
//   imgBtn: {
//     marginTop: 8,
//   },
//   imgBtnText: {
//     fontFamily: "Roboto-Regular",
//     fontSize: 16,
//     color: "#BDBDBD",
//   },
//   inputsContainer: {},
//   inputWrap: {
//     position: "relative",
//   },
//   input: {
//     height: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E8E8E8",
//     fontFamily: "Roboto-Regular",
//     fontSize: 16,
//     color: "#212121",
//   },
//   locationPlaceholderWrap: {
//     position: "absolute",
//     top: "50%",
//     transform: [{ translateY: -4 }],
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   locationPlaceholderText: {
//     marginLeft: 4,
//     fontFamily: "Roboto-Regular",
//     fontSize: 16,
//     color: "#BDBDBD",
//   },
//   formBtn: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 32,
//     height: 51,
//     borderRadius: 51 / 2,
//   },
//   formBtnText: {
//     fontFamily: "Roboto-Regular",
//     fontSize: 16,
//     color: "#FFFFFF",
//   },
//   clearAllBtn: {
//     width: 70,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F6F6F6",
//     borderRadius: 20,
//   },
// });

// container: {
//   flex: 1,
//   backgroundColor: "#FFF",
// },
// camera: {
//   height: 240,
//   marginTop: 32,
//   marginHorizontal: 16,
//   borderWidth: 1,
//   borderColor: "#E8E8E8",
//   backgroundColor: "#F6F6F6",
//   justifyContent: "center",
//   alignItems: "center",
// },
// photoIconContainer: {
//   justifyContent: "center",
//   alignItems: "center",
//   height: 60,
//   width: 60,
//   backgroundColor: "#FFF",
//   borderRadius: 50,
// },
// takePhotoContainer: {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   borderWidth: 1,
//   borderColor: "#F6F6F6",
// },
// loadFoto: {
//   marginTop: 8,
//   marginLeft: 16,
//   fontSize: 16,
//   color: "#BDBDBD",
// },
// photoDescriptionContainer: {
//   marginHorizontal: 16,
//   marginTop: 32,
// },
// photoDescription: {
//   borderBottomWidth: 1,
//   borderBottomColor: "#E8E8E8",
//   paddingBottom: 15,
//   paddingTop: 15,
// },
// btnContainer: {
//   marginTop: 32,
//   justifyContent: "center",
//   alignItems: "center",
// },
// photoLocationContainer: {
//   marginHorizontal: 16,
//   marginTop: 16,
// },
// photoLocation: {
//   borderBottomWidth: 1,
//   borderBottomColor: "#E8E8E8",
//   paddingBottom: 15,
//   paddingTop: 15,
// },
// sendBtn: {
//   width: 343,
//   height: 53,
//   borderRadius: 100,
//   backgroundColor: "#FF6C00",
//   justifyContent: "center",
//   alignItems: "center",
// },
// btnText: {
//   color: "#FFF",
//   fontSize: 16,
// },
