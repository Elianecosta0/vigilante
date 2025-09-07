import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  

  const navigation = useNavigation();
  const auth = firebase.auth();

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const doc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (doc.exists) setUserData(doc.data());
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  // Fetch user posts
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = firebase
      .firestore()
      .collection('posters')
      .where('postedBy', '==', user.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserPosts(posts);
        setLoadingPosts(false);
      });

    return () => unsubscribe();
  }, []);

  // Fetch reports for user’s posts
  useEffect(() => {
    if (userPosts.length === 0) {
      setReports([]);
      setLoadingReports(false);
      return;
    }

    const unsubscribe = firebase.firestore()
      .collection('reports')
      .where('posterId', 'in', userPosts.map(p => p.id))
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(list);
        setLoadingReports(false);
      });

    return () => unsubscribe();
  }, [userPosts]);

  const handleDeletePost = (postId) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await firebase.firestore().collection('posters').doc(postId).delete();
            Alert.alert('Deleted', 'Your post has been deleted.');
          } catch (err) {
            console.error('Delete error:', err);
          }
        }
      }
    ]);
  };

  const handleShare = async (poster) => {
    try {
      await Share.share({
        message: `🚨 Missing Person Alert 🚨\n\nName: ${poster.name}, Age: ${poster.age}\nLast seen: ${poster.lastSeen}\n\nDescription: ${poster.description}`,
        url: poster.imageUrl || '',
        title: 'Missing Person Poster'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMessage = (poster) => {
    navigation.navigate('SendMessage', {
      recipientId: poster.postedBy,
      posterId: poster.id
    });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.posterAvatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.posterName || 'Unknown'}</Text>
          <Text style={styles.postTime}>{new Date(item.timestamp?.toDate()).toLocaleDateString()}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#444" />
      </View>

      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/400' }} style={styles.postImage} />

      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Ionicons name="paper-plane-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMessage(item)}>
          <Ionicons name="chatbox-ellipses-outline" size={28} color="#000" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
          <Ionicons name="trash-outline" size={28} color="red" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.reportsCount} onPress={() => navigation.navigate('ReportScreen', { posterId: item.id })}>
        Reports: {reports.filter(r => r.posterId === item.id).length}
      </Text>
    </View>
  );

  if (!userData) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#2f4156" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userData.profileImage || 'https://via.placeholder.com/100' }} style={styles.profilePic} />
        <Text style={styles.username}>{userData.name || 'Anonymous'}</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyDetails')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPoster')}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Create Post</Text>
        </TouchableOpacity>
      </View>

      {loadingPosts ? <ActivityIndicator size="large" color="#2f4156" /> :
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#f8f8f8' },
  profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 22, fontWeight: '700' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2f4156', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginHorizontal: 5 },
  buttonText: { color: '#fff', fontWeight: '600', marginLeft: 5 },

  postCard: { backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15, padding: 10 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  postActions: { flexDirection: 'row', marginBottom: 10 },
  description: { fontSize: 14, color: '#555', marginBottom: 5 },
  reportsCount: { fontSize: 12, color: '#007AFF' }
});

export default ProfileScreen;

