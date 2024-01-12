import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './component/main';
import Login from './auth/login';
import Join from './auth/join';
import StarList from './component/starList';
import KakaoLogin from './auth/kakao_login';
import Admin from './admin/navigation/admin';
import UserDetail from './admin/components/userDetail';
import Setting from './component/setting';
import Mypage from './component/mypage'
import Pwupdate from './component/pwupdate';
import AdminLogin from './admin/components/adminLogin';
import AdminJoin from './admin/components/adminJoin';



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
        <Stack.Screen
          name="StarList"
          component={StarList}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="KakaoLogin"
          component={KakaoLogin}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen 
          name="Admin" 
          component={Admin} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserDetail" 
          component={UserDetail}
        />
        <Stack.Screen
          name="setting"
          component={Setting}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="mypage"
          component={Mypage}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen
          name="pwupdate"
          component={Pwupdate}
          options={{ headerShown: false }} // 여기에 추가
        />
        <Stack.Screen 
          name="adminLogin" 
          component={AdminLogin}
        />
        
        <Stack.Screen 
          name="adminJoin" 
          component={AdminJoin}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}