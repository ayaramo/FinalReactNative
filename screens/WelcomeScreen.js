
import React, { useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // استيراد useNavigation من مكتبة التنقل
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/logo.png')} style={{ width: 100, height: 100 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>مرحبًا بك في MediCross</Text>
    </View>
  );
};

export default WelcomeScreen;
