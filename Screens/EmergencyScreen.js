import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

import { firebase, getAuth } from '../config';

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [alertSent, setAlertSent] = useState(false); // track if alert was sent

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCounting && countdown === 0) {
      setIsCounting(false);
      handleEmergency();
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const startEmergency = () => {
    setCountdown(5);
    setIsCounting(true);
    setAlertSent(false);  // reset on new press
    setShowMap(false);    // reset map view
  };

  const cancelEmergency = () => {
    setCountdown(null);
    setIsCounting(false);
  };

  // fetch location and return coords directly
  const fetchLocationFast = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is needed to share your location.');
      return null;
    }

    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    fetchAddress(currentLocation.coords.latitude, currentLocation.coords.longitude);

    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
      );
      let json = await response.json();
      if (json.results && json.results.length > 0) {
        setAddress(json.results[0].formatted_address);
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.error(error);
      setAddress(null);
    }
  };

  const handleEmergency = async () => {
    setLoading(true);

    const loc = await fetchLocationFast();

    setLoading(false);

    if (!loc) {
      Alert.alert('Error', 'Could not get location.');
      return;
    }

    const userId = getAuth().currentUser.uid;

    // Fetch emergency contacts
    let contacts = [];
    try {
      const snapshot = await firebase.firestore()
        .collection('emergencyContacts')
        .where('userId', '==', userId)
        .get();
      contacts = snapshot.docs.map(doc => doc.data());
    } catch (error) {
      Alert.alert('Failed to fetch contacts', error.message);
      return;
    }

    const alertMessage = `🚨 EMERGENCY ALERT 🚨\nLocation: ${address || 'Unknown'}\nMap: https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`;

    // Send to each emergency contact
    for (let contact of contacts) {
      const phoneNumber = contact.phone.startsWith('+') ? contact.phone : `+${contact.phone}`;
      // WhatsApp
      const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(alertMessage)}`;
      if (await Linking.canOpenURL(whatsappURL)) {
        await Linking.openURL(whatsappURL);
      }
      // SMS fallback
      const smsURL = `sms:${phoneNumber}&body=${encodeURIComponent(alertMessage)}`;
      if (await Linking.canOpenURL(smsURL)) {
        await Linking.openURL(smsURL);
      }
    }

    // Notify police
    const policeNumber = '10111'; // adjust to your country
    const policeSMS = `sms:${policeNumber}&body=${encodeURIComponent(alertMessage)}`;
    if (await Linking.canOpenURL(policeSMS)) {
      await Linking.openURL(policeSMS);
    } else {
      Alert.alert('Unable to alert police automatically. Please call 10111.');
    }

    // Add alert to ActiveAlerts collection in Firestore
    try {
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        Alert.alert('Error', 'User data not found.');
        return;
      }
      const userData = userDoc.data();

      const alertData = {
        userId,
        name: userData.name || '',
        phone: userData.phone || '',
        identifyingFeature: userData.identifyingFeature || '',
        photoURL: userData.photoURL || '',
        location: new firebase.firestore.GeoPoint(loc.latitude, loc.longitude),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'active',
      };

      await firebase.firestore().collection('ActiveAlerts').add(alertData);
    } catch (error) {
      console.error('Error adding alert to Firestore:', error);
      Alert.alert('Error', 'Failed to save alert to database.');
    }

    Alert.alert('Emergency Alert Sent', 'Your emergency contacts and police have been notified.');
    setAlertSent(true); // mark alert sent, show map icon now
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="red" style={{ marginTop: 40 }} />}

      {!alertSent && !isCounting && (
        <>
          <Text style={styles.info}>
            For easier access to the emergency button, go to settings to make it easily accessible.
          </Text>
          <TouchableOpacity onPress={startEmergency} style={styles.emergencyButton}>
            <Text style={styles.emergencyText}>Emergency</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            *An alert will be sent out to emergency contact and nearby authority
          </Text>
        </>
      )}

      {isCounting && (
        <View style={styles.countdownWrapper}>
          <Text style={styles.countdown}>{countdown}</Text>
          <TouchableOpacity onPress={cancelEmergency} style={styles.cancelButton}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {alertSent && !showMap && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Emergency alert sent successfully!</Text>
          <TouchableOpacity
            onPress={() => setShowMap(true)}
            style={{
              backgroundColor: '#e74c3c',
              padding: 15,
              borderRadius: 50,
            }}
          >
            <Ionicons name="location-sharp" size={36} color="#fff" />
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 5 }}>View Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMap && location && (
        <MapView
          style={styles.fullScreenMap}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location}>
            <View style={styles.markerLabel}>
              {address ? (
                <Text style={styles.markerAddress}>{address}</Text>
              ) : null}
              <Ionicons name="location-sharp" size={32} color="red" />
            </View>
          </Marker>
        </MapView>
      )}
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  info: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: '#444',
    marginTop: 100,
  },
  emergencyButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  emergencyText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  countdownWrapper: { alignItems: 'center', marginTop: 40 },
  countdown: { fontSize: 60, color: 'red', fontWeight: 'bold', marginBottom: 20 },
  cancelButton: {
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  cancelText: { color: 'red', fontSize: 22, fontWeight: '600' },
  note: { marginTop: 40, fontSize: 12, color: '#555', textAlign: 'center' },
  fullScreenMap: { flex: 1 },
  markerLabel: { alignItems: 'center' },
  markerAddress: {
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4,
    textAlign: 'center',
    maxWidth: 200,
  },
});



