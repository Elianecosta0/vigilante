import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../config';
import * as Location from 'expo-location';

const ActiveAlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorityLocation, setAuthorityLocation] = useState(null);

  // Helper: calculate distance in km between two coords
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    // Request location permission and get authority location
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required to see distances.');
        setAuthorityLocation(null);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setAuthorityLocation(location.coords);
    };

    getLocation();

    // Subscribe to Firestore ActiveAlerts collection with status 'active'
    const unsubscribe = firebase
      .firestore()
      .collection('ActiveAlerts')
      .where('status', '==', 'active')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAlerts(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching active alerts:', error);
          setLoading(false);
        }
      );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    let distanceText = 'Distance unknown';
    if (authorityLocation && item.location) {
      const distKm = getDistance(
        authorityLocation.latitude,
        authorityLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
      distanceText = `${distKm} km away`;
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('RequestDetailsScreen', { alertData: item })
        }
      >
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={28} color="red" />
          <Text style={styles.label}>Alert</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.victimName}>{item.name || 'Unknown'}</Text>
          <Text style={styles.distance}>{distanceText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#001f3f" />
      </View>
    );
  }

  if (alerts.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#555' }}>
          No active alerts at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Active Alerts</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ActiveAlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    backgroundColor: '#001f3f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    alignItems: 'center',
  },
  label: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  victimName: {
    fontSize: 18,
    fontWeight: '600',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

