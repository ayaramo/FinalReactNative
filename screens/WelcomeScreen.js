import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Image source={require('../assets/logo.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>مرحبًا بك في MediCross</Text>
      
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
};

export default WelcomeScreen;
