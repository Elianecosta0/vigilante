import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, ImageBackground, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config'; // Make sure this points to your Firebase setup
import { getAuth } from 'firebase/auth';

  const HomeScreen = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const auth = getAuth();
  const [searchQuery, setSearchQuery] = useState('');
const [filteredPosters, setFilteredPosters] = useState([]);


      useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserName(data.name || 'User');
          } else {
            setUserName('User');
          }
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('User');
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('posters')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
       setPosters(list);
        setFilteredPosters(list);
        setLoading(false);
      }, error => {
        console.error("Error fetching posters:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredPosters(posters);
  } else {
    const filtered = posters.filter(poster =>
      poster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poster.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosters(filtered);
  }
}, [searchQuery, posters]);




  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {userName}</Text>
        <Text style={styles.subtitle}>You are not alone. We're here to help.</Text>
      </View>

      <View style={styles.searchContainer}>
  <Ionicons name="search" size={20} color="#ccc" style={{ marginLeft: 10 }} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search missing persons..."
    placeholderTextColor="#999"
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
</View>


      {/* Quick Access Buttons */}
      <View style={styles.quickAccess}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelfDefense')}>
         <Ionicons name="shield-checkmark-outline" size={28} color="#fff" />
   
  <ImageBackground
    source={require('../assets/photo3.jpg')} // replace with your image path
    style={styles.imageBackground}
    imageStyle={{ borderRadius: 12 }}
  >
   
  </ImageBackground>
  
</TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Merchandise')}>
          <Ionicons name="shirt-outline" size={28} color="#1B263B" />
          <Text style={styles.cardText}>Merchandise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddPoster')} >
         <Ionicons name="camera" size={28} color="#1B263B" />
          <Text style={styles.cardText}>Create Poster</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddContact')} >
          <Ionicons name="person-add" size={28} color="#1B263B" />
          <Text style={styles.cardText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Support Categories */}
      <Text style={styles.sectionTitle}>Support Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        <View style={styles.categoryCard}>
          <FontAwesome5 name="balance-scale" size={24} color="#fff" />
          <Text style={styles.categoryText}>Legal</Text>
        </View>
        <View style={styles.categoryCard}>
          <MaterialCommunityIcons name="brain" size={24} color="#fff" />
          <Text style={styles.categoryText}>Mental Health</Text>
        </View>
        <View style={styles.categoryCard}>
          <Ionicons name="book" size={24} color="#fff" />
          <Text style={styles.categoryText}>Resources</Text>
        </View>
        <View style={styles.categoryCard}>
          <Ionicons name="heart-circle" size={24} color="#fff" />
          <Text style={styles.categoryText}>Self-Help</Text>
        </View>
      </ScrollView>

      {/* Missing People Feed */}
      <Text style={styles.sectionTitle}>Missing Persons</Text>
      {loading ? (
  <ActivityIndicator size="large" color="#fff" />
) : (
  filteredPosters.length === 0 ? (
    <Text style={{ color: '#ccc', fontStyle: 'italic' }}>No reports found.</Text>
  ) : (
   filteredPosters.map(poster => (
  <TouchableOpacity
    key={poster.id}
    style={styles.feedCard}
    onPress={() =>
      navigation.navigate('MissingPersonDetails', {
        id: poster.id,
        name: poster.name,
        age: poster.age,
        image: poster.imageUrl,
        description: poster.description,
        lastSeen: poster.lastSeen,
         postedByName: poster.posterName,   // human-readable name
  postedByUid: poster.postedBy, // could be UID or email
        contact: poster.phoneNumber || '0000000000' // fallback
      })
    }
  >
    <Image
      source={{ uri: poster.imageUrl || 'https://via.placeholder.com/70' }}
      style={styles.feedImage}
    />
    <View style={styles.feedTextContainer}>
      <Text style={styles.feedTitle}>{poster.name}, {poster.age}</Text>
      <Text style={styles.feedDesc}>{poster.description}</Text>
      <Text style={styles.details}>Last seen: {poster.lastSeen}</Text>
      <TouchableOpacity style={styles.reportButton}>
        <Text style={styles.reportButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
))

        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },

  searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1B263B',
  borderRadius: 12,
  marginBottom: 20,
  height: 40,
},
searchInput: {
  flex: 1,
  color: '#fff',
  paddingHorizontal: 10,
  fontSize: 16,
},
  greeting: {
    color: '#1B263B',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  quickAccess: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
    card: {
    width: '47%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',  // important for border radius to work on Android
  },
  imageBackground: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#1B263B',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 16,
  },

  sectionTitle: {
    color: '#1B263B',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  categories: {
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: '#1B263B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  categoryText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  feedCard: {
    backgroundColor: '#1B263B',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 15,
  },
  feedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  feedTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  feedTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedDesc: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
  },

   details: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  reportButton: {
    backgroundColor: '#6a4c93',
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
