import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../config';

const CLOUDINARY_UPLOAD_PRESET = 'my_app_preset'; // replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = 'daeqsogvx'; // replace with your Cloudinary cloud name

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [uid, setUid] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const [fullname, setFullname] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
 
  const [emergencyContact, setEmergencyContact] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUid(user.uid);
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setFullname(data.name || '');
          setDob(data.dob || '');
          setGender(data.gender || '');
          setHeight(data.height || '');
          setWeight(data.weight || '');
          
          setEmergencyContact(data.emergencyContact || '');
          setContact(data.phone || '');
          setImageUri(data.profileImage || null);
        }
      });
    }
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need media library permissions to select images.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri); // Show preview immediately
        await uploadImageToCloudinary(uri);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      // Prepare form data for upload
      const data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const json = await response.json();

      if (json.secure_url) {
        // Save URL to Firestore under user document
        await firebase.firestore().collection('users').doc(uid).set(
          { profileImage: json.secure_url },
          { merge: true }
        );
        setImageUri(json.secure_url); // update preview to uploaded URL
        Alert.alert('Success', 'Image uploaded and saved!');
      } else {
        Alert.alert('Upload Failed', 'Failed to upload image to Cloudinary');
        console.error('Cloudinary upload failed:', json);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message);
    }
  };

  const handleSave = async () => {
    if (!uid) return;
   try {
    await firebase.firestore().collection('users').doc(uid).set(
      {
        dob,
        gender,
        height,
        weight,
        emergencyContact,
        phone: contact, // fixed here
      },
      { merge: true }
    );
      Alert.alert('Profile Updated', 'Your changes have been saved.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButtonWraper} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" color="black" size={30} />
        </TouchableOpacity>

        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#A3BBC0" />
            )}
            <Ionicons name="camera" size={26} color="#A3BBC0" style={styles.cameraIcon} />
          </TouchableOpacity>
          <Text style={styles.username}>{fullname || 'Username'}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullname} onChangeText={setFullname} />

          <Text style={styles.label}>DOB</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} />

          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={gender} onChangeText={setGender} />

          <Text style={styles.label}>Height</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} />

          <Text style={styles.label}>Weight</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} />

        

          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// (Make sure to add your styles here)

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
  profileImage: {
  width: 100,
  height: 100,
  borderRadius: 50,
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
