import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, CheckBox } from 'react-native';
import { API_URL } from '@env';

const AdminList = () => {
  const [filteredMemberList, setFilteredMemberList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  
  const fetchAdmins = (page) => {

    const url = `${API_URL}/admin/admin-list?page=${page}&page_size=8`;
   
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setFilteredMemberList(data.admins);
        setTotalPages(Math.ceil(data.total / 8));
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      fetchAdmins(currentPage);
    } else {
      const filteredList = filteredMemberList.filter(member => 
        member.admin_id.toLowerCase().includes(query.toLowerCase()) ||
        member.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMemberList(filteredList);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedAdmins(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  

  const handlePress = (item) => {
    navigation.navigate('UserDetail', { user: item });
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return '';
    }
  
    // UTC 시간을 Date 객체로 변환 ('Z'는 UTC를 나타냄)
    const date = new Date(dateString + 'Z');
  
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

 
  const renderPagination = () => {
    let paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <TouchableOpacity
          key={i}
          onPress={() => setCurrentPage(i)}
          style={currentPage === i ? styles.activePageItem : styles.pageItem}>
          <Text style={currentPage === i ? { color: 'white' } : { color: 'black' }}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return paginationItems;
  };

  const renderItem = ({ item }) => (

    <TouchableOpacity 
      onPress={() => handlePress(item)}
    
      >
      <View 
        style={[
          styles.memberListItem
        ]}
        >
      <View>
        <CheckBox
        value={selectedAdmins.includes(item.admin_id)}
        onValueChange={() => handleSelectUser(item.admin_id)}
        tintColors={{ true: 'black', false: 'white' }}
        />
      </View>
        <Text style={[styles.itemText, styles.marginL]}>{item.admin_id}</Text>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>{item.phone}</Text>
        <Text style={[styles.itemText]}>{formatDate(item.created_at)}</Text>
        
      </View>
    </TouchableOpacity>
  );
  
    
  return (
    <View style={styles.memberListContainer}>
      {/* serach */}
      <Text style={styles.memberListTitle}>Admin List</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      {/* header */}
      <View style={styles.memberListItemHeader}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={[styles.headerText, styles.marginLL]}>Name</Text>
        <Text style={[styles.headerText, styles.marginLL]}>Phone</Text>
        <Text style={[styles.headerText, styles.marginLL]}>Joined Date</Text>
      </View>
      <FlatList
        data={filteredMemberList} 
        keyExtractor={(item) => item.admin_id}
        renderItem={renderItem}
      />
       <TouchableOpacity style={styles.deleteButton} >
        <Text style={styles.deleteButtonText}>정지</Text>
      </TouchableOpacity>

       {/* pagination */}
      <View style={styles.paginationContainer}>{renderPagination()}</View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  memberListContainer: {
    flex: 1,
    padding: 20,
    paddingBottom:0,
  },
  memberListTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberListItem: {
    display:'flex',
    flexDirection:"row",
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  itemText: {
    width: '16.6%',
    // marginLeft: 20,
  },
  memberListItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBlock: '1px solid #ccc',
    paddingVertical: 15,
    backgroundColor:'black',
  },
  headerText: {
    fontWeight: 'bold',
    widht: '16.6%',
    color:'white',
    textTransform: 'uppercase',
  },
  marginL:{
    marginLeft:20,
  },
  marginLL:{
    marginLeft:30,
  },
  center: {
    textAlign: 'center'
  },
  modifyBtn: {
    padding: 10,
    margin: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    color: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width:60,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    display:'flex',
    justifyContent:'flex-end'
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
    width:'20%'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pageItem: {
    border:'1px solid #000',
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius:2,
    margin:5,
  },
  activePageItem: {
    border:'1px solid #000',
    padding: 10,
    borderRadius:2,
    backgroundColor: 'black',
  },
  
});


export default AdminList;