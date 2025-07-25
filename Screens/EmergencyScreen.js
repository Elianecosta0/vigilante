import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; //

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

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
  };

  const cancelEmergency = () => {
    setCountdown(null);
    setIsCounting(false);
  };

  const handleEmergency = async () => {
    setShowMap(true);
    setLoading(true);
    await fetchLocationFast();
    setLoading(false);
    setTimeout(() => {
      Alert.alert('Emergency Alert Sent', 'Authorities have been notified.');
    }, 2000); 
  };

  const fetchLocationFast = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is needed to share your location.');
      return;
    }

    let lastLocation = await Location.getLastKnownPositionAsync();
    if (lastLocation) {
      setLocation({
        latitude: lastLocation.coords.latitude,
        longitude: lastLocation.coords.longitude,
      });
    }

    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    fetchAddress(currentLocation.coords.latitude, currentLocation.coords.longitude);
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="red" style={{ marginTop: 40 }} />}

      {!showMap ? (
        <>
          <Text style={styles.info}>
            For easier access to the emergency button, go to settings to make it easily accessible.
          </Text>

          {!isCounting ? (
            <TouchableOpacity onPress={startEmergency} style={styles.emergencyButton}>
              <Text style={styles.emergencyText}>Emergency</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.countdownWrapper}>
              <Text style={styles.countdown}>{countdown}</Text>
              <TouchableOpacity onPress={cancelEmergency} style={styles.cancelButton}>
                <Text style={styles.cancelText}>cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.note}>
            *An alert will be sent out to emergency contact and nearby authority
          </Text>
        </>
      ) : (
        <View style={styles.mapWrapper}>
          {location ? (
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
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading map...</Text>
          )}

          <Text style={styles.mapText}>Your location has been shared via WhatsApp.</Text>
        </View>
      )}
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  emergencyText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  countdownWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  countdown: {
    fontSize: 60,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cancelButton: {
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  cancelText: {
    color: 'red',
    fontSize: 22,
    fontWeight: '600',
  },
  note: {
    marginTop: 40,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  mapWrapper: {
    flex: 1,
  },
  fullScreenMap: {
    flex: 1,
  },
  mapText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: 'white',
    fontSize: 14,
    borderRadius: 6,
  },
  markerLabel: {
    alignItems: 'center',
  },
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
