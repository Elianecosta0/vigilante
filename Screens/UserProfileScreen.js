import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';

export default function UserProfile({ route }) {
  const { userId } = route.params;
  const db = firebase.firestore();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time user data
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).onSnapshot(doc => {
      if (doc.exists) {
        setUser(doc.data()); // profilePicture, name, bio, etc.
      }
    });
    return () => unsubscribe();
  }, [userId]);

  // Real-time posts data
  useEffect(() => {
    const unsubscribe = db
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc') // newest first
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#9c27b0" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {user.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#ccc' }]} />
        )}
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Bio */}
      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      {/* Posts */}
      {loading ? (
        <ActivityIndicator size="large" color="#9c27b0" style={{ marginTop: 20 }} />
      ) : posts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts yet.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsContainer}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.postImage} />
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
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userName: { fontSize: 20, fontWeight: '700', color: '#4a148c' },
  bio: {
    paddingHorizontal: 15,
    marginTop: 10,
    fontSize: 16,
    color: '#6a1b9a',
  },
  noPostsText: { textAlign: 'center', marginTop: 30, color: '#888', fontSize: 16 },
  postsContainer: { padding: 5 },
  postImage: {
    width: '32%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 10,
  },
});
