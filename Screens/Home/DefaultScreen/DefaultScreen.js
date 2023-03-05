import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevPosts) => [...prevPosts, route.params]);
    }
  }, [route.params]);

  console.log(posts);
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <>
            <View style={styles.postImageContainer}>
              <Image style={styles.postImage} source={{ uri: item.photo }} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                marginHorizontal: 19,
                // justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => navigation.navigate("Коментарії")}
              >
                <EvilIcons name="comment" size={30} color="#BDBDBD" />
                <Text style={{ marginLeft: 8, color: "#BDBDBD", fontSize: 16 }}>
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => navigation.navigate("Карта")}
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
                  Розташування
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
