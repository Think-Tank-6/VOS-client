import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './components/List';
import Generate from './components/Generate';
import Main from './components/main';
import Login from './components/login';
import Member from './components/member';

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
          name="Member"
          component={Member}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="List"
          component={List}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="Generate"
          component={Generate}
          options={{ headerShown: false }}
        /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}