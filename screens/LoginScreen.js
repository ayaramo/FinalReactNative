import React, { useState } from 'react';
import { View, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, I18nManager } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import useAuthStore from '../useAuthStore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("من فضلك املأ جميع الحقول");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login(userCredential.user);
      navigation.navigate('home');
    } catch (error) {
      console.error('Error logging in: ', error.message);
      if (error.code === 'auth/invalid-credential') {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/invalid-email') {
        alert('صيغة البريد الإلكتروني غير صحيحة');
      } else {
        alert('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى');
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
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign="right"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="كلمة المرور"
            placeholder="********"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (!text) setShowPassword(false); // Reset if empty
            }}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            textAlign="right"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={password.length > 0 ? (showPassword ? "eye-off" : "eye") : "eye-off"}
                onPress={() => {
                  if (password.length > 0) setShowPassword(!showPassword);
                }}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            تسجيل الدخول
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('register')}
            style={styles.linkButton}
          >
            ليس لديك حساب؟ سجل الآن
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
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    color: '#00587b',
  },
});

export default LoginScreen;
