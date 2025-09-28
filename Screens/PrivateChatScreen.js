import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function PrivateChatScreen({ route }) {
  const navigation = useNavigation();
  const { userId, userName } = route.params;
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const flatListRef = useRef();

  // Fetch other user's profile
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).onSnapshot(snapshot => {
      if (snapshot.exists) setUserProfile(snapshot.data());
    });
    return () => unsubscribe();
  }, [userId]);

  // Unique chat ID
  const chatId = [currentUser.uid, userId].sort().join('_');
  const chatRef = db.collection('privateChats').doc(chatId);

  // Listen for messages
  useEffect(() => {
    const unsubscribe = chatRef.collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        // Scroll to bottom on new message
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      });
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const messageData = {
      text: trimmed,
      senderId: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await chatRef.set(
        { participants: [currentUser.uid, userId], lastUpdated: firebase.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      await chatRef.collection('messages').add(messageData);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUser.uid;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, { color: isMe ? 'white' : '#2e3a59' }]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('UserProfile', { userId })}
      >
        {userProfile?.profilePicture ? (
          <Image source={{ uri: userProfile.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#ccc' }]} />
        )}
        <Text style={styles.headerTitle}>{userName}</Text>
      </TouchableOpacity>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10, paddingBottom: 70 }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6edf5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4a6fa5',
  },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
  },
  myMessage: { backgroundColor: '#4a6fa5', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#cfd8e8', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f5fa',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aab6c4',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: 'white', fontWeight: '600' },
});
