import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

export default function CommunityScreen() {
  const navigation = useNavigation();
  const db = firebase.firestore();
  const auth = firebase.auth();
  const currentUser = auth.currentUser;

  const [groups, setGroups] = useState([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);

  // Fetch groups
  useEffect(() => {
    const unsubscribe = db.collection('groups')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allGroups = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          members: doc.data().members || [],
        }));
        setGroups(allGroups);
        const joined = allGroups
          .filter(g => g.members.includes(currentUser.uid))
          .map(g => g.id);
        setJoinedGroupIds(new Set(joined));
      });
    return () => unsubscribe();
  }, []);

  // Fetch all users except current
  useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot(snapshot => {
      const allUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser.uid);
      setUsers(allUsers);
    });
    return () => unsubscribe();
  }, []);

  // Filter users by search query
  useEffect(() => {
  const results = users.filter(u => {
    if (!u.name) return false; // skip users without a name
    return u.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  setSearchResults(results);
}, [searchQuery, users]);

  // Fetch active private chats (most recent first)
  useEffect(() => {
    const unsubscribe = db.collection('privateChats')
      .where('participants', 'array-contains', currentUser.uid)
      .orderBy('lastUpdated', 'desc')
      .onSnapshot(snapshot => {
        const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrivateChats(chats);
      });
    return () => unsubscribe();
  }, []);

  const handleStartPrivateChat = user => {
    navigation.navigate('PrivateChat', { userId: user.id, userName: user.name });
  };

  const renderPrivateChat = ({ item }) => {
    const otherUserId = item.participants.find(uid => uid !== currentUser.uid);
    const otherUser = users.find(u => u.id === otherUserId);
    const otherUserName = otherUser ? otherUser.name : 'User';

    return (
      <TouchableOpacity
        style={styles.privateChatItem}
        onPress={() =>
          navigation.navigate('PrivateChat', { userId: otherUserId, userName: otherUserName })
        }
      >
        <Text style={styles.privateChatName}>{otherUserName}</Text>
        <Text style={styles.privateChatLastMessage}>{item.lastMessage || ''}</Text>
      </TouchableOpacity>
    );
  };

  const availableToJoin = groups.filter(g => !joinedGroupIds.has(g.id));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#6a1b9a" />
        </TouchableOpacity>
        <Text style={styles.title}>Community</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Chatbot Button */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Text style={styles.chatbotButtonText}>Talk to SafeSpace Bot 💬</Text>
      </TouchableOpacity>

      {/* User Search */}
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {searchQuery ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => handleStartPrivateChat(item)}
            >
              <Text style={styles.groupName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={[...privateChats, ...groups]}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            item.participants ? renderPrivateChat({ item }) : (
              <TouchableOpacity
                style={[styles.groupItem, joinedGroupIds.has(item.id) && styles.joinedGroup]}
                onPress={() =>
                  navigation.navigate('GroupChat', { groupId: item.id, groupName: item.name })
                }
              >
                <Text style={styles.groupName}>{item.name}</Text>
                {joinedGroupIds.has(item.id) && <Text style={styles.joinedBadge}>Joined</Text>}
              </TouchableOpacity>
            )
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f0fa' },
  header: { paddingTop: 50, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#6a1b9a' },
  chatbotButton: {
    backgroundColor: '#d29fcc',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 15,
  },
  chatbotButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginHorizontal: 20, marginBottom: 10 },
  groupItem: { padding: 20, marginHorizontal: 20, marginVertical: 6, backgroundColor: 'white', borderRadius: 15 },
  joinedGroup: { backgroundColor: '#e1bee7' },
  groupName: { fontSize: 18, color: '#4a148c', fontWeight: '600' },
  joinedBadge: { backgroundColor: '#7b1fa2', color: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, fontWeight: '700', fontSize: 12 },
  privateChatItem: { padding: 15, marginHorizontal: 20, marginVertical: 5, backgroundColor: '#fff3e0', borderRadius: 12 },
  privateChatName: { fontWeight: '700', fontSize: 16, color: '#6a1b9a' },
  privateChatLastMessage: { fontSize: 14, color: '#4a148c', marginTop: 4 },
});
