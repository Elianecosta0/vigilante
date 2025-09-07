import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList,
  TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../config'; // compat style

export default function GroupChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, groupName } = route.params;

  const db = firebase.firestore();
  const auth = firebase.auth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [members, setMembers] = useState([]);

  // 🔄 Listen for messages in this group
  useEffect(() => {
    const messagesRef = db
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('createdAt');

    const unsubscribe = messagesRef.onSnapshot(snapshot => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

  // 🔄 Fetch members of the group
  useEffect(() => {
    const groupRef = db.collection('groups').doc(groupId);

    const unsubscribe = groupRef.onSnapshot(docSnap => {
      if (docSnap.exists) {
        const groupData = docSnap.data();
        setMembers(groupData.members || []);
      }
    });

    return () => unsubscribe();
  }, [groupId]);

  // ✅ Handle sending a new message
  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      // 🔍 Get user name from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      let senderName = user.email; // fallback
      if (userDoc.exists) {
        const userData = userDoc.data();
        senderName = userData.name || senderName;
      }

      await db.collection('groups')
        .doc(groupId)
        .collection('messages')
        .add({
          senderId: user.uid,
          senderName: senderName,
          text: trimmed,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      setInputText('');
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.messageSender}>{item.senderName}:</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Text style={styles.groupTitle}>{groupName}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { groupId, groupName })}>
            <Text style={styles.infoLink}>Info</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

   
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#800080',
  },
  groupTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  infoLink: { fontSize: 16, color: '#fff', fontWeight: 'bold' },

  messageBubble: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  messageSender: { fontWeight: 'bold' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#800080',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },

  membersSection: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  memberItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  memberText: { fontSize: 16 },
});
