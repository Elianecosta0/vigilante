import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (!user) return;

    // Listen for messages related to the user's posts
    const unsubscribe = firebase
      .firestore()
      .collection('messages')
      .where('postOwnerId', '==', user.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageCard}
      onPress={() => navigation.navigate('Comments', { postId: item.postId })}
    >
      <Text style={styles.sender}>{item.senderName}</Text>
      <Text style={styles.postTitle}>{item.postTitle}</Text>
      <Text numberOfLines={1} style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f4156" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {messages.length === 0 ? (
        <Text style={styles.noMessages}>No messages yet.</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noMessages: { textAlign: 'center', color: '#777', marginTop: 20 },
  messageCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  sender: { fontWeight: '700', fontSize: 16, marginBottom: 2 },
  postTitle: { fontWeight: '600', fontSize: 14, marginBottom: 4, color: '#2f4156' },
  messageText: { fontSize: 14, color: '#555', marginBottom: 4 },
  timestamp: { fontSize: 12, color: '#aaa', textAlign: 'right' },
});

export default ChatScreen;


