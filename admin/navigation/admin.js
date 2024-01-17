import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Dimensions } from 'react-native';
import { useFonts, Hurricane_400Regular } from '@expo-google-fonts/hurricane';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import UserList from '../components/userList';
import AdminList from '../components/adminList';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';


const Admin = ({navigation}) => {

  const [activeMenu, setActiveMenu] = useState('users');
  const [selectedMember, setSelectedMember] = useState();
  const isUsersFocused = activeMenu === 'users';

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };
  const handleUserItemClick = (userId) => {
    // UserList에서 클릭 이벤트 처리
    // 선택된 유저를 상태에 저장하고, UserDetail 화면으로 이동
    const selectedUser = memberList.find((user) => user.user_id === userId);
    navigation.navigate('UserDetail', { user: selectedUser });
  };

  const [fontsLoaded] = useFonts({
    Hurricane: Hurricane_400Regular,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  };

  
  return (
    <View style={styles.adminPanel}>
      <View style={styles.sidebar}>
        <View style={styles.logo}> 
          {Platform.OS === 'web' ? (
              <Text style={styles.logoText}>Voice of the Star</Text>
            ) : (
              <FontAwesome5 name="star-and-crescent" size={24} color="black" margin={22} marginTop={65} />
            )}
        </View>
        <View style={styles.menu}>
         
          <TouchableOpacity
            style={[styles.menuItem, isUsersFocused && styles.focusedMenuItem]}
            onPress={() => handleMenuClick('users')}
            >
            {Platform.OS === 'web' ? (
              <View style={styles.menuFlex}>
                <FontAwesome name="user" size={24} color={isUsersFocused ? 'white' : 'black'} width={20} />
                <Text style={[styles.menuItemText, isUsersFocused && styles.focusedMenuItemText]}>users</Text>
              </View>
            ) : (
              <FontAwesome name="user" size={24} color="black" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, activeMenu === 'admin' && styles.focusedMenuItem]}
            onPress={() => handleMenuClick('admin')}
          >
            {Platform.OS === 'web' ? (
              <View style={styles.menuFlex}>
                <FontAwesome5 name="user-shield" size={20} color={activeMenu === 'admin' ? 'white' : 'black'} />
                <Text style={[styles.menuItemText, activeMenu === 'admin' && styles.focusedMenuItemText]}>admin</Text>
              </View>
            ) : (
              <FontAwesome5 name="user-shield" size={20} color="black"/>
            )}
            
          </TouchableOpacity>
    
          
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.memberListContainer}>
          {activeMenu === 'users' ? (
           <UserList navigation={navigation} />
        ) : (
          <AdminList />
        )}
        </View>
        
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  adminPanel: {
    flexDirection: 'row',
    width: '100%',
    height:'100%',
    backgroundColor: '#000',
    padding: Platform.OS === 'web' ? 25 : 10,
    paddingTop: Platform.OS === 'web' ? 25 : 60,
  },
  sidebar: {
    width: '20%',
    minHeight: 690,
    borderRadius:20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    height: 145,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
 
    boxShadow: '0px 4px 8px -4px #CCC',
  },
  menu: {
    marginTop: 10,
    textTransform: 'uppercase',
    
  },
  menuItem: {
    
    padding: 25,
    paddingRight: Platform.OS === 'web' ? 25 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  menuItemText: {
    width: 50,
    marginLeft: 10,
  },
  focusedMenuItem: {
    backgroundColor: 'black',
    
  },
  focusedMenuItemText: {
    color: 'white',
  },
  menuFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    padding: Platform.OS === 'web' ? 25 : 20,
    borderRadius:20,
  },
  logoText: {
    fontFamily: 'Hurricane',
    fontSize: Platform.OS === 'web' ? 60 : 25,
    margin: Platform.OS === 'web' ? 25 : 25,
    
  },
  focusedMenuItemText: {
    color: 'white',
  },
});

export default Admin;
