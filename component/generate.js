import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const Generate = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deceaseDate, setDeceaseDate] = useState('');
  const [relationship, setRelationship] = useState('');
  const [feature, setFeature] = useState('');


  const handleSubmit = async () => {
    let response; // response 변수를 미리 정의

    try {
      response = await fetch('http://192.168.0.96:8000/submit-data', { //컴퓨터 ipconfig 로 검색해서 컴퓨터 ip주소 넣어야함
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          birthDate,
          deceaseDate,
          relationship,
          feature,
        }),
      });

      const jsonResponse = await response.json();

      // 서버 응답 처리
      console.log(jsonResponse);
    } catch (error) {
      console.error('Error submitting data:', error);
      console.error('Error details:', error.message); // 에러 메시지

      // 수정된 부분: response가 정의되지 않은 경우에도 에러 핸들링 가능
      const status = response?.status || 'unknown';
      console.error('Response status:', status); // 서버 응답 상태 코드
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>고인의 생전 데이터들을 받아</Text>
        <Text style={styles.subheader}>말투나 대화 패턴을 분석합니다.</Text>
        <Text style={styles.instructions}>통화녹음과 카톡 내보내기 파일을 올려주세요</Text>
        <Text style={styles.instructions}>(채팅방 , 설정 , 대화내용 내보내기)</Text>

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Text style={styles.label}>타계일</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={deceaseDate}
          onChangeText={setDeceaseDate}
        />

        <Text style={styles.label}>관계</Text>
        <TextInput
          style={styles.input}
          placeholder="관계"
          value={relationship}
          onChangeText={setRelationship}
        />

        <Text style={styles.label}>특징</Text>
        <TextInput
          style={styles.input}
          placeholder="특징"
          value={feature}
          onChangeText={setFeature}
        />

        <Button title="작성하기" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subheader: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  fileInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#5B9BD5',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Generate;