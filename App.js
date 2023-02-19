import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "./router";

export default function App() {
  const routing = useRoute(true);
  return (
    <>
      <NavigationContainer>{routing}</NavigationContainer>
    </>
  );
}
// {
/* <AuthStack.Navigator>
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
</AuthStack.Navigator>; */
// }
