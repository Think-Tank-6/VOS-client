import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './component/main';
import Login from './component/login';
import Join from './component/join';
import StarList from './component/starList';
import KakaoLogin from './component/kakao_login';
import Admin from './admin/navigation/admin';
import UserDetail from './admin/components/userDetail';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {/* <Stack.Screen
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
        <Stack.Screen
          name="StarList"
          component={StarList}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="KakaoLogin"
          component={KakaoLogin}
          options={{ headerShown: false }} // 여기에 추가
        /> */}
        <Stack.Screen 
          name="Admin" 
          component={Admin} 
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="UserDetail" 
          component={UserDetail}
        />

      </Stack.Navigator>

      
          
      

    </NavigationContainer>
  );
}

