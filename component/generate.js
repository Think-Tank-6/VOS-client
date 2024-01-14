import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from './loading';
import { API_URL } from '@env';
import getAccessTokenFromHeader from '../hooks/getAccessTokenFromHeader';

const Generate = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('M');
  const [birthDate, setBirthDate] = useState(new Date());
  const [deceaseDate, setDeceaseDate] = useState(new Date());
  const [relationship, setRelationship] = useState('');
  const [feature, setFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTextFile, setSelectedTextFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [birthDateSelected, setBirthDateSelected] = useState(false);
  const [deceaseDateSelected, setDeceaseDateSelected] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showDeceaseDatePicker, setShowDeceaseDatePicker] = useState(false);

  const handleSelectGender = (gender) => {
    setGender(gender);
  };

  // 생년월일 변경 처리 함수
  const handleBirthDateChange = (event, selectedDate) => {
    if (selectedDate) {  // 사용자가 날짜를 선택한 경우
      setBirthDate(selectedDate);
      setBirthDateSelected(true);  // 날짜가 선택되었음을 표시
      setShowBirthDatePicker(Platform.OS === 'ios');
    } else {
      setShowBirthDatePicker(false);
    }
  };

  // 타계일 변경 처리 함수
  const handleDeceaseDateChange = (event, selectedDate) => {
    if (selectedDate) {  // 사용자가 날짜를 선택한 경우
      setDeceaseDate(selectedDate);
      setDeceaseDateSelected(true);  // 날짜가 선택되었음을 표시
      setShowDeceaseDatePicker(Platform.OS === 'ios');
    } else {
      setShowDeceaseDatePicker(false);
    }
  };

  // 생년월일 선택기를 활성화하는 함수
  const showBirthDatepicker = () => {
    setShowBirthDatePicker(true);
  };

  // 타계일 선택기를 활성화하는 함수
  const showDeceaseDatepicker = () => {
    setShowDeceaseDatePicker(true);
  };
  
  const today = new Date();

  // 생년월일을 보기 좋은 문자열 형식으로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return '생년월일';

    // 날짜를 'YYYY-MM-DD' 형식으로 변환합니다.
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  let response;

  const handleSubmit = async () => {
    setLoading(true);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('birthDate', birthDate.toISOString());
    formData.append('deceaseDate', deceaseDate.toISOString());
    formData.append('relationship', relationship);
    formData.append('feature', feature);

    // 파일이 선택되었는지 확인하고 FormData에 추가
    if (selectedTextFile) {
        formData.append('textFile', selectedTextFile);
    }
    if (selectedAudioFile) {
        formData.append('audioFile', selectedAudioFile);
    }

    
    // 헤더에 사용할 accessToken 가져오기
    const accessToken = await getAccessTokenFromHeader();
    
    if (!accessToken) {
      console.log('Access token is missing');
      setLoading(false);
      return;
    }

    try {
        const response = await fetch(`${API_URL}/stars`, {  // ip 주소 설정필요
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const jsonResponse = await response.json();

        // 서버 응답 처리
        console.log(jsonResponse);
    } catch (error) {
        console.error('Error submitting data:', error);
    } finally {
        setLoading(false);
    }
  };

  // txt 파일 선택 함수
  const selectTextFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain', // 텍스트 파일만 선택
      });

      if (result.type === 'success') {
        console.log('Selected Text File: ', result);
      }
    } catch (error) {
      console.error('Error picking a text file: ', error);
    }
  };

  // 오디오 파일 선택 함수
  const selectAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // 오디오 파일만 선택
      });

      if (result.type === 'success') {
        console.log('Selected Audio File: ', result);
      }
    } catch (error) {
      console.error('Error picking an audio file: ', error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.generrateDesc}>
          <Text style={styles.subheader}>
            고인의 생전 데이터들을 받아{'\n'}
            말투나 대화 패턴을 분석합니다.{'\n'}
            통화녹음과 카톡 내보내기 파일을 올려주세요
          </Text>
          <Text style={styles.instructions}>
            (채팅방 {'>'} 설정 {'>'} 대화 내용 내보내기)
          </Text>
        </View>

        <View style={styles.namengender}>
          <View style={styles.name}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={[styles.baseInput, styles.nameInput]}
              placeholder="이름"
              placeholderTextColor = '#B1B1B1'
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderBox}>
              <TouchableOpacity
                style={[styles.buttonL, { backgroundColor: gender === 'M' ? 'rgba(61,159,136,0.5)' : 'gray' }]}
                onPress={() => handleSelectGender('M')}>
                <Text style={{color : gender === 'M' ? 'white' : '#B1B1B1'}}>남</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonR, { backgroundColor: gender === 'F' ? 'rgba(61,159,136,0.5)' : 'gray' }]}
                onPress={() => handleSelectGender('F')}>
                <Text style={{color : gender === 'F' ? 'white' : '#B1B1B1'}}>여</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.label}>생년월일</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.datePickerButton} onPress={showBirthDatepicker}>
            <Text style={styles.datePickerText}>
              {birthDateSelected ? formatDate(birthDate) : "생년월일"}
            </Text>
          </TouchableOpacity>
          {showBirthDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display="default"
              onChange={handleBirthDateChange}
            />
          )}
        </View>

        <Text style={styles.label}>타계일</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.datePickerButton} onPress={showDeceaseDatepicker}>
            <Text style={styles.datePickerText}>
              {deceaseDateSelected ? formatDate(deceaseDate) : "타계일"}
            </Text>
          </TouchableOpacity>
          {showDeceaseDatePicker && (
            <DateTimePicker
              value={deceaseDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDeceaseDateChange}
            />
          )}
        </View>

        <Text style={styles.label}>관계</Text>
        <TextInput
          style={[styles.baseInput, styles.relationInput]}
          placeholder="관계"
          placeholderTextColor = '#B1B1B1'
          value={relationship}
          onChangeText={setRelationship}
        />

        <Text style={styles.label}>특징</Text>
        <TextInput
          style={[styles.baseInput, styles.featuerInput]}
          placeholder="특징"
          placeholderTextColor = '#B1B1B1'
          value={feature}
          onChangeText={setFeature}
        />

        {/* 파일 선택 버튼들 */}
        <Text style={styles.label}>음성 파일</Text>
        <TouchableOpacity style={styles.fileSelectButton} onPress={selectAudioFile}>
          <Text style={styles.fileSelectButtonText}>오디오 파일 선택하기</Text>
        </TouchableOpacity>

        <Text style={styles.label}>카톡 내보내기 파일</Text>
        <TouchableOpacity style={styles.fileSelectButton} onPress={selectTextFile}>
          <Text style={styles.fileSelectButtonText}>텍스트 파일 선택하기</Text>
        </TouchableOpacity>

        {/* 제출 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>추가하기</Text>
        </TouchableOpacity>

        {/* 로딩 인디케이터 */}
        <Loading visible={loading} onClose={() => { setLoading(false); closeModal(); }} />
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
    backgroundColor: '#2A2826',
    borderRadius: 5,
  },
  fileSelectButton: {
    backgroundColor: '#ADADAC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  fileSelectButtonText: {
    color: '#4E4E4E',
    fontSize: 16,
  },
  generrateDesc: {
    alignItems: 'center',
  },
  subheader: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 10,
    color: '#DBDBDB',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    marginTop: -10,
    marginBottom: 5,
    color: '#B1B1B1',
  },
  label: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 5,
    color: '#D4D4D4',
  },
  baseInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: '#DBDBDB',
    fontSize: 11,
  },
  namengender: {
    flexDirection: 'row',
  },
  name: {
    flex:1
  },
  genderBox: {
    flexDirection: 'row',
  },
  buttonL: {
    height: 40,
    width: 40,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonR: {
    height: 40,
    width: 40,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuerInput: {
    textAlignVertical: 'top',
    height: 100,
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
  submitButton: {
    width: 210,
    backgroundColor: 'rgba(61,159,136,0.5)', // 버튼의 배경색
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#C4C4C4', // 텍스트의 색상
    fontSize: 18,
  },
  datePickerButton: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: '#DBDBDB',
  },
  datePickerText: {
    color: '#B1B1B1',
    fontSize: 11,
  },
});

export default Generate;