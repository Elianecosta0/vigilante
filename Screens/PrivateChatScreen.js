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
  const { userId, userName } = route.params; // Other user info
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const flatListRef = useRef();

  // Fetch other user's profile
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).onSnapshot(snapshot => {
      if (snapshot.exists) {
        setUserProfile(snapshot.data());
      }
    });
    return () => unsubscribe();
  }, []);

  // Unique chat ID
  const chatId = [currentUser.uid, userId].sort().join('_');
  const chatRef = db.collection('privateChats').doc(chatId);

  // Listen for messages in real-time
  useEffect(() => {
    const unsubscribe = chatRef.collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage.trim(),
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUser.uid;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('UserProfile', { userId: userId })}
      >
        {userProfile?.profilePicture ? (
          <Image source={{ uri: userProfile.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#ccc' }]} />
        )}
        <Text style={styles.headerTitle}>{userName}</Text>
      </TouchableOpacity>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10, paddingBottom: 60 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
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
  container: { flex: 1, backgroundColor: '#f7f0fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#9c27b0',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#9c27b0',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#e1bee7',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: 'white', fontWeight: '600' },
});
