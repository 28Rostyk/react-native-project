import React from "react";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import RegistrationScreen from "./Screens/auth/RegistrationScreen/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen/LoginScreen";
import PostScreens from "./Screens/Home/PostScreens";

import CreatePostsScreen from "./Screens/Home/CreatePostsScreen";
import ProfileScreen from "./Screens/Home/ProfileScreen";
import { TouchableOpacity } from "react-native";

import { authSignOutUser } from "./redux/auth/auth-operations";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
  const dispatch = useDispatch();

  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
          headerShown: false,
        }}
        name="PostScreens"
        component={PostScreens}
      />

      <MainTab.Screen
        options={({ navigation }) => ({
          tabBarIcon: ({ focused, size, color }) => (
            <SimpleLineIcons name="plus" size={24} color={color} />
          ),
          headerLeft: ({ focused, size, color }) => (
            <TouchableOpacity onPress={() => navigation.navigate("Публікації")}>
              <AntDesign
                style={{ marginLeft: 20 }}
                name="arrowleft"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: "none" },
        })}
        // options={{
        //   tabBarIcon: ({ focused, size, color }) => (
        //     <SimpleLineIcons name="plus" size={24} color={color} />
        //   ),
        //   headerLeft: ({ focused, size, color }) => (
        //     <TouchableOpacity>
        //       <AntDesign
        //         style={{ marginLeft: 20 }}
        //         name="arrowleft"
        //         size={24}
        //         color="black"
        //       />
        //     </TouchableOpacity>
        //   ),
        //   tabBarStyle: { display: "none" },
        // }}
        name="Створити публікацію"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="md-person-outline" size={24} color={color} />
          ),
        }}
        name="Профіль"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};
