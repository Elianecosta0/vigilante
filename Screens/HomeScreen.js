import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator, RefreshControl, Animated, StyleSheet, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../config';
import { Share } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [posters, setPosters] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const auth = firebase.auth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosters, setFilteredPosters] = useState([]);
  const [unreadReportsCount, setUnreadReportsCount] = useState(0);


  // Fetch current user's name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          setUserName(userDoc.exists ? userDoc.data().name : 'User');
        }
      } catch (error) {
        console.error(error);
        setUserName('User');
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const unsubscribe = firebase.firestore()
    .collection('reports')
    .where('reporterId', '==', userId)
    .where('isRead', '==', false)
    .onSnapshot(snapshot => {
      setUnreadReportsCount(snapshot.size);
    });

  return () => unsubscribe();
}, []);


  useEffect(() => {
  const fetchProfileImage = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setProfileImage(userDoc.data().profileImage); // fetch Cloudinary URL
        }
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  fetchProfileImage();
}, []);

  // Fetch posters
  const fetchPosters = useCallback(() => {
    setLoading(true);
    const unsubscribe = firebase.firestore()
      .collection('posters')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosters(list);
        setFilteredPosters(list);
        setLoading(false);
        setRefreshing(false);
      }, error => {
        console.error(error);
        setLoading(false);
        setRefreshing(false);
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchPosters();
    return () => unsubscribe();
  }, [fetchPosters]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) setFilteredPosters(posters);
    else {
      const filtered = posters.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosters(filtered);
    }
  }, [searchQuery, posters]);

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



  const renderPost = (poster) => {
  const currentUser = auth.currentUser; // FIXED: define currentUser
  if (!currentUser) return null;

  const liked = poster.likes?.includes(currentUser.uid);
  const scaleAnim = new Animated.Value(1);

  // Direct message


  const handleReport = () => {
    navigation.navigate('SendMessage', {
      posterId: poster.id,
      posterName: poster.name,
      posterPhone: poster.posterPhone,
    });
  };

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    const posterRef = firebase.firestore().collection('posters').doc(poster.id);
    if (!liked) {
      posterRef.update({ likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid) });
    } else {
      posterRef.update({ likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid) });
    }
  };

  return (
    <View key={poster.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: poster.posterAvatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{poster.name || 'Unknown'}</Text>
          <Text style={styles.postTime}>{new Date(poster.timestamp?.toDate()).toLocaleDateString()}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#444" />
      </View>

      {/* Post Image */}
      <Image source={{ uri: poster.imageUrl || 'https://via.placeholder.com/400' }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
         

          <TouchableOpacity onPress={() => navigation.navigate('Comments', { posterId: poster.id })}>
            <Ionicons name="chatbubble-outline" size={28} color="#000" style={{ marginRight: 15 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleShare(poster)}>
            <Ionicons name="paper-plane-outline" size={28} color="#000" />
          </TouchableOpacity>

          {/* REPORT BUTTON: Only show if current user did NOT post */}
          {currentUser.uid !== poster.postedBy && (
            <TouchableOpacity onPress={handleReport} style={{ marginLeft: 15 }}>
              <Ionicons name="warning-outline" size={28} color="#ff0000" />
            </TouchableOpacity>
          )}
        </View>

     
      </View>

      {/* Post Details */}
     
      <Text style={styles.description}>
        <Text style={styles.username}>{poster.name || 'Unknown'} </Text>
        {poster.description}
      </Text>

      {poster.comments?.length > 0 && (
        <TouchableOpacity onPress={() => navigation.navigate('Comments', { posterId: poster.id })}>
          <Text style={styles.viewComments}>View all {poster.comments.length} comments</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stickyHeader}>

          <View style={styles.topBar}>
               <TouchableOpacity onPress={() => navigation.openDrawer()}>
                 <Ionicons name="menu" size={30} color="#000" />
               </TouchableOpacity>
             </View>
             
             
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
  <Image
    source={{ uri: profileImage || 'https://via.placeholder.com/40' }}
    style={styles.profilePic}
  />
</TouchableOpacity>
      
     
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosters(); }} />
        }
      >
        

        {/* Floating Create Poster Button */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPoster')}>
          <Ionicons name="camera" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Feed */}
        {loading ? <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} /> :
          filteredPosters.map(renderPost)
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stickyHeader: {
      flexDirection: 'row',
  justifyContent: 'space-between', // pushes items to ends
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 10,
  backgroundColor: '#f8f8f8',
},
profilePic: {
  width: 40,
  height: 40,
  borderRadius: 20, // makes it round
},
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 25, paddingHorizontal: 10, height: 40, margin: 15 },
  searchInput: { marginLeft: 8, flex: 1 },

  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#2f4156', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },

  postCard: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: '700', fontSize: 14 },
  postTime: { fontSize: 12, color: '#888' },
  postImage: { width: screenWidth, height: screenWidth, marginTop: 5 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  leftActions: { flexDirection: 'row' },
  likes: { fontWeight: '700', paddingHorizontal: 10, marginBottom: 4 },
  description: { paddingHorizontal: 10, marginBottom: 4 },
  viewComments: { paddingHorizontal: 10, color: '#888', marginBottom: 4 },
});

export default HomeScreen;
