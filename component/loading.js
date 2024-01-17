import React from 'react';
import { View, Modal, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Loading = ({ visible, onClose }) => {
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
       
        <View style={styles.centeredView}>
          <View style={styles.closeBtnWrap}>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              {/* <AntDesign name="closecircleo" size={24} color="white" /> */}
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalView}>
            <Image
              source={require('../assets/img/loading.gif')} // 로컬 경로에 있는 GIF 이미지
              style={styles.loadingImage}
            />
            <Text style={styles.loadingText}>데이터를 처리하는 중입니다...</Text>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  centeredView: {
    display:'flex',
    height:'100%',
    alignContent:'space-between',
    backgroundColor: '#2A2826',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2A2826',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    textAlign: 'center',
    color:'white',
    fontSize:15,
  },
  loadingImage: {
    width: 233,
    height: 175,
  },
  closeButton: {
    alignItems:'flex-end',
    paddingTop:70,
    padding:30,
  },
  closeBtnWrap:{
   height:'30%'
  }
});

export default Loading;
