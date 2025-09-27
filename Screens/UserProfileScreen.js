import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function UserProfile({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const db = firebase.firestore();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time user data
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).onSnapshot(doc => {
      if (doc.exists) {
        setUser(doc.data());
      }
    });
    return () => unsubscribe();
  }, [userId]);

  // Real-time posts data
  useEffect(() => {
    const unsubscribe = db
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(userPosts);
          setLoading(false);
        },
        error => {
          console.log('Error fetching posts:', error);
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, [userId]);

  const handleMessageUser = () => {
    navigation.navigate('PrivateChat', { userId, userName: user?.name || 'User' });
  };

  const openPost = (post) => {
    Alert.alert('Post Clicked', 'You can navigate to a detailed post screen here.');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4a148c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile info */}
      <View style={styles.header}>
        {user.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#ccc' }]} />
        )}
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.messageButton]}
              onPress={handleMessageUser}
            >
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Posts Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#9c27b0" style={{ marginTop: 20 }} />
      ) : posts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts yet.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openPost(item)}>
              <Image source={{ uri: item.image }} style={styles.postImage} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f0fa' },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  userName: { fontSize: 22, fontWeight: '700', color: '#4a148c' },
  bio: { fontSize: 16, color: '#6a1b9a', marginTop: 5 },
  buttonsRow: { flexDirection: 'row', marginTop: 10 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  messageButton: { backgroundColor: '#4a6fa5' },
  buttonText: { color: 'white', fontWeight: '600' },
  noPostsText: { textAlign: 'center', marginTop: 30, color: '#888', fontSize: 16 },
  postsContainer: { padding: 5 },
  postImage: {
    width: '32%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 10,
  },
});
