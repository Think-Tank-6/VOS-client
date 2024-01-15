import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MemberComponent from './member';
import PwupdateComponent from './pwupdate';
// import DeleteComponent from './delete';

const Tab = createBottomTabNavigator();

function MyPage({ route, navigation }) {
  const token = route.params?.token; // 토큰을 받아옴

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="member" 
        component={MemberComponent} 
        initialParams={{ token: token }} 
        options={{ title: '계정정보수정' }} 
      />

      <Tab.Screen 
        name="pwupdate" 
        component={PwupdateComponent} 
        initialParams={{ token: token }} 
        options={{ title: '비밀번호 변경' }} 
      />

      <Tab.Screen 
        name="delete" 
        component={DeleteComponent} 
        initialParams={{ token: token }} 
        options={{ title: '회원탈퇴신청' }} 
      />
    </Tab.Navigator>
  );
}

export default MyPage;