import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [name, setName] = useState('Sowda');
  const [dob, setDob] = useState('25/10/2002');
  const [gender, setGender] = useState('Female');
  const [height, setHeight] = useState('175 cm');
  const [weight, setWeight] = useState('Non disclosed');
  const [feature, setFeature] = useState('Dark eye circles');
  const [emergencyContact, setEmergencyContact] = useState('01-234-567-89');
  const [yourNumber, setYourNumber] = useState('123-456-7890');
  const [password, setPassword] = useState('password123');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButtonWraper}>
          <Ionicons name="chevron-back-sharp" color="black" size={30} />
        </TouchableOpacity>

        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profilePictureContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#A3BBC0" />
            <Ionicons name="camera" size={26} color="#A3BBC0" style={styles.cameraIcon} />
          </TouchableOpacity>
          <Text style={styles.username}>CtrlCommanders</Text>
          <Ionicons name="pencil" size={18} color="#A3BBC0" style={styles.pencilIcon} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>DOB</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} />

          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={gender} onChangeText={setGender} />

          <Text style={styles.label}>Height</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} />

          <Text style={styles.label}>Weight</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} />

          <Text style={styles.label}>Identifying feature</Text>
          <TextInput style={styles.input} value={feature} onChangeText={setFeature} />

          <Text style={styles.label}>Emergency contact</Text>
          <TextInput style={styles.input} value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />

          <Text style={styles.label}>Your Number</Text>
          <TextInput style={styles.input} value={yourNumber} onChangeText={setYourNumber} keyboardType="phone-pad" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonWraper: {
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
    marginTop: -30,
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  profilePictureContainer: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 2,
    borderColor: '#A3BBC0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 7,
    right: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  pencilIcon: {
    position: 'absolute',
    right: 100,
    top: 220,
  },
  inputContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: 'black',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    marginBottom: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#2F3C4E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
