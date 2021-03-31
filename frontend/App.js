import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import DomainDetailScreen from "./components/DomainDetailScreen";
import AddUrlScreen from "./components/AddUrlScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Registered domains" }}
        />
        <Stack.Screen
          name="DomainDetailScreen"
          component={DomainDetailScreen}
          options={{ title: "Domain details" }}
        />
        <Stack.Screen
          name="AddUrlScreen"
          component={AddUrlScreen}
          options={{ title: "Add URL" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
