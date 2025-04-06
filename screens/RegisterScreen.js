import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image } from 'react-native';
import { auth, createUserWithEmailAndPassword } from '../firebase-config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firestore = getFirestore();

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !age || !medicalHistory) {
      alert("من فضلك املأ جميع الحقول");
      return;
    }
    if (password.length < 6) {  
      alert("يجب أن تكون كلمة المرور 6 أحرف على الأقل");       
      return;
    }                                                                 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // إضافة بيانات المستخدم إلى Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        age,
        medicalHistory,
      });

      navigation.navigate('login'); 
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={require('../assets/logo.png')} style={{ width: 100, height: 100 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>MediCross</Text>
      </View>
      <TextInput placeholder="الاسم" value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="البريد الإلكتروني" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="العمر" value={age} onChangeText={setAge} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="التاريخ المرضي" value={medicalHistory} onChangeText={setMedicalHistory} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <Button title="إنشاء حساب" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
