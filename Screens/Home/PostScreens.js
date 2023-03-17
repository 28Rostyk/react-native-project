import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreen from "./DefaultScreen/DefaultScreen";
import MapScreen from "./DefaultScreen/MapScreen";
import CommentsScreen from "./DefaultScreen/CommentsScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { authSignOutUser } from "../../redux/auth/auth-operations";

const NestedScreen = createStackNavigator();

const PostScreens = () => {
  const dispatch = useDispatch();
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Публікації"
        component={DefaultScreen}
        options={{
          headerRight: ({ focused, size, color }) => (
            <TouchableOpacity onPress={() => dispatch(authSignOutUser())}>
              <MaterialIcons
                style={{ marginRight: 10 }}
                name="logout"
                size={24}
                color="#BDBDBD"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen name="Карта" component={MapScreen} />
      <NestedScreen.Screen name="Коментарії" component={CommentsScreen} />
    </NestedScreen.Navigator>
  );
};

export default PostScreens;
