import React, { useState } from 'react';
import { View, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { auth, createUserWithEmailAndPassword } from '../firebase-config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firestore = getFirestore();

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

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

      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        age,
        medicalHistory,
      });

      navigation.navigate('login');
    } catch (error) {
      console.error('Error registering user:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('هذا البريد الإلكتروني مستخدم بالفعل');
      } else {
        alert('حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={4}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text variant="headlineMedium" style={styles.title}>MediCross</Text>
          </View>

          <TextInput
            label="الاسم"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="العمر"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            left={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="التاريخ المرضي"
            value={medicalHistory}
            onChangeText={setMedicalHistory}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="medical-bag" />}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            إنشاء حساب
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('login')}
            style={styles.linkButton}
          >
            لديك حساب بالفعل؟ سجل دخول
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: '#00587b',

  },
  buttonContent: {
    height: 48,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default RegisterScreen;
