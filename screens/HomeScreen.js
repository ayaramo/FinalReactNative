import React from 'react';
import { View, Text, Button } from 'react-native';
import useUserStore from '../useAuthStore'; 

const HomeScreen = () => {
  const { user } = useUserStore();

  return (
    <View>
      <Text>Welcome, {user?.displayName}</Text>
      <Button title="Logout" onPress={() => auth.signOut()} />
    </View>
  );
};

export default HomeScreen;
