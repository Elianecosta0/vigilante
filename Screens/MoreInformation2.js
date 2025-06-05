import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

export default function MoreInformation2({ navigation }) {
  const [profileImage, setProfileImage] = useState(null); // placeholder for now

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>More Information</Text>

      <Text>Emergency Contact:</Text>
      <TextInput style={styles.input} placeholder="Emergency" />

      <Text>Your Number:</Text>
      <TextInput style={styles.input} placeholder="Number" keyboardType="phone-pad" />

      {/* Profile Picture Upload Section */}
      <View style={styles.imageUploadContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/vigilante-logo.png') // make sure you have this in your assets folder
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.chooseButton} onPress={() => alert('Image picker coming soon')}>
          <Text style={styles.chooseButtonText}>Choose Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.buttonText}>Complete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 100,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  chooseButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  chooseButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
