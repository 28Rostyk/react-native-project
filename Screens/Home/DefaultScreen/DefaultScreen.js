import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

import { auth } from "../../../firebase/config";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";

const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const { userId, nickName, userBgImage } = useSelector((state) => state.auth);

  const getAllPosts = async () => {
    const db = getDatabase();
    const starCountRef = await ref(db, "posts/");

    onValue(starCountRef, (snapshot) => {
      const objectPosts = snapshot.val();
      if (!objectPosts) {
        return;
      }
      const allPostsFromServer = Object.values(objectPosts);
      setPosts(allPostsFromServer);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 32 }}>
        <View style={styles.userAvatar}>
          <Image
            source={{ uri: userBgImage }}
            style={{ width: 60, height: 60, borderRadius: 16 }}
          />
        </View>
        <View style={styles.containerUserInfo}>
          <Text style={{ fontSize: 13, fontWeight: "700" }}>{nickName}</Text>
          <Text style={{ fontSize: 13, fontWeight: "400" }}>
            {auth.currentUser.email}
          </Text>
        </View>
      </View>

      <FlatList
        keyExtractor={(item, indx) => {
          return indx.toString();
        }}
        data={posts}
        renderItem={({ item }) => (
          <View>
            <View style={styles.postImageContainer}>
              <Image style={styles.postImage} source={{ uri: item.photo }} />
            </View>
            <View>
              <Text style={{ marginLeft: 23, marginTop: 8, fontSize: 16 }}>
                {item.comment}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                marginHorizontal: 19,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() =>
                  navigation.navigate("Коментарії", {
                    postId: item.postId,
                    photoUri: item.photo,
                  })
                }
              >
                <EvilIcons name="comment" size={30} color="#BDBDBD" />
                <Text style={{ marginLeft: 8, color: "#BDBDBD", fontSize: 16 }}>
                  {item.comments ? Object.values(item.comments).length : "0"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
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
                  }}
                >
                  {item.photoLocation}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default DefaultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  userAvatar: {
    marginLeft: 16,
  },

  containerUserInfo: {
    justifyContent: "center",
    marginLeft: 8,
  },

  postImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  postImage: {
    width: 343,
    height: 240,
    borderRadius: 10,
  },
});
