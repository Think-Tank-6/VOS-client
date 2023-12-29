import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './component/main';
import Login from './component/login';
import Join from './component/join';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }} // 여기에 추가
        />
      <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="Join"
          component={Join}
          options={{ headerShown: false }} // 여기에 추가
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}