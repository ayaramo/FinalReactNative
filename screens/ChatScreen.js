import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase-config';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatId, doctor } = route.params;
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, 'Chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  

const sendMessage = async () => {
  if (!message.trim()) return;

  const messageData = {
    text: message,
    senderId: currentUser.uid,
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(db, 'Chats', chatId, 'messages'), messageData);

  await updateDoc(doc(db, 'Chats', chatId), {
    lastMessage: message,
    lastTimestamp: serverTimestamp(),
  });

  setMessage('');
};


  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === currentUser.uid
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.senderId === currentUser.uid
            ? styles.sentMessageText
            : styles.receivedMessageText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.timeText,
          item.senderId === currentUser.uid
            ? styles.sentTimeText
            : styles.receivedTimeText,
        ]}
      >
        {item.timestamp?.toDate ? moment(item.timestamp.toDate()).format('h:mm A') : 'جارٍ الإرسال...'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#006272" />
          <Text style={styles.backButtonText}> رجوع</Text>
        </TouchableOpacity>
        
        <View style={styles.doctorInfo}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-md" size={24} color="white" />
          </View>
          <View>
            <Text style={styles.doctorName}>{doctor?.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor?.specialty}</Text>
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={90}
      >
        <View style={styles.chatContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyChat}>
              <View style={styles.emptyAvatar}>
                <FontAwesome name="user-md" size={32} color="#006272" />
              </View>
              <Text style={styles.emptyTitle}>ابدأ محادثة مع الدكتور</Text>
              <Text style={styles.emptyText}>هذه بداية المحادثة مع الدكتور {doctor?.name}</Text>
            </View>
          ) : (
            <FlatList
              ref={scrollViewRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            />
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.disabledSendButton,
              ]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={message.trim() ? 'white' : '#999'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: '#006272',
    fontSize: 16,
    marginLeft: 5,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#006272',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#006272',
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  sentTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimeText: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#006272',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledSendButton: {
    backgroundColor: '#eee',
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 98, 114, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006272',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatScreen;