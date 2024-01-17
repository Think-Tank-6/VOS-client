import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Loading from "./loading";
import { API_URL } from "@env";
import getAccessTokenFromHeader from "../hooks/getAccessTokenFromHeader";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const Generate = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("M");
  const [birthDate, setBirthDate] = useState(new Date());
  const [deceaseDate, setDeceaseDate] = useState(new Date());
  const [relationship, setRelationship] = useState("");
  const [feature, setFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTextFile, setSelectedTextFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [birthDateSelected, setBirthDateSelected] = useState(false);
  const [deceaseDateSelected, setDeceaseDateSelected] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showDeceaseDatePicker, setShowDeceaseDatePicker] = useState(false);

  const [selectedTextFileName, setSelectedTextFileName] = useState("");
  // star ID
  const [starId, setStarId] = useState(null);

  // 음성 데이터
  const [speakerData, setSpeakerData] = useState(null);

  // 음성 업로드 모달
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 음성 재생 모달
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);

  // 화자 선택
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);

  // 첫번째 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };
  // 두번째 모달 열기
const handleFirstModalSubmit = () => {
  setIsModalVisible(false);
  setIsSecondModalVisible(true);
};

  useEffect(() => {
  }, [selectedSpeakerId]);

  // 성별 선택

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  // 생년월일 변경 처리 함수
  const handleBirthDateChange = (event, selectedDate) => {
    if (selectedDate) {
      // 사용자가 날짜를 선택한 경우
      setBirthDate(selectedDate);
      setBirthDateSelected(true); // 날짜가 선택되었음을 표시
      setShowBirthDatePicker(Platform.OS === "ios");
    } else {
      setShowBirthDatePicker(false);
    }
  };

  // 타계일 변경 처리 함수
  const handleDeceaseDateChange = (event, selectedDate) => {
    if (selectedDate) {
      // 사용자가 날짜를 선택한 경우
      setDeceaseDate(selectedDate);
      setDeceaseDateSelected(true); // 날짜가 선택되었음을 표시
      setShowDeceaseDatePicker(Platform.OS === "ios");
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
    if (!date) return "생년월일";

    // 날짜를 'YYYY-MM-DD' 형식으로 변환합니다.
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  let response;

  const selectTextFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/*", // 텍스트 파일만 선택
      });
          setSelectedTextFile({
            blob: result.assets[0].uri, 
            name: result.assets[0].name,
            type: result.assets[0].mimeType,
          });
          setSelectedTextFileName(result.assets[0].name)
        
      } catch (error) {
        console.error('Error picking a text file: ', error);
      }
  };
  
  const renderTextFileName = () => {
    return selectedTextFileName || "텍스트 파일을 선택하세요";
  };

  const handleSubmit = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenFromHeader();

    if (!accessToken) {
      setLoading(false);
      return;
    }
    const formData = new FormData();

    formData.append("star_name", name);
    formData.append("gender", gender);
    formData.append("birth", birthDate.toISOString().split("T")[0]);
    formData.append("death_date", deceaseDate.toISOString().split("T")[0]);
    formData.append("relationship", relationship);
    formData.append("persona", feature);

    if (selectedTextFile) {
      const file = {
        uri: selectedTextFile.blob,
        type: selectedTextFile.type,
        name: selectedTextFile.name,
      };
      formData.append("original_text_file", file);
    } else {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/stars`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const jsonResponse = await response.json();
      if (response.ok) {
        // 서버 응답 처리, 스타 생성 성공
        setStarId(jsonResponse.star_id);
        openModal();
      } else {
        // 스타 생성 실패 처리
        console.error("Failed to create star:", jsonResponse);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 화자 보이스 선택
  const submitVoiceSelection = async (
    selectedSpeakerId,
    full_speech_list,
    original_voice_base64
  ) => {
    // 헤더에 사용할 accessToken 가져오기
    const accessToken = await getAccessTokenFromHeader();

   if (!accessToken) {
     setLoading(false);
     return;
   }
  const formData = new FormData();
  
  formData.append('selected_speaker_id', selectedSpeakerId);
  formData.append('speech_list', JSON.stringify(full_speech_list));
  formData.append('original_voice_base64', original_voice_base64);
  try {
    const response = await fetch(`${API_URL}/stars/voice-select/${starId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // 인증 토큰이 필요한 경우
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
      },
      body: formData,
      // body : { selected_speaker_id: selectedSpeakerId, 
      //           speech_list: JSON.stringify(full_speech_list),
      //           original_voice_base64: original_voice_base64,
      //         },
    });

    const jsonResponse = await response.json();

    if (response.ok) {

    } else {
      console.error('Failed to submit voice selection:', jsonResponse);
    }
  } catch (error) {
    console.error('Error in submitting voice selection:', error);
  }
};


  // 첫번째 모달 ( 오디오 선택 )
  const selectAudioFile = async () => {
    setLoading(true);
    // 헤더에 사용할 accessToken 가져오기
    const accessToken = await getAccessTokenFromHeader();

    if (!accessToken) {
      setLoading(false);
      return;
    }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*', // 오디오 파일만 선택
    });
    setSelectedAudioFile(result);

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (typeof uri === 'string') {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
        formData.append('original_voice_file', {
          uri: uri, 
          type: `audio/${fileType}`, 
          name: result.assets[0].name || `recording.${fileType}`,
        });

        try {
          const response = await fetch(`${API_URL}/stars/voice-upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${accessToken}`
            },
            body: formData,
          });
          const jsonResponse = await response.json();
          setSpeakerData(jsonResponse);
        } catch (error) {
          console.error('Error uploading audio file:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error picking an audio file: ', error);
  }finally {
    setLoading(false);
}
};

  // 오디오 파일 선택
  const renderAudioFileName = () => {
    return selectedAudioFile &&
      selectedAudioFile.assets &&
      selectedAudioFile.assets[0].name
      ? selectedAudioFile.assets[0].name
      : "오디오 파일을 선택하세요";
  };

  // 두번째 모달 ( 화자별 보이스 재생 ) 아이폰 재생 불가능
  const playSample = async (audioBase64) => {
    try {
      // 오디오를 재생할 수 있는 URI 생성
      const audioUri = `data:audio/wav;base64,${audioBase64}`;
      // Audio 객체 생성
      const soundObject = new Audio.Sound();
      // 오디오 로딩 및 준비
      await soundObject.loadAsync({ uri: audioUri });
      // 오디오 재생
      await soundObject.playAsync();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoiceAdditionComplete = () => {
    // 음성 추가 관련 작업이 완료되었을 때 호출할 함수
    setIsModalVisible(false);
    setIsSecondModalVisible(false);

    // 모든 모달이 닫힌 후, Generate 컴포넌트를 닫습니다.
    closeModal();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

       {/* 첫번째 모달 */}
       <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
              setIsModalVisible(false);
            }}>
  
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <View style={styles.generrateDesc}>
                  <Text style={styles.instructions}>고인의 생전 음성을 토대로</Text>
                    <Text style={styles.instructions}>목소리 패턴을 분석합니다.</Text>
                    <Text style={styles.instructions}>통화 녹음 파일을 올려주세요.</Text>  
                  <Text style={styles.subText}>
                    (여러 사람의 목소리가 있어도 괜찮습니다.)
                  </Text>
                </View>
                
            <View style={styles.uploadWarp}>
              <Text style={styles.audioFileName}>{renderAudioFileName()}</Text>
              <TouchableOpacity
                style={styles.modalUploadButton}
                onPress={selectAudioFile}
              >
                <Text style={styles.modalButtonText}>업로드</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFirstModalSubmit}
              >
                <Text style={styles.submitButtonText}>추가하기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.textButton} onPress={closeModal}>음성 추가 안하고 넘어가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 두번째 모달 */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSecondModalVisible}
        onRequestClose={() => {
          setIsSecondModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.subheader}>
              구현하려는 별의 목소리를 선택해주세요
            </Text>

            <View style={styles.modalWarp}>
              {speakerData &&
                Object.keys(speakerData.speaker_sample_list).map((key) => (
                  <View key={key} style={styles.speakerItem}>
                    <View style={styles.radioButtonContainer}>
                      <TouchableOpacity
                        style={
                          selectedSpeakerId === key
                            ? styles.radioSelected
                            : styles.radioUnselected
                        }
                        onPress={() => {
                          setSelectedSpeakerId(key);
                        }}
                      >
                        {selectedSpeakerId === key && (
                          <View style={styles.radioInner} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.speakerNumber}>{key}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        playSample(
                          speakerData.speaker_sample_list[key]["audio_byte"]
                        )
                      }
                    >
                      <FontAwesome5 name="play" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                submitVoiceSelection(
                  selectedSpeakerId,
                  speakerData.full_speech_list,
                  speakerData.original_voice_base64
                );
                handleVoiceAdditionComplete();
              }}
            >
              <Text style={styles.submitButtonText}>추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.generrateDesc}>
            <Text style={styles.subheader}>
              고인의 생전 데이터들을 받아{"\n"}
              말투나 대화 패턴을 분석합니다.{"\n"}
              통화녹음과 카톡 내보내기 파일을 올려주세요
            </Text>
            <Text style={styles.instructions}>
              (채팅방 {">"} 설정 {">"} 대화 내용 내보내기)
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
                onPress={() => handleGenderChange('M')}>
                <Text style={{color : gender === 'M' ? 'white' : '#B1B1B1'}}>남</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonR, { backgroundColor: gender === 'F' ? 'rgba(61,159,136,0.5)' : 'gray' }]}
                onPress={() => handleGenderChange('F')}>
                <Text style={{color : gender === 'F' ? 'white' : '#B1B1B1'}}>여</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.datePickerButton} onPress={showBirthDatepicker}>
             
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
            placeholderTextColor = '#B1B1B1'
            value={relationship}
            onChangeText={setRelationship}
          />

          <Text style={styles.label}>특징</Text>
          <TextInput
            style={[styles.baseInput, styles.featuerInput]}
            placeholderTextColor = '#B1B1B1'
            value={feature}
            onChangeText={setFeature}
          />

          
  
            <Text style={styles.label}>카톡 내보내기 파일</Text>
          <View style={styles.uploadWarp}>
            <Text style={styles.TextFileName}
                  numberOfLines={1}
                  ellipsizeMode='tail'
              >
              {renderTextFileName()}
            </Text>
            <TouchableOpacity style={styles.modalUploadButton} onPress={selectTextFile}>
              <Text style={styles.uploadButtonText}>업로드</Text>
            </TouchableOpacity>
          </View>

  
          {/* 제출 버튼 */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={styles.submitButtonText}>추가하기</Text>
          </TouchableOpacity>

          {/* 로딩 인디케이터 */}
          <Loading
            visible={loading}
            onClose={() => {
              setLoading(false);
              closeModal();
            }}
          />

          <View></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  scrollView: {
    flex:1,
  },
  container: {
    display:'flex',
    flex:1,
    justifyContent: 'center',
    padding: 50,
    backgroundColor: '#2A2826',
  },
  fileSelectButton: {
    backgroundColor: "#ADADAC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  fileSelectButtonText: {
    color: "#4E4E4E",
    fontSize: 16,
  },
  generrateDesc: {
    alignItems: "center",
  },
  subheader: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 10,
    color: "#DBDBDB",
    textAlign: "center",
  },
  instructions: {
    fontSize: 15,
    marginTop: -3,
    marginBottom: 5,
    color: "#B1B1B1",
  },
  label: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 5,
    color: "#D4D4D4",
  },
  baseInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: "#DBDBDB",
    fontSize: 11,
    backgroundColor: 'gray',
  },
  namengender: {
    flexDirection: "row",
  },
  name: {
    flex: 1,
  },
  genderBox: {
    flexDirection: "row",
  },
  buttonL: {
    height: 40,
    width: 40,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonR: {
    height: 40,
    width: 40,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  featuerInput: {
    textAlignVertical: "top",
    height: 100,
  },
  fileInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fileInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: "#5B9BD5",
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#2A2826',
    textAlign: 'center',
    fontSize:14,
  },
  submitButton: {
    width: 210,
    backgroundColor: "rgba(61,159,136,0.5)", // 버튼의 배경색
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#C4C4C4", // 텍스트의 색상
    fontSize: 18,
  },
  datePickerButton: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: '#DBDBDB',
    backgroundColor:'gray',
  },
  datePickerText: {
    color: "#B1B1B1",
    fontSize: 11,
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  speakerWarp: {
    height: "50%",
    display: "flex",
    justifyContent: "space-around",
  },
  modalWarp: {
    height: "auto",
    width: "100%",
  },
  modalView: {
    backgroundColor: "#2A2826",
    padding: 45,
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: "#dbdbdb", // 모달 텍스트 색상
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#adadac", // 버튼 색상
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5, // 버튼 둥근 모서리
    elevation: 2,
    width: "100%",
  },
  uploadWarp: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#7f7b7b",
  },
  modalUploadButton: {
    backgroundColor: "#adadac",
    width: "20%",
    height: 35,
    marginRight: 8,
    borderRadius: 5, // 버튼 둥근 모서리
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#4e4e4e",
    fontWeight: "bold",
    fontSize: 14,
  },
  inputField: {
    fontSize: 18,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000", // 입력 필드 하단 경계선 색상
    marginBottom: 20,
    width: 200, // 입력 필드 너비
  },
  submitButton: {
    backgroundColor: "#3d9f88", // '추가하기' 버튼 색상
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    width: "100%",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    color: "#B1B1B1",
    fontSize: 13,
  },
  textButton: {
    color: "#B1B1B1", // 회색 텍스트
    fontSize: 13, // 적당한 텍스트 크기
    marginTop: 13,
  },
  btnWrap: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  SecondModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2826",
    padding: 20, // 내부 패딩 추가
  },
  speakerItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#7f7b7b",
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  radioSelected: {
    backgroundColor: "#7f7b7b",
    borderColor: "#7f7b7b",
    borderWidth: 1,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioUnselected: {
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    backgroundColor: "#7f7b7b",
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  radioButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  speakerNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: "#3d9f88",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "stretch",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  audioFileName: {
    color: 'white', 
    fontSize: 16, 
    margin:13, 
    textAlign: 'center',
    },
    TextFileName: {
      color: '#2A2826', 
      fontSize: 14, 
      margin:13, 
      textAlign: 'center',
      width: 160,
    },
    genderButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderButton: {
      padding: 10,
    },
    genderButtonSelected: {
      backgroundColor: 'lightblue',
    },
    genderButtonText: {
    },
});

export default Generate;
