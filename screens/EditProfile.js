import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { auth, db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

export default function EditProfile({ route, navigation }) {
  const { userData } = route.params;
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);

  const handleSave = async () => {
    try {
      const uid = auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        name,
        email
      });
      Alert.alert("تم التحديث", "تم تحديث بياناتك بنجاح");
      navigation.goBack();
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <View style={styles.container}>
      <Text>الاسم</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>البريد الإلكتروني</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Button title="حفظ" onPress={handleSave} color="#2196F3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});
