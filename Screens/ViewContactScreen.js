import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, Image , SafeAreaView, Platform
} from 'react-native';
import { firebase } from '../config';

const ViewContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const snapshot = await firebase
          .firestore()
          .collection('emergencyContacts')
          .where('userId', '==', userId)
          .get();

        const fetchedContacts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
   
      <View style={styles.center}>
        <Text style={styles.emptyText}>No emergency contacts found.</Text>
      </View>
     
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {item.name ? item.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.relationship}>Relationship: {item.relationship}</Text>
      </View>
    </View>
    
  );

  return (
     <SafeAreaView style={styles.safeArea}>
           <Text style={styles.heading}>Emergency Contacts</Text>
    <FlatList
      data={contacts}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
    </SafeAreaView>
  );
};

export default ViewContactScreen;

const styles = StyleSheet.create({
     safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
      },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 14,
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // elevation for Android
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  relationship: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

