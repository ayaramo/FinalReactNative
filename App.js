import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// استيراد الشاشات
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PharmacyScreen from './screens/PharmacyScreen';
import MedicinesScreen from './screens/MedicinesScreen';
import MedicalContentScreen from './screens/MedicalContentScreen';
import DoctorCalling from './screens/DoctorCalling';
import DoctorsListPage from './screens/DoctorsListPage';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'الرئيسية') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'الأطباء') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'الصيدلية') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'محتوى طبي') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="الرئيسية" component={HomeScreen} />
      <Tab.Screen name="الأطباء" component={DoctorCalling} />
      <Tab.Screen name="الصيدلية" component={PharmacyScreen} />
      <Tab.Screen name="محتوى طبي" component={MedicalContentScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ 
            headerShown: false,
            animation: "fade_from_bottom",
          }} 
        />
        <Stack.Screen 
          name="login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="home" 
          component={MainApp} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MedicinesScreen" 
          component={MedicinesScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DoctorsList" 
          component={DoctorsListPage} 
          options={{ 
            headerShown: true,
            title: 'قائمة الأطباء',
            headerBackTitle: 'رجوع',
          }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ 
            headerShown: true,
            title: 'الدردشة مع الطبيب',
            headerBackTitle: 'رجوع',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});