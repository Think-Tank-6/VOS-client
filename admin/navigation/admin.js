import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Dimensions } from 'react-native';
import { useFonts, Hurricane_400Regular } from '@expo-google-fonts/hurricane';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import UserList from '../components/userList';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';


const Admin = () => {

  const [members, setMembers] = useState([]);

  // 더미 데이터
  const memberList = [
    { user_id: 'jihye', name: 'User 1' },
    { user_id: 'mkos__@nate.com', name: 'User 2' },
    { user_id: 'user123', name: 'User 3' },
   
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/admin')
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error(error));
  }, []);

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
          {/* <TouchableOpacity style={styles.menuItem}>
            {Platform.OS === 'web' ? (
              <Text>Dashboard</Text>
            ) : (
              <FontAwesome name="home" size={24} color="black" />
            )}
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem}>
            {Platform.OS === 'web' ? (
              <View style={styles.menuFlex}>
                <FontAwesome name="user" size={24} color="black" width={20} />
                <Text style={styles.menuItemText}>users</Text>
              </View>
            ) : (
              <FontAwesome name="user" size={24} color="black" />
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem}>
            {Platform.OS === 'web' ? (
              <Text>posts</Text>
            ) : (
              <FontAwesome name="table" size={24} color="black" />
            )}
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            {Platform.OS === 'web' ? (
              <Text>settings</Text>
            ) : (
              <Ionicons name="ios-settings-sharp" size={24} color="black" />
            )}
            
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.main}>
        {/* 회원 목록 섹션 */}
        <View style={styles.memberListContainer}>
          {/* UserList 컴포넌트 사용 */}
          <UserList memberList={memberList} /> 
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
    borderRightWidth: 1,
    borderRightColor: '#ebebeb',
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
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Admin;
