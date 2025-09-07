import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const RequestDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { alertData } = route.params;

  const handleRespond = async () => {
    try {
      // Update the alert document in Firestore
      await firebase.firestore().collection('ActiveAlerts').doc(alertData.id).update({
        status: 'responded',
        respondedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Navigate to live location screen
      navigation.navigate('LiveLocationScreen', {
        location: {
          latitude: alertData.location.latitude,
          longitude: alertData.location.longitude,
        },
        address: alertData.address, // send address to display only
      });
    } catch (error) {
      console.error('Failed to update alert status:', error);
      Alert.alert('Error', 'Failed to respond to alert.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: alertData.photoURL || 'https://thumbs.dreamstime.com/b/portrait-happy-female-generation-z-person-profile-picture-head-shot-beautiful-positive-young-woman-having-attractive-appearance-328069168.jpg',
        }}
        style={styles.profileImage}
      />
      <Text style={styles.label}>Emergency Contact:</Text>
      <Text style={styles.info}>{alertData.phone}</Text>

      <Text style={styles.label}>Identifying Features:</Text>
      <Text style={styles.info}>{alertData.identifyingFeature}</Text>

      <TouchableOpacity style={styles.respondButton} onPress={handleRespond}>
        <Text style={styles.respondText}>Respond</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginVertical: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  info: { fontSize: 16, marginBottom: 10 },
  respondButton: { backgroundColor: 'blue', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 30 },
  respondText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});



