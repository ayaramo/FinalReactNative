import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet , I18nManager } from 'react-native';
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
import MyChats from './screens/MyChats';
import DoctorCalling from './screens/DoctorCalling';
import DoctorsListPage from './screens/DoctorsListPage';
import ChatScreen from './screens/ChatScreen';

import ProfileScreen from './screens/ProfileScreen';
import EditProfile from './screens/EditProfile';
import MyBookings from './screens/MyBookings';


import Doctorlist from './screens/Doctorlist';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// تبويب الصفحات الرئيسية داخل التطبيق بعد تسجيل الدخول
const MainApp = () => {

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      // بمجرد التفعيل، لازم تعمل إعادة تشغيل للتطبيق بالكامل
    }
  }, []);

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
          direction: 'rtl',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="الرئيسية" component={HomeScreen} />
      <Tab.Screen name="الأطباء" component={DoctorCalling} />
      <Tab.Screen name="الصيدلية" component={PharmacyScreen} />
      <Tab.Screen name="محتوى طبي" component={MedicalContentScreen} />
      <Tab.Screen name="حسابي" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// التطبيق الرئيسي
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



<Stack.Screen
          name="Doctorlist"
          component={Doctorlist}
          options={{ headerShown: false }}
        />



        
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ title: 'تعديل الملف الشخصي' }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookings}
          options={{ headerShown: true, title: 'حجوزاتي' }}
        />
        <Stack.Screen name="MyChats"
          component={MyChats}
          options={{ title: 'محادثاتي' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'الدردشة' }} />

        <Stack.Screen name="PharmacyScreen" component={PharmacyScreen} options={{ headerShown: false , title: 'الصيدلية' }} />

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
    direction: 'rtl',
  },
});
