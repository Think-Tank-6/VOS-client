import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MemberComponent from './member';
import PwupdateComponent from './pwupdate';
// import DeleteAccountScreen from './DeleteAccountScreen'; // 또 다른 컴포넌트를 가져옵니다.

const Tab = createBottomTabNavigator();

function MyPage({ route, navigation }) {
  const token = route.params?.token; // 토큰을 받아옴

  return (
    <Tab.Navigator>
      {/* 토큰을 MemberComponent에 prop으로 전달 */}
      <Tab.Screen 
        name="member" 
        component={MemberComponent} 
        initialParams={{ token: token }} 
        options={{ title: '계정정보수정' }} 
      />
      {/* 토큰을 PwupdateComponent에 prop으로 전달 */}
      <Tab.Screen 
        name="pwupdate" 
        component={PwupdateComponent} 
        initialParams={{ token: token }} 
        options={{ title: '비밀번호 변경' }} 
      />
      {/* 토큰을 DeleteAccountScreen에 prop으로 전달 */}
      {/* <Tab.Screen 
        name="DeleteAccount" 
        component={DeleteAccountScreen} 
        initialParams={{ token: token }} 
        options={{ title: '회원탈퇴' }} 
      /> */}
    </Tab.Navigator>
  );
}

export default MyPage;