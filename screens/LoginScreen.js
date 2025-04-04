import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config'; // تأكد من المسار الصحيح
import useAuthStore from '../useAuthStore'; // تأكد من أن هذا هو المسار الصحيح

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login); // ✅ تصحيح هنا

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login(userCredential.user); // ✅ تحديث المستخدم في Zustand
      navigation.navigate('home'); // ✅ الانتقال إلى الصفحة الرئيسية
    } catch (error) {
      console.error('Error logging in: ', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={require('../assets/logo.png')} style={{ width: 100, height: 100 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>MediCross</Text>
      </View>
      <TextInput
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="تسجيل الدخول" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center' }}>
        <Text style={{ color: 'blue', marginTop: 10 }}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
