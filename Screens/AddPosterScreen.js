import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from '../config';
import { Ionicons } from '@expo/vector-icons';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/daeqsogvx/image/upload';
const UPLOAD_PRESET = 'my_app_preset';

const AddPosterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
    const [phoneNumber, setNumber] = useState(null);
  const [uploading, setUploading] = useState(false);




  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission denied');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets?.[0]?.uri || result.uri);
    }
  };

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'poster.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await axios.post(CLOUDINARY_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.secure_url;
  };

const handleSubmit = async () => {
  if (!name || !age || !lastSeen || !image) {
    return Alert.alert('Please fill in all required fields and select an image');
  }

  try {
    setUploading(true);
    const imageUrl = await uploadImageToCloudinary();
    const user = firebase.auth().currentUser;

    // Fetch user profile from Firestore
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    await firebase.firestore().collection('posters').add({
      name,
      age,
      lastSeen,
      description,
      imageUrl,
      posterName: userData?.name || user.email,
      phoneNumber: phoneNumber || userData?.phone || '',
      postedBy: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setUploading(false);
    Alert.alert('Poster submitted successfully');
    navigation.goBack();
  } catch (error) {
    console.error(error);
    setUploading(false);
    Alert.alert('Failed to submit poster');
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>📌 Add Missing Person Poster</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="image" size={36} color="#aaa" />
              <Text style={styles.imageText}>Tap to upload image</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Seen Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cape Town CBD"
            value={lastSeen}
            onChangeText={setLastSeen}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Additional details like clothing, height, etc."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, uploading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>🚀 Submit Poster</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPosterScreen;

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    padding: 20,
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageText: {
    color: '#555',
    marginTop: 6,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1B263B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6a4c93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
