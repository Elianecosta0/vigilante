import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function MoreInformation2({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} color="#1E2C3A" />
      </TouchableOpacity>

      <Text style={styles.title}>More Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact:</Text>
        <TextInput
          style={styles.input}
          placeholder="Emergency contact number"
          placeholderTextColor="#8391A1"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your phone number"
          placeholderTextColor="#8391A1"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
        ) : (
          <>
            <Ionicons name="image-outline" size={40} color="#B0B0B0" />
            <Text style={styles.uploadText}>
              <Text style={styles.clickText}>Click to upload</Text> or drag and drop
            </Text>
            <Text style={styles.fileTypeText}>JPG, JPEG, PNG less than 1MB</Text>
            <Text style={styles.noteText}>*Upload an unfiltered image of yourself</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs')}>
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
    marginBottom: 40,
    textAlign: 'center',
    marginTop: 50,
    marginRight: -20,
  },
  inputGroup: {
    marginBottom: 15,
    paddingVertical: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
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
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    backgroundColor: '#FAFAFA',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  clickText: {
    color: '#00A8E8',
    fontWeight: 'bold',
  },
  fileTypeText: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E2C3A',
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
