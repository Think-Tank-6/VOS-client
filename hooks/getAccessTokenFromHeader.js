import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccessTokenFromHeader = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('Error retrieving access token', error);
        return null;
    }
};

export default getAccessTokenFromHeader;