import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  const navigation = useNavigation();

  const [role, setRole] = useState('');

  // User fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [identifyingFeature, setIdentifyingFeature] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Authority field
  const [securityNumber, setSecurityNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      let emailToUse = '';
      let userData = {};

      if (role === 'authority') {
        if (!securityNumber || !password || !confirmPassword) {
          Alert.alert('Error', 'Please fill all fields for authority.');
          setLoading(false);
          return;
        }

        const docRef = firebase.firestore().collection('Authorities').doc(securityNumber);
        const doc = await docRef.get();

        if (!doc.exists) {
          Alert.alert('Error', 'Invalid Security Number');
          setLoading(false);
          return;
        }

        emailToUse = `${securityNumber}@vigilante.com`;
        userData = { ...doc.data(), role: 'authority', email: emailToUse };

        let userCredential;
        try {
          userCredential = await firebase.auth().createUserWithEmailAndPassword(emailToUse, password);
        } catch (authError) {
          console.error('Firebase Auth Error (authority):', authError);
          Alert.alert('Sign Up Error', authError.message || 'Failed to create authority account');
          setLoading(false);
          return;
        }

        const uid = userCredential.user.uid;
        await firebase.firestore().collection('users').doc(uid).set(userData);
        await docRef.update({ email: emailToUse });

        Alert.alert('Success', 'Authority account created. Please log in.');
        navigation.replace('LogIn');

      } else if (role === 'user') {
        if (
          !firstName.trim() || !lastName.trim() || !dob.trim() || !emergencyContact.trim() ||
          !gender.trim() || !height.trim() || !identifyingFeature.trim() ||
          !username.trim() || !phone.trim() || !password || !confirmPassword
        ) {
          Alert.alert('Error', 'Please fill all fields for user.');
          setLoading(false);
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
        emailToUse = `${cleanUsername}@vigilante.com`;

        userData = {
          name: fullName,
          dob: dob.trim(),
          emergencyContact: emergencyContact.trim(),
          gender: gender.trim(),
          height: height.trim(),
          weight: weight.trim() || '',
          identifyingFeature: identifyingFeature.trim(),
          username: cleanUsername,
          phone: phone.trim(),
          role: 'user',
          email: emailToUse,
        };

        let userCredential;
        try {
          userCredential = await firebase.auth().createUserWithEmailAndPassword(emailToUse, password);
        } catch (authError) {
          console.error('Firebase Auth Error (user):', authError);
          Alert.alert('Sign Up Error', authError.message || 'Failed to create user');
          setLoading(false);
          return;
        }

        const uid = userCredential.user.uid;
        userData.UID = uid;
        await firebase.firestore().collection('users').doc(uid).set(userData);

        Alert.alert('Success', 'User account created. Please log in.');
        navigation.replace('LogIn');

      } else {
        Alert.alert('Error', 'Please select a role.');
      }
    } catch (error) {
      console.error('SignUp Error:', error);
      Alert.alert('Error', error.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/vigilante-logo.png')} style={styles.image} resizeMode="contain" />
          <Image source={require('../assets/Vigilantetxt.png')} style={styles.txt} resizeMode="contain" />
        </View>

        {/* Role Selection */}
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.selectedRole]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.roleText, role === 'user' && { color: '#fff' }]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'authority' && styles.selectedRole]}
            onPress={() => setRole('authority')}
          >
            <Text style={[styles.roleText, role === 'authority' && { color: '#fff' }]}>Authority</Text>
          </TouchableOpacity>
        </View>

        {/* Authority Form */}
        {role === 'authority' && (
          <>
            <Text style={styles.label}>Security Number:</Text>
            <TextInput
              style={styles.input}
              value={securityNumber}
              onChangeText={setSecurityNumber}
              placeholder="Enter security number"
              autoCapitalize="none"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
            />
          </>
        )}

        {/* User Form */}
        {role === 'user' && (
          <>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              autoCapitalize="words"
            />
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              autoCapitalize="words"
            />
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Emergency Contact:</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Enter emergency contact"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Gender:</Text>
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
              placeholder="Enter gender"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Height:</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter height"
              keyboardType="numeric"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Weight:</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              keyboardType="numeric"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Identifying Feature:</Text>
            <TextInput
              style={styles.input}
              value={identifyingFeature}
              onChangeText={setIdentifyingFeature}
              placeholder="Enter identifying feature"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Phone:</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
            />
          </>
        )}

        {/* Submit */}
        {role !== '' && (
          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: -100,
  },
  txt: {
    width: 300,
    height: 50,
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
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#DADADA',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#1E2C3A',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#1E2C3A',
  },
  button: {
    backgroundColor: '#1E2C3A',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
