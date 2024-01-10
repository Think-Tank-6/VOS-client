// 상세페이지、 수정
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';


const UserDetail = ({ route }) => {
  const { user } = route.params;
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/admin/user-list/${user.user_id}`)
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
      })
      .catch(error => console.error('Error:', error));
  }, [user.user_id]);
  
  const formatDate = (dateString) => {
    if (!dateString) {
      return '';
    }
  
    // UTC 시간을 Date 객체로 변환 ('Z'는 UTC를 나타냄)
  const date = new Date(dateString + 'Z');

    if (!dateString || isNaN(Date.parse(dateString))) {
      return ' ';
    }

    // Intl.DateTimeFormat을 사용하여 한국 시간대로
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24시간 표시
    }).format(date).replace(/\./g, '-');
  };

  const displayInfo = (info) => {
    return info || ' '; // 빈 정보가 있는 경우 대체 텍스트
  };

  const displayPassword = (password, maxLength = 15) => {
    if (password && password.length > maxLength) {
      return `${password.substring(0, maxLength)}...`;
    }
    return password;
  };
  
 
 
  return (
    
    <View style={styles.container}>
      <View style={styles.contentWarp}>
        <Text style={styles.detailHeader}>회원정보</Text>
        <Image 
          source={{ uri: user.image }}  
          style={styles.profileImage} 
        />
       
        <View style={styles.detailContent}>

          <View style={styles.detailHeaderWrap}>
            <Text style={styles.detailHeaderText}>Name</Text>
            <Text style={styles.detailHeaderText}>ID</Text>
            <Text style={styles.detailHeaderText}>password</Text>
            <Text style={styles.detailHeaderText}>Phone</Text>
            <Text style={styles.detailHeaderText}>birth</Text>
            <Text style={styles.detailHeaderText}>created at</Text>
            <Text style={styles.detailHeaderText}>updated at</Text>
          </View>
          <View style={styles.detailTextWrap}>

            <Text style={styles.detailText}>{user.name}</Text>
            <Text style={styles.detailText}>{user.user_id}</Text> 
            <Text style={styles.detailText}>{displayPassword(user.password)}</Text>
            <Text style={styles.detailText}>{user.phone}</Text>
            <Text style={styles.detailText}>{user.birth}</Text>
            <Text style={styles.detailText}>{formatDate(displayInfo(user.created_at))}</Text>
            <Text style={styles.detailText}>{formatDate(displayInfo(user.updated_at))}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>회원 정지</Text>
        </TouchableOpacity>
      </View>
      
        <View style={styles.chatCountWrap}>
          <Text style={styles.chatCountText}>chat count</Text>

        </View>
      
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    padding: 60,
  },
  detailHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical:13,
  },
  contentWarp: {
    backgroundColor:'white',
    borderRadius:20,
    padding:10,
    width:'50%',
    height:'80vh',
    display:'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputHeader:{
    paddingVertical:5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    fontSize:15,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    marginVertical: 20,
    borderRadius:5,
  },
  buttonText:{
    color:'white'
  },
  profileImage: {
    width: 150, 
    height: 150, 
    borderRadius: '50%', 
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
  detailContent: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width:'70%',
    height:'50%',
    paddingTop:15,
    
  },
  detailHeaderWrap:{
    justifyContent:'space-between',
  },
  detailHeaderText:{
    fontSize:15,
    fontWeight:600,
    textTransform: 'uppercase',
  },
  detailTextWrap:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
  },
  detailText:{
    fontSize:15,
  },
  chatCountText:{
    textAlign: 'center', 
    marginTop: 30,      
    fontSize: 25,        
    fontWeight: '600',   
    textTransform: 'uppercase',
   
  },
  chatCountWrap:{
    width:'30%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 25,
  },
  
});
export default UserDetail;