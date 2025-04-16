import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function MyChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          const chatsRef = collection(db, 'Chats');
          const q = query(chatsRef, where('participants', 'array-contains', uid));
          const snapshot = await getDocs(q);
          const chatList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChats(chatList);
        }
      } catch (error) {
        console.error('خطأ في تحميل المحادثات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const openChat = (chat) => {
    navigation.navigate('ChatScreen', {
      chatId: chat.id,
      doctor: {
        name: chat.doctorName,
        specialty: chat.doctorSpecialty || '',
        clinic: chat.clinic || '',
        address: chat.address || '',
        price: chat.price || '',
        doctorUid: chat.doctorUid || '',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>لا توجد محادثات</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
            <Text style={styles.chatTitle}>
              مع {item.doctorName || "طبيب غير معروف"}
            </Text>
            <Text style={styles.chatMessage}>
              {item.lastMessage?.substring(0, 30) || "لا توجد رسائل"}
            </Text>
            <Text style={styles.chatTime}>
              {item.lastMessageTime || ""}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  chatItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  chatTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  chatMessage: {
    fontSize: 14,
    color: '#555',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
});
