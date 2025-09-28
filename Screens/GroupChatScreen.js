import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

export default function GroupChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, groupName } = route.params;

  const db = firebase.firestore();
  const auth = firebase.auth();
  const currentUser = auth.currentUser;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [group, setGroup] = useState(null);

  const flatListRef = useRef(null);

  // Listen for group messages
  useEffect(() => {
    const messagesRef = db
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('createdAt');

    const unsubscribe = messagesRef.onSnapshot(snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Listen for group data (members, admins)
  useEffect(() => {
    const groupRef = db.collection('groups').doc(groupId);
    const unsubscribe = groupRef.onSnapshot(docSnap => {
      if (docSnap.exists) setGroup(docSnap.data());
    });
    return () => unsubscribe();
  }, [groupId]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      const senderName = userDoc.exists
        ? userDoc.data().name || currentUser.email
        : currentUser.email;

      await db.collection('groups').doc(groupId).collection('messages').add({
        senderId: currentUser.uid,
        senderName,
        text: trimmed,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update group's last message & timestamp
      await db.collection('groups').doc(groupId).update({
        lastMessage: trimmed,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setInputText('');
      flatListRef.current.scrollToEnd({ animated: true });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.senderId === currentUser.uid;
    return (
      <View style={[styles.messageBubble, isOwn && styles.ownBubble]}>
        <Text style={[styles.messageSender, isOwn && { color: '#fff' }]}>
          {isOwn ? 'You' : item.senderName}:
        </Text>
        <Text style={[styles.messageText, isOwn && { color: '#fff' }]}>{item.text}</Text>
      </View>
    );
  };

  const handleCopyGroupLink = () => {
    const link = `https://yourapp.com/group/${groupId}`;
    Clipboard.setString(link);
    Alert.alert('Group link copied!', 'You can now share it with friends.');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.groupTitle}>{groupName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {group && (
              <TouchableOpacity onPress={handleCopyGroupLink} style={styles.shareButton}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('GroupDetail', { groupId, groupName })}
            >
              <Text style={styles.infoLink}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#e6edf5' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4a6fa5',
  },
  groupTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  infoLink: { fontSize: 16, color: '#fff', fontWeight: 'bold', marginLeft: 15 },
  shareButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#597ca3',
    borderRadius: 8,
  },
  shareText: { color: '#fff', fontWeight: 'bold' },

  messageBubble: {
    backgroundColor: '#dbe4f0',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  ownBubble: { backgroundColor: '#4a6fa5', alignSelf: 'flex-end' },
  messageSender: { fontWeight: 'bold', color: '#000', marginBottom: 2 },
  messageText: { color: '#000' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#e6edf5',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});
