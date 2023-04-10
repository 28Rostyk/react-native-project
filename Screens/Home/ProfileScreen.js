import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import {
  authRemoveUserImg,
  authAddUserImg,
} from "../../redux/auth/auth-operations";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const { userId, nickName, userBgImage } = useSelector((state) => state.auth);
  const [userImg, setUserImg] = useState(null);
  console.log(userPosts);
  console.log(userBgImage);
  console.log(userImg);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    await onSnapshot(q, (data) => {
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // await setUserImg(result.assets[0].uri);

    dispatch(authAddUserImg(result.assets[0].uri));
    // setUserImage(result.assets[0].uri);

    // result.assets[0].uri
  };

  const removeImage = () => {
    dispatch(authRemoveUserImg());
  };

  const createLike = async (postIdd) => {
    const db = getDatabase();
    const likeId = Date.now().toString();
    set(ref(db, "posts/" + postIdd + "/likes/" + likeId), {
      likeId,
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/image/PhotoBG.png")}
      style={styles.ImageBackground}
    >
      <View style={styles.back}>
        <View style={styles.backAvatar}>
          {userBgImage && (
            <Image
              source={{ uri: userBgImage }}
              style={{ width: 120, height: 120, borderRadius: 16 }}
            />
          )}
          <TouchableOpacity
            style={styles.btnAddOrClose}
            onPress={userBgImage ? removeImage : pickImage}
          >
            {userBgImage ? (
              <AntDesign name="closecircleo" size={26} color="#E8E8E8" />
            ) : (
              <AntDesign name="pluscircleo" size={26} color="#FF6C00" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.textTitle}>{nickName}</Text>

        <FlatList
          data={userPosts}
          keyExtractor={(item, indx) => indx.toString()}
          // keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              <View style={styles.postContainer}>
                <Image source={{ uri: item.photo }} style={styles.imagePost} />
                <View style={styles.postTextContainer}></View>
                <View>
                  <Text style={{ marginLeft: 16, fontSize: 16, marginTop: 8 }}>
                    {item.comment}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 10,
                    marginHorizontal: 19,
                  }}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() =>
                      navigation.navigate("Коментарії", {
                        postId: item.id,
                        photoUri: item.photo,
                      })
                    }
                  >
                    <EvilIcons name="comment" size={30} color="#BDBDBD" />
                    <Text
                      style={{ marginLeft: 8, color: "#BDBDBD", fontSize: 16 }}
                    >
                      0
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "auto",
                      marginLeft: 27,
                    }}
                  >
                    <AntDesign name="like2" size={24} color="#BDBDBD" />
                    <Text
                      style={{ marginLeft: 8, color: "#BDBDBD", fontSize: 16 }}
                    >
                      0
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                    onPress={() =>
                      navigation.navigate("Карта", { location: item.location })
                    }
                  >
                    <SimpleLineIcons
                      name="location-pin"
                      size={24}
                      color="#BDBDBD"
                    />
                    <Text
                      style={{
                        marginRight: 10,
                        marginLeft: 8,
                        color: "#212121",
                        fontSize: 16,
                        textDecorationLine: "underline",
                      }}
                    >
                      {item.photoLocation}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        />
      </View>
    </ImageBackground>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  delDescr: {
    backgroundColor: "#f00",
    textAlign: "center",
  },
  ImageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  back: {
    position: "relative",
    width: "100%",
    minHeight: "80%",
    marginHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backAvatar: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },

  btnAddOrClose: {
    position: "absolute",
    right: 0,
    transform: [{ translateX: 12 }],
    bottom: 10,
    zIndex: 10,
  },
  textTitle: {
    fontSize: 30,
    color: "#212121",
    textAlign: "center",
    marginTop: 92,
    marginBottom: 33,
  },

  postContainer: {
    justifyContent: "center",
    marginBottom: 10,
  },
  imagePost: {
    width: 343,
    height: 240,
    resizeMode: "cover",
    marginHorizontal: 16,
    borderRadius: 6,
  },
  postTextContainer: {
    width: "100%",
    marginLeft: 8,
  },
  postText: {
    fontSize: 16,
  },
});
