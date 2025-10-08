import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { firebase } from '../config';
import { Audio } from 'expo-av';

const EmergencyScreen = () => {
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingsList, setRecordingsList] = useState([]);

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

  useEffect(() => {
    // Subscribe to Firestore recordings in real-time
    const unsubscribe = subscribeToRecordings();
    return () => unsubscribe();
  }, []);

  const startEmergency = () => {
    setCountdown(5);
    setIsCounting(true);
    setAlertSent(false);
    setMapVisible(false);
  };

  const cancelEmergency = () => {
    setCountdown(null);
    setIsCounting(false);
  };

  const fetchLocationFast = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is needed to share your location.');
      return null;
    }

    let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    return currentLocation.coords;
  };

  const handleEmergency = async () => {
    setLoading(true);
    const coords = await fetchLocationFast();
    setLoading(false);

    if (!coords) {
      Alert.alert('Error', 'Could not get location.');
      return;
    }

    const userId = getAuth().currentUser.uid;

    // Fetch user data
    let userData = {};
    try {
      const userDoc = await firebase.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        Alert.alert('Error', 'User data not found.');
        return;
      }
      userData = userDoc.data();
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data.');
      return;
    }

    // Add alert to Firestore
    try {
      const alertData = {
        userId,
        name: userData.name || '',
        phone: userData.emergencyContact || '',
        identifyingFeature: userData.feature || '',
        photoURL: userData.profileImage || '',
        location: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'active',
      };
      await firebase.firestore().collection('ActiveAlerts').add(alertData);
    } catch (error) {
      console.error('Error adding alert:', error);
      Alert.alert('Error', 'Failed to save alert to database.');
      return;
    }

    setAlertSent(true);
    setMapVisible(true);

    await startRecording();

    Alert.alert('Emergency Alert Sent', 'Your emergency alert has been sent successfully.');
  };

  const startRecording = async () => {
    if (recording) return;

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Audio recording permission is required.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Recording Error', 'Could not start recording.');
    }
  };

 const stopRecording = async () => {
  if (!recording) return;
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    setRecording(null);
    setIsRecording(false);

    const userId = getAuth().currentUser.uid;

    // 🔹 Convert to Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // 🔹 Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "audio/m4a",
      name: `${userId}_${Date.now()}.m4a`,
    });
    formData.append("upload_preset", "my_app_preset"); // from Cloudinary settings

    const cloudinaryResponse = await fetch(
      "https://api.cloudinary.com/v1_1/daeqsogvx/auto/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await cloudinaryResponse.json();
    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    // 🔹 Save metadata to Firestore (still keeping Firestore for metadata)
    await firebase.firestore().collection("userRecordings").add({
      userId,
      url: data.secure_url, // Cloudinary URL
      location: location || null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Return to Emergency button screen
    setMapVisible(false);
    setAlertSent(false);
  } catch (error) {
    console.error("Failed to stop and upload recording", error);
    Alert.alert("Recording Error", "Could not stop recording or upload.");
  }
};


  const playRecording = async (url) => {
    try {
      if (!url) return;
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    } catch (error) {
      console.error('Error playing recording:', error);
      Alert.alert('Playback Error', 'Could not play recording.');
    }
  };

  const subscribeToRecordings = () => {
    const userId = getAuth().currentUser.uid;
    return firebase.firestore()
      .collection('userRecordings')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const recs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecordingsList(recs);
      }, error => {
        console.error('Error loading recordings:', error);
      });
  };

  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.recordingText}>
          {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'No date'}
        </Text>
        {item.location && (
          <Text style={styles.recordingText}>
            Lat: {item.location.latitude.toFixed(5)}, Lng: {item.location.longitude.toFixed(5)}
          </Text>
        )}
      </View>
      <Button title="Play" onPress={() => playRecording(item.url)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {!alertSent && !isCounting && !mapVisible && (
        <>
          <View style={styles.topButtonContainer}>
            <TouchableOpacity onPress={startEmergency} style={styles.emergencyButton}>
              <Text style={styles.emergencyText}>Emergency</Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              *An alert will be sent out to emergency contact and nearby authorities
            </Text>
          </View>

          <FlatList
            data={recordingsList}
            keyExtractor={item => item.id}
            renderItem={renderRecordingItem}
            style={styles.recordingsList}
          />
        </>
      )}

      {isCounting && (
        <View style={styles.countdownWrapper}>
          <Text style={styles.countdown}>{countdown}</Text>
          <TouchableOpacity onPress={cancelEmergency} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {mapVisible && location && (
        <View style={{ flex: 1, marginTop: 20 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} title="Your Location" pinColor="blue" />
          </MapView>

          {isRecording && (
            <TouchableOpacity onPress={stopRecording} style={styles.stopRecordingButton}>
              <Text style={styles.stopRecordingText}>Stop Recording</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="red" style={{ marginTop: 40 }} />}
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  topButtonContainer: { alignItems: 'center', marginTop: 40 },
  emergencyButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emergencyText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  note: { marginTop: 10, fontSize: 12, color: '#555', textAlign: 'center' },
  countdownWrapper: { alignItems: 'center', marginTop: 40 },
  countdown: { fontSize: 60, color: 'red', fontWeight: 'bold', marginBottom: 20 },
  cancelButton: { borderColor: 'red', borderWidth: 3, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 40 },
  cancelText: { color: 'red', fontSize: 22, fontWeight: '600' },
  stopRecordingButton: { position: 'absolute', top: 10, alignSelf: 'center', backgroundColor: 'red', padding: 15, borderRadius: 12, zIndex: 10 },
  stopRecordingText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  recordingsList: { marginTop: 20, marginBottom: 20 },
  recordingItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 8, paddingVertical: 8 },
  recordingText: { fontSize: 12, color: '#333' },
});
