
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const UserList = ({ memberList }) => {

  return (
    <View style={styles.memberListContainer}>
      <Text style={styles.memberListTitle}>Member List</Text>
      <FlatList
        data={memberList}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <View style={styles.memberListItem}>
            <Text>{item.user_id}</Text>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  memberListContainer: {
    flex: 1,
  },
  memberListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
});

export default UserList;
