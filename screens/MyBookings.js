import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase-config';
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';

export default function MyBookings() {
  const [appointments, setAppointments] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collectionGroup(db, 'PatientBookings'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(results);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>التاريخ: {item.date}</Text>
      <Text>الوقت: {item.time}</Text>
      <Text>الحالة: {item.status}</Text>
      <Text>ملاحظات: {item.notes || "لا يوجد"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>مواعيدي</Text>
      {appointments.length === 0 ? (
        <Text style={styles.empty}>لا يوجد حجوزات حالياً</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray' },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f1f9ff',
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
});
