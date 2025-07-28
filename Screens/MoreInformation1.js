import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../config'; // your firebase setup

export default function MoreInformation1({ route }) {
  const { uid, username, email } = route.params;
  const navigation = useNavigation();

  // Individual state variables for better controlled inputs (matching your style snippet)
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [feature, setFeature] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [yourNumber, setYourNumber] = useState('');

  const onSubmit = async () => {
    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !height ||
      !weight ||
      !feature ||
      !emergencyContact ||
      !yourNumber
    ) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    try {
      await db.collection('users').doc(uid).set({
        uid,
        username,
        email,
        name: fullName,
        dob: dateOfBirth,
        gender,
        height,
        weight,
        identifyingFeature: feature,
        emergencyContact,
        phone: yourNumber,
      });

      Alert.alert('Success', 'Your information has been saved.');
      navigation.navigate('AppDrawer'); // Adjust your navigation target accordingly
    } catch (error) {
      console.error('Error saving user info:', error);
      Alert.alert('Error', 'Failed to save information. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color="#1E2C3A" />
      </TouchableOpacity>

      <Text style={styles.title}>More Information</Text>
      <Text style={styles.description}>
        This information is needed to make it easier to identify you in times of need.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#8391A1"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#8391A1"
          value={dateOfBirth}
          onChangeText={setDob}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Female / Male / Other"
          placeholderTextColor="#8391A1"
          value={gender}
          onChangeText={setGender}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5'7 or 170cm"
          placeholderTextColor="#8391A1"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 70kg"
          placeholderTextColor="#8391A1"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Identifying Feature:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. birthmark on neck"
          placeholderTextColor="#8391A1"
          value={feature}
          onChangeText={setFeature}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact:</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#8391A1"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Phone Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#8391A1"
          value={yourNumber}
          onChangeText={setYourNumber}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Complete Signup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingTop: 35,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 80,
    left: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    marginRight: -20,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 15,
    paddingVertical: -3,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#DADADA',
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },
  button: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

