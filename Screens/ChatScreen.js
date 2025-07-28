import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { firebase } from '../config';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { recipientId, recipientName } = route.params;
  const currentUser = firebase.auth().currentUser;
  const chatId = [currentUser.uid, recipientId].sort().join('_');

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const userDoc = await firebase
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get();

    const userName = userDoc.exists ? userDoc.data().name : 'Unknown';

    const newMessage = {
      text: message,
      senderId: currentUser.uid,
      recipientId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await firebase
      .firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(newMessage);

    await firebase.firestore().collection('notifications').add({
      type: 'message',
      senderId: currentUser.uid,
      senderName: userName,
      recipientId: recipientId,
      message: message,
      chatId: chatId,
      isRead: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessage('');
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === currentUser.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  chatContent: {
    padding: 12,
    paddingBottom: 90,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '75%',
  },
  senderBubble: {
    backgroundColor: '#0078FF',
    alignSelf: 'flex-end',
  },
  receiverBubble: {
    backgroundColor: 'grey',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#0078FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

