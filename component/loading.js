import React from 'react';
import { View, Modal, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

const Loading = ({ visible, onClose }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require('../assets/img/loading.gif')} // 로컬 경로에 있는 GIF 이미지
              style={styles.loadingImage}
            />
            <Text style={styles.loadingText}>데이터를 처리하는 중입니다...</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0)', // 반투명 배경
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2A2826',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 15,
    textAlign: 'center',
  },
  loadingImage: {
    width: 233,
    height: 175,
  },
});

export default Loading;
