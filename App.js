
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import DoctorsScreen from './screens/DoctorsScreen';
// import PharmacyScreen from './screens/PharmacyScreen';
import MedicalContentScreen from './screens/MedicalContentScreen';
// import ProfileScreen from './screens/ProfileScreen';

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
            iconName = focused ? 'medical-kit' : 'medical-kit-outline';
          } else if (route.name === 'محتوى طبي') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'حسابي') {
            iconName = focused ? 'person' : 'person-outline';
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
       {/* <Tab.Screen name="الأطباء" component={DoctorsScreen} /> */}
      {/* <Tab.Screen name="الصيدلية" component={PharmacyScreen} /> */}
      <Tab.Screen name="محتوى طبي" component={MedicalContentScreen} />
      {/* <Tab.Screen name="حسابي" component={ProfileScreen} />  */}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          options={{ 
            headerShown: false, 
            animation: "fade_from_bottom", 
            animationDuration: 3000 
          }} 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="register" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          options={{ headerShown: false }} 
          name="home" 
          component={MainApp} 
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
